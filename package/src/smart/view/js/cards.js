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

export const CARDS_TAG = "sf-view-cards";
export const CARDS_PER_PAGE = 24;
// The first paint: as many cards as two rows of the widest grid hold.
export const FIRST_PAINT_CARDS = 8;

export const CARDS_EVENTS = Object.freeze([
    "sf-view-cards-open", "sf-view-cards-select", "sf-view-cards-more", "sf-view-cards-apply",
    "sf-view-cards-create", "sf-view-cards-reset", "sf-view-cards-refresh",
]);

const copy = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));

/** The cards element in the view's content slot. */
export function cardsOf(view) {
    const slot = view.shadowRoot?.querySelector?.('slot[name="content"]');
    return slot?.assignedElements?.().find((element) => element.localName === CARDS_TAG)
        ?? view.querySelector?.(`:scope > ${CARDS_TAG}[slot="content"]`) ?? null;
}

/** layouts.cards as the host's view answers it, else as the page gave it on the cards. */
export function cardsOptions(view) {
    const fromPage = cardsOf(view)?.options;
    return {...(fromPage && typeof fromPage === "object" ? fromPage : {}), ...(view._cardsHostOptions ?? {})};
}

/** The query the cards ask (CD-4): the page and window {page, per_page}. */
export function cardsQuery(view, query) {
    const asked = Number(cardsOptions(view).per_page);
    const perPage = Number.isSafeInteger(asked) && asked > 0 ? asked : CARDS_PER_PAGE;
    view.query.per_page = perPage;
    query.per_page = perPage;
    query.window = {page: Number.isSafeInteger(query.page) && query.page > 0 ? query.page : 1, per_page: perPage};
    return query;
}

/** The cards' part of an answer: layouts.cards of the view's settings. */
export function acceptCards(view, data) {
    const layouts = data?.view_config?.layouts ?? data?.layouts;
    if (layouts?.cards && typeof layouts.cards === "object") view._cardsHostOptions = copy(layouts.cards);
}

/** What the view knows, given to the cards (after every answer and state). */
export function syncCards(view) {
    const cards = cardsOf(view);
    if (!cards) return;
    cards.fields = view.columns ?? [];
    if (view._cardsHostOptions) cards.options = {...(cards.options ?? {}), ...view._cardsHostOptions};
    if (view._answered) cards.records = view.records ?? [];
    const refused = view._queryRefused === true;
    if (view.countKnown !== false && Number.isSafeInteger(view.total)) cards.setAttribute("total", String(view.total));
    else cards.removeAttribute("total");
    cards.setAttribute("count-known", view.countKnown === false ? "false" : "true");
    if (typeof view.hasNext === "boolean" && !(view.countKnown !== false && Number.isSafeInteger(view.total))) cards.setAttribute("has-next", view.hasNext ? "true" : "false");
    else cards.removeAttribute("has-next");
    syncCardsState(view, view.getAttribute?.("data-state") ?? "");
    cards.setAttribute("selectable", view.selects() && !refused ? "true" : "false");
    cards.setAttribute("creatable", view.hostOffers("create-record") && !refused ? "true" : "false");
    cards.actions = (view.bulkActions ?? []).map((item) => ({id: item.id ?? item.value, text: item.label ?? item.text ?? item.id ?? item.value, icon: item.icon}));
    cards.current = view._current ?? "";
    if (view.controlSize) cards.setAttribute("size", view.controlSize);
    if (!cards.hasAttribute("aria-label") && view.getAttribute("aria-label")) cards.setAttribute("aria-label", view.getAttribute("aria-label"));
}

/** The view's data state on the cards: loading, empty (and why), error, no-access. */
export function syncCardsState(view, state) {
    const cards = cardsOf(view);
    if (!cards || !state) return;
    if (state === "empty") cards.emptyContext = view._emptyContext();
    else if (state === "error") cards.emptyContext = {kind: "error", ...(view._queryMessage ? {message: view._queryMessage} : {})};
    else if (view._queryRefused) cards.emptyContext = {kind: "no-access", ...(view._queryMessage ? {message: view._queryMessage} : {})};
    // A «Показать ещё» that failed gives its button back.
    if (state !== "loading" && cards._loadingMore && view._answered) cards.records = view.records ?? [];
    const kind = view._queryRefused && state !== "loading" ? "no-access" : state;
    if (cards.getAttribute("data-state") !== kind) cards.setAttribute("data-state", kind);
}

/** The cards' events, answered as the table's are. */
export function onCardsEvent(view, event) {
    const cards = event.target?.closest?.(CARDS_TAG);
    if (!cards || cards !== cardsOf(view)) return undefined;
    const detail = event.detail ?? {};
    switch (event.type) {
    case "sf-view-cards-open":
        return view._openRecord(String(detail.id), {action_id: "view", record_ids: [String(detail.id)], record_id: String(detail.id)});
    case "sf-view-cards-more":
        return view.changeQuery({page: (Number(view.query.page) || 1) + 1}, "show-more");
    case "sf-view-cards-select":
        view._cardsSelection = Array.isArray(detail.ids) ? detail.ids.map(String) : [];
        return undefined;
    case "sf-view-cards-apply": {
        // The cards say ids as text; the records keep the host's own.
        const ids = (detail.ids ?? []).map((id) => (view.records ?? []).find((record) => String(record.id) === String(id))?.id ?? id);
        return view._action({action_id: String(detail.action), record_ids: ids}, {selectedBulk: detail.scope !== "record"});
    }
    case "sf-view-cards-create":
        return view._raise("view.create_record", {item: null});
    case "sf-view-cards-reset":
        return view.changeQuery({search: "", filters: {}}, "filter");
    case "sf-view-cards-refresh":
        return view.refresh("retry");
    default:
        return undefined;
    }
}

/** Whether the cards have drawn (the first paint stays until they have). */
export function cardsDrawn(view) {
    const cards = cardsOf(view);
    return Boolean(globalThis.customElements?.get?.(CARDS_TAG) && cards?.querySelector?.(".sf-view-cards > *"));
}

/**
 * The cards' first paint (CD-2): a grid of cards of the cards' own lengths,
 * a cover frame where the options give one, no table and no page row.
 */
export function cardsSkeleton(view, bar) {
    const cards = cardsOf(view);
    const options = cardsOptions(view);
    const size = ["s", "m", "l"].includes(cards?.getAttribute?.("card-size")) ? cards.getAttribute("card-size")
        : ["s", "m", "l"].includes(options.size) ? options.size : "m";
    const cover = options.cover_field !== null;
    const card = `<div>${cover ? '<span data-part="cover"></span>' : ""}${bar}${bar}${bar}</div>`;
    return `<div class="sf-data-view-skeleton-cards" data-card-size="${size}"${cover ? "" : " data-flat"}>${card.repeat(FIRST_PAINT_CARDS)}</div>`;
}
