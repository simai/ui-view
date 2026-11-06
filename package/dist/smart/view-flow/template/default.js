import {html, nothing} from "lit";
import "./default.css";
import {renderFieldValue} from "../../../view-properties/js/field-value.js";
import {allFields, conditionedField, fieldDisabled, shownFields, valuesOnScreen} from "../answer.js";

// A few properties in a flow: the header line, the fields, the status line and
// the answers.
//
// The heading is a role="heading" with the level the host chooses, not a fixed
// <h2>: the block is placed inside a message, a feed entry or a page, and the
// level right in one is a skipped level in another.
//
// Every value is drawn by sf-view-properties' field value over the Framework
// field renderers (../../../view-properties/js/field-value.js): the block has
// no field code. A field is a label above its value, the record component's
// reading order; a half-width field pairs up with the next one.
//
// The status line is a polite live region that is always in the page, and the
// place focus goes when the answers go (the confirm surface). Send is filled and
// Cancel outlined: a form's answer is to send it, and cancelling is the way out,
// not a second equal choice.

function renderField(context, field) {
    const key = String(field.key);
    const values = context.values;
    const editing = context.editing;
    const disabled = editing && fieldDisabled(field, values);
    const shown = editing ? conditionedField(field, values) : {...field, value: context.component.shownValue(field)};
    // A message the control draws under itself (a mask not filled) is not drawn twice.
    const error = context.controlErrors.has(key) ? null : context.errors.get(key);
    const width = field.width === "full" ? "full" : "half";
    return html`
        <div class="sf-view-flow__field sf-view-flow__field--${width} flex flex-col gap-1/4 min-w-0"
             data-field=${key}
             data-invalid=${context.errors.has(key) ? "true" : nothing}>
            <div class="sf-view-flow__label flex items-cross-center gap-1/3 color-on-surface-variant">
                <span>${String(field.label ?? key)}</span>
                ${shown.required && editing
                    ? html`<span class="sf-view-flow__required color-error" aria-hidden="true">*</span>`
                    : nothing}
                ${field.hint
                    ? html`<sf-help-mark class="sf-view-flow__hint" label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>`
                    : nothing}
            </div>
            <div class="sf-view-flow__value min-w-0 flex items-cross-center gap-1 flex-wrap">${renderFieldValue(context, shown, editing, {disabled})}</div>
            ${error ? html`<div class="sf-view-flow__error color-error" role="alert">${error}</div>` : nothing}
        </div>`;
}

function renderGroup(context, group, index) {
    const fields = shownFields(group.fields, context.values);
    if (!fields.length) return nothing;
    const component = context.component;
    const collapsed = component.groupCollapsed(group);
    const bodyId = `${context.headingId.replace(/--heading$/u, "")}--group-${index + 1}`;
    const body = html`
        <div class="sf-view-flow__fields" id=${bodyId} ?hidden=${collapsed}>
            ${fields.map((field) => renderField(context, field))}
        </div>`;
    if (!group.label) return html`<div class="sf-view-flow__group" data-group=${group.key}>${body}</div>`;
    return html`
        <div class="sf-view-flow__group" data-group=${group.key} data-collapsed=${collapsed ? "true" : nothing}>
            ${group.collapsible
                ? html`<button type="button" class="sf-view-flow__group-label sf-view-flow__toggle flex items-cross-center gap-1/4"
                               aria-expanded=${collapsed ? "false" : "true"} aria-controls=${bodyId}
                               @click=${() => component.toggleGroup(group.key)}>
                        <sf-icon icon="expand_more" size="1/2" aria-hidden="true"></sf-icon>
                        <span>${group.label}</span>
                    </button>`
                : html`<div class="sf-view-flow__group-label">${group.label}</div>`}
            ${body}
        </div>`;
}

function renderFoot(context) {
    if (!context.footShown) return nothing;
    const component = context.component;
    const answering = context.open || context.pending;
    return html`
        <footer class="sf-view-flow__footer">
            <!-- Always in the page, empty while there is nothing to say: a live
                 region that appears together with its words is not heard. -->
            <p class="sf-view-flow__status${context.statusError ? " sf-view-flow__status--error" : ""}"
               role="status" tabindex="-1">
                ${context.statusText
                    ? html`<sf-icon icon=${context.statusIcon} size="1/2" aria-hidden="true"></sf-icon><span>${context.statusText}</span>`
                    : nothing}
            </p>
            <div class="sf-view-flow__actions" ?hidden=${!answering}>
                ${context.cancelable
                    ? html`<sf-button appearance="outline" scheme="on-surface" size=${context.size}
                                      text=${context.cancelText} data-action="cancel"
                                      ?loading=${context.pressed === false}
                                      ?disabled=${context.answersLocked && context.pressed !== false}
                                      @click=${() => component.cancel()}></sf-button>`
                    : nothing}
                <sf-button scheme="primary" size=${context.size}
                           text=${context.submitText} data-action="submit"
                           ?loading=${context.pressed === true}
                           ?disabled=${context.answersLocked && context.pressed !== true}
                           @click=${() => component.confirm()}></sf-button>
            </div>
        </footer>`;
}

export function renderViewFlowTemplate(context) {
    // The values the conditions read: what is typed while the block takes an
    // answer, else what it shows (the answer sent, or the host's values).
    const values = context.editing
        ? valuesOnScreen(context.groups, context.changed)
        : new Map(allFields(context.groups).map((field) => [String(field.key), context.component.shownValue(field)]));
    const scoped = {...context, values};
    return html`
        <section
                class="sf-view-flow sf-view-flow--${context.mode}${context.editing ? " sf-view-flow--editing" : ""} sf-view-flow--${context.state} sf-view-flow--size-${context.size === "1" ? "1" : "1-2"}"
                aria-labelledby=${context.heading ? context.headingId : nothing}
                aria-label=${context.heading ? nothing : context.blockLabel}
                aria-busy=${context.pending ? "true" : nothing}
                data-state=${context.mode === "edit" ? context.state : nothing}
        >
            ${context.heading
                ? html`<div class="sf-view-flow__heading" id=${context.headingId} role="heading"
                            aria-level=${context.headingLevel}>${context.heading}</div>`
                : nothing}
            ${context.hasDescription
                ? html`<div class="sf-view-flow__description">${context.descriptionContent}</div>`
                : nothing}
            ${context.fieldsShown
                ? html`<div class="sf-view-flow__groups" ?inert=${context.fieldsLocked}>
                        ${context.groups.map((group, index) => renderGroup(scoped, group, index))}
                    </div>`
                : nothing}
            ${renderFoot(context)}
        </section>
    `;
}
