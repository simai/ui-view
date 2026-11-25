import {html, nothing} from "lit";
import {repeat} from "lit/directives/repeat.js";
import "./default.css";

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
    if (shape === null || shape === undefined || shape === false) return nothing;
    if (typeof shape === "string" || typeof shape === "number") return String(shape);
    if (Array.isArray(shape)) return html`<span class="sf-view-board__values">${shape.map((item) => renderShape(item, owner))}</span>`;
    if (shape._$litType$ !== undefined) return shape;
    if (shape.component?.type) {
        const {component, props: own, ...meta} = shape;
        return owner.renderSmartElement(component.type, {...meta, ...(own ?? {}), ...(component.props ?? {})});
    }
    if (shape.text !== undefined) return String(shape.text);
    return nothing;
}

// A card is content the board gives sf-sortable, not sf-sortable's own
// picture: slot="item" says so to the first paint (a printed board whose
// sf-sortable code came first lost its cards; the snapshot and the first
// render leave slotted children alone). sf-sortable draws no shadow root, so
// the attribute changes nothing else.
function renderCard(context, lane, record) {
    const component = context.component;
    const id = String(record.id);
    const title = component.recordTitle(record);
    const selected = context.selected.has(id);
    return html`
        <div class="sf-card sf-view-board__card" slot="item"
             data-sf-sortable-item=${id} data-id=${id}
             ?data-pending=${context.pending.has(id)}
             ?data-selected=${selected}>
            <div class="sf-view-board__top">
                ${context.selectable ? html`<span class="sf-view-board__box">
                    <sf-checkbox size=${context.size} data-box=${id} ?checked=${selected}
                                 aria-label=${component.word("select-text", {title})}></sf-checkbox>
                </span>` : nothing}
                <button type="button" class="sf-view-board__title" data-open=${id}>${title}</button>
                <span class="sf-view-board__end"><sf-button-icon class="sf-view-board__menu" size=${context.size} appearance="ghost" scheme="on-surface-variant"
                                icon="more_horiz" data-menu=${id} aria-label=${component.word("card-menu-text", {title})}
                                tooltip=${component.word("actions-text")}></sf-button-icon></span>
            </div>
            ${context.cardFields.length ? html`<div class="sf-view-board__fields">
                ${context.cardFields.map((field) => html`<span class="sf-view-board__field" data-key=${String(field.key)}
                        data-align=${component.fieldAlign(field)}>${renderShape(component.cellShape(field, record), component)}</span>`)}
            </div>` : nothing}
        </div>`;
}

function renderLane(context, lane, index) {
    const component = context.component;
    const count = component.laneCountOf(lane);
    if (lane.collapsed && !context.phone) {
        return html`
            <button type="button" class="sf-view-board__folded" data-unfold=${lane.value} data-lane-index=${index}
                    aria-label=${component.word("expand-text", {lane: lane.label, count: lane.total})}>
                <span>${lane.label}</span><span>${lane.total}</span>
            </button>`;
    }
    const refusal = context.refusals.get(lane.value);
    const sums = component.laneSumsOf(lane);
    const shown = lane.records.length;
    const rest = Math.max(0, lane.total - shown);
    return html`
        <section class="sf-view-board__lane" data-lane=${lane.value} data-lane-index=${index}
                 ?data-over=${count.over} ?data-refuse=${Boolean(refusal)}
                 aria-label=${component.word("lane-label", {lane: lane.label, count: lane.total})}>
            <div class="sf-view-board__head">
                <div class="sf-view-board__row">
                    <sf-badge appearance="tonal" size=${context.size} text=${lane.label}
                              status=${lane.status || nothing} scheme=${lane.scheme || nothing}></sf-badge>
                    <span class="sf-view-board__count">${count.text}</span>
                    ${context.creatable ? html`<sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="add"
                            data-add=${lane.value} aria-label=${component.word("add-text", {lane: lane.label})}
                            tooltip=${component.word("add-short-text")}></sf-button-icon>` : nothing}
                    <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="more_horiz"
                            data-lanemenu=${lane.value} aria-label=${component.word("lane-menu-text", {lane: lane.label})}
                            tooltip=${component.word("lane-short-text")}></sf-button-icon>
                </div>
                ${sums.length ? html`<div class="sf-view-board__sum">${sums.join(" · ")}</div>`
                    : component.sumsAwaited ? html`<div class="sf-view-board__sum" data-pending aria-hidden="true">\u00a0</div>` : nothing}
            </div>
            <div class="sf-view-board__note" aria-hidden=${refusal ? "false" : "true"}>${refusal ? component.word("refuse-text", {reason: refusal}) : ""}</div>
            <div class="sf-view-board__body">
                <sf-sortable class="sf-view-board__list" id=${`${context.uid}-lane-${index}`} group=${context.uid}
                             label=${lane.label} data-lane=${lane.value}>
                    ${repeat(lane.records, (record) => String(record.id), (record) => renderCard(context, lane, record))}
                </sf-sortable>
                ${lane.total === 0 ? html`<div class="sf-view-board__empty">${component.word("empty-text")}</div>` : nothing}
            </div>
            ${rest > 0 ? html`<div class="sf-view-board__more">
                <sf-button size=${context.size} appearance="ghost" scheme="on-surface-variant" full-width
                           ?loading=${context.loadingLanes.has(lane.value)}
                           data-more=${lane.value} text=${component.word("more-text", {count: Math.min(rest, context.perLane)})}></sf-button>
            </div>` : nothing}
        </section>`;
}

function renderBulk(context) {
    const component = context.component;
    const count = context.selected.size;
    if (context.bulkActions) {
        // sf-bulk-actions (C295), where the pair carries it: «Выбрано N»,
        // «Переместить в…» first, the host's actions after it, × and Escape.
        return html`<sf-bulk-actions class="sf-view-board__bulk-bar" size=${context.size} place="dock" count=${count}
                                     .actions=${context.actions}></sf-bulk-actions>`;
    }
    // Without it (a pair before sf-bulk-actions): the same strip from
    // sf-button and sf-button-icon.
    return html`
        <div class="sf-view-board__bulk" role="region" aria-label=${component.word("bulk-label")} ?hidden=${count === 0}>
            <span class="sf-view-board__bulk-count">${component.word("selected-text", {count})}</span>
            ${context.actions.map((action) => html`<sf-button size=${context.size} appearance="outline" scheme="on-surface"
                    icon=${action.icon || nothing} text=${action.text} data-bulk=${action.id}></sf-button>`)}
            <sf-button-icon size=${context.size} appearance="ghost" scheme="on-surface-variant" icon="close"
                            data-clear aria-label=${component.word("clear-text")} tooltip=${component.word("clear-text")}></sf-button-icon>
        </div>`;
}

export function renderViewBoardTemplate(context) {
    const lanes = context.lanes;
    return html`
        <div class="sf-view-board" data-size=${context.size} ?data-phone=${context.phone}
             ?data-dragging=${context.dragging} ?data-selecting=${context.choosing}>
            ${context.phone ? html`<div class="sf-view-board__switch-row"><sf-tabs class="sf-view-board__switch" type="pills" size=${context.size} overflow="scroll"
                    aria-label=${component(context).word("lanes-label")} active-index=${String(context.phoneIndex)}
                    items=${JSON.stringify(lanes.map((lane) => ({id: lane.value, label: lane.label, count: lane.total})))}></sf-tabs>${context.selectable
                ? html`<sf-button class="sf-view-board__choose" data-choose size=${context.size} appearance="ghost" scheme=${context.choosing ? "primary" : "on-surface"}
                        icon-start=${context.choosing ? "check" : "checklist"} text=${component(context).word(context.choosing ? "choose-done-text" : "choose-text")}
                        aria-pressed=${context.choosing ? "true" : "false"}></sf-button>` : nothing}</div>` : nothing}
            <div class="sf-view-board__lanes" role="region" aria-label=${context.label}>
                ${lanes.map((lane, index) => renderLane(context, lane, index))}
            </div>
            <div class="sf-view-board__live" role="status" aria-live="polite">${context.message}</div>
            ${context.selectable && (context.selected.size > 0 || !context.bulkActions) ? renderBulk(context) : nothing}
        </div>`;
}

function component(context) {
    return context.component;
}
