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
import SfBaseElement from "../../core/js/smart-base";
import {elementFromManifest} from "../../core/js/element-manifest";
import {answerActions, settingSetters} from "../view-table/js/manifest-actions.js";
import manifest from "./component.json";
import aliases from "./aliases.json";
import en from "./lang/en.json";
import ru from "./lang/ru.json";
// The glyphs are the Framework's choice list (core/js/icon-choices.js, core.runtime
// 1.25.0; duplication audit 2026-11-03 A-1), shared with sf-admin-menu.
import {ICON_CHOICES} from "../../core/js/icon-choices.js";
import {pageText} from "../../core/js/page-language";
import {FOCUSABLE, hasLayer, hasLayerAbove, openLayers} from "../../core/js/layer-stack";
import {followDensity} from "../../core/js/density.js";
import {copyText} from "../../core/js/clipboard.js";
import {noteDeprecated} from "../../core/js/deprecations.js";
import {renderPropertyViewTemplate} from "./js/templates/default";
// The day-and-time reading is the field renderers' (A-14): this view kept a
// copy from before it was lifted into the Framework.
import {fieldConditions} from "./js/conditions.js";
import {drawsSetField} from "./js/set-fields.js";
import {propertyModes} from "../field-renderers/index.js";
import {historyFromRevisions, timelineItems, valueText} from "./js/history.js";

// Every port version this composite accepts, in one place, the way sf-view
// keeps its list -- a guard naming a narrower set than the published versions is
// a component refusing a host it asked to move. The contract test beside this
// file compares the list with the manifest.
const SUPPORTED_PORT_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0", "1.13.0", "1.14.0", "1.15.0", "1.16.0", "1.17.0", "1.18.0", "1.19.0", "1.20.0", "1.21.0", "1.22.0"];

// The surface's mode (owner, 2026-10-14). view: show the object, never offer
// a change. auto: show it and offer what this person may do. edit: every group
// open at once, one save. create: an empty object of the collection, every
// field open, one create.
const MODES = ["view", "auto", "edit", "create"];
// How long an opened panel waits for its title before leaving the first focus
// where the drawer put it: the drawer's own wait for a late field (two seconds).
const TITLE_FOCUS_WAIT_MS = 2000;

// The most candidates a picker asks for at once, from a host on port 1.14.0 or
// later (an earlier port's field.options payload is closed and would refuse
// it). Twenty is the page the record picker was built and measured against
// with the consumer's 448 targets; the host may answer fewer, and says which
// page is the last by its cursor, not by a short page.
const OPTIONS_PAGE_LIMIT = 20;

// The property types picked from a list the host pages: the records and people,
// and since 1.14.0 a lookup whose list is not inline.
const PAGED_TYPES = ["record", "relation", "user", "lookup"];
// A group the host has not read yet (port 1.15.0, group.load): its fields are
// empty and its field_count says how many it holds. An empty group is a group
// with field_count 0 or none, never one waiting for its read.
const groupNotRead = (group) => Number.isInteger(group?.field_count) && group.field_count > 0
    && (!Array.isArray(group.fields) || group.fields.length === 0);

const versionAtLeast = (version, minimum) => {
    const parts = (value) => String(value ?? "").split(".").map((part) => Number.parseInt(part, 10) || 0);
    const [a, b] = [parts(version), parts(minimum)];
    for (let index = 0; index < 3; index += 1) {
        if ((a[index] ?? 0) !== (b[index] ?? 0)) return (a[index] ?? 0) > (b[index] ?? 0);
    }
    return true;
};

// Every panel open on the page is a layer of the Framework's one document layer
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
const WIDE_MEDIA_QUERY = "(min-width: 48rem)";

// What the drawer's close reasons (standard 1.3.8 §19.3) are as this panel's:
// the drawer draws no close control of its own here, so its `close` is a script
// asking; `outside` is a press on the dimmed page.
const DRAWER_CLOSE_REASONS = {escape: "escape", outside: "outside", close: "api", api: "api"};

// The column the list of sections takes. It is here rather than in the
// stylesheet because the panel's own width is computed from it, and the drawer
// that carries the panel is placed outside this component's subtree: a custom
// property declared on the element never reaches it. The stylesheet reads this
// through `--sf-property-view--sections-width`, which the component passes to
// the panel and sets on the layout it draws in place.
const SECTIONS_WIDTH = "var(--sf-view-properties-sections-width, 12rem)";

// How the record is edited (C305 (1), RC-1): a group with its Save, plus the
// short fields in a window at their value (the table's cell edit, C296), or
// nothing. A short field is one choice, a date, a time, a yes/no, a person or
// a number: one control, nothing to read around it.
const EDIT_MODES = ["group", "group+quick", "none"];
const QUICK_TYPES = new Set(["choice", "enum", "select", "dropdown", "date", "datetime", "time", "boolean", "user", "number", "integer"]);
// The types sf-form cannot draw for the card (C182): the set's own (money,
// percent, rows, compound), a file or an image that uploads through the host,
// and a reference picked from the host's pages. A group holding one keeps the
// card's own form until sf-form takes a host for them (order FO-C305-1).
const FORMLESS_TYPES = new Set(["file", "files", "image", "images", "record", "relation", "lookup", "user"]);
// From 80rem the full screen keeps the history in a column of its own (C305 (3)).
const SIDE_MEDIA_QUERY = "(min-width: 80rem)";
// From 64rem a panel is a docked column beside the list (C305 (4)); narrower
// it floats over a scrim.
const DOCK_BREAKPOINT = "64rem";
const HISTORY_PAGE = 20;

// The panel's widths are sf-drawer's ladder and nothing else (C157 (2), C289
// (2)): 20, 24 and 30rem and the whole screen. `panel-width` is the dated
// former name (until 2027-01-01): a width it asks for lands on the nearest
// step, and anything wider than the widest step on that step -- Larena's 40rem
// and ui-admin's 44rem take 30rem. A record that needs more room opens on the
// whole screen, where its sections stand in a column.
const PANEL_STEPS = [["1/2", 20], ["1", 24], ["2", 30]];
const PANEL_WIDTH_UNTIL = "2027-01-01";
const nearestPanelStep = (width) => {
    const found = /^\s*(\d+(?:\.\d+)?)\s*(rem|em|px)\s*$/u.exec(String(width ?? ""));
    if (!found) return "2";
    const rem = found[2] === "px" ? Number(found[1]) / 16 : Number(found[1]);
    let best = PANEL_STEPS[0];
    for (const step of PANEL_STEPS) if (Math.abs(step[1] - rem) < Math.abs(best[1] - rem)) best = step;
    return best[0];
};

// The tags the card draws, asked of the Loader before they are needed
// (component-set standard draft 1.1 §7.11, VF-16): a page that defined none of
// them -- a chat message, a card printed into a page by itself -- gets the
// whole card, not its markup. The rule's relations name most of them; asking
// costs nothing for a tag already defined.
const DRAWN_TAGS = [
    "sf-drawer", "sf-button", "sf-button-icon", "sf-button-close", "sf-tabs", "sf-list", "sf-list-description",
    "sf-help-mark", "sf-empty-state", "sf-confirm", "sf-menu-context", "sf-badge", "sf-icon",
    "sf-popover", "sf-form", "sf-list-timeline", "sf-menu",
];

// The parts only the arranging mode and the select-only chooser draw (C311):
// asked for once the card knows it may arrange, before the mode is entered.
const ARRANGING_TAGS = ["sf-profile-picker", "sf-sortable"];

// How long the copy control shows its tick. The Framework's own clipboard holds
// its tick for this long, and two controls that say «copied» for two different
// lengths are two conventions where there is one act.
const COPY_FEEDBACK_MS = 5000;

// A payload is copied so that a host cannot mutate what the component still
// holds. Copying it through JSON destroys anything that is not plain data, and
// the upload intent carries a File: it arrived at the host as an empty object,
// so its name was undefined, the host's own size check never matched, and a file
// it would have refused was accepted instead. Found by a probe asserting that
// what arrives is a File, which is the only reason it was not shipped.
//
// So the plain parts are copied and anything that is not plain is passed by
// reference. The protection was always about data; a File is not data the
// component can own a second copy of.
const isPlain = (value) => value === null
    || ["string", "number", "boolean", "undefined"].includes(typeof value)
    || (typeof value === "object" && (Array.isArray(value) || value.constructor === Object));

const copy = (value) => {
    if (value == null) return value;
    if (typeof value !== "object" || !isPlain(value)) return value;
    if (Array.isArray(value)) return value.map((item) => copy(item));
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copy(item)]));
};

// The Framework speaks English by default and Russian on a Russian page, as
// src/core/js/page-language states for every component. This composite
// carried Russian defaults instead, so an English page drew a panel entirely
// in Russian -- beside an sf-input-color inside it that followed the rule and said
// «inherited». A product still overrides any of these by attribute.
// The words are the language files' (lang/<locale>.json, standard 1.3.8 §11),
// read under the camelCase keys a product registers more languages by.
const camelWords = (words = {}) => Object.fromEntries(Object.entries(words)
    .map(([key, word]) => [key.replace(/-([a-z0-9])/gu, (_, letter) => letter.toUpperCase()), word]));
const PROPERTY_VIEW_TEXT = {
    en: camelWords(en.runtime),
    ru: camelWords(ru.runtime),
};


const SECTION_ICONS = ICON_CHOICES;

// The refusal codes of a view write (port 1.22.0; Larena backend c311-reply)
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
    admin_record_layout_icon_invalid: "viewRefusedIconInvalidText",
};

// sf-view-properties from its component.json (standard simai.smart-component
// 1.3.8 §3, §4, §8, §11): its own props below keep their parsers; what they
// do not name is the manifest's. The actions answer outcomes
// (../table/js/manifest-actions.js), the events take the vocabulary's
// verbs, and the old names follow once through the dated aliases.
const PropertyViewElement = elementFromManifest(manifest, {base: SfBaseElement, lang: {en, ru}, source: "ru", aliases});

class SfPropertyView extends PropertyViewElement {
    // The history adapter for a host that stores a snapshot per revision
    // (js/history.js): record.history answered from neighbouring revisions.
    static historyFromRevisions(revisions, options) {
        return historyFromRevisions(revisions, options);
    }

    static get props() {
        return {
            templateName: {attribute: "template", default: "default"},
            recordId: {attribute: "record-id", default: ""},
            collection: {default: ""},
            showRare: {attribute: "show-rare", type: Boolean, default: false},
            // 1, or 1/2 beside a table at 1/2: the record read a step larger
            // than the list it was opened from (owner, 2026-10-14).
            size: {default: "1"},
            // view | auto | edit | create: what the surface is placed to do
            // (owner, 2026-10-14). The person's rights narrow it.
            mode: {default: "auto"},
            emptyText: {attribute: "empty-text", default: "not filled in"},
            emptyRecordText: {attribute: "empty-record-text", default: "This record has nothing to show"},
            editText: {attribute: "edit-text", default: "Edit"},
            saveText: {attribute: "save-text", default: "Save"},
            cancelText: {attribute: "cancel-text", default: "Cancel"},
            deleteText: {attribute: "delete-text", default: "Delete"},
            changedText: {attribute: "changed-text", default: "Fields changed"},
            errorsText: {attribute: "errors-text", default: "Errors"},
            conflictText: {attribute: "conflict-text", default: "The record changed; read it again"},
            sectionsLabel: {attribute: "sections-label", default: "Sections"},
            // How the sections are laid out. A list beside the groups is right
            // for a settings screen with many of them; a row of tabs is right
            // for a record with a few, and is what the mockup drew first.
            sectionsAs: {attribute: "sections-as", default: "list", values: ["list", "tabs"]},
            panel: {type: Boolean, default: false},
            panelSize: {attribute: "panel-size", default: "1", values: ["1/2", "1", "2", "full"]},
            panelLabel: {attribute: "panel-label", default: ""},
            panelWidth: {attribute: "panel-width", default: ""},
            closeLabel: {attribute: "close-label", default: "Close"},
            copyLinkLabel: {attribute: "copy-link-label", default: "Copy link"},
            linkCopiedLabel: {attribute: "link-copied-label", default: "Link copied"},
            openFullLabel: {attribute: "open-full-label", default: "Open as a page"},
            configureText: {attribute: "configure-text", default: "Arrange the view"},
            doneConfiguringText: {attribute: "done-configuring-text", default: "Done"},
            resetViewText: {attribute: "reset-view-text", default: "Reset"},
            resetViewAskText: {attribute: "reset-view-ask-text", default: "Reset the whole view?"},
            cancelConfiguringText: {attribute: "cancel-configuring-text", default: "Cancel"},
            personalLayerText: {attribute: "personal-layer-text", default: "Personal"},
            viewProfileLabel: {attribute: "view-profile-label", default: "View"},
            addViewText: {attribute: "add-view-text", default: "Add a view"},
            newViewText: {attribute: "new-view-text", default: "New view"},
            deleteViewText: {attribute: "delete-view-text", default: "Remove the view"},
            lastSharedViewText: {attribute: "last-shared-view-text", default: "The only view everyone has"},
            sharedLayerText: {attribute: "shared-layer-text", default: "Everyone's"},
            widthText: {attribute: "width-text", default: "Full width"},
            fieldLabelText: {attribute: "field-label-text", default: "Name"},
            sectionIconText: {attribute: "section-icon-text", default: "Section glyph"},
            sectionIcons: {attribute: "section-icons", default: ""},
            variantText: {attribute: "variant-text", default: "Template"},
            hintText: {attribute: "hint-text", default: "Hint"},
            hiddenText: {attribute: "hidden-text", default: "Hide"},
            configureHintText: {
                attribute: "configure-hint-text",
                default: "Drag fields between groups and onto a section on the left. Applied at once.",
            },
            configureHintNarrowText: {
                attribute: "configure-hint-narrow-text",
                default: "Drag fields between groups. Applied at once.",
            },
            fieldSettingsText: {attribute: "field-settings-text", default: "Field settings"},
            shownText: {attribute: "shown-text", default: "Shown"},
            showRareText: {attribute: "show-rare-text", default: "Show rare fields"},
            hideRareText: {attribute: "hide-rare-text", default: "Hide rare fields"},
            rareText: {attribute: "rare-text", default: "rare"},
            unplacedTitle: {attribute: "unplaced-title", default: "Not placed"},
            moveUpText: {attribute: "move-up-text", default: "Move up"},
            moveDownText: {attribute: "move-down-text", default: "Move down"},
            addFieldText: {attribute: "add-field-text", default: "Add a field"},
            inThisGroupText: {attribute: "in-this-group-text", default: "In this area"},
            renameText: {attribute: "rename-text", default: "Rename"},
            saveNameText: {attribute: "save-name-text", default: "Save the name"},
            cancelNameText: {attribute: "cancel-name-text", default: "Leave the name"},
            removeFieldText: {attribute: "remove-field-text", default: "Remove from this area"},
            removeGroupText: {attribute: "remove-group-text", default: "Remove this area"},
            removeSectionText: {attribute: "remove-section-text", default: "Remove this section"},
            addGroupText: {attribute: "add-group-text", default: "Add an area"},
            addSectionText: {attribute: "add-section-text", default: "Add a section"},
            newGroupTitle: {attribute: "new-group-title", default: "New area"},
            newSectionTitle: {attribute: "new-section-title", default: "New section"},
            noMatchText: {attribute: "no-match-text", default: "Nothing matches"},
            unplacedHintText: {
                attribute: "unplaced-hint-text",
                default: "Fields this view does not show. Drag one into a group to place it, or drag a field here to take it out.",
            },
            viewConflictText: {attribute: "view-conflict-text", default: "The view changed and was read again"},
            viewDeniedText: {attribute: "view-denied-text", default: "You may not change this layer"},
            backLabel: {attribute: "back-label", default: "Back"},
            collectionLabel: {attribute: "collection-label", default: ""},
            collectionIcon: {attribute: "collection-icon", default: ""},
            favourite: {type: Boolean, default: false},
            favouriteLabel: {attribute: "favourite-label", default: "Favourite"},
            menuLabel: {attribute: "menu-label", default: "More"},
            inheritedText: {attribute: "inherited-text", default: "by default"},
            // C305 (1)-(4): how the record is edited, whether it shows its
            // history, and whether a panel is a column beside the list.
            edit: {default: "group+quick", values: EDIT_MODES},
            history: {default: "auto", values: ["auto", "off"]},
            modal: {default: "auto", values: ["auto", "true"]},
        };
    }

    constructor() {
        super();
        this.hostPort = null;
        // What the host last answered with, held for rendering only. Never written
        // to and never the source of a save: a save sends the fields the person
        // changed against the revision the host gave, and the host answers with
        // the object as it now is.
        this.record = null;
        this.sections = [];
        this.selectedSection = null;
        // Which name is being typed, while it is being typed. A rename is not
        // written until it is confirmed, so an area keeps its name while a
        // person is still deciding on another.
        this.renaming = null;
        // What the arrangement was when the mode was entered, and whether a
        // reset has been asked for and is waiting to be confirmed.
        this.arrangementEntered = null;
        this.resetAsked = false;
        this.epoch = 0;
        // Reading by group (port 1.15.0, capability group-load): the revision of
        // the record each group's fields were read at. A group read at another
        // revision than the record's now is read again the next time it is shown;
        // the record has one revision, never one per group.
        this.groupReads = new Map();
        this.groupsReading = new Set();
        // A group refused as unknown-group, by the revision it was refused at:
        // the arrangement is read again once for it, and an arrangement that
        // still names it does not make the panel ask again at that revision.
        this.groupsRefused = new Map();
        this.groupEpoch = 0;
        this.message = "";
        // Which group is open, and what has been changed in it. Only changed
        // fields are held: a save carries what was touched and nothing else, so it
        // cannot overwrite a field somebody else saved meanwhile.
        this.editing = null;
        this.changed = new Map();
        this.errors = new Map();
        // What is wrong with an entry a field control reports it cannot write
        // yet (inputErrors). The view's own, so a host's refusal does not
        // replace them; a save waits until they are put right.
        this.inputErrors = new Map();
        // The keys of inputErrors a field control reported itself (port 1.16.0:
        // a masked string that does not fill its mask, through the renderer
        // set's setFieldError). The control draws that message under itself, so
        // the panel holds the save for it and does not draw it a second time.
        this.controlErrors = new Set();
        this.conflict = null;
        // A save the host will make only once confirmed (port 1.14.0): what it
        // said the save will do and the digest it issued for it, held until the
        // person confirms or goes back to editing. Nothing is written meanwhile,
        // and what was entered stays.
        this.confirmation = null;
        // Candidate records for a reference field, per field: the page the host
        // last answered with and the search it was answered for. Held for
        // rendering only, and dropped when the search changes -- a page is not the
        // whole set, so keeping pages across searches would show stale matches.
        this.optionPages = new Map();
        this.optionSearches = new Map();
        // One counter per field, because every reference field in a group is read
        // at the same moment and a single counter kept only the last answer.
        this.optionEpochs = new Map();
        // Files in flight, per field, in the shape sf-file-upload reads. The host
        // stores them and reports what it reports; the component times nothing,
        // because a progress bar over a transfer it does not perform would be a
        // bar that lies.
        this.uploads = new Map();
        // How the arrangement resolved and what this person may change about it,
        // as the host stated it. Absent means the view cannot be configured, and
        // no control that would lead there is drawn.
        this.view = null;
        this.configuring = false;
        // True while this component opened the not-placed bin for a drag, so it
        // can close it again and leave a bin the person opened alone.
        this._openedForDrag = false;
        this.viewTarget = "personal";
        // The layer being edited, as a working copy of what the host sent for it.
        // A layer carries only the entries it decides; the component edits that
        // and writes it back, rather than writing the whole resolved arrangement
        // into it -- a personal layer restating every entry would pin the view and
        // stop any later change to the shared layer from showing through.
        this.layerDraft = null;
        this.entryErrors = new Map();
        // One counter for the view writes, for the same reason the field options
        // have one each: an answer that arrives after the next write began is not
        // about the arrangement on screen.
        this.viewEpoch = 0;
        // Wide until something says otherwise: a first render that assumed a phone
        // would draw the narrow arrangement on a desktop for one frame.
        this.wide = true;
        this.wideMedia = null;
        // On a phone the sections are a list and a section is the next screen.
        // Null is the list; a key is that section's screen.
        this.phoneSection = null;
        // A short field edited in a window at its value (C305 (1)):
        // {section, group, key} while it is open. Its entry is held in
        // `changed` as a group's is, and saved as group.save with that one value.
        this.quick = null;
        // The field the last save wrote, marked for a moment (the saved colour).
        this.savedKeys = new Set();
        // The whole record opened from «⋯ → Изменить всё» (mode edit for a while).
        this.editAll = false;
        // A close (or a step to the next record) asked over unsaved entries
        // (C159 (6)): {kind: close|step, reason|direction} until answered.
        this.leaveAsk = null;
        // The record's history (C305 (2)): open as a level of the panel, or in
        // the full screen's side column; its events as the port answered them.
        this.historyOpen = false;
        this.historyFeed = null;
        this.historyEpoch = 0;
        this.sideWide = false;
        this.sideMedia = null;
        // The group drawn by sf-form while it is edited: its fields and saved
        // value, kept for the edit so a render never resets the form.
        this.formEdit = null;
        this._focusFieldAfterRender = null;
    }

    // Declaring a prop does not create an accessor for it: `static get props()`
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
    }

    get collection() {
        return this.getAttribute("collection") || "";
    }

    get showRare() {
        return this.getBooleanAttr("show-rare", false);
    }

    // A record the host answered with and that holds nothing visible is a state
    // of its own: without a word for it the panel is an empty box that reads as
    // something still loading.
    get emptyRecordText() {
        return this.getAttribute("empty-record-text") || pageText(PROPERTY_VIEW_TEXT, "emptyRecordText", this);
    }

    get isEmptyRecord() {
        if (!this.record) return false;
        const sections = this.sections ?? [];
        if (!sections.length) return true;
        return !sections.some((section) => (section.groups ?? []).some(
            (group) => group.kind === "related" || (group.fields ?? []).length > 0));
    }

    get emptyText() {
        return this.getAttribute("empty-text") || pageText(PROPERTY_VIEW_TEXT, "emptyText", this);
    }

    get editText() {
        return this.getAttribute("edit-text") || pageText(PROPERTY_VIEW_TEXT, "editText", this);
    }

    get saveText() {
        return this.getAttribute("save-text") || pageText(PROPERTY_VIEW_TEXT, "saveText", this);
    }

    get cancelText() {
        return this.getAttribute("cancel-text") || pageText(PROPERTY_VIEW_TEXT, "cancelText", this);
    }

    get deleteText() {
        return this.getAttribute("delete-text") || pageText(PROPERTY_VIEW_TEXT, "deleteText", this);
    }

    // What the host allows on the record itself, as it allows it per row in a
    // data view. The component offers nothing the host did not name: a delete
    // the host would refuse is a control that exists to fail.
    // Fields the collection has that this view places in no group. They are not
    // hidden: hiding keeps a field where it is and dims it, while these are out
    // of the arrangement altogether, and only the arranging mode draws them.
    get unplaced() {
        const fields = this.record?.unplaced;
        return Array.isArray(fields) ? fields : [];
    }

    // Taking a field out of every group, and putting one back. A field out of
    // the arrangement is the layer saying its group is nothing, which is what
    // the port means by a null group.
    moveFieldToUnplaced(fieldKey, index, {save = true} = {}) {
        if (!this.configuring || !this.layerDraft) return false;
        // «Стадия» the admin locked stays shown (port 1.22.0 view.locked).
        if (this.lockedForMe(`fields.${String(fieldKey)}.hidden`)) return false;
        let moved = null;
        let fromGroup = null;
        for (const section of this.sections) {
            for (const group of section.groups ?? []) {
                const at = (group.fields ?? []).findIndex((field) => String(field.key) === String(fieldKey));
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
        this._writeOrder(this.layerDraft.fields, into, {group: null});
        if (fromGroup) this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {group: String(fromGroup.key)});
        this.requestComponentUpdate("view-move");
        return save ? this.saveView() : true;
    }

    get recordActions() {
        const actions = this.record?.actions;
        return Array.isArray(actions) ? actions.map((action) => String(action)) : [];
    }

    // Deleting is the host's, including whether to ask first. The component says
    // it was asked for and closes when the host says it is done; a host that
    // refuses sends its reason and the panel stays open with it on screen.
    async deleteRecord() {
        if (this.mode === "view" || this.mode === "create" || !this.recordActions.includes("record.delete")) return false;
        const answer = await this._raise("record.delete", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            revision: this.record?.revision ?? null,
        });
        // Vocabulary §5 delete; sf-property-view-delete-record follows once (aliases.json).
        this.sfEmit("delete", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            revision: this.record?.revision ?? null,
            answer: answer?.answer ?? null,
        });
        if (!answer) return false;
        if (answer.answer === "applied") {
            this.closePanel("deleted");
            return true;
        }
        // The person said no to the host's question: nothing to report.
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
        return this.getAttribute("changed-text") || pageText(PROPERTY_VIEW_TEXT, "changedText", this);
    }

    get errorsText() {
        return this.getAttribute("errors-text") || pageText(PROPERTY_VIEW_TEXT, "errorsText", this);
    }

    get conflictText() {
        return this.getAttribute("conflict-text") || pageText(PROPERTY_VIEW_TEXT, "conflictText", this);
    }

    get sectionsAs() {
        return this.getEnumAttr("sections-as", ["list", "tabs"], "list");
    }

    get sectionsLabel() {
        return this.getAttribute("sections-label") || pageText(PROPERTY_VIEW_TEXT, "sectionsLabel", this);
    }

    // A panel is a drawer over the page; `full` (the record as the page,
    // stand 24's record panel) draws it in place instead.
    get panel() {
        return this.getBooleanAttr("panel", false) && !this.full;
    }

    get full() {
        return this.getBooleanAttr("full", false);
    }

    set full(value) {
        this.toggleAttribute("full", Boolean(value));
    }

    // A panel shows while its element is not hidden and not closed by `open`
    // (simai/ui-pro#4; standard 1.3.8 §7.2.2, §19): a page or an assembly
    // closes it by `hidden` or open=false and brings it back by the same.
    get panelOpen() {
        return this.panel && !this.hidden && this.getAttribute("open") !== "false";
    }

    // The drawer opens and closes with it and takes the panel on and off the
    // layer stack; there is nothing to register here.
    syncPanelOpen() {
        this.requestComponentUpdate("panel-open");
    }

    // ---------- the manifest's values (§4) ----------

    get revision() {
        return this.record?.revision === undefined || this.record?.revision === null ? "" : String(this.record.revision);
    }

    get section() {
        return this.selectedSection ?? "";
    }

    // The step the drawer is drawn at (C289 (2)): panel-size when it names a
    // step; else the step nearest the width a former `panel-width` asked for.
    // Not a getter named panelSize: the declared property of that name is the
    // attribute's own accessor and wins over a getter, so a panel-width alone
    // was drawn at the default step 1.
    get drawerStep() {
        const size = this.getAttribute("panel-size");
        if (["1/2", "1", "2", "full"].includes(size)) return size;
        const width = this.panelWidth;
        return width ? nearestPanelStep(width) : "1";
    }

    // How the sections are laid out (C289 (1), (5); R250): the component
    // decides by width and the person does not set it. A panel on a phone is
    // the list of sections, each opening as a level with «←»; a panel on the
    // whole screen keeps a column on the left; any narrower panel draws a line
    // of tabs under its head, what does not fit in «Ещё (n)». In place (not a
    // panel) a wide page keeps `sections-as`.
    get sectionsLayout() {
        if (!this.wide) return "phone";
        // Arranging on the whole screen keeps the rail of sections beside the
        // groups, each its own scroller. A narrower panel (20, 24 or 30rem,
        // less its gutters) cannot hold a rail and fields of 20rem beside it:
        // the rail left the fields 212 px at 30rem and 116 px at 24rem (view
        // round 5, LV-3). There it arranges stacked, as tabs do (C311 (4)):
        // the picker, «Вкладки» (dragged as before), then the fields.
        if (this.panel) return this.drawerStep === "full" ? "column" : "tabs";
        return this.sectionsAs === "tabs" ? "tabs" : "column";
    }

    // Once per element: a former `panel-width` is said in the console with
    // the step it lands on, and noted in SF.deprecations.
    _notePanelWidth() {
        const width = this.panelWidth;
        if (!width || this.hasAttribute("panel-size") || this._panelWidthNoted === width) return;
        this._panelWidthNoted = width;
        const step = nearestPanelStep(width);
        noteDeprecated({component: "sf-view-properties", kind: "attribute", from: "panel-width", to: "panel-size",
            since: "2026-11-17", remove_after: PANEL_WIDTH_UNTIL, package: "view"});
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
    }

    // The size written on the controls the panel draws: the host's own when it
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
    }

    // Whether this person may change the fields. A view surface never offers
    // it; since port 1.12.0 the host says so with record.edit among the
    // record's actions, and a reader is sent none. A host on an earlier port
    // never sent it, and for it a group is editable unless it says otherwise.
    get mayEdit() {
        if (this.mode === "view" || this.editMode === "none") return false;
        if (this.mode === "create") return true;
        if (!versionAtLeast(this.hostPort?.version, "1.12.0")) return true;
        return this.recordActions.includes("record.edit");
    }

    // Every group open at once: a full edit page, or a create.
    get openAll() {
        return this.mode === "create" || ((this.mode === "edit" || this.editAll) && this.mayEdit);
    }

    // C305 (1): group | group+quick | none; group+quick by default wherever
    // the record may be edited, the same short fields the table edits at the
    // cell (C296).
    get editMode() {
        const value = this.getAttribute("edit");
        return EDIT_MODES.includes(value) ? value : "group+quick";
    }

    // The window at a value is SIMAI Framework sf-popover: where the page has
    // not defined it yet, a short field goes through its group as before.
    get quickEdit() {
        return this.editMode === "group+quick" && this.mayEdit && !this.openAll && !this.configuring
            && Boolean(globalThis.customElements?.get?.("sf-popover"));
    }

    // A short field: one control at its value, by its type. A list of several,
    // a set type, a condition and a read-only field go through the group. (A
    // field's own say -- a port field key -- is ordered with the port edition.)
    isQuickField(field) {
        if (!field || field.readonly === true || field.when || field.multiple === true) return false;
        const type = String(field.propertyType || field.type || "");
        if (!QUICK_TYPES.has(type) || drawsSetField(field)) return false;
        // A person picked from the host's pages needs the picker's host.
        if (type === "user" && !this.canPickRecords) return false;
        return true;
    }

    // C305 (2): the history is offered where the host answers record.history
    // (capability record-history) and the page did not turn it off.
    get historyOffered() {
        return this.getAttribute("history") !== "off" && this.mode !== "create" && Boolean(this.recordId)
            && Boolean(this.hostPort?.capabilities?.includes?.("record-history"));
    }

    // C305 (3): the full screen keeps the history in a column of its own
    // from 80rem; narrower it is a level of the panel, as in a panel.
    get historySide() {
        return this.historyOffered && this.sideWide && this.sectionsLayout === "column" && !this.configuring
            && (this.drawerStep === "full" || !this.panel);
    }

    // C305 (4): a panel narrower than the screen is a column beside the list
    // from 64rem (sf-drawer docked), the list usable; below it, and with
    // modal="true", it floats over a scrim.
    // A panel opened over another card's panel (a related record, C289 (6))
    // stays a window over the one below, which the Framework's overlay dims.
    get docked() {
        if (!this.panel || this.getAttribute("modal") === "true" || this.drawerStep === "full") return false;
        // Only a panel below counts: the one under a related record stays docked.
        const own = this._ownDrawer();
        const cards = openLayers("panel").filter((owner) => owner?.parentElement?.localName === this.localName);
        const at = cards.indexOf(own);
        return at === -1 ? cards.length === 0 : at === 0;
    }

    // A docked panel is a column of the page only where something gives it the
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
        const host = (this.id ? views.find((view) => view.getAttribute("record-card") === this.id) : null)
            ?? (views.length === 1 ? views[0] : null)
            ?? (this.parentElement && this.parentElement !== document.documentElement ? this.parentElement : null);
        host?.setAttribute("data-sf-drawer-dock-host", "");
        return docked;
    }

    // What the drawer is told to be. `size` is a ladder and its widest step short
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
        return this.getAttribute("close-label") || pageText(PROPERTY_VIEW_TEXT, "closeLabel", this);
    }

    get linkCopiedLabel() {
        return this.getAttribute("link-copied-label") || pageText(PROPERTY_VIEW_TEXT, "linkCopiedLabel", this);
    }

    get copyLinkLabel() {
        return this.getAttribute("copy-link-label") || pageText(PROPERTY_VIEW_TEXT, "copyLinkLabel", this);
    }

    get configureText() {
        return this.getAttribute("configure-text") || pageText(PROPERTY_VIEW_TEXT, "configureText", this);
    }

    get resetViewAskText() {
        return this.getAttribute("reset-view-ask-text") || pageText(PROPERTY_VIEW_TEXT, "resetViewAskText", this);
    }

    get cancelConfiguringText() {
        return this.getAttribute("cancel-configuring-text") || pageText(PROPERTY_VIEW_TEXT, "cancelConfiguringText", this);
    }

    get doneConfiguringText() {
        return this.getAttribute("done-configuring-text") || pageText(PROPERTY_VIEW_TEXT, "doneConfiguringText", this);
    }

    get resetViewText() {
        return this.getAttribute("reset-view-text") || pageText(PROPERTY_VIEW_TEXT, "resetViewText", this);
    }

    get addViewText() {
        return this.getAttribute("add-view-text") || pageText(PROPERTY_VIEW_TEXT, "addViewText", this);
    }

    get newViewText() {
        return this.getAttribute("new-view-text") || pageText(PROPERTY_VIEW_TEXT, "newViewText", this);
    }

    get deleteViewText() {
        return this.getAttribute("delete-view-text") || pageText(PROPERTY_VIEW_TEXT, "deleteViewText", this);
    }

    get lastSharedViewText() {
        return this.getAttribute("last-shared-view-text") || pageText(PROPERTY_VIEW_TEXT, "lastSharedViewText", this);
    }

    get viewProfileLabel() {
        return this.getAttribute("view-profile-label") || pageText(PROPERTY_VIEW_TEXT, "viewProfileLabel", this);
    }

    get personalLayerText() {
        return this.getAttribute("personal-layer-text") || pageText(PROPERTY_VIEW_TEXT, "personalLayerText", this);
    }

    get sharedLayerText() {
        return this.getAttribute("shared-layer-text") || pageText(PROPERTY_VIEW_TEXT, "sharedLayerText", this);
    }

    get widthText() {
        return this.getAttribute("width-text") || pageText(PROPERTY_VIEW_TEXT, "widthText", this);
    }

    get variantText() {
        return this.getAttribute("variant-text") || pageText(PROPERTY_VIEW_TEXT, "variantText", this);
    }

    get hintText() {
        return this.getAttribute("hint-text") || pageText(PROPERTY_VIEW_TEXT, "hintText", this);
    }

    get hiddenText() {
        return this.getAttribute("hidden-text") || pageText(PROPERTY_VIEW_TEXT, "hiddenText", this);
    }

    get configureHintText() {
        return this.getAttribute("configure-hint-text")
            || pageText(PROPERTY_VIEW_TEXT, "configureHintText", this);
    }

    // On a narrow panel the section list is a screen of its own, so a field has
    // nowhere beside the fields to be dropped. The wide sentence names the list
    // on the left, and saying that where there is no list promises something a
    // person cannot do.
    get configureHintNarrowText() {
        return this.getAttribute("configure-hint-narrow-text")
            || pageText(PROPERTY_VIEW_TEXT, "configureHintNarrowText", this);
    }

    get fieldSettingsText() {
        return this.getAttribute("field-settings-text") || pageText(PROPERTY_VIEW_TEXT, "fieldSettingsText", this);
    }

    get shownText() {
        return this.getAttribute("shown-text") || pageText(PROPERTY_VIEW_TEXT, "shownText", this);
    }

    get showRareText() {
        return this.getAttribute("show-rare-text") || pageText(PROPERTY_VIEW_TEXT, "showRareText", this);
    }

    get hideRareText() {
        return this.getAttribute("hide-rare-text") || pageText(PROPERTY_VIEW_TEXT, "hideRareText", this);
    }

    get rareText() {
        return this.getAttribute("rare-text") || pageText(PROPERTY_VIEW_TEXT, "rareText", this);
    }

    get unplacedTitle() {
        return this.getAttribute("unplaced-title") || pageText(PROPERTY_VIEW_TEXT, "unplacedTitle", this);
    }

    get moveUpText() {
        return this.getAttribute("move-up-text") || pageText(PROPERTY_VIEW_TEXT, "moveUpText", this);
    }

    get moveDownText() {
        return this.getAttribute("move-down-text") || pageText(PROPERTY_VIEW_TEXT, "moveDownText", this);
    }

    get addFieldText() {
        return this.getAttribute("add-field-text") || pageText(PROPERTY_VIEW_TEXT, "addFieldText", this);
    }

    get renameText() {
        return this.getAttribute("rename-text") || pageText(PROPERTY_VIEW_TEXT, "renameText", this);
    }

    get saveNameText() {
        return this.getAttribute("save-name-text") || pageText(PROPERTY_VIEW_TEXT, "saveNameText", this);
    }

    get cancelNameText() {
        return this.getAttribute("cancel-name-text") || pageText(PROPERTY_VIEW_TEXT, "cancelNameText", this);
    }

    get removeFieldText() {
        return this.getAttribute("remove-field-text") || pageText(PROPERTY_VIEW_TEXT, "removeFieldText", this);
    }

    get removeGroupText() {
        return this.getAttribute("remove-group-text") || pageText(PROPERTY_VIEW_TEXT, "removeGroupText", this);
    }

    get removeSectionText() {
        return this.getAttribute("remove-section-text") || pageText(PROPERTY_VIEW_TEXT, "removeSectionText", this);
    }

    get addGroupText() {
        return this.getAttribute("add-group-text") || pageText(PROPERTY_VIEW_TEXT, "addGroupText", this);
    }

    get addSectionText() {
        return this.getAttribute("add-section-text") || pageText(PROPERTY_VIEW_TEXT, "addSectionText", this);
    }

    get newGroupTitle() {
        return this.getAttribute("new-group-title") || pageText(PROPERTY_VIEW_TEXT, "newGroupTitle", this);
    }

    get newSectionTitle() {
        return this.getAttribute("new-section-title") || pageText(PROPERTY_VIEW_TEXT, "newSectionTitle", this);
    }

    get sectionIconText() {
        return this.getAttribute("section-icon-text") || pageText(PROPERTY_VIEW_TEXT, "sectionIconText", this);
    }

    get fieldLabelText() {
        return this.getAttribute("field-label-text") || pageText(PROPERTY_VIEW_TEXT, "fieldLabelText", this);
    }

    get inThisGroupText() {
        return this.getAttribute("in-this-group-text") || pageText(PROPERTY_VIEW_TEXT, "inThisGroupText", this);
    }

    get noMatchText() {
        return this.getAttribute("no-match-text") || pageText(PROPERTY_VIEW_TEXT, "noMatchText", this);
    }

    // Where a group stands among the groups a person can see, and how many there
    // are, so the control that moves it knows when it has nowhere to go.
    get currentGroups() {
        const section = (this.sections ?? []).find((part) => String(part.key) === this.selectedSection)
            ?? (this.sections ?? [])[0] ?? null;
        return section?.groups ?? [];
    }

    groupAt(groupKey) {
        return this.currentGroups.findIndex((group) => String(group.key) === String(groupKey));
    }

    get groupCount() {
        return this.currentGroups.length;
    }

    // Moving a group one step, for a person who would rather press than drag --
    // and for anyone who cannot drag at all.
    moveGroupBy(groupKey, step) {
        const at = this.groupAt(groupKey);
        if (at < 0) return false;
        const to = at + step;
        if (to < 0 || to >= this.groupCount) return false;
        const section = (this.sections ?? []).find((part) => String(part.key) === this.selectedSection)
            ?? (this.sections ?? [])[0] ?? null;
        if (!section) return false;
        return this.moveGroup(groupKey, String(section.key), to);
    }

    // Every field this group could hold, with the ones it holds already marked.
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
        const session = this._addSession?.group === key
            ? this._addSession
            : this._buildAddSession(key);
        const here = new Set();
        for (const field of this._locateGroup(key)?.group?.fields ?? []) here.add(String(field.key));

        const search = this.addSearch.trim().toLowerCase();
        const options = [];
        for (const entry of session.order) {
            if (search && !entry.label.toLowerCase().includes(search)
                && !entry.key.toLowerCase().includes(search)) continue;
            options.push({...entry, selected: here.has(entry.key)});
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
            order.push({key: fieldKey, label: String(field.label ?? field.key), group: from});
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
        return {group: key, order};
    }

    // The list opens on a snapshot of where every field is, and forgets it when
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
    }

    // Ticking places the field here; unticking takes it out of every area, which
    // is where a field goes when it belongs to none.
    toggleFieldInGroup(fieldKey, groupKey, wanted) {
        return wanted
            ? this.moveField(fieldKey, groupKey, Number.MAX_SAFE_INTEGER)
            : this.moveFieldToUnplaced(fieldKey);
    }

    get unplacedHintText() {
        return this.getAttribute("unplaced-hint-text") || pageText(PROPERTY_VIEW_TEXT, "unplacedHintText", this);
    }

    get viewConflictText() {
        return this.getAttribute("view-conflict-text") || pageText(PROPERTY_VIEW_TEXT, "viewConflictText", this);
    }

    // The head's own words. The port carries a collection *key* and no record
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
    }

    get favouriteLabel() {
        return this.getAttribute("favourite-label") || pageText(PROPERTY_VIEW_TEXT, "favouriteLabel", this);
    }

    get menuLabel() {
        return this.getAttribute("menu-label") || pageText(PROPERTY_VIEW_TEXT, "menuLabel", this);
    }

    // What a value inherited from somewhere else is marked with. The prototype
    // writes «по умолчанию» beside it, so a person can see that the record has not
    // decided this and that changing the source will change it here.
    get inheritedText() {
        return this.getAttribute("inherited-text") || pageText(PROPERTY_VIEW_TEXT, "inheritedText", this);
    }

    // The star answers the press at once and reports it. Storing a favourite is
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
            detail: {record_id: this.recordId || null, collection: this.collection || null, favourite: next},
        }));
        return true;
    }

    // The «⋯» menu: what belongs to the view rather than to the record. Configure
    // and reset live here, as the mockup has them, so the panel head carries one
    // control instead of a row of words.
    get panelMenuItems() {
        const items = [];
        if (this.canConfigureView && !this.configuring) {
            items.push({id: "configure", name: this.configureText, icon: "tune"});
        }
        // Resetting is not offered here while the view is being arranged: the
        // bar at the foot carries «Сбросить» with a confirmation beside the
        // other two answers, and the same act behind a «⋯» as well is the same
        // destruction reachable two ways, one of them quietly (owner,
        // 2026-10-08).
        if (this.hasRare) {
            items.push({
                id: "show-rare",
                name: this.showRare ? this.hideRareText : this.showRareText,
                icon: this.showRare ? "unfold_less" : "unfold_more",
            });
        }
        return items;
    }

    // What the «⋯» holds for the record itself (C289 (3), (6); C180 (2)):
    // copy its address and open it as a page -- they stood outside the panel
    // on the scrim and drew a white glyph on a white plate -- and, last and
    // apart, deleting it. A reading panel has no foot for one delete.
    get recordMenuItems() {
        const items = [];
        // «Изменить всё» (C305 (1)): every group open at once, one Save -- in
        // the panel's head; an inline view has its groups' «Изменить» and no
        // row of its own for it (the skeleton keeps the first group in place).
        if (this.panel && this.mayEdit && !this.openAll && !this.configuring && this.mode !== "create"
            && (this.sections ?? []).some((section) => (section.groups ?? []).some((group) => group.kind !== "related" && group.editable !== false))) {
            items.push({id: "edit-all", name: pageText(PROPERTY_VIEW_TEXT, "editAllText", this), icon: "edit"});
        }
        // «История изменений» (C305 (2)): a level of the panel; the full
        // screen from 80rem shows it in its own column instead.
        if (this.historyOffered && !this.historySide) {
            items.push({id: "history", name: pageText(PROPERTY_VIEW_TEXT, "historyText", this), icon: "history"});
        }
        if (this.address) items.push({id: "copy-link", name: this.copyLinkLabel, icon: "link"});
        if (this.canOpenFullPage) items.push({id: "open-full", name: this.openFullLabel, icon: "open_in_full"});
        return items;
    }

    get canDeleteRecord() {
        return this.mode !== "view" && this.mode !== "create" && this.recordActions.includes("record.delete")
            && !this.configuring;
    }

    // ─── the standard menu (owner, 2026-10-12) ──────────────────────────────
    // The «⋯» and the view chooser open the Framework's standard menu: one
    // sf-menu-context beside the page, filled for whichever control asked.
    async openStandardMenu(anchor, {label, entries, select, align = "end"}) {
        if (!(anchor instanceof Element)) return null;
        // The panel did not draw a menu before, so its rule does not fetch one;
        // the Loader is asked for it the first time it is wanted.
        await globalThis.SF?.Loader?.ensure?.(["sf-menu-context"]);
        let menu = this._standardMenu;
        if (!menu?.isConnected) {
            menu = document.createElement("sf-menu-context");
            menu.setAttribute("popup", "");
            menu.dataset.sfPropertyViewMenu = "";
            menu.addEventListener("sf-menu-context-select", (event) => this._standardMenuSelect?.(event.detail?.id));
            (this.closest("dialog[open]") || document.body).append(menu);
            this._standardMenu = menu;
        }
        if (menu.isOpen && this._standardMenuAnchor === anchor) {
            menu.close();
            return null;
        }
        // The panel's step and the density of its area, on every opening (owner
        // remark 2026-11-15): the menu stands on <body> or in the open dialog,
        // outside the panel, and fell back to the menu's own 1/2.
        menu.setAttribute("size", this.size);
        followDensity(menu, this);
        menu.setAttribute("aria-label", label ?? "");
        menu.entries = entries;
        this._standardMenuSelect = select;
        this._standardMenuAnchor = anchor;
        return menu.openFor(anchor, {align});
    }

    openPanelMenu(anchor) {
        // The history level's «⋯»: which events it shows.
        if (this.historyOpen && !this.historySide) {
            const fieldsOnly = JSON.stringify(this.historyFeed?.kinds ?? null) === JSON.stringify(["update"]);
            return this.openStandardMenu(anchor, {
                label: this.menuLabel,
                entries: [
                    {id: "history-kinds:update", text: pageText(PROPERTY_VIEW_TEXT, "historyFieldsText", this), kind: "radio", checked: fieldsOnly, icon: "edit_note"},
                    {id: "history-kinds:all", text: pageText(PROPERTY_VIEW_TEXT, "historyAllText", this), kind: "radio", checked: !fieldsOnly, icon: "list"},
                ],
                select: (id) => this._chooseStandardEntry(id),
            });
        }
        const entries = [];
        const profiles = this.viewProfiles;
        // The profile is chosen in sf-profile-picker only (C163 (1), C311 (5),
        // RC-6): outside the mode one row «Вид: <name>» enters it with the
        // picker open. A person who cannot arrange the view chooses in the
        // select-only picker above the fields; the menu has no views submenu
        // for anyone (the dispatcher's call on C311 (5)).
        if (profiles.length > 1 && !this.configuring && this.canConfigureView) {
            const current = profiles.find((profile) => profile.id === this.viewProfile);
            entries.push({id: "view-profile-picker", text: `${this.viewProfileLabel}: ${current?.label ?? ""}`, icon: "view_sidebar"});
        }
        // «Сохранить как моё» in the head «⋯» while arranging (C311 (5)).
        if (this.canSaveAsMine) {
            entries.push({id: "save-as-mine", text: pageText(PROPERTY_VIEW_TEXT, "saveAsMineText", this), icon: "person"});
        }
        const record = this.recordMenuItems;
        if (entries.length && record.length) entries.push({type: "separator"});
        entries.push(...record.map((item) => ({id: item.id, text: item.name, icon: item.icon})));
        const items = this.panelMenuItems;
        if (entries.length && items.length) entries.push({type: "separator"});
        entries.push(...items.map((item) => ({id: item.id, text: item.name, icon: item.icon})));
        const hosted = this.hostMenuEntries();
        if (entries.length && hosted.length) entries.push({type: "separator"});
        entries.push(...hosted);
        if (this.canDeleteRecord) {
            if (entries.length) entries.push({type: "separator"});
            entries.push({id: "delete", text: this.deleteText, icon: "delete", danger: true});
        }
        if (!entries.length) return null;
        return this.openStandardMenu(anchor, {
            label: this.menuLabel, entries,
            select: (id) => this._chooseStandardEntry(id),
        });
    }

    // The host's own menu items, as rows of the standard menu: its text, its
    // icon (icon, icon-start or data-icon), a link row for an address.
    hostMenuElements() {
        // In a panel the holder is in the drawer, which is moved to the page's end.
        const holder = this.querySelector("[data-host-menu]")
            ?? this.panelContent?.()?.querySelector?.("[data-host-menu]");
        return holder ? [...holder.children] : [];
    }

    hostMenuEntries() {
        return this.hostMenuElements().map((element, at) => {
            const control = element.matches("a[href], button") ? element : element.querySelector("a[href], button") ?? element;
            const text = (element.getAttribute("text") ?? element.getAttribute("aria-label") ?? control.textContent ?? "").trim();
            const href = control.matches?.("a[href]") ? control.getAttribute("href") : null;
            return {
                id: `host:${at}`, text,
                icon: element.getAttribute("icon") ?? element.getAttribute("icon-start") ?? element.dataset.icon ?? undefined,
                href: href || undefined,
                danger: element.getAttribute("scheme") === "error" || element.dataset.danger === "true",
                disabled: element.hasAttribute("disabled") || control.disabled === true,
            };
        }).filter((entry) => entry.text);
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
            }), {next: true});
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
        return this.getAttribute("back-label") || pageText(PROPERTY_VIEW_TEXT, "backLabel", this);
    }

    get viewDeniedText() {
        return this.getAttribute("view-denied-text") || pageText(PROPERTY_VIEW_TEXT, "viewDeniedText", this);
    }

    get openFullLabel() {
        return this.getAttribute("open-full-label") || pageText(PROPERTY_VIEW_TEXT, "openFullLabel", this);
    }

    // Where this object lives, as the host named it when it answered. Never
    // constructed here: a composite that built a URL would be guessing at the
    // consumer's routing.
    get address() {
        return this.record?.address ?? null;
    }

    // Opening the record as a page is the host's, and so is whether there is a
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
        if (previous === next || !this.isConnected) return;
        // Without a port there is nothing to read: the view stays loading and
        // the port, when it comes, reads the record (setHostPort). Read here,
        // a record-id the page printed failed at once with «port not
        // connected» while the element upgraded, before it asked for a port.
        if (name === "record-id" && this.hostPort) this.load("record-id-changed");
        if (name === "hidden" || name === "open" || name === "full") this.syncPanelOpen();
    }

    // Every tag the card draws, asked of the Loader once per connection
    // (§7.11, VF-16); the card draws again once they are defined, so a part
    // drawn before its definition upgrades in place.
    _askForDrawnTags() {
        const registry = globalThis.customElements;
        const loader = globalThis.SF?.Loader;
        if (typeof registry?.get !== "function" || typeof loader?.ensure !== "function") return;
        const missing = DRAWN_TAGS.filter((tag) => !registry.get(tag));
        if (!missing.length) return;
        Promise.resolve(loader.ensure(missing, {timeout: 10000})).catch(() => null).then(() => {
            if (this.isConnected) this.requestComponentUpdate("parts-defined");
        });
    }

    // Every other tag the view has drawn -- a field's control, a host's
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
        Promise.resolve(loader.ensure([...missing], {timeout: 10000})).catch(() => null);
    }

    // The arranging mode's own parts (C311): the view picker and the lists
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
        const missing = ARRANGING_TAGS.filter((tag) => !registry.get(tag));
        if (missing.length) Promise.resolve(loader.ensure(missing, {timeout: 10000})).catch(() => null);
    }

    onConnected() {
        super.onConnected?.();
        this._notePanelWidth();
        this._askForDrawnTags();
        // Born loading. The first render comes before the host is asked, and
        // drawn with no state it was the empty body -- one frame of «nothing
        // here» before the skeleton, the flash the table had (rules of the
        // road, rule 2: loading is drawn as the skeleton, from the first frame).
        if (!this.hasAttribute("data-state") && !this.record) {
            this.setAttribute("data-state", "loading");
            this.setAttribute("aria-busy", "true");
        }
        // Escape is the layer stack's: it hands the press to the top layer only,
        // after it has passed through the page, so a list, a menu or a modal
        // opened over this panel takes it first, and a control inside that
        // handled it (preventDefault) keeps it. The drawer closes on it -- and a
        // panel never closes itself, so every close the drawer starts (Escape,
        // a press on the dimmed page, a script calling close()) is refused here
        // and asked of the host as this component's own cancelable close, with
        // the count of what is unsaved. Only this panel's own drawer: a drawer
        // opened inside the panel is portalled with it and never bubbles here.
        this._onDrawerClose = (event) => {
            if (event.target !== this._ownDrawer()) return;
            event.preventDefault();
            this.closePanel(DRAWER_CLOSE_REASONS[event.detail?.reason] ?? "api");
        };
        this.addEventListener("sf-drawer-close", this._onDrawerClose);
        // The first focus of the panel (Pro joint pass PRO-ADM-16): the drawer
        // gives it to the first field of its content, else its first control
        // -- for a record shown to read, the favourite star in the head, whose
        // tooltip then stood over the title. A record to read starts on its
        // title (the heading takes the focus without becoming a Tab stop); a
        // record with a field keeps the field the drawer chose (C159 (9)). The
        // panel is drawn open and its record comes later, so sf-drawer-opened
        // is not sent and the drawer's pick lands frames after the open: the
        // panel watches the focus from its open until the title is drawn, the
        // person acts or two seconds pass.
        this._onPanelFocusIn = () => this._focusTitleFirst();
        this._onPanelAct = (event) => {
            const root = this._ownDrawerRoot();
            if (root && event.composedPath?.().includes(root)) this._endTitleFocus();
        };
        this._offAfterRender = this.onAfterRender?.(() => {
            const open = this.panelOpen;
            if (open && !this._panelWasOpen) this._startTitleFocus();
            if (!open) this._endTitleFocus();
            this._panelWasOpen = open;
            if (this._titleFocusUntil) requestAnimationFrame(() => this._focusTitleFirst());
        });
        // Every render, not once (onAfterRender runs a callback once unless
        // told otherwise): the errors to focus after a refused Save, the tags
        // to ask the Loader for, the back line of a related record.
        this._offEveryRender = this.onAfterRender?.(() => {
            if (this._focusErrorsAfterRender) {
                this._focusErrorsAfterRender = false;
                requestAnimationFrame(() => this._focusErrors());
            }
            // A long field's value pressed: its group opens with the focus on
            // it (VP-21); sf-form gives it once its controls are drawn.
            if (this._focusFieldAfterRender && this.editing) {
                const key = this._focusFieldAfterRender;
                this._focusFieldAfterRender = null;
                // sf-form may draw before or after this hook, and its control is
                // defined lazily: wait (60 frames at most) until the control has
                // something to focus.
                const formed = Boolean(this.formEdit);
                const FOCUSABLE = "input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])";
                let frames = 0;
                const give = () => {
                    const form = formed ? this._formOf(this.editing?.group) : null;
                    const control = form?.controlOf?.(key);
                    const ready = !formed || Boolean(control && (!control.localName.includes("-") || customElements.get(control.localName))
                        && (control.focusDelegate?.() || control.querySelector?.(FOCUSABLE)));
                    if (!ready && frames++ < 60) return requestAnimationFrame(give);
                    if (form?.focusField) form.focusField(key);
                    else this.focusField(key);
                };
                requestAnimationFrame(give);
            }
            if (this._focusAfterStep && this.record && this.getAttribute("data-state") !== "loading") {
                this._focusAfterStep = false;
                requestAnimationFrame(() => {
                    const root = this.panel ? this.panelContent?.() : this;
                    const active = document.activeElement;
                    if (root && active && root.contains(active) && active !== document.body) return;
                    root?.querySelector?.(".sf-property-view-title")?.focus?.({preventScroll: true});
                });
            }
            // The full screen's history column reads its first page itself.
            if (this.historySide && (!this.historyFeed || this.historyFeed.record !== this.recordId) && this.record && !this._sideAsked) {
                this._sideAsked = true;
                Promise.resolve().then(() => this.loadHistory()).finally(() => { this._sideAsked = false; });
            }
            this._askForUndefinedTags();
            this._askForArrangingTags();
            // The panel's level for a related record (C289 (6)): whether this
            // panel's drawer is drawn inside another one is known once it is open.
            const nested = this._nestedLabel();
            if (nested !== this._nestedUnderLabel) {
                this._nestedUnderLabel = nested;
                this.requestComponentUpdate("nested");
            }
        }, {once: false});
        // The drop is sf-sortable's to report and the component's to apply or
        // refuse -- that is the seam the mechanism already publishes, so no drag
        // is implemented here. The lists name themselves `field:<group>` and
        // `group:<section>`, which is what `to` carries.
        this._onSortableIntent = (event) => {
            if (!this.configuring) return;
            const detail = event.detail ?? {};
            const [kind, container] = String(detail.to ?? "").split(":");
            if (!container) return;
            if (kind === "section") this.moveSection(detail.item, detail.index);
            else if (kind === "field") this.moveField(detail.item, container, detail.index);
            else if (kind === "group") this.moveGroup(detail.item, container, detail.index);
            else if (kind === "unplaced") this.moveFieldToUnplaced(detail.item, detail.index);
        };
        this.addEventListener("sf-sortable-intent", this._onSortableIntent);
        // A panel is portalled out of this element, so an intent raised inside one
        // never bubbles to it. The document listener catches those, and checks the
        // list belongs to this record before acting -- two stacked panels are two
        // components, and the wrong one applying the move would rearrange a view
        // nobody was looking at.
        this._onDocumentSortableIntent = (event) => {
            if (!this.panel || !this.configuring) return;
            const panel = event.target?.closest?.(".sf-property-view-panel");
            if (!panel || panel.getAttribute("data-record-id") !== String(this.recordId)) return;
            this._onSortableIntent(event);
        };
        document.addEventListener("sf-sortable-intent", this._onDocumentSortableIntent);
        // The not-placed bin is an accordion, closed by default, and a drop
        // target nobody can see is a drop target nobody uses. So a drag opens
        // it -- by pressing its trigger, the way a person would, because the
        // accordion owns whether it is open and a second controller would
        // fight it. It is pressed back when the drag ends, and only if this is
        // what opened it: a person who opened it themselves keeps it open
        // (owner, 2026-10-09).
        this._onSortableState = (event) => {
            if (!this.configuring) return;
            const state = event.detail?.state;
            // The panel is portalled out of this element, so it is reached the
            // way the sortable intents are reached: by the record it carries.
            // `this.panel` is not an element and querying it found nothing,
            // which is why the bin stayed shut through a whole drag.
            const panel = globalThis.document?.querySelector?.(
                `.sf-property-view-panel[data-record-id="${this.recordId}"]`,
            );
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
        this.wideMedia = typeof globalThis.matchMedia === "function"
            ? globalThis.matchMedia(WIDE_MEDIA_QUERY)
            : null;
        this.wide = this.wideMedia ? this.wideMedia.matches : true;
        this._onWideChange = (event) => {
            this.wide = event.matches;
            // Leaving the phone arrangement leaves its navigation behind: a section
            // screen is a phone idea, and keeping the state would show a desktop a
            // single section with a back arrow and no way to see the others.
            if (this.wide) this.phoneSection = null;
            this.requestComponentUpdate("viewport");
        };
        this.wideMedia?.addEventListener?.("change", this._onWideChange);
        this.sideMedia = typeof globalThis.matchMedia === "function" ? globalThis.matchMedia(SIDE_MEDIA_QUERY) : null;
        this.sideWide = Boolean(this.sideMedia?.matches);
        this._onSideChange = (event) => {
            this.sideWide = event.matches;
            this.requestComponentUpdate("viewport");
        };
        this.sideMedia?.addEventListener?.("change", this._onSideChange);
        // Alt+↓ / Alt+↑: the next or the previous record of the view (C305 (4)).
        // The panel is portalled out of the element, so the keys are read on
        // the document for a press inside this card's panel.
        this._onStepKey = (event) => {
            if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            const root = this.panel ? this.panelContent() : this;
            // A press on the panel itself counts: the drawer gives its panel
            // the focus when the card covers the list (phone), and the keys
            // went nowhere from there (VR2-3).
            const path = event.composedPath?.() ?? [];
            const own = this.panel ? this._ownDrawerRoot() : null;
            if (!root || !(path.includes(root) || (own && path.includes(own))) || (this.panel && !this.isTopPanel)) return;
            event.preventDefault();
            // The next record redraws the panel: the focus comes back to its
            // title so the keys go on stepping.
            this._focusAfterStep = true;
            this.step(event.key === "ArrowDown" ? "next" : "previous");
        };
        document.addEventListener("keydown", this._onStepKey);
        // A view placed before it is told its record (an assembly binds
        // record-id after it places the part) asks the host nothing yet: the
        // record-id it is given reads it (attributeChangedCallback).
        if (this.hostPort && (this.recordId || this.mode === "create")) this.load("connected");
        else if (!this.hostPort) this._requestHostPort();
    }

    // The shared convention for a component that takes a host port: ask for one
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
                context: {owner: "property-view", record: this.recordId || null, group: null},
            },
        }));
        return true;
    }

    onDisconnected() {
        this._standardMenu?.close?.({restoreFocus: false});
        this._standardMenu?.remove();
        this._standardMenu = null;
        // Once per connection, so an element moved in the DOM asks again.
        this._portRequested = false;
        if (this._onDrawerClose) this.removeEventListener("sf-drawer-close", this._onDrawerClose);
        this._onDrawerClose = null;
        this._endTitleFocus();
        this._offAfterRender?.();
        this._offAfterRender = null;
        this._offEveryRender?.();
        this._offEveryRender = null;
        this._panelWasOpen = false;
        // The settings surface listens on the document, so a panel that goes away
        // while it is open takes that listener with it.
        this.configuring = false;
        this._bindSectionDropTarget();
        if (this._onSortableIntent) this.removeEventListener("sf-sortable-intent", this._onSortableIntent);
        this._onSortableIntent = null;
        // A document listener outliving its component would go on applying drops
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
        this._onSideChange = null;
        this.sideMedia = null;
        if (this._onStepKey) document.removeEventListener("keydown", this._onStepKey);
        this._onStepKey = null;
        clearTimeout(this._savedTimer);
        this._onWideChange = null;
        this.wideMedia = null;
        super.onDisconnected?.();
    }

    // Where this panel's content actually lives. The drawer moves it out of the
    // element, so anything looking for the panel -- a key handler, a probe, a
    // stack deciding which window is on top -- has to ask rather than assume.
    panelContent() {
        const drawer = this.querySelector("sf-drawer") ?? this._panelDrawer ?? null;
        const inside = drawer?.querySelector?.(".sf-property-view-panel");
        if (inside) return inside;
        const instance = this.getAttribute("record-id") || "";
        const candidates = [...document.querySelectorAll(".sf-property-view-panel")];
        return candidates.find((node) => node.dataset.recordId === instance) ?? null;
    }

    // A host adapter exposes raise(intent, payload, {signal}); no transport is
    // implied, exactly as for sf-view.
    setHostPort(host) {
        if (!host || typeof host.raise !== "function" || !SUPPORTED_PORT_VERSIONS.includes(host.version)) {
            throw new TypeError(
                `sf-view-properties requires a declared property-view host port: ${SUPPORTED_PORT_VERSIONS.join(", ")}`,
            );
        }
        this.hostPort = host;
        if (this.isConnected && (this.recordId || this.mode === "create")) this.load("host-connected");
        return this;
    }

    visible(entries, {conditions = true} = {}) {
        const values = conditions ? this.fieldValues() : null;
        return (Array.isArray(entries) ? entries : [])
            .filter((entry) => entry && entry.hidden !== true)
            .filter((entry) => this.showRare || entry.rare !== true)
            // A field its condition hides is not drawn (port 1.14.0). Not while
            // the view is arranged -- the template lists every entry then -- and
            // not by the view: `hidden` is the arrangement's, `when` the values'.
            .filter((entry) => !values || !entry.when || fieldConditions(entry, values).visible);
    }

    // Every field's value as it stands on screen: what the record holds, or what
    // the person changed it to and has not saved. The conditions read these, so
    // a field appears the moment the value it waits for is chosen, before any
    // save -- and a condition over a field in another group, closed, reads what
    // that field holds.
    fieldValues() {
        const values = new Map();
        const take = (field) => {
            if (!field || field.key === undefined || field.key === null) return;
            const key = String(field.key);
            values.set(key, this.changed.has(key) ? this.changed.get(key) : field.value);
        };
        for (const section of this.sections ?? []) {
            for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(take);
        }
        this.unplaced.forEach(take);
        return values;
    }

    // A field as its conditions make it: required as `when.required` says, and
    // drawn disabled -- as `readonly` is -- while `when.enabled` does not hold.
    // The field itself is the host's and is not written to.
    conditionedField(field, values = this.fieldValues()) {
        if (!field?.when) return field;
        const decided = fieldConditions(field, values);
        return {
            ...field,
            required: decided.required,
            readonly: field.readonly === true || !decided.enabled,
        };
    }

    // The keys of the fields their conditions hide now.
    _hiddenByCondition() {
        const values = this.fieldValues();
        const hidden = new Set();
        const check = (field) => {
            if (field?.when && !fieldConditions(field, values).visible) hidden.add(String(field.key));
        };
        for (const section of this.sections ?? []) {
            for (const group of section?.groups ?? []) (group?.fields ?? []).forEach(check);
        }
        this.unplaced.forEach(check);
        return hidden;
    }

    // What a save carries: the changed fields, less every field its condition
    // hides (port 1.14.0). Such a field is left out, not emptied: it keeps what
    // it holds -- its own value or an inherited one -- because hidden by a
    // condition is not the same as cleared, and a contract type switched back
    // and forth must not lose the date it had. What the person typed into it
    // stays among the changes, unsent, and is sent if the field shows again.
    _savedValues() {
        const hidden = this._hiddenByCondition();
        return Object.fromEntries([...this.changed].filter(([key]) => !hidden.has(key)));
    }

    // The host as the renderer set reads a field shown: its formatFieldValue
    // first, and for a date it did not format, the date in the page's language
    // (format-date), as sf-view-table's cells read it. A date stood in the card
    // as stored -- «2026-11-02» -- unless the host formatted it (2026-11-05).
    get viewHost() {
        const host = this.hostPort ?? null;
        if (this._viewHost?.host === host) return this._viewHost.view;
        // Everything else the host offers the renderer set (its words, say) is
        // reached through it unchanged.
        const view = Object.create(host && typeof host === "object" ? host : null);
        Object.assign(view, {
            formatFieldValue: (field, value) => {
                const own = host?.formatFieldValue?.(field, value);
                return typeof own === "string" ? own : undefined;
            },
        });
        this._viewHost = {host, view};
        return view;
    }


    // ─── C305: quick edit, a field's group, the history, the next record ─────

    // Where a field stands: its section, its group and its descriptor.
    fieldAt(key) {
        const wanted = String(key ?? "");
        for (const section of this.sections ?? []) {
            for (const group of section.groups ?? []) {
                const field = (group.fields ?? []).find((one) => String(one.key ?? "") === wanted);
                if (field) return {section: String(section.key ?? ""), group: String(group.key ?? ""), field};
            }
        }
        return null;
    }

    // A short field opened in its window (C305 (1), C296): the entry is held
    // as a group's is, nothing is written until Save.
    startQuick(section, group, key) {
        if (!this.quickEdit || this.editing) return false;
        this.quick = {section: String(section), group: String(group), key: String(key)};
        this.changed.clear();
        this._clearInputs();
        this.errors.clear();
        this.conflict = null;
        this.confirmation = null;
        this.requestComponentUpdate("quick");
        return true;
    }

    endQuick(key = null) {
        if (!this.quick || (key !== null && this.quick.key !== key)) return false;
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
    }

    // One value per save: group.save of the field's group with that value,
    // the same revision and the same confirmation as a group's save.
    async saveQuick({confirm = null} = {}) {
        const quick = this.quick;
        if (!quick) return null;
        if (!this.changed.has(quick.key) && !this.inputErrors.size) {
            this._quickPopover(quick.key)?.close?.();
            this.endQuick();
            return null;
        }
        return this.saveGroup({confirm});
    }

    // The saved fields are marked for a moment (--sf-view-properties-saved-background-color).
    markSaved(keys) {
        this.savedKeys = new Set([...keys].map(String));
        this.requestComponentUpdate("saved-mark");
        clearTimeout(this._savedTimer);
        this._savedTimer = setTimeout(() => {
            this.savedKeys = new Set();
            this.requestComponentUpdate("saved-mark");
        }, 1600);
    }

    // RC-6 editField(key): a short field opens its window, any other its
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
        this.editGroup(at.section, at.group, {focus: at.field.key});
        return true;
    }

    // sf-form draws a group's edit (C182) when it draws every field of it.
    formDraws(group) {
        const fields = this.visible(group?.fields, {conditions: false});
        // sf-form where the page has it defined; else the card's own form, as before.
        if (!fields.length || !globalThis.customElements?.get?.("sf-form")) return false;
        return fields.every((field) => {
            const type = String(field.propertyType || field.type || "");
            if (field.when || drawsSetField(field) || FORMLESS_TYPES.has(type)) return false;
            const modes = propertyModes(type);
            return Boolean(modes?.edit || (field.readonly === true && modes?.view));
        });
    }

    // The fields and the saved value an sf-form gets for one group's edit.
    _formEditOf(section, group) {
        const current = this.sections.find((entry) => String(entry.key) === String(section));
        const found = this.visible(current?.groups).find((entry) => String(entry.key) === String(group));
        if (!found || !this.formDraws(found)) return null;
        const fields = this.visible(found.fields, {conditions: false}).map((field) => {
            const {value, width, ...rest} = field;
            return {...rest, key: String(field.key ?? "")};
        });
        const value = Object.fromEntries(this.visible(found.fields, {conditions: false})
            .filter((field) => field.value !== undefined && field.value !== null)
            .map((field) => [String(field.key ?? ""), field.value]));
        return {section: String(section), group: String(group), fields, value};
    }

    // sf-form's Save: what differs from the record is the save; the form waits
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
            if (same || next === undefined) this.changed.delete(field.key);
            else this.changed.set(field.key, next);
        }
        return this.saveGroup();
    }

    _formOf(groupKey) {
        const root = this.panel ? this.panelContent() : this;
        return root?.querySelector?.(`[data-group="${CSS.escape(String(groupKey))}"] sf-form`) ?? null;
    }

    // The way out of unsaved entries asks first (C159 (6)): a close, or a step
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
        return this.closePanel(ask.reason, {asked: true});
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
    }

    // RC-5, RC-6 step(direction): the next or the previous record in the
    // order of the view the panel was opened from. The card never reads the
    // list: it asks (sf-view-properties-step {direction}) and the page opens the
    // neighbour in the same panel (sf-view recordBeside gives it).
    step(direction) {
        const dir = direction === "previous" || direction === -1 ? "previous" : "next";
        this._commitFocusedEntry();
        if (this.unsavedFields) {
            this.leaveAsk = {kind: "step", direction: dir};
            this.requestComponentUpdate("leave");
            return {outcome: "refused", reason: "unsaved"};
        }
        return this._emitStep(dir);
    }

    // The next record: a host that announces record-neighbours names it over
    // its current view (filters, search, sort; Larena: {listed, previous:
    // {record_id}, next: {record_id}}), and the card opens it in the same panel
    // unless the page takes the step (preventDefault). Without it the page
    // finds the neighbour itself (sf-view recordBeside) and sets record-id.
    async _emitStep(direction) {
        let next = null;
        if (this.hostPort?.capabilities?.includes?.("record-neighbours") && this.recordId) {
            const answer = await this._raise("record.neighbours", {record_id: this.recordId, collection: this.collection || null});
            if (answer?.answer === "applied") {
                const id = answer[direction]?.record_id;
                if (id === undefined || id === null || id === "") return {outcome: "refused", reason: "no-neighbour"};
                next = String(id);
            }
        }
        const allowed = this.sfEmit("step", {direction, record_id: this.recordId || null, ...(next ? {next_record_id: next} : {})}, {cancelable: true});
        if (!allowed) return {outcome: "refused", reason: "prevented"};
        if (next) this.setAttribute("record-id", next);
        return {outcome: "applied"};
    }

    // RC-3, RC-6 openHistory(): the history as a level of the same panel, the
    // C289 head over it («← <запись>», the title, «⋯», the close).
    openHistory() {
        if (!this.historyOffered) return {outcome: "refused", reason: "unavailable"};
        this.historyOpen = true;
        this.phoneSection = null;
        this.sfEmit("history", {record_id: this.recordId || null});
        this.requestComponentUpdate("history");
        if (!this.historyFeed || this.historyFeed.record !== this.recordId) this.loadHistory();
        return {outcome: "applied"};
    }

    closeHistory() {
        if (!this.historyOpen) return false;
        this.historyOpen = false;
        this.requestComponentUpdate("history");
        return true;
    }

    // «Только изменения полей» / «Все события» (the history's «⋯»).
    setHistoryKinds(kinds) {
        const next = Array.isArray(kinds) && kinds.length ? kinds.map(String) : null;
        if (JSON.stringify(next) === JSON.stringify(this.historyFeed?.kinds ?? null) && this.historyFeed) return false;
        this.historyFeed = {record: this.recordId, kinds: next, events: [], items: [], cursor: null, hasMore: false, loading: false, failed: false};
        this.loadHistory();
        return true;
    }

    // One page of record.history; «Показать ещё» asks for the next one with
    // the cursor the host gave.
    async loadHistory({more = false} = {}) {
        if (!this.historyOffered) return null;
        const kinds = this.historyFeed?.kinds ?? null;
        if (!more || !this.historyFeed || this.historyFeed.record !== this.recordId) {
            this.historyFeed = {record: this.recordId, kinds, events: [], items: [], cursor: null, hasMore: false, loading: true, failed: false};
        } else {
            this.historyFeed = {...this.historyFeed, loading: true};
        }
        this.requestComponentUpdate("history");
        const epoch = ++this.historyEpoch;
        const last = this.historyFeed.events.at(-1);
        const answer = await this._raise("record.history", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            cursor: more ? (this.historyFeed.cursor ?? (last ? String(last.id) : null)) : null,
            kinds,
            limit: HISTORY_PAGE,
        }, {stale: () => epoch !== this.historyEpoch});
        if (!answer) return null;
        if (answer.answer !== "applied") {
            this.historyFeed = {...this.historyFeed, loading: false, failed: true, hasMore: false};
            // A refused history is no state of the record: the record stays ready.
            if (this.getAttribute("data-state") === "error" && this.record) this._setState("ready");
            this.requestComponentUpdate("history");
            return answer;
        }
        const events = [...this.historyFeed.events, ...(Array.isArray(answer.events) ? answer.events : [])];
        this.historyFeed = {
            ...this.historyFeed, events, loading: false, failed: false,
            hasMore: answer.has_more === true, cursor: answer.cursor ?? null,
            items: timelineItems(events, {
                words: this.historyWords,
                fieldOf: (key) => this.fieldAt(key)?.field ?? null,
                host: this.viewHost,
            }),
        };
        this.requestComponentUpdate("history");
        return answer;
    }

    get historyWords() {
        const word = (key) => pageText(PROPERTY_VIEW_TEXT, key, this);
        return {
            historyCreate: word("historyCreateText"), historyDelete: word("historyDeleteText"),
            historyRestore: word("historyRestoreText"), historyPublish: word("historyPublishText"),
            historyChangedOne: word("historyChangedOneText"), historyChangedMany: word("historyChangedManyText"),
            historySealed: word("historySealedText"),
        };
    }

    templateContext() {
        const props = this.getPropsContext();

        return this.createTemplateContext({
            ...props,
            component: this,
            hostPort: this.hostPort,
            viewHost: this.viewHost,
            size: this.size,
            controlSize: this.controlSize,
            mode: this.mode,
            mayEdit: this.mayEdit,
            openAll: this.openAll,
            createText: pageText(PROPERTY_VIEW_TEXT, "createText", this),
            emptyText: this.emptyText,
            emptyRecordText: this.emptyRecordText,
            isEmptyRecord: this.isEmptyRecord,
            // The first load draws the fields it waits for; a failed one says
            // why in sf-empty-state.
            loading: this.getAttribute("data-state") === "loading" && !this.record,
            panel: this.panel,
            panelOpen: this.panelOpen,
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
            hostSlot: (name) => this.getSlotContent(name),
            hasHostSlot: (name) => this.hasSlotContent(name),
            address: this.address,
            drawerWidth: this.drawerWidth,
            sectionsWidth: SECTIONS_WIDTH,
            conflict: this.conflict,
            confirmation: this.confirmation,
            confirmSaveText: pageText(PROPERTY_VIEW_TEXT, "confirmSaveText", this),
            keepEditingText: pageText(PROPERTY_VIEW_TEXT, "keepEditingText", this),
            message: this.message,
            visible: (entries) => this.visible(entries),
            conditionedField: (field) => this.conditionedField(field),
            fieldDisabled: (field) => this.fieldDisabled(field),
            canConfigureView: this.canConfigureView,
            configuring: this.configuring,
            unplaced: this.unplaced,
            viewTarget: this.viewTarget,
            editableLayers: this.editableLayers,
            viewProfiles: this.viewProfiles,
            viewProfile: this.viewProfile,
            canDeleteViewProfile: (id) => this.canDeleteViewProfile(id),
            layerDenied: (kind) => this.layerDenied(kind),
            canChangeVisibility: (entry) => this.canChangeVisibility(entry),
            entryError: (kind, key) => this.entryError(kind, key),
            configureText: this.configureText,
            doneConfiguringText: this.doneConfiguringText,
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
            groupAt: (groupKey) => this.groupAt(groupKey),
            groupCount: this.groupCount,
            fieldChoices: (groupKey) => this.fieldChoices(groupKey),
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
            isQuickField: (field) => this.isQuickField(field),
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
            sectionColumnTabs: typeof globalThis.customElements?.get?.("sf-tabs")?.prototype?.placeBox === "function"
                || !globalThis.customElements?.get?.("sf-menu"),
            word: (key) => pageText(PROPERTY_VIEW_TEXT, key, this),
            // C311: levels, locks, the head, the tabs' and fields' menus.
            canWriteShared: this.canWriteShared,
            viewRequired: this.viewRequired,
            requiredEdits: Boolean(this.requiredEdits),
            hasPersonalEdits: this.hasPersonalEdits,
            isLocked: (path) => this.isLocked(path),
            lockedForMe: (path) => this.lockedForMe(path),
            headLine: this.headLine,
            fieldMenuEntries: (key) => (this.configuring ? this.fieldMenuEntries(key) : []),
        });
    }

    template() {
        return renderPropertyViewTemplate(this.templateContext());
    }

    // A printed skeleton (data-sf-first-paint="skeleton", skeleton.html) stays
    // until the record comes through the port (standard 1.3.8 §5.4): the first
    // render then draws the record over it in one frame. A panel draws in its
    // drawer, so it renders at once.
    sfAwaitingData() {
        if (this.getAttribute("data-sf-first-paint") !== "skeleton" || this.panel) return false;
        return !this.record && !this.loadFailure && this.getAttribute("data-state") !== "error";
    }

    // A view refusal in words (port 1.22.0, Larena backend c311-reply): the
    // host's message if it sends one, else the pack's words for its code;
    // a machine code is never shown to a person.
    viewRefusalText(answer, fallback = this.viewDeniedText) {
        if (answer?.message) return String(answer.message);
        const key = VIEW_REFUSALS[String(answer?.reason ?? answer?.code ?? "")];
        return key ? pageText(PROPERTY_VIEW_TEXT, key, this) : fallback;
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
            bubbles: true, composed: true, detail: {state, message},
        }));
    }

    // Whether an answer still describes something on screen is the caller's
    // question, not this method's. One counter for every intent was wrong the
    // moment two reads could be in flight at once: opening a group asks for the
    // candidates of every reference field in it in the same tick, each ask bumped
    // the one counter, and only the last answer was kept -- the others were
    // dropped and their fields sat at «Загрузка записей» for ever. A consumer
    // found it with four reference fields in one group; the probe had one, and one
    // is a number at which concurrency does not exist.
    async _raise(intent, payload, {stale = () => false} = {}) {
        if (!this.hostPort) {
            this._setState("error", pageText(PROPERTY_VIEW_TEXT, "statePortNotConnected", this));
            return {answer: "unavailable", reason: "port-not-connected"};
        }
        try {
            const answer = await this.hostPort.raise(intent, copy(payload), {});
            // A late answer is dropped rather than rendered: what it describes is
            // not what is on screen any more.
            if (!this.isConnected || stale()) return null;
            if (!answer || !["applied", "conflict", "refused", "unavailable"].includes(answer.answer)) {
                throw new TypeError("Host answer is not a declared port answer");
            }
            // A saved record tells the rest of the page what changed, on the
            // page host's outputs (simai.interface-fragment, effects).
            if (answer.answer === "applied" && Array.isArray(answer.effects) && answer.effects.length) {
                globalThis.SF?.Composition?.publishEffects?.(answer.effects, {origin: this});
            }
            // A save over a revision that moved (Larena: refused revision_moved,
            // with the current revision, nothing written) is a conflict: the
            // card says so, keeps what was typed and reads the record again.
            if (answer.answer === "refused" && answer.reason === "revision_moved") return {...answer, answer: "conflict"};
            return answer;
        } catch (error) {
            if (!this.isConnected || stale()) return null;
            this._setState("error", pageText(PROPERTY_VIEW_TEXT, "stateLoadFailed", this));
            return {answer: "unavailable", reason: "host-threw", message: String(error?.message || error)};
        }
    }

    // Whether the host reads one group at a time (port 1.15.0 §4.9). Without
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
        this._setState("loading", pageText(PROPERTY_VIEW_TEXT, "stateLoading", this));
        this.loadFailure = null;
        const epoch = ++this.epoch;
        const creating = this.mode === "create";
        const byGroup = this.readsByGroup;
        if (byGroup) {
            this.groupEpoch += 1;
            this.groupReads = new Map();
            this.groupsReading = new Set();
        }
        // With group-load the first read is a group: group null answers the
        // group the panel opens on, with the whole arrangement and every other
        // group's field count, and names the group it carries.
        const answer = byGroup ? await this._raise("group.load", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            group: null,
            reason,
        }, {stale: () => epoch !== this.epoch}) : await this._raise("record.load", {
            record_id: creating ? null : this.recordId || null,
            collection: this.collection || null,
            reason,
            // An empty object of the collection, laid out by its arrangement
            // (port 1.12.0).
            ...(creating ? {mode: "create"} : {}),
        }, {stale: () => epoch !== this.epoch});
        if (!answer) return null;
        // A panel is placed before the host names its record: asked with no
        // record, the host answered «unavailable», and «Запись недоступна» stood
        // in the panel until the record's own answer came (owner, 2026-10-14).
        // Not having been told which record is not a failure: the panel waits,
        // loading, for its record.
        if (answer.answer !== "applied" && !creating && !this.recordId) return answer;
        if (answer.answer !== "applied") {
            // Said by the empty state, only once there is an answer: refused is
            // no access; anything else could not load, with «Повторить».
            this.loadFailure = {kind: answer.answer === "refused" ? "no-access" : "error", text: answer.message || ""};
            this._setState("error", answer.message || pageText(PROPERTY_VIEW_TEXT, "stateUnavailable", this));
            // The fact a screen reads a missing record from (vocabulary §4):
            // sf-property-view-failed {reason, message}.
            this.sfEmit("failed", {reason: String(answer.reason ?? ""), message: String(answer.message ?? "")});
            return answer;
        }
        this.record = byGroup ? {...(answer.record ?? {}), revision: answer.revision ?? answer.record?.revision ?? null} : answer.record ?? null;
        // Copied, not held by reference. Configuring moves a field between groups
        // in this array before the host answers -- «applied immediately» is what
        // the request asks for -- and a component that did that to the object the
        // host handed it would be rearranging the host's own data. A host that
        // caches its answer would find its record silently rewritten by a drag it
        // had not accepted yet.
        this.sections = [];
        this._takeSections(this.record);
        this.view = answer.record?.view ?? null;
        // A target the person may no longer write cannot stay selected: the rights
        // travel with the answer, so they can change between two loads.
        const editable = this.editableLayers;
        if (!editable.includes(this.viewTarget)) this.viewTarget = editable[0] ?? "personal";
        if (!editable.length) this.configuring = false;
        this.layerDraft = this.configuring ? this._layerCopy(this.viewTarget) : null;
        this.entryErrors = new Map();
        const known = this.sections.some((section) => String(section.key) === this.selectedSection);
        // The section the answered group is in, when the panel had none chosen.
        const answered = byGroup && answer.group !== undefined && answer.group !== null
            ? this.sections.find((section) => (section.groups ?? []).some((group) => String(group.key) === String(answer.group)))
            : null;
        if (!known) {
            this.selectedSection = answered ? String(answered.key)
                : this.sections.length ? String(this.sections[0].key) : null;
        }
        this._setState("ready");
        if (byGroup) this._readShownGroups("started");
        return answer;
    }

    // What an answer carries is the record from now on. Reading by group, a
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
        const held = new Map(this.sections.flatMap((section) => (section.groups ?? []).map((group) => [String(group.key), group])));
        for (const section of incoming) {
            const groups = Array.isArray(section.groups) ? section.groups : [];
            groups.forEach((group, index) => {
                const key = String(group.key);
                if (!groupNotRead(group)) {
                    this.groupReads.set(key, revision);
                    return;
                }
                const mine = held.get(key);
                if (mine && this.groupReads.has(key)) groups[index] = {...group, fields: mine.fields};
            });
        }
        this.sections = incoming;
    }

    // The groups on screen: every group of an open-all surface or of the view
    // being arranged, otherwise the groups of the section being read.
    _shownGroups() {
        const shown = this.openAll || this.configuring
            ? this.sections
            : this.sections.filter((section) => String(section.key) === this.selectedSection);
        return shown.flatMap((section) => (section.groups ?? []).map((group) => ({section: String(section.key), group: String(group.key)})));
    }

    // A section that starts asks group.load for each of its groups not read at
    // the record's revision (§7.2.1, reason started). Each answer is merged into
    // the arrangement; a newer revision leaves the other groups to be read
    // again when next shown, and a group the record no longer holds
    // (unknown-group) reads the arrangement again.
    _readShownGroups(reason = "started", {force = false} = {}) {
        if (!this.readsByGroup || !this.record) return [];
        const current = this.revision;
        const reads = [];
        for (const {section, group} of this._shownGroups()) {
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
            reason,
        }, {stale: () => epoch !== this.groupEpoch});
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
        this.record = {...this.record, ...(answer.record ?? {}), revision};
        this._takeSections(this.record);
        this.requestComponentUpdate("group-read");
        return answer;
    }

    // Is this group's read still on its way (port 1.15.0)? The template draws
    // the group as loading meanwhile.
    isGroupReading(key) {
        return this.groupsReading.has(String(key));
    }

    // A conflict carries the record's current revision: what the person typed
    // is kept, and what is shown is read again at that revision -- the groups
    // on screen by group.load, or the whole record once by record.load.
    async _rereadAfterConflict(answer) {
        if (this.readsByGroup) {
            if (answer?.revision !== undefined && answer.revision !== null && this.record) {
                this.record = {...this.record, revision: answer.revision};
            }
            return Promise.all(this._readShownGroups("requested", {force: true}));
        }
        const epoch = this.epoch;
        const read = await this._raise("record.load", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            reason: "requested",
        }, {stale: () => epoch !== this.epoch});
        if (!read || read.answer !== "applied" || !read.record) return read;
        this.record = read.record;
        this._takeSections(read.record);
        this.requestComponentUpdate("conflict-reread");
        return read;
    }

    // The two the file editor asks of a host, and the capability that decides
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
        if (!chosen.length) return null;
        // Recorded before anything is sent, because the component is the only
        // thing that knows what the person chose: sf-file-upload fills its own
        // list and every render writes this one over it.
        this.uploads.set(key, [...this.getFieldUploads(field), ...chosen]);
        this.requestComponentUpdate("uploads");

        for (const item of chosen) {
            const answer = await this._raise("field.upload", {
                record_id: this.recordId || null,
                collection: this.collection || null,
                field: key,
                file: item.file ?? item,
            }, {stale: () => !this.uploads.has(key)});
            if (!answer) return null;
            const current = this.getFieldUploads(field);
            if (answer.answer === "applied" && answer.file) {
                // A stored file is a value change like any other: it joins what
                // the person has changed and waits for the save button. Nothing
                // about the record is written here.
                const held = this.changed.has(key) ? this.changed.get(key) : field.value;
                const list = Array.isArray(held) ? held : held ? [held] : [];
                this.changed.set(key, [...list, answer.file]);
                this.uploads.set(key, current.filter((entry) => entry !== item));
                this.errors.delete(key);
            } else {
                this.uploads.set(key, current.map((entry) => (entry === item
                    ? {...entry, state: "error", errorMessage: answer.message || answer.reason || ""}
                    : entry)));
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
        this.uploads.set(key, current.filter((entry) => entry !== item));
        return this.startFieldUpload(field, [item]);
    }

    // A reference value was activated. The component asks and decides nothing:
    // following the href would be routing for the consumer, and opening a window
    // itself would be deciding whether a half-edited window may be covered.
    async openReference(field, value) {
        if (!value || typeof value !== "object") return null;
        const answer = await this._raise("record.open", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            field: String(field.key ?? ""),
            value,
        }, {stale: () => !this.isConnected});
        // Vocabulary §5 open; sf-property-view-open-record follows once (aliases.json).
        this.sfEmit("open", {field: String(field.key ?? ""), value, answer: answer?.answer ?? null});
        return answer;
    }

    // The drawer that carries this panel: a child of the element (the drawer
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
    }

    // Gives the title the focus the drawer handed out on its own: the panel
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
        if (!panel || !title || !active) return;
        // A docked column hands out no focus (sf-drawer: it is a part of the
        // page, not a window), so the focus stayed on the row that opened it
        // and the record was not reached from the keyboard (view round 5,
        // LV-9). The title takes it, as a window's does; a person typing in a
        // field outside keeps it. The ring is drawn for the keyboard only
        // (:focus-visible), and nothing with a tooltip is focused.
        if (!panel.contains(active)) {
            if (!drawer?.dockColumn || active.closest?.("input, textarea, select, [contenteditable], sf-input, sf-select, sf-textarea")) return;
            this._endTitleFocus();
            title.tabIndex = -1;
            title.focus({preventScroll: true});
            return;
        }
        if (active.closest?.("input, textarea, select, [contenteditable], sf-input, sf-select, sf-textarea")) return this._endTitleFocus();
        if (active !== panel && active !== drawer?.firstFocusIn?.(panel)) return this._endTitleFocus();
        this._endTitleFocus();
        title.tabIndex = -1;
        title.focus({preventScroll: true});
    }

    // The record this panel was opened from, when its drawer is drawn inside
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
        return [...this.children].find((child) => child.localName === "sf-drawer") ?? null;
    }

    // Read from the layer stack, not kept: how many panels of this component
    // stand below this one, and whether no window (a modal or another panel)
    // stands above it. A list or a menu opened inside the panel leaves it on top.
    get stackDepth() {
        const drawer = this._ownDrawer();
        if (!drawer || !hasLayer(drawer)) return 0;
        const panels = openLayers("panel").filter((owner) => owner?.parentElement?.localName === this.localName);
        return Math.max(0, panels.indexOf(drawer));
    }

    get isTopPanel() {
        const drawer = this._ownDrawer();
        return Boolean(drawer && hasLayer(drawer) && !hasLayerAbove(drawer, ["modal", "panel"]));
    }

    // What a panel's three controls do, and all three are the host's decisions
    // announced rather than carried out here. The component closes itself, says
    // what was copied, and says what should be opened; where a window goes, and
    // whether it may close over unsaved edits, belongs to whoever placed it.
    closePanel(reason = "close", {asked = false} = {}) {
        this._commitFocusedEntry();
        const unsaved = this.unsavedFields;
        // Unsaved entries are asked about first (C159 (6)); a delete and a
        // cancel of a create surface are the host's to decide.
        if (unsaved && !asked && reason !== "deleted" && !(this.openAll && !this.editAll)) {
            this.leaveAsk = {kind: "close", reason};
            this.requestComponentUpdate("leave");
            return {outcome: "refused", reason: "unsaved"};
        }
        // A cancelable request (vocabulary §5 close, standard 1.3.8 §19.3): the
        // page decides whether it closes; a listener may refuse it.
        const allowed = this.sfEmit("close", {reason, record_id: this.recordId || null, unsaved_fields: unsaved, asked: Boolean(asked)}, {cancelable: true});
        return allowed ? {outcome: "applied"} : {outcome: "refused", reason: "prevented"};
    }

    // What would be lost by closing: every changed field, and every entry that
    // is not a value yet -- a masked text not filled in is work the person did,
    // though there is nothing to save (Larena acceptance, 2026-10-22: Esc after
    // an entry closed without asking).
    get unsavedFields() {
        return new Set([...this.changed.keys(), ...this.inputErrors.keys()]).size;
    }

    // A field reports its value when it loses focus, so a time typed and left
    // focused is not counted until then. Closing takes the focus first, and the
    // field reports before the count is read.
    _commitFocusedEntry() {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
        if (!active || typeof active.blur !== "function") return;
        const panel = this.panel ? this.panelContent() : null;
        if (this.contains(active) || panel?.contains(active)) active.blur();
    }

    // What a person pastes is a page they can open, so the host's address is
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
    }

    // Copying is the Framework's clipboard (core/js/clipboard.js, with its
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
            bubbles: true, composed: true,
            detail: {address, url: this.addressUrl ?? address, copied, record_id: this.recordId || null},
        }));
        return copied;
    }

    async copyAddress() {
        if (!this.address) return null;
        let copied = false;
        try {
            copied = Boolean(await copyText(this.addressUrl ?? String(this.address)));
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
        if (!address) return null;
        // An intent, not a navigation: the component does not know whether the
        // consumer routes by href, by a client router or by replacing a region.
        // Vocabulary §5 open-full {id}; the address and record_id stay for the
        // listeners that read them.
        this.sfEmit("open-full", {id: this.recordId || null, address, record_id: this.recordId || null});
        return this;
    }

    // The phone's two screens. Opening a section also selects it, so leaving the
    // phone arrangement lands on the section the person was last reading rather
    // than on the first one.
    openPhoneSection(key) {
        const name = String(key);
        if (!this.sections.some((section) => String(section.key) === name)) return false;
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
        const current = this.sections.find((section) => String(section.key) === this.phoneSection);
        return current ? String(current.label ?? current.key) : "";
    }

    selectSection(key) {
        this.selectedSection = String(key);
        this.requestComponentUpdate("section");
        // A section that starts reads the groups it has not read at this
        // revision (port 1.15.0, group-load).
        this._readShownGroups("started");
        return this;
    }

    // The four the edit template asks for when it builds a record picker. The
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

    async loadFieldOptions(field, {cursor = null, search = "", quiet = false} = {}) {
        const key = String(field.key ?? "");
        const previous = this.optionPages.get(key);
        // A new search starts a new list; a cursor continues the one on screen.
        const items = cursor && Array.isArray(previous?.items) ? previous.items : [];
        // `quiet` is the page the group asks for as it opens. It is not announced,
        // because a consumer saw «Загрузка записей» standing under four closed
        // fields at once; an error always is.
        this.optionPages.set(key, {items, status: "loading", quiet,
            nextCursor: previous?.nextCursor ?? null});
        this.requestComponentUpdate("options");
        // Dropped when the record changes, or when a newer search or page for this
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
            ...(versionAtLeast(this.hostPort?.version, "1.14.0")
                ? {...(field.source ? {source: String(field.source)} : {}), limit: OPTIONS_PAGE_LIMIT}
                : {}),
        }, {stale: () => recordEpoch !== this.epoch || fieldEpoch !== this.optionEpochs.get(key)});
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
                nextCursor: null,
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
            total: page.total ?? null,
        });
        this.requestComponentUpdate("options");
        return answer;
    }

    // `undefined` takes a change back: the person erased what they typed into a
    // write-only field (a password), and a save must carry nothing for it --
    // not an empty value that would clear what the host keeps.
    changeField(field, value) {
        const key = String(field.key ?? "");
        // Back to what the record holds is no change. A control is drawn with
        // the change it made, so it compares a later entry with that and not
        // with the record: a time put back to the stored one was written.
        const stored = Object.hasOwn(field ?? {}, "value") && value !== undefined
            && JSON.stringify(value) === JSON.stringify(field.value ?? null);
        if (value === undefined || stored) this.changed.delete(key);
        else this.changed.set(key, value);
        this.errors.delete(key);
        // A confirmation described the save as it stood; an entry changed after
        // it is a different save, and the question goes until save is pressed again.
        this.confirmation = null;
        this.requestComponentUpdate("changed");
        return this;
    }

    _clearInputs() {
        this.inputErrors.clear();
        this.controlErrors.clear();
    }

    // A field control that knows its entry is not a value yet (port 1.16.0,
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
    }

    // Whether a field's condition turns it off now (port 1.14.0 when.enabled).
    // The renderer set draws such a field disabled where it draws disabled and
    // read-only apart -- a choice as buttons (port 1.16.0) -- and as read-only
    // everywhere else, as before.
    fieldDisabled(field, values = this.fieldValues()) {
        return Boolean(field?.when) && !fieldConditions(field, values).enabled;
    }

    // Which fields in a group are picked from a list the host pages rather than
    // typed. A lookup that brought its list inline is chosen from in place and
    // asks for nothing. A field its condition hides now still has its first page
    // asked for: the condition can change at any keystroke, and a picker that
    // appears empty is the broken-looking case this read exists to avoid.
    _referenceFields(section, group) {
        const current = this.sections.find((entry) => String(entry.key) === String(section));
        const found = this.visible(current?.groups).find((entry) => String(entry.key) === String(group));

        return this.visible(found?.fields, {conditions: false})
            .filter((field) => PAGED_TYPES.includes(field.propertyType || field.type))
            .filter((field) => !((field.propertyType || field.type) === "lookup"
                && Array.isArray(field.options) && field.options.length > 0));
    }

    editGroup(section, group, {focus = null} = {}) {
        if (!this.mayEdit) return this;
        this.quick = null;
        this.editing = {section: String(section), group: String(group)};
        // sf-form draws the group when it draws every field (C182, VP-19);
        // its fields and saved value are kept for the whole edit.
        this.formEdit = this._formEditOf(section, group);
        this._focusFieldAfterRender = focus === null || focus === undefined ? null : String(focus);
        this.changed.clear();
        this._clearInputs();
        this.errors.clear();
        this.conflict = null;
        this.confirmation = null;
        this.requestComponentUpdate("editing");
        // The first page is asked for as the group opens, not when the person
        // first types: a picker that is empty until you search looks broken, and
        // the common case is choosing from the first page without searching at
        // all.
        if (this.canPickRecords) {
            for (const field of this._referenceFields(section, group)) {
                if (!this.optionPages.has(String(field.key ?? ""))) {
                    this.loadFieldOptions(field, {cursor: null, search: "", quiet: true});
                }
            }
        }
        return this;
    }

    cancelEdit() {
        if (this.quick) {
            this._quickPopover(this.quick.key)?.close?.();
            return this.endQuick() && this;
        }
        // «Изменить всё» opened from the menu goes back to reading.
        if (this.editAll) {
            this._dropEntries();
            this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {bubbles: true, composed: true, detail: {mode: "edit", scope: "record"}}));
            return this;
        }
        // Cancel drops what was typed and writes nothing. Data is saved by the
        // button alone, so there is nothing to undo. On a surface open all at
        // once the host decides where cancelling leads (a panel closes).
        if (this.openAll) {
            this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {bubbles: true, composed: true, detail: {mode: this.mode}}));
            // A panel asks to close with what is unsaved, as the cross and Esc
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
        }
        // A group's cancel is a fact too (simai.main, 2026-10-27): a host that
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
            this.dispatchEvent(new CustomEvent("sf-view-properties-cancel", {bubbles: true, composed: true, detail: {mode: this.mode, scope: "group", section: group.section, group: group.group}}));
        }
        return this;
    }

    // One press, one intent, one revision. Nothing is sent on blur and nothing
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
        this.sfEmit("saved", {id, revision: revision === null ? "" : String(revision)});
    }

    // The fields a save covers: the group being edited, or on a surface open
    // all at once every editable group shown.
    _editedFields() {
        const out = [];
        for (const section of this.sections ?? []) {
            for (const group of this.visible(section?.groups)) {
                if (group.kind === "related" || group.editable === false) continue;
                const edited = this.openAll || (this.editing && String(section.key) === this.editing.section
                    && String(group.key) === this.editing.group);
                if (!edited) continue;
                for (const field of this.visible(group.fields)) {
                    out.push(field.when ? this.conditionedField(field) : field);
                }
            }
        }
        return out;
    }

    // A required field left empty is said at the field before anything is sent
    // (C182 (6)); the host's own refusal is said the same way.
    _missingRequired() {
        const missing = new Map();
        const values = this.fieldValues();
        for (const field of this._editedFields()) {
            if (!field.required || field.readonly === true || this.fieldDisabled(field)) continue;
            const key = String(field.key ?? "");
            const value = values.get(key);
            const empty = value === undefined || value === null || value === ""
                || (Array.isArray(value) && value.length === 0);
            if (empty) missing.set(key, this.requiredErrorText);
        }
        return missing;
    }

    get requiredErrorText() {
        return this.getAttribute("required-error-text") || pageText(PROPERTY_VIEW_TEXT, "requiredErrorText", this);
    }

    // Save is never drawn disabled (C182 (7)): pressed with something wrong it
    // shows every error at its field and, from two, a summary with a link to
    // each, which takes the focus; one error takes the focus to its field.
    _refuseWithErrors(errors) {
        for (const [key, message] of errors) if (!this.errors.has(key) && !this.inputErrors.has(key)) this.errors.set(key, message);
        this._focusErrorsAfterRender = true;
        this.requestComponentUpdate("errors");
        return {answer: "refused", reason: this.inputErrors.size ? "input_invalid" : "required",
            errors: Object.fromEntries(new Map([...this.inputErrors, ...errors]))};
    }

    // The errors of the surface in the order their fields stand.
    get errorList() {
        const all = this.inputErrors.size ? new Map([...this.errors, ...this.inputErrors]) : this.errors;
        if (!all.size) return [];
        const labels = new Map();
        for (const section of this.sections ?? []) for (const group of section?.groups ?? []) {
            for (const field of group?.fields ?? []) labels.set(String(field.key ?? ""), String(field.label ?? field.key ?? ""));
        }
        const order = [...labels.keys()];
        return [...all.entries()]
            .sort(([a], [b]) => (order.indexOf(a) + 1 || 1e9) - (order.indexOf(b) + 1 || 1e9))
            .map(([key, message]) => ({key, label: labels.get(key) ?? key, message}));
    }

    // The field a summary link points to: its first control.
    focusField(key) {
        const root = this._ownDrawerRoot?.() ?? this;
        const scope = (this.panel ? root : this) ?? this;
        const field = scope?.querySelector?.(`[data-field="${CSS.escape(String(key))}"]`);
        const target = field?.querySelector?.("input:not([type=hidden]), textarea, select, button, [tabindex]:not([tabindex='-1'])");
        (target ?? field)?.focus?.({preventScroll: false});
        field?.scrollIntoView?.({block: "nearest"});
        return Boolean(target ?? field);
    }

    _focusErrors() {
        const list = this.errorList;
        if (!list.length) return;
        if (list.length === 1) {
            this.focusField(list[0].key);
            return;
        }
        const scope = this.panel ? (this._ownDrawerRoot?.() ?? this) : this;
        scope?.querySelector?.(".sf-property-view-error-summary")?.focus?.({preventScroll: false});
    }

    async saveGroup({confirm = null} = {}) {
        if (this.openAll) return this.saveAll({confirm});
        // A short field's window saves as its group does, with its one value.
        const target = this.editing ?? this.quick;
        if (!target) return null;
        const missing = this.quick ? new Set() : this._missingRequired();
        if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing);
        // Nothing changed: Save leaves the group as it is (Save is never
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
            ...(confirm ? {confirm} : {}),
        }, {stale: () => epoch !== this.epoch});
        if (!answer) return null;
        if (this._askedToConfirm(answer)) return answer;
        if (answer.answer === "applied") {
            this.record = answer.record ? {...answer.record, revision: answer.revision ?? answer.record.revision}
                : {...this.record, revision: answer.revision ?? this.record?.revision ?? null};
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
            this.announceSaved(answer);
            // The history the panel holds is older than this save.
            if (this.historyFeed) this.historyFeed = {...this.historyFeed, record: null};
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
            this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
            // An sf-form edit shows the host's errors at its fields and in its
            // summary (set-errors); the card's own form focuses them itself.
            const form = this.formEdit ? this._formOf(target.group) : null;
            if (form?.setErrors) form.setErrors({errors: Object.fromEntries(this.errors)});
            else this._focusErrorsAfterRender = this.errors.size > 0;
            this.requestComponentUpdate("errors");
            return answer;
        }
        this._setState("error", answer.message || pageText(PROPERTY_VIEW_TEXT, "saveFailedText", this));
        return answer;
    }

    // A surface open all at once saves the whole object: a create makes it
    // (record.create), an edit saves every changed field as one revision
    // (record.save), port 1.12.0.
    async saveAll({confirm = null} = {}) {
        const missing = this._missingRequired();
        if (this.inputErrors.size || missing.size) return this._refuseWithErrors(missing);
        if (this.mode !== "create" && this.changed.size === 0) return null;
        const creating = this.mode === "create";
        const values = this._savedValues();
        if (!creating && !Object.keys(values).length) return null;
        this.confirmation = null;
        const epoch = ++this.epoch;
        const answer = creating
            ? await this._raise("record.create", {
                collection: this.collection || null,
                values,
            }, {stale: () => epoch !== this.epoch})
            : await this._raise("record.save", {
                record_id: this.recordId || null,
                collection: this.collection || null,
                values,
                revision: this.record?.revision ?? null,
                ...(confirm ? {confirm} : {}),
            }, {stale: () => epoch !== this.epoch});
        if (!answer) return null;
        // A create is not confirmed: record.create carries no digest.
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
                    bubbles: true, composed: true, detail: {record_id: id, collection: this.collection || null},
                }));
                // The new object is shown as any object is: read, with what
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
            this.conflict = answer.message || this.conflictText;
            this.requestComponentUpdate("conflict");
            return answer;
        }
        if (answer.answer === "refused") {
            this.errors = new Map(Object.entries(answer.errors ?? {}).map(([key, value]) => [key, String(value)]));
            this._focusErrorsAfterRender = this.errors.size > 0;
            if (!this.errors.size && answer.message) this.conflict = answer.message;
            this.requestComponentUpdate("errors");
            return answer;
        }
        this._setState("error", answer.message || pageText(PROPERTY_VIEW_TEXT, "saveFailedText", this));
        return answer;
    }

    // A save the host makes only once confirmed (port 1.14.0, the data view
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
        if (answer?.answer !== "refused" || answer.reason !== "confirm_required"
            || !confirm || typeof confirm.digest !== "string" || !confirm.digest) return false;
        this.confirmation = {
            text: String(confirm.summary || answer.message || ""),
            digest: confirm.digest,
        };
        this.requestComponentUpdate("confirmation");
        return true;
    }

    confirmSave() {
        const digest = this.confirmation?.digest;
        if (!digest) return Promise.resolve(null);
        return this.openAll ? this.saveAll({confirm: digest}) : this.saveGroup({confirm: digest});
    }

    cancelConfirmation() {
        this.confirmation = null;
        this.requestComponentUpdate("confirmation");
        return this;
    }

    // Configuring the view. The host decides three separate things and the
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
        return Boolean(this.hostPort?.capabilities?.includes?.("view-settings"))
            && Boolean(this.view)
            && this.editableLayers.length > 0;
    }

    // The named views this person may choose between. A view is a whole
    // arrangement with a permanent id -- which is what makes renaming possible
    // -- and the layers still resolve inside whichever one is chosen. Larena
    // had already settled this shape for its lists before the panel needed it,
    // and one idea met twice is worth more than two ideas (owner, 2026-10-09).
    //
    // One view is not a choice, so the component draws no chooser for it.
    get viewProfiles() {
        const profiles = this.view?.profiles;
        if (!Array.isArray(profiles)) return [];
        return profiles.filter((profile) => profile && typeof profile.id === "string" && profile.id);
    }

    get viewProfile() {
        const current = this.view?.profile;
        if (typeof current === "string" && current) return current;
        return this.viewProfiles[0]?.id ?? null;
    }

    // Whether a view may be removed. The last shared one may not: a scope with
    // no shared view has nothing for a person who has made none of their own.
    // The host refuses it too -- it owns the list -- but a control that can
    // only be refused is not offered, which is the same rule the saved-view
    // controls answer to (owner, 2026-10-09).
    canDeleteViewProfile(id) {
        const profiles = this.viewProfiles;
        const profile = profiles.find((item) => item.id === String(id ?? ""));
        if (!profile) return false;
        if (!profile.shared) return true;
        return profiles.filter((item) => item.shared).length > 1;
    }

    // Making a view, from what is on screen. The host gives it an id and
    // answers with the record through it, because a person who has just made a
    // view is looking at it.
    createViewProfile(label, {shared = false} = {}) {
        const name = String(label ?? "").trim();
        if (!name) return null;
        return this._viewProfileIntent("view.create", {
            label: name,
            shared: Boolean(shared),
            view: this.layerDraft ?? this._layerCopy(this.viewTarget),
        });
    }

    // A rename changes the label. The id is permanent, so anything pointing at
    // the view keeps pointing at it.
    renameViewProfile(id, label) {
        const name = String(label ?? "").trim();
        const profile = String(id ?? "");
        if (!name || !profile) return null;
        if (!this.viewProfiles.some((item) => item.id === profile)) return null;
        return this._viewProfileIntent("view.rename", {profile, label: name});
    }

    deleteViewProfile(id) {
        const profile = String(id ?? "");
        if (!this.canDeleteViewProfile(profile)) return null;
        return this._viewProfileIntent("view.delete", {profile});
    }

    // The three acts answer the way a read answers, so they are taken the same
    // way: whatever the host sends back is the arrangement from now on.
    async _viewProfileIntent(intent, payload) {
        const epoch = ++this.epoch;
        const answer = await this._raise(intent, {
            record_id: this.recordId || null,
            collection: this.collection || null,
            ...payload,
        }, {stale: () => epoch !== this.epoch});
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
    }

    // Asking for a different view. The host answers as it answers a read,
    // because reading a record through another arrangement is reading the
    // record. What a person chose is the host's to remember: a choice kept
    // here would live in one browser and vanish in the next, which looks
    // broken rather than absent.
    async selectViewProfile(id) {
        const wanted = String(id ?? "");
        if (!wanted || wanted === this.viewProfile) return null;
        if (!this.viewProfiles.some((profile) => profile.id === wanted)) return null;
        const epoch = ++this.epoch;
        const answer = await this._raise("view.profile", {
            record_id: this.recordId || null,
            collection: this.collection || null,
            profile: wanted,
        }, {stale: () => epoch !== this.epoch});
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
        return Array.isArray(editable) ? editable.filter((kind) => kind === "personal" || kind === "shared") : [];
    }

    layerDenied(kind) {
        if (this.editableLayers.includes(kind)) return null;
        return this.view?.denied?.[kind] || this.viewDeniedText;
    }

    _emptyLayer() {
        return {schema_version: 1, sections: {}, groups: {}, fields: {}};
    }

    _layerCopy(kind) {
        const stored = this.view?.layers?.[kind]?.view;
        return stored ? copy(stored) : this._emptyLayer();
    }

    _layerRevision(kind) {
        const layer = this.view?.layers?.[kind];
        return layer ? layer.revision ?? null : null;
    }

    // Reading choice, not arrangement: a rare entry is declared rare by whoever
    // owns the collection, and showing it changes no value and writes no layer.
    // It was an attribute only, so nobody short of the host could ever see one.
    toggleShowRare() {
        this.toggleAttribute("show-rare", !this.showRare);
        this.requestComponentUpdate("show-rare");
        return this.showRare;
    }

    // Whether anything in this record is declared rare. Without one the menu does
    // not offer to show rare entries, because an item that changes nothing reads
    // as a feature that is broken.
    get hasRare() {
        const anyRare = (entries) => (entries ?? []).some((entry) => entry?.rare === true);
        return (this.sections ?? []).some((section) => section?.rare === true
            || anyRare(section?.groups)
            || (section?.groups ?? []).some((group) => anyRare(group?.fields)));
    }

    // The layer a person's own edits are written to: the personal layer of the
    // chosen profile, at once, whatever the profile is (C298, C311 (5)). «For
    // everyone» is a separate act, view.publish, offered to those who may
    // write the shared layer (RC-1: a shared profile was written for everyone
    // on every move). A host that offers no personal layer keeps the 1.18.0
    // way: the shared layer of a shared profile.
    _layerOfProfile() {
        if (this.editableLayers.includes("personal")) return "personal";
        const profile = this.viewProfiles.find((item) => item.id === this.viewProfile);
        const wanted = profile?.shared ? "shared" : "personal";
        return this.editableLayers.includes(wanted) ? wanted : this.viewTarget;
    }

    // Whether the host speaks port 1.22.0 (view.publish, view.lock): the
    // contract is in ui-source and rides the next pair. A 1.21.0 host (group
    // build 13: 1.20.0 type templates, 1.21.0 form fields), a 1.19.0 host
    // (group build 12: money C294) and earlier hosts are offered neither. The
    // C311 edition was called 1.19.0 on its ui-source branch until GB12 took
    // the number, then 1.20.0 here; group build 13 numbers it 1.22.0.
    get hostSpeaksCardSettings() {
        const [major, minor] = String(this.hostPort?.version ?? "").split(".").map(Number);
        return major > 1 || (major === 1 && minor >= 22);
    }

    // Whether this person may write the shared layer: «Сохранить для всех»,
    // the locks and the head's fields are theirs (C298, C311 (2), (5)).
    get canWriteShared() {
        return this.editableLayers.includes("shared") && this.hostSpeaksCardSettings;
    }

    // A required profile (port 1.22.0 profiles[].required): it cannot be
    // changed, and edits live until the page is left -- nothing is written
    // (C298, RC-2).
    get viewRequired() {
        const profile = this.viewProfiles.find((item) => item.id === this.viewProfile);
        return profile?.required === true;
    }

    // The paths the lower layers cannot change (port 1.22.0 view.locked):
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
    }

    // Whether the personal layer of the chosen profile holds anything: what
    // «Сохранить для всех» would publish. The required profile's edits are
    // the page's only (requiredEdits).
    get hasPersonalEdits() {
        const layer = this.view?.layers?.personal;
        const view = layer?.view;
        if (!view) return false;
        return ["sections", "groups", "fields"].some((bucket) => Object.keys(view[bucket] ?? {}).length > 0)
            || Boolean(view.head);
    }

    startConfiguringView() {
        if (!this.canConfigureView) return false;
        this.configuring = true;
        if (this.viewProfiles.length) this.viewTarget = this._layerOfProfile();
        // What the arrangement was when the mode was entered. Every change in
        // this mode is written at once, so «cancel» can only mean putting back
        // what a person started from -- which is what a person means by it.
        this.arrangementEntered = {
            kind: this.viewTarget,
            revision: this._layerRevision(this.viewTarget),
            view: this._layerCopy(this.viewTarget),
        };
        this.resetAsked = false;
        this.requiredEdits = false;
        this.layerDraft = this._layerCopy(this.viewTarget);
        this._bindSectionDropTarget();
        this.entryErrors = new Map();
        this.cancelEdit();
        this.requestComponentUpdate("configuring");
        // Arranging shows every group; those not read yet are read now.
        this._readShownGroups("started");
        this._focusAfterRender(['.sf-property-view-configure-top [data-action="view-profile"]', ".sf-property-view-configure-bar"]);
        return true;
    }

    stopConfiguringView() {
        const wasConfiguring = this.configuring;
        this.configuring = false;
        this._bindSectionDropTarget();
        this.layerDraft = null;
        this.arrangementEntered = null;
        this.resetAsked = false;
        this.entryErrors = new Map();
        this.requestComponentUpdate("configuring");
        if (wasConfiguring) this._focusAfterRender('[data-action="menu"]');
    }

    // Where the keyboard goes when the mode changes. The menu that started
    // arranging closes and the bar that ends it goes away, and each left the
    // focus on the page's body, so a keyboard user started again from the top
    // (simai.main keyboard QA, 2026-10-28). Entering, the focus goes to the
    // arranging bar's view chooser (its first control otherwise: the first was
    // Reset, the act that takes most away); leaving, to the panel's menu,
    // where the mode was entered from. The first selector that finds a
    // control wins.
    _focusAfterRender(selectors) {
        // What can take focus is the layer stack's one list (core.runtime 1.19.0).
        const inside = (area) => (area?.matches?.(FOCUSABLE) ? area : area?.querySelector?.(FOCUSABLE)) ?? null;
        this.whenRendered(() => requestAnimationFrame(async () => {
            const root = this.panelContent?.() ?? this;
            let target = null;
            for (const selector of [selectors].flat()) {
                const area = [...(root?.querySelectorAll?.(selector) ?? [])].pop() ?? null;
                if (!area) continue;
                target = inside(area);
                // A child defined lazily (the view chooser on a cold page) has
                // no control yet on the first frame, and the next selector's
                // first control -- Reset -- took the focus in its place
                // (simai.main, 2026-10-28). Its definition and first render are
                // waited for before falling through.
                if (!target && area.localName.includes("-")) {
                    await customElements.whenDefined(area.localName);
                    await area.whenRendered?.();
                    await new Promise((done) => requestAnimationFrame(done));
                    target = inside(area);
                }
                if (target) break;
            }
            if (!target || !target.isConnected) return;
            const active = document.activeElement;
            // Only where the focus was lost: a person who has already moved on
            // keeps where they went.
            if (active && active !== document.body && root?.contains?.(active)) return;
            target.focus({preventScroll: true});
        }), {next: true});
    }

    // Leaving the mode with the arrangement a person started from. Not the same
    // as resetting: a reset takes the layer away and lets what lies beneath show
    // through, while this writes back the arrangement that was there when the
    // mode was entered, including one a person had made earlier.
    //
    // Nothing written since then means nothing to write back: the host's layer
    // is still the one entered with, and an identical view.save still cost a
    // shared revision and a history entry (simai.main QA, 2026-10-28).
    async cancelConfiguringView() {
        if (!this.configuring) return false;
        // A required view wrote nothing: what was drawn is read again.
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
    }

    // A reset asks first. It takes away everything a person arranged in this
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
    }

    // A hidden entry can be shown again only from the layer that hid it or above
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
    }

    // The resolved siblings of a container, in the order they are drawn. The move
    // is computed against what a person sees, not against what the layer stores:
    // a layer is sparse, so the entry being dragged may have no order in it yet.
    _groupsOf(sectionKey) {
        const section = this.sections.find((item) => String(item.key) === String(sectionKey));
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
                if (String(group.key) === String(groupKey)) return {section, group};
            }
        }
        return null;
    }

    // Dense order for the containers a move touched, and only those. A single
    // sparse order cannot say «between B and C» -- two neighbours may share a
    // number, or have none -- so the layer takes over the order of the one or two
    // containers that changed and leaves every other container resolving as it did.
    _writeOrder(bucket, items, extra = {}) {
        items.forEach((item, index) => {
            const key = String(item.key);
            bucket[key] = {...(bucket[key] ?? {}), ...extra, order: index + 1};
        });
    }

    // A field dropped on a section in the list lands in that section's first
    // group that takes fields. A section is not itself a container of fields --
    // a group is -- so something has to choose, and the first group is the one a
    // person sees at the top of the section they aimed at. A section whose only
    // groups are related lists takes nothing, and the drop is refused rather
    // than landing somewhere invisible.
    moveFieldToSection(fieldKey, sectionKey) {
        if (!this.configuring || !this.layerDraft) return false;
        const section = (this.sections ?? []).find((candidate) => String(candidate.key) === String(sectionKey));
        if (!section) return false;
        const group = (section.groups ?? []).find((candidate) => candidate.kind !== "related");
        if (!group) return false;
        return this.moveField(fieldKey, String(group.key), (group.fields ?? []).length);
    }

    // The section list is a drop target of its own rather than a sortable list:
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
            const under = globalThis.document?.elementFromPoint?.(x, y);
            // While the view is arranged the sections are rows of their own, so a
            // field may be dropped on a tab the same way it is dropped on a group.
            // This target is bound only while the view is arranged, and then the
            // sections are those rows (data-section-tab, the section key); the
            // reading list (sf-tabs) is never drawn at the same time.
            const item = under?.closest?.("[data-section-tab]");
            // Another panel's list is not this panel's drop target. The drawer
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
                if (key === this.selectedSection) return null;
                // The row's name, not its handle or icon: those are glyph
                // ligatures, and their words would be read into the label.
                return {
                    descriptor: {section: key},
                    rect: item.getBoundingClientRect(),
                    label: item.querySelector(".sf-property-view-section-tab-label")?.textContent?.trim()
                        || item.textContent?.trim() || key,
                };
            },
            drop: (session, descriptor) => {
                if (!descriptor?.section) return false;
                if (session?.group === "group") {
                    return this.moveGroup(session?.item, descriptor.section, Number.MAX_SAFE_INTEGER);
                }
                return this.moveFieldToSection(session?.item, descriptor.section);
            },
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
                const at = (group.fields ?? []).findIndex((field) => String(field.key) === String(fieldKey));
                if (at >= 0) {
                    fromGroup = group;
                    [moved] = group.fields.splice(at, 1);
                    break;
                }
            }
            if (moved) break;
        }
        // A field being placed may be coming back from outside the arrangement
        // rather than from another group.
        let fromUnplaced = false;
        if (!moved) {
            const waiting = this.record?.unplaced ?? [];
            const at = waiting.findIndex((field) => String(field.key) === String(fieldKey));
            if (at >= 0) {
                [moved] = waiting.splice(at, 1);
                fromUnplaced = true;
            }
        }
        if (!moved) return false;
        const into = target.group.fields ?? (target.group.fields = []);
        const at = Math.max(0, Math.min(Number.isInteger(index) ? index : into.length, into.length));
        into.splice(at, 0, moved);
        this._writeOrder(this.layerDraft.fields, into, {group: String(toGroupKey)});
        if (fromUnplaced) {
            this._writeOrder(this.layerDraft.fields, this.record?.unplaced ?? [], {group: null});
        }
        if (fromGroup && fromGroup !== target.group) {
            this._writeOrder(this.layerDraft.fields, fromGroup.fields ?? [], {group: String(fromGroup.key)});
        }
        this.requestComponentUpdate("view-move");
        return this.saveView();
    }

    moveGroup(groupKey, toSectionKey, index) {
        if (!this.configuring || !this.layerDraft) return false;
        const target = this.sections.find((item) => String(item.key) === String(toSectionKey));
        if (!target) return false;
        let moved = null;
        let fromSection = null;
        for (const section of this.sections) {
            const at = (section.groups ?? []).findIndex((group) => String(group.key) === String(groupKey));
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
        this._writeOrder(this.layerDraft.groups, into, {section: String(toSectionKey)});
        if (fromSection && fromSection !== target) {
            this._writeOrder(this.layerDraft.groups, fromSection.groups ?? [], {section: String(fromSection.key)});
        }
        this.requestComponentUpdate("view-move");
        return this.saveView();
    }

    // Width, template variant and hint, one field at a time. The value is written
    // into the layer and onto the drawn entry together, so the view moves under
    // the person's hand and the layer is what gets stored.
    setFieldView(fieldKey, patch = {}) {
        if (!this.configuring || !this.layerDraft) return false;
        // `label` is this view's name for the field, the same way a section and
        // an area carry one: the collection keeps its own, and resetting the
        // layer gives it back.
        // The template (variant) is the field's own, chosen once in the field
        // (C302 (2), C311 (6), RC-9): the card view writes none. A layer that
        // holds one is still read until 2027-01-01.
        const allowed = ["width", "hint", "label"];
        const change = Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.includes(key)));
        if (!Object.keys(change).length) return false;
        const key = String(fieldKey);
        this.layerDraft.fields[key] = {...(this.layerDraft.fields[key] ?? {}), ...change};
        for (const section of this.sections) {
            for (const group of section.groups ?? []) {
                for (const field of group.fields ?? []) {
                    if (String(field.key) === key) Object.assign(field, change);
                }
            }
        }
        this.requestComponentUpdate("view-field");
        return this.saveView();
    }

    // The glyphs a section may be marked with. A hundred and twenty names from
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
    }

    // A section's glyph is this view's, like its name: the layer carries it and
    // resetting the layer gives the host's back.
    setSectionIcon(sectionKey, icon) {
        if (!this.configuring || !this.layerDraft) return false;
        const name = String(sectionKey);
        const section = this.sections.find((part) => String(part.key) === name);
        if (!section) return false;
        const next = String(icon ?? "").trim() || null;
        this.layerDraft.sections[name] = {...(this.layerDraft.sections[name] ?? {}), icon: next};
        section.icon = next;
        this.requestComponentUpdate("view-section-icon");
        return this.saveView();
    }

    // Naming what is on screen. A label is the layer's to set -- the port has
    // carried `label` for a section and a group since 1.6.0 -- so renaming is an
    // arrangement, not a change to the collection: what it renames is this
    // view's name for it, and resetting the layer gives the host's name back.
    renameEntry(kind, key, label) {
        if (!this.configuring || !this.layerDraft) return false;
        const buckets = {section: "sections", group: "groups"};
        const bucket = buckets[kind];
        if (!bucket) return false;
        const next = String(label ?? "").trim();
        if (!next) return false;
        const entry = this._findEntry(kind, key);
        if (!entry) return false;
        const name = String(key);
        this.layerDraft[bucket][name] = {...(this.layerDraft[bucket][name] ?? {}), label: next};
        entry.label = next;
        this.renaming = null;
        this.requestComponentUpdate("view-rename");
        return this.saveView();
    }

    startRenaming(kind, key) {
        if (!this.configuring) return false;
        this.renaming = {kind, key: String(key)};
        this.requestComponentUpdate("view-rename");
        return true;
    }

    cancelRenaming() {
        this.renaming = null;
        this.requestComponentUpdate("view-rename");
    }

    // Taking an area out of the view. Its fields are not destroyed with it: they
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
        this.layerDraft.groups[name] = {...(this.layerDraft.groups[name] ?? {}), hidden: true};
        target.group.hidden = true;
        const section = this.sections.find((part) => (part.groups ?? []).includes(target.group));
        if (section) section.groups = (section.groups ?? []).filter((group) => group !== target.group);
        this.requestComponentUpdate("view-remove-group");
        return this.saveView();
    }

    // A tab is removed and its fields go to «Скрытые поля» (C311 (4)), where
    // the eye or a drag brings each back: one way to not show a field (C106
    // (1)). Its areas are hidden with it. It moved the areas to the tab that
    // remained before.
    removeSection(sectionKey) {
        if (!this.configuring || !this.layerDraft) return false;
        const name = String(sectionKey);
        const section = this.sections.find((part) => String(part.key) === name);
        if (!section || !this.canChangeVisibility(section)) return false;
        if (this.sections.length < 2) return false;
        const into = this.sections.find((part) => part !== section);
        for (const group of [...(section.groups ?? [])]) {
            if (group.kind !== "related") {
                for (const field of [...(group.fields ?? [])]) this.moveFieldToUnplaced(String(field.key), undefined, {save: false});
            }
            const groupName = String(group.key);
            this.layerDraft.groups[groupName] = {...(this.layerDraft.groups[groupName] ?? {}), hidden: true};
            group.hidden = true;
        }
        this.layerDraft.sections[name] = {...(this.layerDraft.sections[name] ?? {}), hidden: true};
        section.hidden = true;
        this.sections = this.sections.filter((part) => part !== section);
        if (this.selectedSection === name) this.selectedSection = String(into.key);
        this.requestComponentUpdate("view-remove-section");
        return this.saveView();
    }

    // The order of the sections, as a drag leaves them. A section is a tab in
    // this arrangement, and a tab nobody can move is an order the host chose
    // once and nobody since.
    moveSection(sectionKey, index) {
        if (!this.configuring || !this.layerDraft) return false;
        if (this.lockedForMe("sections.order")) return false;
        const name = String(sectionKey);
        const at = this.sections.findIndex((part) => String(part.key) === name);
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
    }

    // Making a new area, and a new section to hold areas. This is the one act in
    // arranging that does not rearrange what the host sent: it names something
    // the record does not carry yet, and the host decides whether to keep it --
    // the layer write says so, and the area survives the next read only if the
    // host returns it. Until then it is drawn from the layer, so a person sees
    // what they made straight away.
    addGroup(sectionKey) {
        if (!this.configuring || !this.layerDraft) return false;
        const section = this.sections.find((part) => String(part.key) === String(sectionKey))
            ?? this.sections[0];
        if (!section) return false;
        const key = this._newEntryKey("group");
        const group = {
            key,
            label: this.newGroupTitle,
            columns: 1,
            fields: [],
            hidden: false,
            rare: false,
            editable: true,
        };
        section.groups = [...(section.groups ?? []), group];
        this._writeOrder(this.layerDraft.groups, section.groups, {section: String(section.key)});
        this.layerDraft.groups[key] = {
            ...(this.layerDraft.groups[key] ?? {}),
            label: group.label,
            section: String(section.key),
            columns: 1,
            hidden: false,
        };
        this.renaming = {kind: "group", key};
        this.requestComponentUpdate("view-add-group");
        return this.saveView();
    }

    // A new tab comes with a «Поля» area (C311 (4)), so a field can be moved to
    // it at once from its «⋯ → На вкладку …».
    addSection() {
        if (!this.configuring || !this.layerDraft) return false;
        const key = this._newEntryKey("section");
        const groupKey = this._newEntryKey("group");
        const fieldsTitle = pageText(PROPERTY_VIEW_TEXT, "newTabGroupTitle", this);
        const group = {key: groupKey, label: fieldsTitle, columns: 1, fields: [], hidden: false, rare: false, editable: true};
        const section = {key, label: this.newSectionTitle, groups: [group], hidden: false, rare: false};
        this.layerDraft.groups[groupKey] = {label: fieldsTitle, section: key, columns: 1, hidden: false, order: 1};
        this.sections = [...this.sections, section];
        this._writeOrder(this.layerDraft.sections, this.sections, {});
        this.layerDraft.sections[key] = {
            ...(this.layerDraft.sections[key] ?? {}),
            label: section.label,
            hidden: false,
        };
        this.selectedSection = key;
        this.renaming = {kind: "section", key};
        this.requestComponentUpdate("view-add-section");
        return this.saveView();
    }

    // A key nobody else holds, said in the open so a host reading the layer can
    // tell a key this component made from one of its own.
    _newEntryKey(kind) {
        const stamp = Date.now().toString(36);
        const noise = Math.floor(Math.random() * 46655).toString(36).padStart(3, "0");
        return `view-${kind}-${stamp}${noise}`;
    }

    toggleEntryHidden(kind, key) {
        if (!this.configuring || !this.layerDraft) return false;
        const buckets = {section: "sections", group: "groups", field: "fields"};
        const bucket = buckets[kind];
        if (!bucket) return false;
        const entry = this._findEntry(kind, key);
        if (!entry || !this.canChangeVisibility(entry)) return false;
        const next = !entry.hidden;
        const name = String(key);
        this.layerDraft[bucket][name] = {...(this.layerDraft[bucket][name] ?? {}), hidden: next};
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
    }

    // Applied immediately, the way column settings are, and against the layer
    // revision. A refusal or a conflict is not something to paper over: the
    // arrangement on screen is the component optimistic copy, so when the host
    // does not accept it the record is read again and the host resolution wins.
    async saveView() {
        if (!this.canConfigureView || !this.layerDraft) return null;
        // Serialized, one write at a time. Two drags in quick succession would
        // otherwise both be sent against the revision the layer had before either
        // of them, so the second would be answered with a conflict the person
        // caused by being quick -- correct by the contract and useless to them.
        // Waiting means the second write carries the revision the first earned.
        const queued = this._viewWriting ?? Promise.resolve();
        let release;
        this._viewWriting = new Promise((done) => {
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
        if (!this.canConfigureView || !this.layerDraft) return null;
        // A required view: the edit is drawn and kept until the page is left,
        // and never written (C298).
        if (this.viewRequired) {
            this.requiredEdits = true;
            this.requestComponentUpdate("view-required");
            return {answer: "applied", local: true};
        }
        const kind = this.viewTarget;
        const epoch = ++this.viewEpoch;
        const answer = await this._raise("view.save", {
            record_id: null,
            collection: this.collection || null,
            target: {kind, revision: this._layerRevision(kind)},
            view: copy(this.layerDraft),
        }, {stale: () => epoch !== this.viewEpoch});
        if (!answer) return null;
        if (answer.answer === "applied") {
            this.entryErrors = new Map();
            this._storeLayer(kind, answer.revision ?? null, answer.view ?? this.layerDraft);
            // A host that normalised the layer is telling the component its copy
            // is not what was stored, so the arrangement is read again rather
            // than left as the component imagined it.
            // The port says a view write announces sf-property-view-state, so it
            // has to announce it when the write succeeds and not only when it
            // fails -- otherwise the declared event is a half-truth and a host
            // listening for it would hear only bad news.
            if (answer.view) await this.load("view-normalised");
            else {
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
            this.entryErrors = new Map(errors.map(([key, value]) => [key, this.viewRefusalText({code: value}, String(value))]));
            await this.load("view-refused");
            // An error of the head or of no entry on screen is said as the card's message.
            const loose = errors.find(([key]) => !key.includes(":"));
            if (loose || !errors.length) this.message = this.viewRefusalText(loose ? {code: loose[1]} : answer, pageText(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));
            return answer;
        }
        this._setState("error", answer.message || pageText(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this));
        return answer;
    }

    // «Сохранить для всех» (port 1.22.0 view.publish; C298, C311 (5), RC-1):
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
            shared_revision: this._layerRevision("shared"),
        }, {stale: () => epoch !== this.viewEpoch});
        if (!answer) return null;
        if (answer.answer === "applied" || answer.answer === "conflict") {
            const shared = answer.shared ?? null;
            if (shared) this._storeLayer("shared", shared.revision ?? null, shared.view ?? null);
            if (answer.answer === "applied") {
                this._storeLayer("personal", answer.personal?.revision ?? null, null);
                this.message = pageText(PROPERTY_VIEW_TEXT, "viewPublishedText", this);
            } else {
                // A conflict carries both newer layers: the next publish asks with them.
                if (answer.personal) this._storeLayer("personal", answer.personal.revision ?? null, answer.personal.view ?? null);
                this.message = this.viewRefusalText(answer, pageText(PROPERTY_VIEW_TEXT, "viewChangedText", this));
            }
            this.layerDraft = this._layerCopy(this.viewTarget);
            // What «Отменить» puts back is now what everyone has.
            this.arrangementEntered = {kind: this.viewTarget, revision: this._layerRevision(this.viewTarget), view: this._layerCopy(this.viewTarget)};
            await this.load(answer.answer === "applied" ? "view-published" : "view-conflict");
            return answer;
        }
        this._setState("error", this.viewRefusalText(answer, pageText(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));
        return answer;
    }

    // «Закрыть для изменений» (port 1.22.0 view.lock; C298, RC-2): one setting
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
            revision: this._layerRevision("shared"),
        }, {stale: () => epoch !== this.viewEpoch});
        if (!answer) return null;
        if ((answer.answer === "applied" || answer.answer === "conflict") && this.view) {
            if (Array.isArray(answer.locked)) this.view.locked = answer.locked.map(String);
            // Larena's path "required" answers whether the profile is now required.
            if (typeof answer.required === "boolean" && Array.isArray(this.view.profiles)) {
                this.view.profiles = this.view.profiles.map((item) => (item.id === this.viewProfile ? {...item, required: answer.required} : item));
            }
            const shared = this.view.layers?.shared;
            if (shared && answer.revision) this.view.layers = {...this.view.layers, shared: {...shared, revision: String(answer.revision)}};
            if (answer.answer === "conflict") this.message = this.viewRefusalText(answer, pageText(PROPERTY_VIEW_TEXT, "viewChangedText", this));
            this.requestComponentUpdate("view-lock");
            return answer;
        }
        this._setState("error", this.viewRefusalText(answer, pageText(PROPERTY_VIEW_TEXT, "viewSaveFailedText", this)));
        return answer;
    }

    // «Сохранить как моё» (C311 (5), RC-3): a personal profile from what is on
    // screen, for a view whose settings are locked. Not in a required view.
    get canSaveAsMine() {
        return this.configuring && !this.viewRequired && this.editableLayers.includes("personal");
    }

    saveAsMine() {
        if (!this.canSaveAsMine) return null;
        const current = this.viewProfiles.find((profile) => profile.id === this.viewProfile);
        const label = pageText(PROPERTY_VIEW_TEXT, "saveAsMineLabelText", this).replace("{name}", current?.label ?? "");
        return this.createViewProfile(label, {shared: false});
    }

    // The card head (port 1.22.0 view.head; C289 (6), C311 (2)): the title,
    // under it up to two fields, and the stage as a tonal badge. What the
    // draft layer says wins over what the host resolved.
    get viewHead() {
        const layered = this.configuring ? this.layerDraft?.head : null;
        const head = layered ?? this.view?.head ?? null;
        if (!head || typeof head !== "object") return {subtitle: [], status: null};
        const subtitle = Array.isArray(head.subtitle) ? head.subtitle.map(String).filter(Boolean).slice(0, 2) : [];
        return {subtitle, status: typeof head.status === "string" && head.status ? head.status : null};
    }

    // What the head draws under the title: the subtitle fields' values, and
    // the stage's option with its scheme for the tonal badge.
    get headLine() {
        const head = this.viewHead;
        const subtitle = head.subtitle.map((key) => {
            const field = this.headField(key);
            const value = this.changed?.has?.(key) ? this.changed.get(key) : field?.value;
            const text = field ? valueText(field, value, this.viewHost) : "";
            return text ? {key, text} : null;
        }).filter(Boolean);
        let status = null;
        const stage = head.status ? this.headField(head.status) : null;
        if (stage) {
            const value = stage.value && typeof stage.value === "object" ? stage.value.value ?? stage.value.id : stage.value;
            const option = (stage.options ?? []).find((item) => String(item?.value ?? item?.id ?? item) === String(value ?? ""));
            const text = option ? String(option.label ?? option.text ?? option.value ?? "") : valueText(stage, stage.value, this.viewHost);
            if (text) status = {key: String(stage.key), text, scheme: option?.scheme ?? option?.color ?? "secondary"};
        }
        return {subtitle, status};
    }

    _writeHead(next) {
        // A 1.18.0 layer holds sections, groups and fields only.
        if (!this.configuring || !this.layerDraft || !this.hostSpeaksCardSettings || this.lockedForMe("head")) return false;
        this.layerDraft.head = {subtitle: next.subtitle.slice(0, 2), status: next.status ?? null};
        // Drawn after the mode too, before the next read brings the host's.
        if (this.view) this.view.head = copy(this.layerDraft.head);
        this.requestComponentUpdate("view-head");
        return this.saveView();
    }

    toggleHeadSubtitle(fieldKey) {
        const head = this.viewHead;
        const key = String(fieldKey);
        const subtitle = head.subtitle.includes(key)
            ? head.subtitle.filter((item) => item !== key)
            : [...head.subtitle, key].slice(-2);
        return this._writeHead({...head, subtitle});
    }

    setHeadStatus(fieldKey) {
        const head = this.viewHead;
        const key = fieldKey == null ? null : String(fieldKey);
        return this._writeHead({...head, status: head.status === key ? null : key});
    }

    // The field the head names, wherever it stands (hidden ones too).
    headField(key) {
        const name = String(key);
        for (const section of this.sections ?? []) {
            for (const group of section.groups ?? []) {
                for (const field of group.fields ?? []) if (String(field.key) === name) return field;
            }
        }
        return (this.unplaced ?? []).find((field) => String(field.key) === name) ?? null;
    }

    // «Добавить поле» is structure, not view (C311 (1)): it opens the data
    // owner's field editor. The card says which collection and where; the
    // host opens its editor.
    openStructureEditor(groupKey = null) {
        const located = groupKey ? this._locateGroup(groupKey) : null;
        return this.sfEmit?.("structure", {
            collection: this.collection || null,
            section: located ? String(located.section.key) : (this.selectedSection || null),
            group: groupKey ? String(groupKey) : null,
        }, {cancelable: true}) ?? null;
    }

    // The eye of a field in «Скрытые поля» (C311 (5)): back into the open
    // tab's first area that takes fields.
    showHiddenField(fieldKey) {
        if (!this.configuring) return false;
        const sections = this.sections ?? [];
        const section = sections.find((part) => String(part.key) === this.selectedSection) ?? sections[0];
        const group = (section?.groups ?? []).find((candidate) => candidate.kind !== "related" && !candidate.hidden);
        if (!group) return false;
        // A field a layer hid comes back shown, not only placed.
        const key = String(fieldKey);
        if (this.layerDraft) this.layerDraft.fields[key] = {...(this.layerDraft.fields[key] ?? {}), hidden: false};
        const waiting = (this.record?.unplaced ?? []).find((field) => String(field.key) === key);
        if (waiting) waiting.hidden = false;
        return this.moveField(key, String(group.key), (group.fields ?? []).length);
    }

    // A tab's «⋯» (C311 (4), TB-1): name, icon, up, down, hide, delete, and
    // the lock for those who may write the shared layer.
    tabMenuEntries(sectionKey) {
        const at = this.sections.findIndex((section) => String(section.key) === String(sectionKey));
        const section = this.sections[at];
        if (!section) return [];
        const word = (key) => pageText(PROPERTY_VIEW_TEXT, key, this);
        const path = `sections.${String(section.key)}`;
        const mine = !this.lockedForMe(path);
        const entries = [
            {id: "tab-rename", text: word("tabRenameText"), icon: "edit", disabled: !mine},
            {id: "tab-icon", text: word("tabIconText"), icon: "category", disabled: !mine},
            {id: "tab-up", text: word("tabUpText"), icon: "arrow_upward", disabled: at === 0 || this.lockedForMe("sections.order")},
            {id: "tab-down", text: word("tabDownText"), icon: "arrow_downward", disabled: at === this.sections.length - 1 || this.lockedForMe("sections.order")},
            {type: "separator"},
            {id: "tab-hide", text: word(section.hidden ? "tabShowText" : "tabHideText"), icon: section.hidden ? "visibility" : "visibility_off", disabled: !mine},
            {id: "tab-delete", text: word("tabDeleteText"), icon: "delete", danger: true, disabled: !mine || this.sections.length < 2},
        ];
        if (this.canWriteShared) {
            entries.push({type: "separator"});
            entries.push(this.isLocked(path)
                ? {id: "tab-lock", text: word("unlockText"), icon: "lock_open"}
                : {id: "tab-lock", text: word("lockText"), icon: "lock"});
        }
        return entries;
    }

    openTabMenu(anchor, sectionKey) {
        const key = String(sectionKey);
        return this.openStandardMenu(anchor, {
            label: pageText(PROPERTY_VIEW_TEXT, "tabMenuText", this).replace("{name}", String(this.sections.find((section) => String(section.key) === key)?.label ?? key)),
            entries: this.tabMenuEntries(key),
            select: (id) => this.chooseTabEntry(key, id),
        });
    }

    chooseTabEntry(sectionKey, id) {
        const key = String(sectionKey);
        const at = this.sections.findIndex((section) => String(section.key) === key);
        if (at < 0) return false;
        if (id === "tab-rename") return this.startRenaming("section", key);
        if (id === "tab-icon") {
            this.selectSection(key);
            this.whenRendered?.(() => (this.panelContent?.() ?? this).querySelector?.(`[data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"] button, [data-icon-for="${CSS.escape(key)}"] [data-action="section-icon"]`)?.click?.(), {next: true});
            return true;
        }
        if (id === "tab-up") return this.moveSection(key, at - 1);
        if (id === "tab-down") return this.moveSection(key, at + 1);
        if (id === "tab-hide") return this.toggleEntryHidden("section", key);
        if (id === "tab-delete") return this.removeSection(key);
        if (id === "tab-lock") return this.lockViewPath(`sections.${key}`);
        return false;
    }

    // A field's «⋯» in the arranging mode (C311 (2), (4)): the head's fields
    // and stage for the admin, «На вкладку …» at every width, the lock.
    fieldMenuEntries(fieldKey) {
        const key = String(fieldKey);
        const field = this.headField(key);
        const word = (name) => pageText(PROPERTY_VIEW_TEXT, name, this);
        const entries = [];
        const head = this.viewHead;
        if (this.canWriteShared && !this.lockedForMe("head")) {
            entries.push({id: "head-subtitle", text: word(head.subtitle.includes(key) ? "headSubtitleOffText" : "headSubtitleOnText"), icon: "title"});
            if (Array.isArray(field?.options) && field.options.length) {
                entries.push({id: "head-status", text: word(head.status === key ? "headStatusOffText" : "headStatusOnText"), icon: "label"});
            }
        }
        const here = this.sections.find((section) => (section.groups ?? []).some((group) => (group.fields ?? []).some((item) => String(item.key) === key)));
        const others = this.sections.filter((section) => section !== here
            && (section.groups ?? []).some((group) => group.kind !== "related"));
        if (others.length && !this.lockedForMe(`fields.${key}.group`)) {
            if (entries.length) entries.push({type: "separator"});
            for (const section of others) {
                entries.push({id: `to-tab:${String(section.key)}`, text: word("toTabText").replace("{name}", String(section.label ?? section.key)), icon: "drive_file_move"});
            }
        }
        if (this.canWriteShared) {
            if (entries.length) entries.push({type: "separator"});
            const path = `fields.${key}.hidden`;
            entries.push(this.isLocked(path)
                ? {id: "field-lock", text: word("unlockText"), icon: "lock_open"}
                : {id: "field-lock", text: word("lockText"), icon: "lock"});
        }
        return entries;
    }

    openFieldMenu(anchor, fieldKey) {
        const key = String(fieldKey);
        const entries = this.fieldMenuEntries(key);
        if (!entries.length) return null;
        return this.openStandardMenu(anchor, {
            label: pageText(PROPERTY_VIEW_TEXT, "fieldMenuText", this).replace("{name}", String(this.headField(key)?.label ?? key)),
            entries,
            select: (id) => this.chooseFieldEntry(key, id),
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
        this.view.layers = {...(this.view.layers ?? {})};
        this.view.layers[kind] = {revision, view: view ? copy(view) : null};
        this.layerDraft = this._layerCopy(kind);
    }

    // A reset writes nothing against the revision -- it never sends the component
    // idea of the defaults, because the host owns those and writing them would
    // overwrite them with a guess.
    async resetView() {
        if (!this.canConfigureView) return null;
        this.resetAsked = false;
        // Behind the same queue as a save: a reset racing a save in flight would
        // clear a layer and then store the save's revision over the cleared one.
        await (this._viewWriting ?? Promise.resolve());
        // «Вернуть как у всех» clears the person's own layer and nothing else
        // (C311 (5), RC-3): it cleared the layer of the profile, the shared one
        // included. A shared reset is the picker row's, for the admin.
        const kind = this.editableLayers.includes("personal") ? "personal" : this.viewTarget;
        const epoch = ++this.viewEpoch;
        const answer = await this._raise("view.reset", {
            record_id: null,
            collection: this.collection || null,
            target: {kind, revision: this._layerRevision(kind)},
        }, {stale: () => epoch !== this.viewEpoch});
        if (!answer) return null;
        if (answer.answer === "applied" || answer.answer === "conflict") {
            if (answer.answer === "conflict") this.message = answer.message || this.viewConflictText;
            this._storeLayer(kind, answer.revision ?? null, null);
            this.entryErrors = new Map();
            await this.load("view-reset");
            return answer;
        }
        this._setState("error", answer.message || pageText(PROPERTY_VIEW_TEXT, "viewResetFailedText", this));
        return answer;
    }
}

answerActions(SfPropertyView, manifest);
settingSetters(SfPropertyView, manifest);
SfPropertyView.define("sf-view-properties");

export {SfPropertyView, SUPPORTED_PORT_VERSIONS};
