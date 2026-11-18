import {html, nothing} from "lit";
import {repeat} from "lit/directives/repeat.js";
import "./default.css";

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
// Framework's words in every language pack); an empty list is sf-empty-state.

function renderShape(shape, owner) {
    if (shape === null || shape === undefined || shape === false) return nothing;
    if (typeof shape === "string" || typeof shape === "number") return String(shape);
    if (Array.isArray(shape)) return html`<span class="sf-view-cards__values">${shape.map((item) => renderShape(item, owner))}</span>`;
    if (shape._$litType$ !== undefined) return shape;
    if (shape.component?.type) {
        const {component, props: own, ...meta} = shape;
        return owner.renderSmartElement(component.type, {...meta, ...(own ?? {}), ...(component.props ?? {})});
    }
    if (shape.text !== undefined) return String(shape.text);
    return nothing;
}

function renderCover(context, record) {
    const component = context.component;
    const cover = component.coverOf(record);
    // The frame keeps its ratio whether the picture has come or not (CD-3):
    // nothing below it moves when it arrives.
    return html`<div class="sf-view-cards__cover" aria-hidden="true">
        ${cover?.src ? html`<img class="sf-view-cards__image" src=${cover.src} alt="" loading="lazy" decoding="async"
                                width=${cover.width ?? nothing} height=${cover.height ?? nothing}>`
            : html`<span class="sf-view-cards__none">
                <sf-icon icon=${cover?.icon ?? "image_not_supported"} size="1" aria-hidden="true"></sf-icon>
                ${cover?.icon ? nothing : html`<span>${component.word("no-cover-text")}</span>`}
            </span>`}
    </div>`;
}

function renderControls(context, record, title) {
    const component = context.component;
    const id = String(record.id);
    const selected = context.selected.has(id);
    return html`
        ${context.selectable ? html`<span class="sf-view-cards__box">
            <sf-checkbox size=${context.size} data-box=${id} ?checked=${selected}
                         aria-label=${component.word("select-text", {title})}></sf-checkbox>
        </span>` : nothing}
        <span class="sf-view-cards__menu">
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="more_horiz"
                            data-menu=${id} aria-label=${component.word("card-menu-text", {title})}
                            tooltip=${component.word("actions-text")}></sf-button-icon>
        </span>`;
}

function renderField(context, field, record) {
    const component = context.component;
    const label = String(field.label ?? field.key);
    const shape = component.cellShape(field, record);
    if (shape === null && !context.labels) return html`<span class="sf-view-cards__field" data-key=${String(field.key)} data-empty></span>`;
    return html`<span class="sf-view-cards__field" data-key=${String(field.key)} data-align=${component.fieldAlign(field)}
                      title=${context.labels ? nothing : label}>${context.labels
        ? html`<span class="sf-view-cards__label">${label}</span>`
        : html`<span class="sr-only">${label}: </span>`}<span class="sf-view-cards__value">${renderShape(shape, component)}</span></span>`;
}

function renderCard(context, record, index) {
    const component = context.component;
    const id = String(record.id);
    const title = component.recordTitle(record);
    const selected = context.selected.has(id);
    const name = selected ? component.word("card-selected-label", {title}) : title;
    return html`
        <div class="sf-card sf-view-cards__card" role="listitem" data-id=${id} data-index=${String(index)}
             tabindex=${id === context.active ? "0" : "-1"}
             aria-posinset=${String(index + 1)} aria-setsize=${String(context.total)}
             aria-label=${name}
             ?data-selected=${selected} ?data-current=${id === context.current}
             ?data-flat=${!context.cover}>
            ${context.cover ? html`${renderCover(context, record)}${renderControls(context, record, title)}
                <div class="sf-view-cards__title">${title}</div>`
                : html`<div class="sf-view-cards__top"><div class="sf-view-cards__title">${title}</div>${renderControls(context, record, title)}</div>`}
            ${context.cardFields.length ? html`<div class="sf-view-cards__fields" ?data-labels=${context.labels}>
                ${context.cardFields.map((field) => renderField(context, field, record))}
            </div>` : nothing}
        </div>`;
}

// A card of the same lengths while the first records come (or a filtered
// list is asked again with nothing on screen).
function renderSkeleton(context) {
    return html`<div class="sf-card sf-view-cards__card sf-view-cards__skeleton" aria-hidden="true" ?data-flat=${!context.cover}>
        ${context.cover ? html`<div class="sf-view-cards__cover"></div>` : nothing}
        <sf-skeleton kind="text" count="3" width="90%,60%,40%" size="1/2" animation="pulse"></sf-skeleton>
    </div>`;
}

function renderEmpty(context) {
    const component = context.component;
    const state = context.empty;
    const actions = [];
    if (state.kind === "no-data" && context.creatable) actions.push({id: "create", text: component.word("create-text")});
    if (state.kind === "nothing-found") actions.push({id: "reset", text: component.word("reset-text"), appearance: "outline"});
    return html`<div class="sf-view-cards__empty">
        <sf-empty-state kind=${state.kind} size=${context.size === "1" ? "1" : "1/2"} text=${state.message || nothing}
                        icon=${state.kind === "nothing-found" ? "filter_alt_off" : nothing}
                        .actions=${state.kind === "error" ? null : actions}></sf-empty-state>
    </div>`;
}

function renderMore(context) {
    if (!context.more) return nothing;
    return html`<div class="sf-view-cards__more">
        <sf-pagination appearance="more" size=${context.size} bottom="false"
                       total=${String(Math.max(context.total, context.records.length))} page-size=${String(context.perPage)}
                       current=${String(context.portions)} has-next=${context.hasNext ? "true" : "false"}
                       count-known=${context.countKnown ? "true" : "false"}
                       ?show-more-busy=${context.loadingMore}></sf-pagination>
    </div>`;
}

function renderBulk(context) {
    const component = context.component;
    const count = context.selected.size;
    if (context.bulkActions) {
        // sf-bulk-actions (C295), where the pair carries it.
        return html`<sf-bulk-actions class="sf-view-cards__bulk-bar" size=${context.size} place="dock" count=${String(count)}
                                     page-count=${String(context.records.length)} total=${String(context.total)}
                                     .actions=${context.actions}></sf-bulk-actions>`;
    }
    // Without it (a pair before sf-bulk-actions): the same strip from
    // sf-button and sf-button-icon.
    return html`
        <div class="sf-view-cards__bulk" role="region" aria-label=${component.word("bulk-label")} ?hidden=${count === 0}>
            <span class="sf-view-cards__bulk-count">${component.word("selected-text", {count})}</span>
            ${context.actions.map((action) => html`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || nothing} text=${action.text ?? action.label ?? action.id} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-text")} tooltip=${component.word("clear-text")}></sf-button-icon>
        </div>`;
}

export function renderViewCardsTemplate(context) {
    const records = context.records;
    const skeleton = context.loading && !records.length;
    return html`
        <div class="sf-view-cards" data-size=${context.size} data-card-size=${context.cardSize} data-fit=${context.fit}
             data-density=${context.density} ?data-selecting=${context.selected.size > 0}
             style=${`--sf-view-cards-ratio: ${context.ratio}`}>
            ${context.empty && !skeleton ? renderEmpty(context) : html`
                <div class="sf-view-cards__grid" role="list" aria-label=${context.label} aria-busy=${context.loading ? "true" : "false"}>
                    ${skeleton ? Array.from({length: context.skeletons}, () => renderSkeleton(context))
                        : repeat(records, (record) => String(record.id), (record, index) => renderCard(context, record, index))}
                </div>
                ${skeleton ? nothing : renderMore(context)}`}
            <div class="sf-view-cards__live" role="status" aria-live="polite">${context.message}</div>
            ${context.selectable && (context.selected.size > 0 || !context.bulkActions) ? renderBulk(context) : nothing}
        </div>`;
}
