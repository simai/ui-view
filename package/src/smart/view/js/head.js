// The list head of sf-view (head="list"; owner decisions C297, C299, C300,
// C301; ui-control research 2026-11-17-list-head-filters, sections 5-7).
//
// Two rows above the list:
//   the title row  -- how to look: the list name and count, the views menu,
//                     the display kind (sf-segmented), «Customize view» and the
//                     list menu «⋯» (only for those the host allows);
//   the head row   -- what to do: «Filter» with its bookmark, the filter
//                     fields, «Clear», the search (up to 20rem) and «Create».
// On a phone (the view narrower than 600 px, where the table turns into the
// compact list) the title row keeps a display-kind icon, «Customize view» and
// «⋯»; the head row is «Filter», the search and «+»; the filter fields are one
// row that scrolls sideways; every window is a bottom sheet (sf-drawer).
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
// settings.save, entity.fields.save -- a draft until the joint view-config/1
// contract settles the wire format (ui-control research
// 2026-11-17-views-architecture/view-config-1-draft.md).
import {menuOpen} from "../../../core/js/menu-open.js";

const PHONE_WIDTH = 600;
const KINDS = {
    table: "table_rows",
    board: "view_kanban",
    cards: "grid_view",
    calendar: "calendar_month",
    list: "view_list",
    tree: "account_tree",
};
const LIST_TYPES = new Set(["choice", "choices", "multi-select", "single-select", "user", "boolean", "record",
    "relation", "lookup", "entity-multi-select", "entity-single-select", "file", "color"]);
const DATE_TYPES = new Set(["date", "datetime", "date-range", "period"]);
const esc = (text) => String(text ?? "").replace(/[&<>"']/gu, (letter) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[letter]);
const copy = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

// A field's type, from any of the names a host writes it under.
function fieldType(field) {
    return String(field?.filter?.control || field?.propertyType || field?.property_type || field?.type || field?.dataType || "text");
}

// Whether a condition picks anything: a list with values, a value that is not
// empty, or an operator that needs none (a period carries its name; empty and
// not empty carry true).
export function conditionActive(entry) {
    if (!entry || typeof entry !== "object") return false;
    if (Array.isArray(entry.values)) return entry.values.length > 0;
    const value = entry.value;
    if (Array.isArray(value)) return value.some((item) => item !== "" && item != null);
    if (value === true || value === false) return true;
    return value !== undefined && value !== null && String(value).trim() !== "";
}

// How many values a filter field has chosen (C300): the number of a list's
// values, else one.
export function conditionCount(entry) {
    if (!conditionActive(entry)) return 0;
    return Array.isArray(entry.values) ? entry.values.length : 1;
}

export class ListHead {
    // view: the sf-view; text(key): its words; raise(intent, payload): its port.
    constructor(view, {text, raise}) {
        this.view = view;
        this.text = text;
        this.raise = raise;
        this.description = null;
        this.mode = null;
        this.open = null;
        this.temp = {};
        this.optionSearch = {};
        this.tab = {filter: "saved", record: null};
        this.recordGroups = null;
        this.root = null;
        this._onResize = () => this._measure();
    }

    // ---------- lifecycle ----------

    attach() {
        if (this.root?.isConnected) return this;
        const root = this.view.querySelector(':scope > [slot="head"][data-sf-view-head]') ?? document.createElement("div");
        root.setAttribute("slot", "head");
        root.setAttribute("data-sf-view-head", "");
        root.className = "sf-view-head";
        if (!root.isConnected) this.view.prepend(root);
        this.root = root;
        root.addEventListener("click", (event) => this._onClick(event));
        root.addEventListener("input", (event) => this._onInput(event));
        root.addEventListener("keydown", (event) => this._onKey(event));
        root.addEventListener("change", (event) => this._onChange(event));
        root.addEventListener("sf-input-field-reset", (event) => this._onSearchReset(event));
        root.addEventListener("sf-popover-open", (event) => this._onPopoverOpen(event));
        root.addEventListener("sf-popover-closed", (event) => this._onPopoverClosed(event));
        root.addEventListener("sf-button-select", (event) => this._onCreateSelect(event));
        root.addEventListener("sf-button-press", (event) => this._onCreatePress(event));
        this._resize = typeof ResizeObserver === "function" ? new ResizeObserver(this._onResize) : null;
        this._resize?.observe(this.view);
        this._measure();
        return this;
    }

    detach() {
        this._resize?.disconnect();
        this._resize = null;
        this.root?.remove();
        this.root = null;
        this.mode = null;
    }

    // The host's description of the list (the adapter's describe(), draft
    // view-config/1 section 2): fields, layouts, permissions; asked once per port.
    async describe(port) {
        if (!port || this._describedPort === port) return;
        this._describedPort = port;
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
    }

    _measure() {
        const width = this.view.getBoundingClientRect?.().width || globalThis.innerWidth || 0;
        const mode = width > 0 && width < PHONE_WIDTH ? "phone" : "desktop";
        if (mode !== this.mode) {
            this.mode = mode;
            this._build();
        }
    }

    // ---------- what the head knows ----------

    get size() { return this.view.controlSize || "1/2"; }

    get query() { return this.view.query ?? {}; }

    get permissions() { return this.description?.permissions ?? {}; }

    // The fields a filter can use: the host's description, else the fields the
    // host gave its table (sf-view-table filterFields), else nothing.
    get fields() {
        const described = Array.isArray(this.description?.fields) ? this.description.fields : null;
        const list = described ?? (this.table?.filterFields ?? []);
        return list.filter((field) => field && field.key && field.filter !== false && field.filter?.enabled !== false)
            .map((field) => ({...field, label: field.label ?? field.name ?? field.key}));
    }

    field(key) { return this.fields.find((field) => field.key === key) ?? null; }

    // The list's table: the one the view draws, or the page's own while a
    // board is drawn instead (sf-view parks it with its filter fields and
    // create items).
    get table() {
        return this.view.table ?? this.view.querySelector?.(":scope > sf-view-table[data-sf-view-parked]") ?? null;
    }

    // The display kinds the host enables (describe().layouts), table first.
    get kinds() {
        const asked = Array.isArray(this.description?.layouts) ? this.description.layouts.map(String) : [];
        const kinds = asked.filter((kind) => Object.hasOwn(KINDS, kind));
        return kinds.length ? kinds : ["table"];
    }

    get kind() {
        const asked = this.query.view?.type;
        if (this.kinds.includes(asked)) return asked;
        // Without a view in the query, the layout the view draws (a page that
        // wrote layout="board").
        const drawn = this.view.layoutKind;
        return this.kinds.includes(drawn) ? drawn : this.kinds[0];
    }

    // A kind the view cannot draw yet (no layout of the set holds it): shown
    // disabled, its name and the reason as the segment's name.
    drawable(kind) {
        return typeof this.view.canDrawLayout !== "function" || this.view.canDrawLayout(kind);
    }

    kindLabel(kind) {
        const name = this.text(`headKind${kind[0].toUpperCase()}${kind.slice(1)}`);
        return this.drawable(kind) ? name : this.text("headKindUnavailable").replace("{name}", name);
    }

    get savedFilters() { return Array.isArray(this.view.savedFilters) ? this.view.savedFilters : []; }

    get savedViews() { return Array.isArray(this.view.savedViews) ? this.view.savedViews : []; }

    savedFilter(id) { return this.savedFilters.find((item) => String(item?.id) === String(id)) ?? null; }

    get openFilter() { return this.query.saved_filter ? this.savedFilter(this.query.saved_filter) : null; }

    get defaultFilterId() {
        const marked = this.savedFilters.find((item) => item?.default_for || item?.default === true);
        return marked ? String(marked.id) : null;
    }

    get chosen() {
        const asked = Array.isArray(this.query.filters_chosen) ? this.query.filters_chosen : Object.keys(this.query.filters ?? {});
        return asked.filter((key) => this.field(key));
    }

    get filters() { return this.query.filters ?? {}; }

    get anyCondition() { return this.chosen.some((key) => conditionActive(this.filters[key])); }

    // The open saved filter's conditions differ from what is on screen.
    get changed() {
        const open = this.openFilter;
        if (!open) return false;
        const active = (filters) => Object.fromEntries(Object.entries(filters ?? {}).filter(([, entry]) => conditionActive(entry)));
        return !same(active(open.filters), active(this.filters)) || !same(open.fields ?? [], this.chosen);
    }

    get currentView() {
        const id = this.query.view?.id;
        return this.savedViews.find((view) => view?.key === id) ?? this.savedViews[0] ?? null;
    }

    get createItems() {
        const items = this.table?.createItems;
        return Array.isArray(items) ? items : [];
    }

    get creatable() { return this.view.hostOffers("create-record") && this.view._queryRefused !== true; }

    get listMenu() {
        const allowed = this.permissions;
        return [
            allowed.record_fields ? {id: "record-fields", text: this.text("headRecordFields"), icon: "list_alt"} : null,
            allowed.rights ? {id: "rights", text: this.text("headRights"), icon: "lock"} : null,
            allowed.export ? {id: "export", text: this.text("headExport"), icon: "download"} : null,
        ].filter(Boolean);
    }

    // ---------- drawing ----------

    // The rows, once per mode; render() fills them.
    _build() {
        if (!this.root) return;
        this._closeAll();
        const size = esc(this.size);
        const phone = this.mode === "phone";
        const outline = 'appearance="outline" scheme="on-surface"';
        const pop = (name, placement, trigger) => `<sf-popover data-pop="${name}" placement="${placement}" width="22rem" offset="var(--sf-space-1\\/4)">${trigger}<div slot="content" data-body></div></sf-popover>`;
        this.root.toggleAttribute("data-phone", phone);
        this.root.innerHTML = phone
            ? `<div class="sf-view-head-title" data-title>
                 <h2 class="sf-view-head-name"><span data-name></span><sf-badge data-count size="1/2" appearance="tonal" scheme="primary" hidden></sf-badge></h2>
                 <div class="sf-view-head-title-end">
                   <sf-button-icon class="sf-view-head-kind-menu" data-kind-menu size="${size}" ${outline} icon="table_rows" aria-haspopup="menu"></sf-button-icon>
                   <sf-button-icon class="sf-view-head-tune" data-head-open="view" size="${size}" ${outline} icon="tune"></sf-button-icon>
                   <sf-button-icon class="sf-view-head-more" data-list-menu size="${size}" appearance="ghost" scheme="on-surface" icon="more_vert" aria-haspopup="menu" hidden></sf-button-icon>
                 </div>
               </div>
               <div class="sf-view-head-row">
                 <sf-button-icon class="sf-view-head-filter-icon" data-head-open="filter" size="${size}" icon="filter_list"></sf-button-icon>
                 <div class="sf-view-head-search"><sf-input data-search appearance="filled" size="${size}" icon-start="search" input-type="search" clearable></sf-input></div>
                 <sf-button-icon class="sf-view-head-create" data-create size="${size}" icon="add" aria-haspopup="menu" hidden></sf-button-icon>
               </div>
               <div class="sf-view-head-fields" data-fields hidden></div>
               <sf-drawer data-sheet placement="bottom"><div slot="content" data-body></div></sf-drawer>
               <sf-drawer data-record placement="bottom"><div slot="content" data-body></div></sf-drawer>`
            : `<div class="sf-view-head-title" data-title>
                 <h2 class="sf-view-head-name"><span data-name></span><sf-badge data-count size="1/2" appearance="tonal" scheme="primary" hidden></sf-badge></h2>
                 <div class="sf-view-head-title-end">
                   <sf-button class="sf-view-head-views" data-views size="${size}" ${outline} icon-start="bookmarks" icon-end="expand_more" aria-haspopup="menu" hidden></sf-button>
                   <sf-segmented data-kinds size="${size}" hidden></sf-segmented>
                   ${pop("view", "bottom-end", `<sf-button slot="trigger" class="sf-view-head-customize" size="${size}" ${outline} icon-start="tune"></sf-button>`)}
                   <sf-button-icon class="sf-view-head-more" data-list-menu size="${size}" appearance="ghost" scheme="on-surface" icon="more_vert" aria-haspopup="menu" hidden></sf-button-icon>
                 </div>
               </div>
               <div class="sf-view-head-row">
                 <div class="sf-view-head-start">
                   <div class="sf-view-head-join" data-filter-group>
                     ${pop("filter", "bottom-start", `<sf-button slot="trigger" class="sf-view-head-filter" size="${size}" segment="start" icon-start="filter_list"></sf-button>`)}
                     ${pop("save", "bottom-start", `<sf-button-icon slot="trigger" class="sf-view-head-save" size="${size}" segment="end" icon="bookmark_add"></sf-button-icon>`)}
                   </div>
                   <div class="sf-view-head-fields" data-fields></div>
                 </div>
                 <div class="sf-view-head-end">
                   <div class="sf-view-head-search"><sf-input data-search appearance="filled" size="${size}" icon-start="search" input-type="search" clearable></sf-input></div>
                   <sf-button class="sf-view-head-create" size="${size}" icon-start="add" hidden></sf-button>
                 </div>
               </div>
               <sf-drawer data-record placement="inline-end" size="2"><div slot="content" data-body></div></sf-drawer>`;
        // A body moves with its window (sf-drawer takes its content out of the
        // host), so each body listens for itself.
        for (const body of this.root.querySelectorAll("[data-body]")) this._bindBody(body);
        // sf-drawer renders its content into a portal: keep the bodies now.
        this._sheetBody = this.root.querySelector("sf-drawer[data-sheet] [data-body]");
        this._recordBody = this.root.querySelector("sf-drawer[data-record] [data-body]");
        this._fieldsKey = null;
        this.render();
    }

    render() {
        const root = this.root;
        if (!root || !this.mode) return;
        const phone = this.mode === "phone";
        const refused = this.view._queryRefused === true;
        root.hidden = !this.view.renders("toolbar");
        const one = (selector) => root.querySelector(selector);
        const set = (node, name, value) => {
            if (!node) return;
            if (value === null || value === undefined || value === false) node.removeAttribute(name);
            else if (node.getAttribute(name) !== String(value)) node.setAttribute(name, String(value));
        };

        // The title row.
        const name = this.view.getAttribute("heading") || this.view.getAttribute("aria-label") || "";
        const nameNode = one("[data-name]");
        if (nameNode && nameNode.textContent !== name) nameNode.textContent = name;
        const count = one("[data-count]");
        const total = this.view._answered && this.view.countKnown !== false && !refused ? this.view.total : null;
        set(count, "hidden", total === null ? "" : null);
        if (total !== null) {
            set(count, "text", this.view._shownTotal ? this.view._shownTotal(total) : String(total));
            set(count, "aria-label", this.text("headCount").replace("{count}", String(total)));
        }
        const views = one(".sf-view-head-views");
        const current = this.currentView;
        set(views, "hidden", this.savedViews.length || this.view.hostOffers("saved-views") ? null : "");
        set(views, "text", current?.label ?? current?.name ?? this.text("headViews"));
        set(views, "title", this.text("headViews"));
        const kinds = one("[data-kinds]");
        if (kinds) {
            const items = this.kinds.map((kind) => ({id: kind, value: kind, label: this.text(`headKind${kind[0].toUpperCase()}${kind.slice(1)}`), icon: KINDS[kind],
                ...(this.drawable(kind) ? {} : {disabled: true, ariaLabel: this.kindLabel(kind)})}));
            set(kinds, "hidden", items.length > 1 ? null : "");
            set(kinds, "items", JSON.stringify(items));
            set(kinds, "value", this.kind);
            set(kinds, "aria-label", this.text("headDisplay"));
        }
        const kindMenu = one(".sf-view-head-kind-menu");
        set(kindMenu, "icon", KINDS[this.kind]);
        set(kindMenu, "aria-label", this.text("headDisplayMenu"));
        const customize = one(".sf-view-head-customize");
        set(customize, "text", this.text("headCustomize"));
        set(one(".sf-view-head-tune"), "aria-label", this.text("headCustomize"));
        const listMenu = one(".sf-view-head-more");
        set(listMenu, "hidden", this.listMenu.length ? null : "");
        set(listMenu, "aria-label", this.text("headListMenu"));

        // The head row.
        const open = this.openFilter;
        const dot = this.changed ? " •" : "";
        const filterName = open && String(open.id) !== this.defaultFilterId ? String(open.name ?? "") : "";
        const filterText = filterName ? this.text("headFilterNamed").replace("{name}", filterName) : this.text("headFilter");
        const filterTitle = filterName ? `${filterText}${dot ? ` ${this.text("headFilterChanged")}` : ""}` : null;
        // «Filter» is outline; with conditions set it is toned (C301 (3)).
        const look = this.anyCondition ? {appearance: "tonal", scheme: "primary"} : {appearance: "outline", scheme: "on-surface"};
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
        if (search && !search.contains(document.activeElement) && (search.value ?? "") !== typed) search.value = typed;
        const create = one(".sf-view-head-create");
        set(create, "hidden", this.creatable ? null : "");
        set(create, phone ? "aria-label" : "text", this.text("headCreate"));
        if (!phone) {
            // Only «Create» is filled (C301 (3)); its other items are its split menu.
            const items = this.createItems;
            const menu = items.map((item) => ({id: String(item.id), text: String(item.name ?? item.label ?? item.id), icon: item.icon ?? "add"}));
            set(create, "split", menu.length > 1 ? "" : null);
            set(create, "menu", menu.length > 1 ? JSON.stringify(menu.slice(1)) : null);
        }
        this._renderFields();
        // An open window shows the state it was opened over.
        if (this.open && !this.open.kind.startsWith("value:") && this.open.kind !== "save" && !this.open.kind.startsWith("rename:")) this._renderOpen();
    }

    // The filter fields (C300): a joined sf-button + sf-button-icon per chosen
    // field -- the name, colour when a condition is set, the number of values
    // chosen; the condition in words only in its tooltip and its window.
    _renderFields() {
        const box = this.root?.querySelector("[data-fields]");
        if (!box) return;
        const phone = this.mode === "phone";
        const size = esc(this.size);
        const open = this.openFilter;
        const filterName = open && String(open.id) !== this.defaultFilterId ? String(open.name ?? "") : "";
        const key = JSON.stringify([this.chosen, this.chosen.map((name) => this.filters[name] ?? null), filterName, this.changed, this.mode, this.text("headClear")]);
        if (key === this._fieldsKey) return;
        // A field's window that is open stays open: it is redrawn when it closes.
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
            const entry = this.filters[name];
            const count = conditionCount(entry);
            const look = `appearance="tonal" scheme="${count ? "primary" : "on-surface"}"`;
            const words = count ? this._conditionWords(field, entry) : "";
            const title = words ? `${field.label}: ${words}` : "";
            const button = `<sf-button ${phone ? "" : 'slot="trigger" '}data-field="${esc(name)}" size="${size}" segment="start" ${look} text="${esc(count ? `${field.label} ${count}` : field.label)}"${title ? ` title="${esc(title)}"` : ""}></sf-button>`;
            const remove = `<sf-button-icon data-unchoose="${esc(name)}" size="${size}" segment="end" icon="close" ${look} aria-label="${esc(this.text("headRemoveField").replace("{name}", field.label))}"></sf-button-icon>`;
            parts.push(`<div class="sf-view-head-join">${phone ? button : `<sf-popover data-pop="value:${esc(name)}" placement="bottom-start" width="20rem" offset="var(--sf-space-1\\/4)">${button}<div slot="content" data-body></div></sf-popover>`}${remove}</div>`);
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
    }

    // The condition in words (C293, C294, C300): the Framework's own chip words
    // where the pair has them, else the values' labels or the operator and value.
    _conditionWords(field, entry) {
        const own = globalThis.SF?.fieldRenderers?.dateFilterChipText;
        if (typeof own === "function" && DATE_TYPES.has(fieldType(field))) {
            try {
                const words = own(field, entry, this.view);
                if (words) return String(words);
            } catch {
                // the pair's words are an extra; the plain words follow
            }
        }
        const options = this._options(field);
        if (Array.isArray(entry?.values)) {
            return entry.values.map((value) => options.find((option) => String(option.value) === String(value))?.label ?? value).join(", ");
        }
        const value = Array.isArray(entry?.value) ? entry.value.filter((item) => item !== "").join(" – ") : entry?.value === true ? "" : String(entry?.value ?? "");
        const operator = entry?.operator && entry.operator !== "eq" ? this._operator(entry.operator, field) : "";
        return [operator, value].filter(Boolean).join(" ");
    }

    // The operator words are the table's (its lang: Позже, Не раньше...).
    _operator(operator, field) {
        return this.table?.getFilterOperatorLabel?.(operator, field) ?? String(operator);
    }

    _options(field) {
        const options = field?.filter?.options ?? field?.options ?? field?.filter?.optionsSource?.items ?? [];
        return Array.isArray(options) ? options.map((option) => (typeof option === "object" ? {...option, value: option.value ?? option.id ?? option.key, label: option.label ?? option.title ?? option.name ?? String(option.value ?? option.id ?? "")} : {value: option, label: String(option)})) : [];
    }

    // A long saved filter name is cut with «…» and said whole in the tooltip
    // (C301 (2)). The cut is sf-button's own (overflow="truncate" with
    // max-width, SIMAI Framework FW-LH-1); a pair whose sf-button does not
    // declare it draws the whole name, with the same tooltip.
    _truncate(node, width) {
        const Button = globalThis.customElements?.get?.("sf-button");
        if (!node || !Button?.observedAttributes?.includes?.("overflow")) return;
        if (node.getAttribute("overflow") !== "truncate") node.setAttribute("overflow", "truncate");
        if (node.getAttribute("max-width") !== width) node.setAttribute("max-width", width);
    }

    // ---------- windows ----------

    _closeAll() {
        this.open = null;
        for (const popover of this.root?.querySelectorAll("sf-popover") ?? []) {
            if (popover.open || popover.hasAttribute("open")) popover.close?.("api");
        }
        for (const drawer of [...(this.root?.querySelectorAll("sf-drawer") ?? []), ...this._drawers()]) {
            if (drawer.open || drawer.hasAttribute("open")) drawer.close?.("api");
        }
    }

    _drawers() { return [this._sheet, this._recordDrawer].filter(Boolean); }

    get _sheet() { return this._sheetNode?.isConnected ? this._sheetNode : (this._sheetNode = this.root?.querySelector("sf-drawer[data-sheet]") ?? this._sheetNode); }

    get _recordDrawer() { return this._recordNode?.isConnected ? this._recordNode : (this._recordNode = this.root?.querySelector("sf-drawer[data-record]") ?? this._recordNode); }

    _bindBody(body) {
        if (body.__sfViewHead) return;
        body.__sfViewHead = true;
        body.addEventListener("click", (event) => this._onPanelClick(event, body));
        body.addEventListener("change", (event) => this._onPanelChange(event, body));
        body.addEventListener("input", (event) => this._onPanelInput(event, body));
        body.addEventListener("sf-tabs-change", (event) => this._onTabs(event, body));
    }

    _onPopoverOpen(event) {
        const popover = event.target?.closest?.("sf-popover[data-pop]");
        if (!popover || !this.root?.contains(popover)) return;
        const kind = popover.getAttribute("data-pop");
        if (kind === "view" || kind === "filter" || kind === "save") popover.setAttribute("label", this._title(kind));
        this._show(kind, popover, popover.querySelector("[data-body]"));
    }

    _onPopoverClosed(event) {
        const popover = event.target?.closest?.("sf-popover[data-pop]");
        if (!popover || this.open?.host !== popover) return;
        this.open = null;
        this.temp = {};
        if (this._fieldsDirty) this._renderFields();
    }

    // A window by kind: on the phone the bottom sheet, on a desktop the
    // popover of the button that opened it (or the record drawer).
    async _openKind(kind) {
        if (kind === "record-fields") {
            const drawer = this._recordDrawer;
            if (!drawer) return;
            await this.view._ensureElements?.(["sf-drawer", "sf-tabs", "sf-button-icon", "sf-icon"]);
            drawer.setAttribute("heading", this._title(kind));
            this._show(kind, drawer, drawer.querySelector("[data-body]") ?? this._recordBody);
            this._recordBody = drawer.querySelector("[data-body]") ?? this._recordBody;
            drawer.open?.();
            return;
        }
        if (this.mode === "phone") {
            const sheet = this._sheet;
            if (!sheet) return;
            await this.view._ensureElements?.(["sf-drawer"]);
            sheet.setAttribute("heading", this._title(kind));
            const body = sheet.querySelector("[data-body]") ?? this._sheetBody;
            this._sheetBody = body;
            this._show(kind, sheet, body);
            if (!(sheet.open || sheet.hasAttribute("open"))) sheet.open?.();
            return;
        }
        const popover = this.root?.querySelector(`sf-popover[data-pop="${CSS.escape(kind)}"]`)
            ?? this.root?.querySelector('sf-popover[data-pop="filter"]');
        if (!popover) return;
        if (popover.getAttribute("data-pop") !== kind) {
            // a window without its own button (rename) opens in the filter's
            this._show(kind, popover, popover.querySelector("[data-body]"));
        }
        if (!(popover.open || popover.hasAttribute("open"))) popover.show?.();
        else if (popover.getAttribute("data-pop") === kind) this._renderOpen();
    }

    _show(kind, host, body) {
        if (!body) return;
        if (this.open?.kind !== kind) this.temp = {};
        this.open = {kind, host, body};
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
        if (kind === "view") return this.text("headCustomize");
        if (kind === "record-fields") return this.text("headRecordFields");
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
        open.body.innerHTML = this._panel(kind);
    }

    _foot(apply, reset) {
        const size = esc(this.size);
        // Apply first, then Reset (the set's window footers, view round 1 D3).
        return `<div class="sf-view-head-foot"><sf-button data-act="${esc(apply[0])}" size="${size}" text="${esc(apply[1])}"></sf-button><sf-button data-act="${esc(reset[0])}" size="${size}" appearance="outline" scheme="on-surface" text="${esc(reset[1])}"></sf-button></div>`;
    }

    _note(text) { return `<p class="sf-view-head-note">${esc(text)}</p>`; }

    _panel(kind) {
        const size = esc(this.size);
        if (kind === "filter") {
            const items = [{id: "saved", label: this.text("headSavedTab")}, {id: "fields", label: this.text("headFieldsTab")}];
            return `<sf-tabs data-tabs="filter" type="underline" size="${size}" fit="always" active-index="${this.tab.filter === "fields" ? 1 : 0}" items="${esc(JSON.stringify(items))}"></sf-tabs>`
                + `<div class="sf-view-head-panel" data-tab-body>${this._panel(this.tab.filter === "fields" ? "filter:fields" : "filter:saved")}</div>`;
        }
        if (kind === "filter:saved") {
            if (!this.savedFilters.length) return this._note(this.text("headNoSaved"));
            const open = this.query.saved_filter == null ? null : String(this.query.saved_filter);
            return `<div class="sf-view-head-list" role="radiogroup" aria-label="${esc(this.text("headSavedTab"))}">${this.savedFilters.map((item) => {
                const id = String(item.id);
                const label = `${item.name ?? id}${id === open && this.changed ? " •" : ""}`;
                const marks = [
                    id === this.defaultFilterId ? `<sf-icon icon="push_pin" size="1/2" aria-label="${esc(this.text("headDefaultMark"))}" title="${esc(this.text("headDefaultMark"))}"></sf-icon>` : "",
                    item.shared || item.kind === "shared" ? `<sf-icon icon="group" size="1/2" aria-label="${esc(this.text("headSharedMark"))}" title="${esc(item.owner_name ? `${this.text("headSharedMark")}: ${item.owner_name}` : this.text("headSharedMark"))}"></sf-icon>` : "",
                ].join("");
                return `<div class="sf-view-head-saved"><sf-radio data-saved="${esc(id)}" size="${size}" name="sf-view-head-saved" value="${esc(id)}" label="${esc(label)}"${id === open ? " checked" : ""}></sf-radio>${marks}`
                    + `<sf-button-icon data-saved-menu="${esc(id)}" size="${size}" icon="more_vert" appearance="ghost" scheme="on-surface" aria-haspopup="menu" aria-label="${esc(this.text("headFilterActions").replace("{name}", item.name ?? id))}"></sf-button-icon></div>`;
            }).join("")}</div>`;
        }
        if (kind === "filter:fields") {
            const chosen = new Set(this.chosen);
            return `<div class="sf-view-head-list">${this.fields.map((field) => `<sf-checkbox data-choose="${esc(field.key)}" size="${size}" label="${esc(field.label)}"${chosen.has(field.key) ? " checked" : ""}></sf-checkbox>`).join("")}</div>`
                + this._foot(["fields-apply", this.text("headApply")], ["fields-reset", this.text("headReset")]);
        }
        if (kind === "save") {
            const open = this.openFilter;
            const mine = open && (open.kind === "own" || open.mine === true);
            return this._note(this.text("headSaveNote"))
                + `<sf-input data-name size="${size}" label="${esc(this.text("headSaveName"))}"></sf-input>`
                + `<sf-checkbox data-default size="${size}" label="${esc(this.text("headSaveDefault"))}"></sf-checkbox>`
                + (this.permissions.share_filters ? `<sf-checkbox data-shared size="${size}" label="${esc(this.text("headSaveShared"))}" description="${esc(this.text("headSaveSharedHint"))}"></sf-checkbox>` : "")
                + (mine && this.changed ? `<sf-button data-act="filter-update" size="${size}" appearance="ghost" scheme="primary" text="${esc(this.text("headUpdateFilter").replace("{name}", open.name ?? open.id))}"></sf-button>` : "")
                + this._foot(["filter-save", this.text("headSave")], ["close", this.text("headCancel")]);
        }
        if (kind.startsWith("rename:")) {
            const item = this.savedFilter(kind.slice(7));
            return `<sf-input data-name size="${size}" label="${esc(this.text("headSaveName"))}" value="${esc(item?.name ?? "")}"></sf-input>`
                + this._foot(["filter-rename", this.text("headSave")], ["close", this.text("headCancel")]);
        }
        if (kind.startsWith("saved:")) {
            const item = this.savedFilter(kind.slice(6));
            return `<div class="sf-view-head-actions">${this._savedMenu(item).filter((entry) => !entry.kind).map((entry) => `<sf-button data-saved-act="${esc(entry.id)}" data-saved-id="${esc(item.id)}" size="${size}" appearance="ghost" scheme="${entry.status === "danger" ? "primary" : "on-surface"}"${entry.status === "danger" ? ' status="danger"' : ""} icon-start="${esc(entry.icon)}" text="${esc(entry.text)}"></sf-button>`).join("")}</div>`;
        }
        if (kind === "view") return this._viewPanel();
        if (kind === "record-fields") return this._recordPanel();
        return "";
    }

    // «Customize view» by display kind (LH-7), at the levels of C298: a
    // personal change applies at once; «Save for everyone» only where the host
    // allows; a locked setting shows a lock; «Reset to everyone's» resets one's own.
    _viewPanel() {
        const size = esc(this.size);
        const kind = this.kind;
        const settings = this._kindSettings(kind);
        const locked = new Set(this._locked());
        const lock = (key) => (locked.has(key) || locked.has(`layouts.${kind}.${key}`) ? ` disabled data-locked` : "");
        const lockMark = (key) => (lock(key) ? `<sf-icon icon="lock" size="1/2" aria-label="${esc(this.text("headLocked"))}" title="${esc(this.text("headLocked"))}"></sf-icon>` : "");
        const title = (key, text) => `<p class="sf-view-head-sub">${esc(text)}${lockMark(key)}</p>`;
        const radios = (key, list, current) => `<div class="sf-view-head-list" role="radiogroup" aria-label="${esc(key)}">${list.map(([value, label]) => `<sf-radio data-setting="${esc(key)}" size="${size}" name="sf-view-head-${esc(key)}" value="${esc(value)}" label="${esc(label)}"${String(value) === String(current) ? " checked" : ""}${lock(key)}></sf-radio>`).join("")}</div>`;
        const checks = (key, list, current) => `<div class="sf-view-head-list">${list.map(([value, label]) => `<sf-checkbox data-setting="${esc(key)}" data-value="${esc(value)}" size="${size}" label="${esc(label)}"${current.includes(String(value)) ? " checked" : ""}${lock(key)}></sf-checkbox>`).join("")}</div>`;
        const described = Array.isArray(this.description?.fields) ? this.description.fields : this.fields;
        const fieldsOf = (test) => described.filter((field) => test(fieldType(field))).map((field) => [field.key, field.label ?? field.key]);
        const all = described.map((field) => [field.key, field.label ?? field.key]);
        let body = "";
        if (kind === "table") {
            const columns = (this.view.columns ?? []).map((column) => [column.key, column.label ?? column.key]);
            const actions = (this.view.rowActionCatalog ?? []).map((action) => [action.id, action.label ?? action.id]);
            body = title("columns", this.text("headColumns")) + checks("columns", columns, settings.columns)
                + (actions.length ? title("row_actions", this.text("headRowActions")) + checks("row_actions", actions, settings.row_actions) : "");
        } else if (kind === "board") {
            body = title("lane_field", this.text("headLaneField")) + radios("lane_field", fieldsOf((type) => LIST_TYPES.has(type)), settings.lane_field)
                + title("card_fields", this.text("headCardFields")) + checks("card_fields", all, settings.card_fields)
                + `<sf-checkbox data-setting="empty_lanes" size="${size}" label="${esc(this.text("headEmptyLanes"))}"${settings.empty_lanes ? " checked" : ""}${lock("empty_lanes")}></sf-checkbox>`;
        } else if (kind === "cards") {
            body = title("size", this.text("headCardSize")) + radios("size", [["s", this.text("headSizeS")], ["m", this.text("headSizeM")]], settings.size)
                + title("card_fields", this.text("headCardFields")) + checks("card_fields", all, settings.card_fields);
        } else if (kind === "calendar") {
            body = title("date_field", this.text("headDateField")) + radios("date_field", fieldsOf((type) => DATE_TYPES.has(type)), settings.date_field)
                + title("week_start", this.text("headWeekStart")) + radios("week_start", [["mon", this.text("headWeekMon")], ["sun", this.text("headWeekSun")]], settings.week_start)
                + title("colour_field", this.text("headColourField")) + radios("colour_field", [...fieldsOf((type) => LIST_TYPES.has(type)), ["", this.text("headColourNone")]], settings.colour_field ?? "");
        }
        const viewName = this.currentView?.label ?? this.currentView?.name ?? "";
        const kindName = this.text(`headKind${kind[0].toUpperCase()}${kind.slice(1)}`);
        return this._note(`${viewName ? `${viewName} · ` : ""}${kindName}. ${this.text("headCustomizeNote")}`) + body
            + `<div class="sf-view-head-foot" data-one><sf-button data-act="view-reset" size="${size}" appearance="outline" scheme="on-surface" text="${esc(this.text("headResetToShared"))}"></sf-button>`
            + (this.permissions.shared_settings ? `<sf-button data-act="view-share" size="${size}" text="${esc(this.text("headSaveForAll"))}"></sf-button>` : "")
            + "</div>";
    }

    _locked() {
        const config = this.view.viewConfig;
        return [...(Array.isArray(config?.locked) ? config.locked : []), ...(Array.isArray(this.view.lockedSettings) ? this.view.lockedSettings : [])].map(String);
    }

    // What a display kind's settings are now: the view's document
    // (view-config/1 layouts.<kind>), what the person changed here, else what
    // the list shows.
    _kindSettings(kind) {
        const config = this.view.viewConfig?.layouts?.[kind] ?? {};
        const own = this._settings?.[kind] ?? {};
        const merged = {...copy(config), ...copy(own)};
        if (kind === "table") {
            const visible = this.view.viewConfig?.fields?.visible;
            merged.columns ??= (Array.isArray(visible) ? visible : (this.view.columns ?? []).filter((column) => column.visible !== false).map((column) => column.key)).map(String);
            merged.row_actions ??= (this.view.rowActionCatalog ?? []).map((action) => String(action.id));
        }
        if (kind === "board") { merged.card_fields ??= []; merged.empty_lanes ??= true; }
        if (kind === "cards") { merged.size ??= "s"; merged.card_fields ??= []; }
        if (kind === "calendar") merged.week_start ??= "mon";
        for (const key of ["columns", "row_actions", "card_fields"]) if (Array.isArray(merged[key])) merged[key] = merged[key].map(String);
        return merged;
    }

    // Record field settings (LH-8): the owner's «Настройки полей» in a right
    // drawer -- groups as tabs, shown and hidden fields, «Add field», «Restore
    // default fields»; only with the right (permissions.record_fields; Larena
    // decides, C299).
    _recordPanel() {
        const size = esc(this.size);
        const groups = this._recordGroups();
        const ids = Object.keys(groups);
        if (!ids.length) return this._note(this.text("headNoRecordFields"));
        const tab = ids.includes(this.tab.record) ? this.tab.record : ids[0];
        this.tab.record = tab;
        const labels = this.description?.record_fields?.labels ?? {};
        const names = Object.fromEntries((Array.isArray(this.description?.fields) ? this.description.fields : this.fields).map((field) => [field.key, field.label ?? field.key]));
        const row = (key, shown) => {
            const label = names[key] ?? key;
            return `<div class="sf-view-head-record-row"><sf-icon icon="drag_indicator" size="1/2" aria-hidden="true"></sf-icon><span>${esc(label)}</span>`
                + `<sf-button-icon data-record-move="${esc(key)}" size="${size}" appearance="ghost" scheme="on-surface" icon="${shown ? "visibility" : "visibility_off"}" aria-label="${esc(this.text(shown ? "headHideField" : "headShowField").replace("{name}", label))}"></sf-button-icon></div>`;
        };
        const items = ids.map((id) => ({id, label: labels[id] ?? groups[id].label ?? id}));
        const group = groups[tab];
        return this._note(this.text("headRecordNote"))
            + (ids.length > 1 ? `<sf-tabs data-tabs="record" type="underline" size="${size}" fit="always" active-index="${ids.indexOf(tab)}" items="${esc(JSON.stringify(items))}"></sf-tabs>` : "")
            + `<div class="sf-view-head-list" data-unbound>${group.shown.map((key) => row(key, true)).join("")}<div class="sf-view-head-divider">${esc(this.text("headHidden"))}</div>${group.hidden.map((key) => row(key, false)).join("")}</div>`
            + `<div class="sf-view-head-buttons"><sf-button data-act="record-add" size="${size}" appearance="ghost" scheme="primary" icon-start="add" text="${esc(this.text("headAddField"))}"></sf-button>`
            + `<sf-button data-act="record-default" size="${size}" appearance="ghost" scheme="on-surface" icon-start="restart_alt" text="${esc(this.text("headFieldsDefault"))}"></sf-button></div>`
            + this._foot(["record-apply", this.text("headApply")], ["record-reset", this.text("headReset")]);
    }

    // The groups as the host describes them, in the shape the save takes
    // (study section 7: {groups: {<id>: {shown, hidden}}}).
    _recordGroups() {
        if (!this.recordGroups) {
            const groups = this.description?.record_fields?.groups;
            this.recordGroups = groups && typeof groups === "object" ? copy(groups) : {};
            for (const group of Object.values(this.recordGroups)) {
                group.shown = Array.isArray(group.shown) ? group.shown.map(String) : [];
                group.hidden = Array.isArray(group.hidden) ? group.hidden.map(String) : [];
            }
        }
        return this.recordGroups;
    }

    // A field's window: the Framework's filter template for the field's type,
    // over a pending copy of its condition, with Apply and Reset.
    async _renderValue(key, body) {
        const field = this.field(key);
        if (!field || !body) return;
        body.className = "sf-view-head-panel";
        body.setAttribute("data-kind", `value:${key}`);
        const renderers = globalThis.SF?.fieldRenderers?.renderFilterField
            ? globalThis.SF.fieldRenderers
            : await globalThis.SF?.whenFieldRenderers?.().catch(() => null);
        const render = globalThis.SF?.render;
        const html = globalThis.SF?.html;
        if (!renderers?.renderFilterField || !render || !html || this.open?.body !== body) return;
        const size = this.size;
        const host = {
            size,
            getFieldText: () => null,
            getFilterControlValue: () => ({...this.temp}),
            patchTempFilterValue: (_key, patch) => {
                this.temp = {...this.temp, ...patch};
                this._renderValue(key, body);
            },
            getFilterOperatorLabel: (operator) => this._operator(operator, field),
            getFilterOptionSearch: () => this.optionSearch[key] ?? "",
            patchTempFilterOptionSearch: (_key, search) => {
                this.optionSearch[key] = search;
                this._renderValue(key, body);
            },
            getVisibleFilterOptions: () => {
                const search = String(this.optionSearch[key] ?? "").trim().toLowerCase();
                return this._options(field).filter((option) => !search || String(option.label).toLowerCase().includes(search));
            },
            renderFilterOption: (_field, option, selected) => html`<sf-checkbox size=${size} label=${option.label}
                ?checked=${selected.has(option.value)}
                @change=${(event) => {
                    const values = new Set(this.temp.values ?? []);
                    if (event.target?.checked ?? event.detail?.checked) values.add(option.value);
                    else values.delete(option.value);
                    this.temp = {...this.temp, operator: this.temp.operator ?? field.filter?.defaultOperator ?? "in", values: [...values]};
                }}></sf-checkbox>`,
            getEndpointFilterPage: () => null,
            loadEndpointFilterPage: () => null,
        };
        const options = LIST_TYPES.has(fieldType(field)) && !field.filter?.options && !field.options && !field.filter?.optionsSource?.items
            ? {...field, filter: {...(field.filter ?? {}), options: this._options(field)}} : field;
        const words = this.temp && conditionActive(this.temp) ? this._conditionWords(field, this.temp) : "";
        render(html`
            <div class="sf-view-head-value">${renderers.renderFilterField(options, host)}</div>
            ${words ? html`<p class="sf-view-head-note">${words}</p>` : ""}
            <div class="sf-view-head-foot">
                <sf-button data-act="value-apply" size=${size} text=${this.text("headApply")}></sf-button>
                <sf-button data-act="value-reset" size=${size} appearance="outline" scheme="on-surface" text=${this.text("headReset")}></sf-button>
            </div>`, body);
    }

    // ---------- the menus ----------

    _savedMenu(item) {
        if (!item) return [];
        const id = String(item.id);
        const mine = item.kind === "own" || item.mine === true;
        const open = String(this.query.saved_filter ?? "") === id;
        const entries = [];
        if (mine) {
            entries.push({id: "rename", text: this.text("headRename"), icon: "edit"});
            entries.push({id: "update", text: this.text("headUpdate"), icon: "sync", disabled: !(open && this.changed)});
        }
        entries.push({id: "default", text: id === this.defaultFilterId ? this.text("headDefaultMark") : this.text("headMakeDefault"), icon: "push_pin", disabled: id === this.defaultFilterId});
        if (mine && (item.may_share || this.permissions.share_filters)) entries.push({id: "share", text: item.shared ? this.text("headUnshare") : this.text("headShare"), icon: item.shared ? "lock" : "group"});
        if (!mine && item.kind !== "system") entries.push({id: "copy", text: this.text("headCopy"), icon: "content_copy"});
        if (mine) {
            entries.push({kind: "separator"});
            entries.push({id: "delete", text: this.text("headDelete"), icon: "delete", status: "danger"});
        }
        return entries;
    }

    async _menu(anchor, label, entries) {
        const button = anchor?.querySelector?.("button") ?? anchor;
        const choice = await menuOpen({anchor: button, label, entries, size: this.size});
        return choice?.id ?? null;
    }

    // ---------- events ----------

    _onClick(event) {
        const target = event.target;
        if (!target?.closest) return;
        const unchoose = target.closest("[data-unchoose]");
        if (unchoose) {
            const key = unchoose.getAttribute("data-unchoose");
            const filters = {...this.filters};
            delete filters[key];
            this._query({filters_chosen: this.chosen.filter((name) => name !== key), filters});
            return;
        }
        if (target.closest("[data-clear]")) {
            const filters = {...this.filters};
            for (const key of this.chosen) delete filters[key];
            this._query({filters});
            return;
        }
        const field = target.closest("[data-field]");
        if (field && this.mode === "phone") {
            this._openKind(`value:${field.getAttribute("data-field")}`);
            return;
        }
        const opener = target.closest("[data-head-open]");
        if (opener) {
            this._openKind(opener.getAttribute("data-head-open"));
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
                this._menu(create, this.text("headCreate"), items.map((item) => ({id: String(item.id), text: String(item.name ?? item.id), icon: item.icon ?? "add"})))
                    .then((id) => { if (id !== null) this._create(id); });
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
        this.raise("view.create_record", {item: id === null || id === undefined ? null : String(id)});
    }

    async _viewsMenu(anchor) {
        const phone = this.mode === "phone";
        const current = this.currentView;
        const entries = [];
        if (phone) {
            for (const kind of this.kinds) {
                entries.push({id: `kind:${kind}`, text: this.text(`headKind${kind[0].toUpperCase()}${kind.slice(1)}`), icon: kind === this.kind ? "check" : KINDS[kind],
                    ...(this.drawable(kind) ? {} : {disabled: true, caption: this.kindLabel(kind)})});
            }
            if (this.savedViews.length) entries.push({kind: "separator"});
        }
        for (const view of this.savedViews) entries.push({id: `view:${view.key}`, text: String(view.label ?? view.name ?? view.key), icon: view === current ? "check" : "bookmarks"});
        if (this.view.hostOffers("saved-views")) {
            if (entries.length) entries.push({kind: "separator"});
            entries.push({id: "view:new", text: this.text("headViewNew"), icon: "add"});
        }
        if (!entries.length) return;
        const id = await this._menu(anchor, this.text(phone ? "headDisplayMenu" : "headViews"), entries);
        if (!id) return;
        if (id.startsWith("kind:")) return this._setKind(id.slice(5));
        if (id === "view:new") {
            const label = this.text("headViewNewName");
            return this.view.saveView?.({key: `view-${Date.now().toString(36)}`, label, settings: {filter_fields: this.chosen, layout: this.kind}});
        }
        const key = id.slice(5);
        const view = this.savedViews.find((item) => String(item.key) === key);
        const type = view?.settings?.layout && this.kinds.includes(view.settings.layout) && this.drawable(view.settings.layout) ? view.settings.layout : this.kind;
        // A view saved as a board opens as one (and a table view as a table):
        // the layout's own query first, then the view.
        if (type !== this.view.layoutKind && this.drawable(type)) this.view.switchLayout?.(type);
        this.view.query = {...this.view.query, view: {id: key, type}};
        this.view.openView?.(key);
    }

    async _listMenu(anchor) {
        const id = await this._menu(anchor, this.text("headListMenu"), this.listMenu);
        if (!id) return;
        if (id === "record-fields") return this._openKind("record-fields");
        // Rights and export are the host's pages: the view says which was asked.
        this.view.sfEmit?.("settings-open", {id});
    }

    // The display kind: the view swaps its layout live (table <-> board,
    // keeping the marks and the record card beside), then asks the host with
    // the new layout's query. A kind the view cannot draw is not offered.
    _setKind(kind) {
        if (!this.kinds.includes(kind) || kind === this.kind) return;
        if (!this.drawable(kind)) return this.render();
        const allowed = this.view.sfEmit?.("display-change", {kind, previous: this.kind}, {cancelable: true});
        if (allowed === false) return this.render();
        this.view.setAttribute("data-display", kind);
        this.view.switchLayout?.(kind, {refresh: false});
        this._query({view: {id: this.currentView?.key ?? null, type: kind}});
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
        clearTimeout(this._searchTimer);
        // The search text is never saved: it goes with the query only (C297).
        this._searchTimer = setTimeout(() => this._query({search: String(search.value ?? "")}), 300);
    }

    _onKey(event) {
        const search = event.target?.closest?.("[data-search]");
        if (!search || event.key !== "Escape" || !search.value) return;
        search.value = "";
        clearTimeout(this._searchTimer);
        this._query({search: ""});
    }

    _onSearchReset(event) {
        if (!event.target?.closest?.("[data-search]")) return;
        clearTimeout(this._searchTimer);
        this._query({search: ""});
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
        } else if (name === "record") {
            const ids = Object.keys(this._recordGroups());
            if (typeof id === "number" || /^\d+$/u.test(String(id))) id = ids[Number(id)];
            if (!id) return;
            this.tab.record = id;
            this._renderOpen();
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
        const setting = target?.closest?.("[data-setting]");
        if (setting && this.open?.kind === "view") {
            if (setting.hasAttribute("data-locked")) return;
            this._changeSetting(setting, body);
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
    }

    // A personal setting applies at once (C298): settings.save personal.
    _changeSetting(node, body) {
        const kind = this.kind;
        const key = node.getAttribute("data-setting");
        const current = this._kindSettings(kind);
        let value;
        if (node.localName === "sf-radio") {
            const checked = [...body.querySelectorAll(`sf-radio[data-setting="${CSS.escape(key)}"]`)].find((radio) => this._checked(radio));
            value = checked?.getAttribute("value") ?? "";
        } else if (node.hasAttribute("data-value")) {
            value = [...body.querySelectorAll(`sf-checkbox[data-setting="${CSS.escape(key)}"]`)].filter((box) => this._checked(box)).map((box) => box.getAttribute("data-value"));
        } else value = this._checked(node);
        if (same(current[key], value)) return;
        this._settings ??= {};
        this._settings[kind] = {...(this._settings[kind] ?? {}), [key]: value};
        this._saveSettings("personal", {[key]: value});
    }

    _saveSettings(layer, patch) {
        const view = this.currentView?.key ?? null;
        const config = this.view.viewConfig;
        this.raise("settings.save", {layer, view, type: this.kind, patch, ...(config?.revision != null ? {base_revision: config.revision} : {})});
    }

    _onPanelClick(event, body) {
        const target = event.target;
        if (!target?.closest) return;
        const menu = target.closest("[data-saved-menu]");
        if (menu) {
            const item = this.savedFilter(menu.getAttribute("data-saved-menu"));
            if (!item) return;
            if (this.mode === "phone") return this._openKind(`saved:${item.id}`);
            this._menu(menu, this.text("headFilterActions").replace("{name}", item.name ?? item.id), this._savedMenu(item))
                .then((id) => { if (id) this._savedAction(id, item); });
            return;
        }
        const savedAct = target.closest("[data-saved-act]");
        if (savedAct) {
            this._savedAction(savedAct.getAttribute("data-saved-act"), this.savedFilter(savedAct.getAttribute("data-saved-id")));
            return;
        }
        const move = target.closest("[data-record-move]");
        if (move) {
            const group = this._recordGroups()[this.tab.record];
            const key = move.getAttribute("data-record-move");
            if (!group) return;
            const at = group.shown.indexOf(key);
            if (at >= 0) {
                group.shown.splice(at, 1);
                group.hidden.unshift(key);
            } else {
                group.hidden.splice(group.hidden.indexOf(key), 1);
                group.shown.push(key);
            }
            this._renderOpen();
            return;
        }
        const action = target.closest("[data-act]");
        if (!action) return;
        const act = action.getAttribute("data-act");
        const value = (selector) => this._value(body.querySelector(selector));
        switch (act) {
        case "close":
            this._closeOpen();
            return;
        case "fields-reset": {
            const open = this.openFilter;
            const keep = new Set(open?.fields ?? []);
            for (const box of body.querySelectorAll("sf-checkbox[data-choose]")) {
                const input = box.querySelector("input");
                if (input) input.checked = keep.has(box.getAttribute("data-choose"));
            }
            return;
        }
        case "fields-apply": {
            const keys = [...body.querySelectorAll("sf-checkbox[data-choose]")].filter((box) => this._checked(box)).map((box) => box.getAttribute("data-choose"));
            const filters = Object.fromEntries(Object.entries(this.filters).filter(([key]) => keys.includes(key)));
            this._closeOpen();
            this._query({filters_chosen: keys, filters});
            return;
        }
        case "value-reset": {
            const key = this.open.kind.slice(6);
            const filters = {...this.filters};
            delete filters[key];
            this._closeOpen();
            this._query({filters});
            return;
        }
        case "value-apply": {
            const key = this.open.kind.slice(6);
            const filters = {...this.filters};
            if (conditionActive(this.temp)) filters[key] = copy(this.temp);
            else delete filters[key];
            this._closeOpen();
            this._query({filters});
            return;
        }
        case "filter-save": {
            const name = value("[data-name]").trim();
            if (!name) {
                body.querySelector("[data-name]")?.setAttribute("status", "error");
                body.querySelector("[data-name] input")?.focus?.();
                return;
            }
            const filter = {name, fields: this.chosen, filters: this._activeFilters(), shared: this._checked(body.querySelector("[data-shared]")), default: this._checked(body.querySelector("[data-default]"))};
            this._closeOpen();
            this.raise("filter.save", {filter});
            return;
        }
        case "filter-update": {
            const open = this.openFilter;
            this._closeOpen();
            if (open) this.raise("filter.update", {id: open.id, fields: this.chosen, filters: this._activeFilters(), ...(open.revision != null ? {revision: open.revision} : {})});
            return;
        }
        case "filter-rename": {
            const id = this.open.kind.slice(7);
            const name = value("[data-name]").trim();
            if (!name) return;
            this._closeOpen();
            this.raise("filter.rename", {id, name});
            return;
        }
        case "view-reset":
            if (this._settings) delete this._settings[this.kind];
            this._saveSettings("personal", null);
            this._renderOpen();
            return;
        case "view-share":
            this._saveSettings("shared", this._kindSettings(this.kind));
            this._closeOpen();
            return;
        case "record-default":
        case "record-reset":
            this.recordGroups = null;
            this._renderOpen();
            return;
        case "record-add":
            this.view.sfEmit?.("settings-open", {id: "record-field-add"});
            return;
        case "record-apply":
            this.raise("entity.fields.save", {groups: copy(this._recordGroups())});
            this._closeOpen();
            return;
        default:
        }
    }

    _activeFilters() {
        return Object.fromEntries(this.chosen.filter((key) => conditionActive(this.filters[key])).map((key) => [key, copy(this.filters[key])]));
    }

    // Opening a saved filter puts its fields and conditions on screen; it
    // keeps the search (search AND filters).
    _useSaved(id) {
        const item = this.savedFilter(id);
        if (!item) return;
        this._query({saved_filter: String(item.id), filters_chosen: Array.isArray(item.fields) ? item.fields.map(String) : Object.keys(item.filters ?? {}), filters: copy(item.filters ?? {})});
        if (this.open?.kind === "filter") this._renderOpen();
    }

    _savedAction(id, item) {
        if (!item) return;
        if (id === "rename") return this._openKind(`rename:${item.id}`);
        if (this.mode === "phone" && this.open?.kind?.startsWith("saved:")) this._closeOpen();
        if (id === "update") return this.raise("filter.update", {id: item.id, fields: this.chosen, filters: this._activeFilters(), ...(item.revision != null ? {revision: item.revision} : {})});
        if (id === "default") return this.raise("filter.default", {id: item.id});
        if (id === "share") return this.raise("filter.share", {id: item.id, shared: !item.shared});
        if (id === "copy") return this.raise("filter.save", {filter: {name: `${item.name ?? item.id} ${this.text("headCopySuffix")}`, fields: item.fields ?? [], filters: copy(item.filters ?? {}), shared: false, default: false}});
        if (id === "delete") return this.raise("filter.delete", {id: item.id});
    }

    _query(patch) {
        this.view.changeQuery(patch, "head");
    }
}
