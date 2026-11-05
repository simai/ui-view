// A few properties as a block in a flow: a chat message, a feed entry, any
// stream where content follows content. It shows a record's fields, or asks the
// person to fill in a few and send them; after the answer it stays in the flow
// as what was sent, read-only. Design: ui-view docs/design/sf-view-property-block.md.
//
// It is the record component's field drawing and the Framework's confirm
// surface put together, with nothing copied from either:
//
// - the confirm surface (SIMAI Framework helpers/confirm-surface.js, the one
//   sf-confirm and sf-confirm-change share) is the answer's state machine:
//   open, pending, accepted, declined, expired, the expiry timer, the answer and
//   expired events, the actions open, answer, confirm and cancel, and the focus
//   moved to the status line when the answers go;
// - every field is drawn by sf-view-properties' js/field-value.js over the
//   Framework field renderers (SF.fieldRenderers), and its `when` read with
//   that component's js/conditions.js (through ./js/answer.js).
//
// The block owns no data. Its fields are the host's settings, a Send is an
// event with the values, and the host answers with settle() in the record
// port's words -- applied, or refused with the fields' errors -- or sets state.
//
// It renders into its own light DOM, like every Smart component: the field
// controls are Smart elements whose stylesheets are document-level.
import SfBaseElement from "../../core/js/smart-base";
import {applied, elementFromManifest, refused} from "../../core/js/element-manifest";
import {confirmSurface} from "../helpers/confirm-surface.js";
import {formatDateValue} from "../view-table/js/format-value.js";
import {renderPropertyBlockTemplate} from "./js/templates/default.js";
import {answerValues, groupsOf, missingRequired, readSettle} from "./js/answer.js";
import manifest from "./component.json";
import en from "./lang/en.json";
import ru from "./lang/ru.json";

const BlockElement = elementFromManifest(manifest, {
    base: SfBaseElement,
    lang: {en, ru},
    source: "ru",
});

const Surface = confirmSurface(BlockElement, {
    kind: "sf-view-property-block",
    block: "sf-view-property-block",
    answerId: "blockId",
});

// The first control of a field, for the focus a stopped or refused Send moves.
const CONTROL = "input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled]), "
    + "[contenteditable=true], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

const own = (element, name) => Object.prototype.hasOwnProperty.call(element, name);

class SfViewPropertyBlock extends Surface {
    static get props() {
        return {
            ...super.props,
            templateName: {attribute: "template", default: "default"},
            // The lists are properties (the usual case: a host has objects) or
            // their attributes in JSON (markup, the Studio).
            fields: {attribute: "fields", type: Array, default: []},
            groups: {attribute: "groups", type: Array, default: []},
        };
    }

    constructor() {
        super();
        this._fields = null;
        this._groups = null;
        this._formatter = null;
        // What the person typed and has not sent, by key.
        this._changed = new Map();
        // The messages under the fields: the block's own (a required field left
        // empty) and the host's (settle refused with errors).
        this._errors = new Map();
        // An entry a control knows is not a value yet (a mask not filled): the
        // renderer set says so through setFieldError, and it holds a Send.
        this._inputErrors = new Map();
        this._controlErrors = new Set();
        // The sentence of the status line while open: a stopped Send, or the host's.
        this._message = "";
        // A collapsible group the person opened or closed, by key.
        this._toggled = new Map();
        // The values of the last Send, and the ones the host settled with.
        this._sent = null;
        this._answered = null;
        this._answer = null;
        // A value set as a property before the element was defined is an own
        // property that would hide the accessor; it is taken through it.
        for (const name of ["fields", "groups", "formatFieldValue"]) {
            if (!own(this, name)) continue;
            const early = this[name];
            delete this[name];
            this[name] = early;
        }
    }

    // ── data ───────────────────────────────────────────────────────────────

    get fields() {
        const value = this._fields ?? this.getProp("fields");
        return Array.isArray(value) ? value : [];
    }

    set fields(value) {
        this._fields = Array.isArray(value) ? value.map((field) => ({...field})) : null;
        this.requestComponentUpdate("fields");
    }

    get groups() {
        const value = this._groups ?? this.getProp("groups");
        return Array.isArray(value) ? value : [];
    }

    set groups(value) {
        this._groups = Array.isArray(value) ? value.map((group) => ({...group})) : null;
        this.requestComponentUpdate("groups");
    }

    /** The host's formatting of a value shown (as a property-view host's formatFieldValue); optional. */
    get formatFieldValue() {
        return this._formatter;
    }

    set formatFieldValue(value) {
        this._formatter = typeof value === "function" ? value : null;
        this._viewHost = null;
        this.requestComponentUpdate("format");
    }

    get mode() {
        return this.getAttribute("mode") === "edit" ? "edit" : "view";
    }

    set mode(value) {
        this.setAttribute("mode", value === "edit" ? "edit" : "view");
    }

    /** The groups drawn: the host's groups, or its fields as one group. */
    get blockGroups() {
        return groupsOf({fields: this.fields, groups: this.groups});
    }

    /** The values a Send would carry now. */
    get values() {
        return answerValues(this.blockGroups, this._changed);
    }

    // The host the view renderers read: its formatFieldValue first, and for a
    // date it did not format, the date in the page's language -- as
    // sf-view-properties reads a field shown.
    get viewHost() {
        if (this._viewHost) return this._viewHost;
        this._viewHost = {
            formatFieldValue: (field, value) => {
                const given = this._formatter?.(field, value);
                if (typeof given === "string") return given;
                const type = field?.propertyType ?? field?.property_type ?? field?.type ?? field?.dataType;
                return formatDateValue(type, value, this) || undefined;
            },
        };
        return this._viewHost;
    }

    // ── what the field renderers call (view-properties/js/field-value.js) ──

    // `undefined` takes a change back; a value equal to the one given is no change.
    changeField(field, value) {
        const key = String(field?.key ?? "");
        if (!key) return this;
        const given = Object.hasOwn(field ?? {}, "value") && value !== undefined
            && JSON.stringify(value) === JSON.stringify(field.value ?? null);
        if (value === undefined || given) this._changed.delete(key);
        else this._changed.set(key, value);
        this._errors.delete(key);
        this._message = "";
        this.requestComponentUpdate("changed");
        return this;
    }

    reportFieldError(field, message) {
        const key = String(field?.key ?? "");
        if (!key) return this;
        const before = this._inputErrors.get(key);
        if (message) {
            this._inputErrors.set(key, String(message));
            this._controlErrors.add(key);
        } else if (this._controlErrors.has(key)) {
            this._inputErrors.delete(key);
            this._controlErrors.delete(key);
        }
        if (this._inputErrors.get(key) !== before) this.requestComponentUpdate("errors");
        return this;
    }

    openReference(field, value) {
        this.sfEmit("open", {id: this.questionKey, field: String(field?.key ?? ""), value});
    }

    toggleGroup(key) {
        const group = this.blockGroups.find((entry) => entry.key === key);
        if (!group?.collapsible) return;
        this._toggled.set(key, !this.groupCollapsed(group));
        this.requestComponentUpdate("groups");
    }

    // A group holding an error is open, whatever was chosen: an error nobody
    // can see is not an answer anybody can correct.
    groupCollapsed(group) {
        if (!group.collapsible) return false;
        if (group.fields.some((field) => this._errors.has(String(field.key)) || this._inputErrors.has(String(field.key)))) return false;
        return this._toggled.has(group.key) ? this._toggled.get(group.key) : group.collapsed;
    }

    // ── the answer ─────────────────────────────────────────────────────────

    // Send first checks what the block can know itself: every required field
    // filled and no control holding an entry that is not a value yet. Then the
    // confirm surface takes it (pending, the answer event).
    answer(params = {}) {
        const accepted = this.readAnswer(params);
        if (accepted !== null && this.mode !== "edit") return refused("view");
        if (accepted === true && this.shownState === "open" && !this.getProp("disabled")) {
            const groups = this.blockGroups;
            const missing = missingRequired(groups, this._changed);
            if (missing.length || this._inputErrors.size) {
                const word = this.getProp("requiredText") || this.sfWord("required-text");
                for (const key of missing) this._errors.set(key, word);
                this._message = this.getProp("invalidText") || this.sfWord("invalid-text");
                this.requestComponentUpdate("errors");
                this.whenRendered(() => this.focusField(missing[0] ?? [...this._inputErrors.keys()][0]), {next: true});
                return refused("invalid");
            }
            this._sent = answerValues(groups, this._changed);
            this._message = "";
        }
        if (accepted !== null) this._answer = accepted;
        return super.answer(params);
    }

    // The answer event carries the values with a Send: the whole answer.
    sfEmit(verb, detail = {}, options) {
        if (verb === "answer" && detail?.accepted === true) return super.sfEmit(verb, {...detail, values: {...(this._sent ?? {})}}, options);
        return super.sfEmit(verb, detail, options);
    }

    /**
     * The host's answer to the person's: {answer: applied, values?} shows the
     * values sent (or the host's), read-only; refused with errors reopens the
     * block with each message under its field; refused closed or expired
     * closes it. A Cancel answered applied is declined.
     */
    settle(params = {}) {
        if (this.mode !== "edit") return refused("view");
        const result = params && typeof params === "object" && "result" in params && Object.keys(params).length === 1 ? params.result : params;
        const read = readSettle(result, {accepted: this._answer !== false});
        const focusWasInside = this.contains(this.ownerDocument.activeElement);
        this._errors = new Map(Object.entries(read.errors));
        this._message = read.message;
        if (read.state === "accepted") this._answered = read.values ?? this._sent ?? null;
        this.requestComponentUpdate("settled");
        this.setAttribute("state", read.state);
        const first = Object.keys(read.errors)[0];
        if (read.state === "open" && first) this.whenRendered(() => this.focusField(first), {next: true});
        else if (focusWasInside) this.whenRendered(() => this.focusStatus(), {next: true});
        return read.state === "open" ? refused(read.errors && first ? "invalid" : "refused") : applied();
    }

    // While open the status line says the block's sentence (a stopped Send, the
    // host's refusal) before the time it can be answered by.
    statusText(shown) {
        if (shown === "open" && this._message) return this._message;
        return super.statusText(shown);
    }

    focusField(key) {
        if (key === undefined || key === null) return;
        const field = this.querySelector(`.sf-view-property-block__field[data-field="${CSS.escape(String(key))}"]`);
        if (!field) return;
        const control = field.querySelector(CONTROL);
        (control ?? field).focus?.({preventScroll: false});
    }

    // The value a closed block shows: the one settled or sent, else the host's.
    shownValue(field) {
        const key = String(field.key);
        if (this._answered && Object.hasOwn(this._answered, key)) return this._answered[key];
        if (this._changed.has(key)) return this._changed.get(key);
        return field.value;
    }

    templateContext() {
        const base = this.confirmContext();
        const mode = this.mode;
        const state = base.state;
        const editing = mode === "edit" && (state === "open" || state === "pending");
        const errors = this._inputErrors.size ? new Map([...this._errors, ...this._inputErrors]) : this._errors;
        return {
            ...base,
            mode,
            editing,
            // A Cancel and a run-out time leave nothing to read but the outcome.
            fieldsShown: mode === "view" || editing || state === "accepted",
            footShown: mode === "edit",
            // The controls stay where they are while an answer is on its way or
            // the block is disabled, inert rather than redrawn as text.
            fieldsLocked: editing && (state === "pending" || Boolean(this.getProp("disabled"))),
            groups: this.blockGroups,
            changed: this._changed,
            errors,
            controlErrors: this._controlErrors,
            size: this.getProp("size") === "1" ? "1" : "1/2",
            viewHost: this.viewHost,
            emptyText: this.getProp("emptyText") || this.sfWord("empty-text"),
            blockLabel: this.sfWord("block-label"),
            submitText: this.getProp("submitText") || this.sfWord("submit-text"),
            cancelText: this.getProp("cancelText") || this.sfWord("cancel-text"),
            cancelable: this.getProp("cancelable") !== false,
            statusIcon: state === "open" && this._message ? "error" : base.statusIcon,
            statusError: state === "open" && Boolean(this._message),
            canPickRecords: false,
            canUploadFiles: false,
        };
    }

    template() {
        return renderPropertyBlockTemplate(this.templateContext());
    }
}

SfViewPropertyBlock.define("sf-view-property-block");
