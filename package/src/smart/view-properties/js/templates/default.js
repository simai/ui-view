import {html, nothing} from 'lit';
import {guard} from 'lit/directives/guard.js';
import "./default.css";
import {renderViewField, renderEditField} from '../../../view-common/field-renderers.js';
import {renderFieldValue} from '../field-value.js';

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
    return context.configuring ? (entries ?? []) : context.visible(entries);
}

// The chooser names the layers this person may write and nothing else. A layer
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
    if (!context.canConfigureView || !context.configuring) return nothing;
    const writable = context.editableLayers ?? [];
    const required = context.viewRequired;
    return html`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group" aria-label=${context.configureText}>
            <sf-profile-picker
                    size=${context.controlSize ?? nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${required}
                    ?resettable=${!required && writable.includes('personal')}
                    .profiles=${(context.viewProfiles ?? []).map((profile) => ({
                        id: profile.id, label: profile.label, shared: Boolean(profile.shared),
                        editable: writable.includes(profile.shared ? 'shared' : 'personal')
                            && (!profile.shared || context.canDeleteViewProfile(profile.id)),
                    }))}
                    .rights=${{create: {personal: !required && writable.includes('personal'), shared: !required && writable.includes('shared')}}}
                    @sf-profile-picker-select=${(event) => context.component.selectViewProfile(event.detail.id)}
                    @sf-profile-picker-create=${(event) => context.component.createViewProfile(event.detail.label, {shared: event.detail.shared})}
                    @sf-profile-picker-rename=${(event) => context.component.renameViewProfile(event.detail.id, event.detail.label)}
                    @sf-profile-picker-delete=${(event) => context.component.deleteViewProfile(event.detail.id)}
                    @sf-profile-picker-reset=${() => context.component.resetView()}
            ></sf-profile-picker>
            <span class="sf-property-view-configure-hint color-on-surface-variant min-w-0">${configureHint(context)}</span>
        </div>
    `;
}

// A person who cannot arrange the card chooses between the views in the same
// picker, select-only, above the fields (C311 (5), the dispatcher's call on
// RC-6): no «⋯ → Вид» submenu for anyone. Nothing is made, renamed, removed
// or reset here; one view, no picker. A required view is the only one the
// host lets anyone read (Larena c311-reply): the picker shows it, disabled.
function renderViewChooser(context) {
    const profiles = context.viewProfiles ?? [];
    if (context.canConfigureView || context.configuring || profiles.length < 2) return nothing;
    return html`
        <div class="sf-property-view-configure-top flex items-cross-center gap-1/3 flex-wrap" data-chooser="true">
            <sf-profile-picker
                    size=${context.controlSize ?? nothing}
                    data-action="view-profile"
                    label=${context.viewProfileLabel}
                    current=${context.viewProfile ?? ''}
                    ?disabled=${context.viewRequired}
                    .profiles=${profiles.map((profile) => ({id: profile.id, label: profile.label, shared: Boolean(profile.shared), editable: false}))}
                    .rights=${{create: {personal: false, shared: false}}}
                    @sf-profile-picker-select=${(event) => context.component.selectViewProfile(event.detail.id)}
            ></sf-profile-picker>
        </div>
    `;
}

function renderConfigureBar(context) {
    if (!context.canConfigureView || !context.configuring) return nothing;
    const required = context.viewRequired;
    // Save model C1 (study S-B): «Сохранить» writes the draft for the person,
    // «Сохранить для всех» (who may write the shared layer, with a draft or
    // a layout of their own to publish) writes it for everyone, «Отменить»
    // drops the draft. No line says edits are saved at once (VL-93).
    const publish = context.canWriteShared && !required && (context.layerDirty || context.hasPersonalEdits);
    return html`
        <div class="sf-property-view-actions sf-property-view-configure-bar flex items-cross-center gap-1/3 flex-wrap"
             data-configuring="true" role="group"
             aria-label=${context.configureText}>
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? nothing}
                    text=${context.doneConfiguringText}
                    data-action="done-configuring"
                    @click=${() => context.component.commitConfiguringView()}
            ></sf-button>
            ${publish ? html`<sf-button
                    appearance="outline"
                    scheme="primary"
                    size=${context.controlSize ?? nothing}
                    text=${context.word('publishViewText')}
                    data-action="publish-view"
                    @click=${() => context.component.publishConfiguringView()}
            ></sf-button>` : nothing}
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? nothing}
                    text=${required && context.requiredEdits ? context.word('undoMineText') : context.cancelConfiguringText}
                    data-action="cancel-configuring"
                    @click=${() => context.component.cancelConfiguringView()}
            ></sf-button>
        </div>
    `;
}

// Width, template variant and hint sit behind the field's own settings rather
// than under every field at once. Drawn under each field they were four controls
// per row, so a group of eight fields was thirty-two controls and the
// arrangement -- the thing being edited -- could no longer be read.
function renderFieldSettings(context, field, key) {
    // The template (variant) is chosen once in the field (C302 (2), C311 (6),
    // RC-9): the card view no longer offers it.

    return html`
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
                            @change=${(event) => context.component.setFieldView(key, {
                                label: String(event.target?.value ?? '').trim() || null,
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
                            @change=${(event) => context.component.setFieldView(key, {hint: event.target?.value ?? ''})}
                    ></sf-input>
                </label>
                <label class="sf-property-view-settings-row flex items-cross-center justify-between gap-1">
                    <span class="sf-property-view-settings-label color-on-surface-variant">${context.widthText}</span>
                    <sf-switch
                            size="1/2"
                            data-action="width"
                            ?checked=${field.width === 'full'}
                            @change=${(event) => context.component.setFieldView(key, {
                                width: event.target?.checked ? 'full' : 'half',
                            })}
                    ></sf-switch>
                </label>
            </div>
        </sf-popover>
    `;
}

// The two controls a field carries while the view is arranged: taking it out of
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
function renderFieldActions(context, field, key, {hidden = false} = {}) {
    const locked = !context.canChangeVisibility(field);
    const name = String(field.label ?? key);
    const marked = context.isLocked(`fields.${key}.hidden`);
    const menu = context.fieldMenuEntries(key).length > 0;
    // A field a layer hid in its area (hidden: true) is shown again by the
    // same eye; one in «Скрытые поля» goes back to the open tab.
    const off = hidden || field.hidden === true;
    const show = () => (hidden ? context.component.showHiddenField(key) : context.component.toggleEntryHidden('field', key));

    // One way to not show a field (C106 (1), C311 (5), RC-7): the eye moves it
    // to «Скрытые поля» and back. It was a cross «Убрать из области».
    return html`
        <div class="sf-property-view-field-actions flex items-cross-center gap-1/4">
            ${marked ? html`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img"
                    data-lock=${`fields.${key}.hidden`}
                    aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : nothing}
            <sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon=${off ? 'visibility_off' : 'visibility'}
                    data-action=${off ? 'show-field' : 'remove-field'}
                    ?disabled=${locked}
                    title=${locked ? (marked ? context.word('lockedText') : (context.layerDenied('shared') || context.hiddenText)) : context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    aria-label=${context.word(off ? 'showFieldText' : 'hideFieldText').replace('{name}', name)}
                    @click=${() => (off ? show() : context.component.moveFieldToUnplaced(key))}
            ></sf-button-icon>
            ${renderFieldSettings(context, field, key)}
            ${menu ? html`<sf-button-icon
                    size="1/2"
                    appearance="ghost"
                    scheme="on-surface-variant"
                    icon="more_horiz"
                    data-action="field-menu"
                    aria-haspopup="menu"
                    aria-label=${context.word('fieldMenuText').replace('{name}', name)}
                    @click=${(event) => context.component.openFieldMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
            ></sf-button-icon>` : nothing}
        </div>
    `;
}

// A name that can be changed, where it stands. In the arranging mode the title
// is the control: pressing it, or the pencil beside it, turns it into a field
// with a tick and a cross -- the two answers a person has to a name they are
// typing. Nothing is written until the tick, so an area keeps its name while
// somebody is still deciding on another.
function renderEntryName(context, kind, key, label, titleClass) {
    const renaming = context.renaming?.kind === kind && context.renaming?.key === String(key);

    if (!context.configuring) {
        return html`<h3 class=${titleClass}>${label}</h3>`;
    }

    if (!renaming) {
        // The pencil stands right after the name rather than at the end of the
        // row: at the end it read as another of the area's controls, and what
        // it edits is the name beside it (owner, 2026-10-08). The name takes
        // only the room it needs, and the space that was taken from it goes to
        // the spacer, which keeps the controls at the end of the row.
        return html`
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

    const commit = (event) => {
        const input = event.target?.closest?.('.sf-property-view-rename')?.querySelector('sf-input');
        context.component.renameEntry(kind, key, input?.value ?? label);
    };

    return html`
        <span class="sf-property-view-rename flex items-cross-center gap-1/4 grow min-w-0">
            <sf-input
                    size="1/2"
                    appearance="bordered"
                    autofocus
                    root-class="flex-auto min-w-0"
                    data-action="rename-input"
                    aria-label=${context.renameText}
                    value=${label}
                    @keydown=${(event) => {
                        if (event.key === 'Enter') commit(event);
                        // Escape here leaves the naming row and nothing else: the
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
}

// A value is a way in. Reading a record and changing it are the same screen in the
// mockup: a person presses the value and its group opens for editing, with a pen
// showing that it can be. Only a readonly field, a field already being edited and
// a field being arranged are not buttons -- each already means something else.
// What a press inside a field's value may land on that acts on its own.
const INNER_CONTROL = 'a[href], button, input, select, textarea, [role="button"], [role="link"]';

// A field read (C289 (4), C180 (3)): a row of sf-list-description's parts --
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
    return html`
        <div class="sf-list-description-row sf-property-view-field sf-property-view-row" data-field=${key}
             data-current=${current ? 'true' : nothing}
             data-saved=${context.savedKeys?.has(key) ? 'true' : nothing}>
            <dt class="sf-list-description-label sf-property-view-field-label" id=${`sf-property-view-label-${context.recordId || 'record'}-${key}`}>${String(field.label ?? key)}${field.hint
                    ? html`<sf-help-mark class="sf-list-description-help sf-property-view-hint" size=${context.size === '1/2' ? '1/3' : '1/2'}
                                         label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>`
                    : nothing}${field.rare ? html` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : nothing}${field.inherited
                    ? html` <span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>`
                    : nothing}</dt>
            <dd class="sf-list-description-value">
                <span class="sf-list-description-line">
                    ${quick
                            ? renderQuickValue(context, field, sectionKey, groupKey)
                            : opens
                            ? html`<button
                                    type="button"
                                    class="sf-property-view-field-value sf-property-view-field-open min-w-0 text-start cursor-pointer"
                                    data-open-group=${groupKey}
                                    title=${context.editText}
                                    @click=${(event) => {
                                        const path = event.composedPath();
                                        const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
                                        if (inner.some((node) => node.matches?.(INNER_CONTROL))) return;
                                        // A long field's value opens its group with the
                                        // focus on it (C305 (1), VP-21).
                                        context.component.editGroup(sectionKey, groupKey, {focus: key});
                                    }}
                            >${renderFieldValue(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>`
                            : html`<span class="sf-property-view-field-value min-w-0">${renderFieldValue(context, field, false)}</span>`}
                </span>
                ${error && !current ? html`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : nothing}
            </dd>
        </div>
    `;
}

// A field of a group edited in place in the record's list (C401, VL-64, view
// round 15): the read row's own parts -- the list's row, label and value -- with
// the field's control in the value, so «Изменить» moves no label and no row.
// The read row reserves the control's height (default.css), so the field takes
// the room the value already had.
function renderEditRow(context, field) {
    const disabled = Boolean(field.when) && context.fieldDisabled(field);
    if (field.when) field = context.conditionedField(field);
    const key = String(field.key ?? '');
    const error = context.controlErrors?.has(key) ? null : context.errors.get(key);
    return html`
        <div class="sf-list-description-row sf-property-view-field sf-property-view-row sf-property-view-row--edit" data-field=${key}>
            <div class="sf-list-description-label sf-property-view-field-label" id=${`sf-property-view-label-${context.recordId || 'record'}-${key}`}>${String(field.label ?? key)}${field.required
                    ? html`<span class="sf-property-view-required" aria-hidden="true">*</span>`
                    : nothing}${field.hint
                    ? html`<sf-help-mark class="sf-list-description-help sf-property-view-hint" size=${context.size === '1/2' ? '1/3' : '1/2'}
                                         label=${String(field.hint)} text=${String(field.hint)}></sf-help-mark>`
                    : nothing}</div>
            <div class="sf-list-description-value">
                <div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${renderFieldValue(context, field, true, {disabled})}</div>
                ${error ? html`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : nothing}
            </div>
        </div>
    `;
}

// A short field edited in a window at its value (C305 (1), as the table's
// cell, C296): sf-popover with the value as its trigger, the field's own
// control, Save first and a quiet Cancel. One value per save -- group.save of
// the field's group with that value, the same revision and confirmation.
function renderQuickValue(context, field, sectionKey, groupKey) {
    const key = String(field.key ?? '');
    const open = context.quick?.key === key;
    const error = open ? (context.errors.get(key) ?? context.conflict ?? null) : null;
    const label = String(field.label ?? key);
    return html`<sf-popover class="sf-property-view-quick" placement="bottom-start" width="18rem"
            label=${label}
            data-quick-pop=${key}
            ?unsaved=${open && context.changed.has(key)}
            @sf-popover-open=${(event) => {
                if (event.target !== event.currentTarget) return;
                if (!context.component.startQuick(sectionKey, groupKey, key)) event.preventDefault?.();
            }}
            @sf-popover-close=${(event) => {
                if (event.target !== event.currentTarget) return;
                context.component.endQuick(key);
            }}>
        <button slot="trigger" type="button"
                class="sf-property-view-field-value sf-property-view-field-open sf-property-view-quick-value min-w-0 text-start cursor-pointer"
                data-quick=${key}
                aria-haspopup="dialog"
                aria-label=${`${label}: ${context.editText}`}
        >${renderFieldValue(context, field, false)}<i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i></button>
        <div slot="content" class="sf-property-view-quick-editor" data-quick-editor=${key}
             @keydown=${(event) => {
                 if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.target?.localName !== 'textarea'
                     && !event.defaultPrevented && !event.target?.closest?.('[role="listbox"], [role="menu"], .sf-datepicker')) {
                     event.preventDefault();
                     context.component.saveQuick();
                 }
             }}>
            <span class="sf-property-view-quick-label">${label}</span>
            ${open ? renderFieldValue(context, field, true) : nothing}
            ${error ? html`<span class="sf-property-view-field-error color-error" role="alert">${error}</span>` : nothing}
            ${open && context.confirmation ? html`<sf-confirm
                    appearance="inline"
                    size="1/2"
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${(event) => {
                        event.preventDefault?.();
                        if (event.detail?.accepted) context.component.confirmSave();
                        else context.component.cancelConfirmation();
                    }}
            ></sf-confirm>` : html`<div class="sf-property-view-quick-actions">
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
    const key = String(field.key ?? '');
    // A message the field's own control draws under itself (port 1.16.0: an
    // incomplete masked string) is not drawn a second time here; it still
    // counts among the errors beside Save, and still holds the save.
    const error = context.controlErrors?.has(key) ? null : context.errors.get(key);

    const arrangementError = context.configuring ? context.entryError('field', key) : null;

    return html`
        <div class="sf-property-view-field flex flex-col gap-1 min-w-0 ${field.width === 'full' ? 'sf-property-view-field--full' : ''}"
             data-field=${key}
             data-sf-sortable-item=${context.configuring ? key : nothing}
             data-arranging=${context.configuring ? 'true' : nothing}
             data-hidden=${context.configuring && field.hidden ? 'true' : nothing}>
            <!-- Reading: the label is quieter than its value. Editing: a form
                 field's label, in the text colour with its «*» (C153 (1), (2)).
                 Arranging: the handle opens the label's cell, so the label
                 column ends where the reading one ends and the value starts
                 where it starts (SB-C15, VL-95). -->
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 ${editing ? 'color-on-surface' : 'color-on-surface-variant'}">
                ${context.configuring
                        ? html`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>`
                        : nothing}
                ${String(field.label ?? key)}
                ${field.required && editing
                        ? html`<span class="sf-property-view-required" aria-hidden="true">*</span>`
                        : nothing}
                ${field.hint
                        // The hint is the Framework's own affordance for a hint,
                        // sf-help-mark: a button that opens a short explanation on
                        // a press, by touch, by pointer and by keyboard alike, and
                        // announces it politely. It was a glyph carrying the words
                        // in a native `title`, which needs a hover -- so on a touch
                        // device the hint could not be read at all (Larena storage
                        // QA, 2026-10-22). The accessible name stays the hint
                        // itself, as it was on the glyph's aria-label: `label` names
                        // the button, `text` is the explanation it opens.
                        ? html`<sf-help-mark class="sf-property-view-hint"
                                             label=${String(field.hint)}
                                             text=${String(field.hint)}></sf-help-mark>`
                        : nothing}
                ${field.rare ? html`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : nothing}
                ${field.inherited && !editing
                        ? html`<span class="sf-property-view-inherited color-on-surface-variant">${context.inheritedText}</span>`
                        : nothing}
            </div>
            ${editing || context.configuring || field.readonly === true || !context.mayEdit || context.openAll
                    ? html`<div class="sf-property-view-field-value min-w-0 flex items-cross-center gap-2 flex-wrap">${renderFieldValue(context, field, editing, {disabled})}</div>`
                    : html`
                        <button
                                type="button"
                                class="sf-property-view-field-value sf-property-view-field-open min-w-0 flex items-cross-center gap-1 text-start cursor-pointer"
                                data-open-group=${groupKey}
                                title=${context.editText}
                                @click=${(event) => {
                                    // A control inside the value -- a file's download
                                    // button, a URL, an address -- does its own thing
                                    // and nothing more: downloading a stored file also
                                    // opened the group for editing (simai.main,
                                    // 2026-10-28). sf-file-preview's download is a
                                    // button, not a link, so every control between the
                                    // press and this button counts.
                                    const path = event.composedPath();
                                    const inner = path.slice(0, Math.max(0, path.indexOf(event.currentTarget)));
                                    if (inner.some((node) => node.matches?.(INNER_CONTROL))) return;
                                    context.component.editGroup(sectionKey, groupKey);
                                }}
                        >
                            ${renderFieldValue(context, field, editing)}
                            <i class="sf-icon sf-icon--size-1/2 sf-property-view-pen" aria-hidden="true">edit</i>
                        </button>`}
            ${context.configuring ? renderFieldActions(context, field, key) : nothing}
            ${error || arrangementError
                    ? html`<div class="sf-property-view-field-error color-error" role="alert">${error || arrangementError}</div>`
                    : nothing}
        </div>
    `;
}

// A group of related records: the component composes a data view in it and the
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
    return html`
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
}

// Placing a field in this group without dragging it. Dragging is the gesture the
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
    const options = context.fieldChoices(groupKey).map((option) => ({
        type: 'checkbox',
        size: '1/2',
        text: option.label,
        value: option.key,
        group: option.group,
        selected: option.selected,
        checked: option.selected,
        ariaLabel: option.label,
    }));
    const placed = options.filter((option) => option.selected).map((option) => option.value);

    // The list is sf-dropdown's: it carries the search, the groups, the
    // multiple selection and the surface, and takes the «+» as its trigger.
    // What is acted on is the option the change names, not the whole value the
    // dropdown now holds: the component moves a field rather than setting a
    // list, and reading the whole list as the new truth once took five fields
    // out of an area because one was ticked.
    return html`
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
                @change=${(event) => {
                    const key = String(event.detail?.value ?? '');
                    if (!key) return;
                    const values = Array.isArray(event.detail?.values)
                        ? event.detail.values.map(String)
                        : [];
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
    const groupKey = String(group.key ?? '');
    // On a surface open all at once (edit, create) every group is open; a
    // group the host keeps closed stays shown.
    const editing = (context.openAll && group.kind !== 'related' && group.editable !== false)
        || (context.editing?.group === groupKey
            && context.editing?.section === String(section.key ?? ''));
    const fields = listed(context, group.fields);
    const configuring = context.configuring;
    const groupError = configuring ? context.entryError('group', groupKey) : null;
    const groupLocked = configuring && !context.canChangeVisibility(group);
    // The field list is a sortable list and nothing more: the drop is reported by
    // sf-sortable and applied or refused by the component, which is the seam that
    // mechanism already publishes. Its id carries the kind and the container, so
    // one listener can tell a field dropped into a group from a group dropped into
    // a section.
    // A group read by itself (port 1.15.0, group-load) and not read yet holds
    // no fields but says how many: it is drawn as that many skeleton lines, and
    // busy, until its read answers -- never as an empty group.
    const waiting = !Array.isArray(group.fields) || group.fields.length === 0
        ? Number.isInteger(group.field_count) && group.field_count > 0 ? group.field_count : 0
        : 0;
    const reading = waiting > 0 || Boolean(context.component.isGroupReading?.(groupKey));
    // A group the host names '' has no head of its own (a record of one group,
    // a property shown alone): an empty heading took a row (36 px read, 29 px
    // edited) and named nothing to a screen reader. Its «Изменить», the rare
    // mark and the arranging tools still bring the head back.
    // A section of one group whose name is the section's (VRS-9, view round
    // 12): the section's tab, column row or phone screen already names it, and
    // the group's head said «Заказ» again under «Заказ». Its «Изменить» stays;
    // arranging the card still shows every head. One section alone is drawn
    // without its name, so its group keeps the title.
    const repeats = !configuring && !group.rare
        && (context.visible(context.sections ?? []) ?? []).length > 1
        && (context.visible(section.groups ?? []) ?? []).length === 1
        && String(group.label ?? groupKey).trim() === String(section.label ?? section.key ?? '').trim();
    const titled = (String(group.label ?? groupKey) !== '' || Boolean(group.rare)) && !repeats;
    const readEdit = context.mayEdit && !context.openAll && group.editable !== false;
    const cardEdit = !configuring && !editing && context.mayEdit && !context.openAll && group.kind !== 'related' && group.editable !== false;
    // Read, the group is a section of the record's description list: its name
    // a list section heading with «Изменить» as its action, its fields rows of
    // the list (C289 (4)). Edited, arranged or holding related records it stays
    // the card it was.
    if (!editing && !configuring && group.kind !== 'related') {
        const readRows = waiting > 0
            ? html`${Array.from({length: waiting}, (_, at) => html`<div class="sf-list-description-row sf-property-view-row" aria-hidden="true"><dt class="sf-list-description-label"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 w-2/3"></div></div></dt><dd class="sf-list-description-value"><div class="sf-skeleton sf-skeleton--animation-pulse"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div></dd></div>`)}`
            : html`${fields.map((field) => renderReadRow(context, field, String(section.key ?? ''), groupKey))}`;
        return html`
            <section class="sf-property-view-group sf-property-view-group--list" data-group=${groupKey} aria-busy=${reading ? 'true' : nothing}>
                ${titled || readEdit ? html`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? html`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}${group.rare
                            ? html` <span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : nothing}</div>` : html`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit
                            ? html`<span class="sf-list-description-action"><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button></span>`
                            : nothing}
                </div>` : nothing}
                ${fields.length || waiting ? html`<dl class="sf-list-description-part sf-property-view-group-fields" aria-label=${String(group.label ?? groupKey)}>${readRows}</dl>` : nothing}
            </section>
        `;
    }
    // Edited by sf-form (C182, C305 (1); VP-19, VP-27): the label beside its
    // field wherever the record is wide, over it on a phone (owner decision
    // C401: the value turns into its field in place, the label stays at the
    // start; sf-form lays labels="start" from 40rem of its own width); «Сохранить» first, a quiet «Отмена»;
    // every field the group's whole width. The form's value and fields are
    // the edit's own (formEdit), so a render of the card never resets it.
    const form = context.formEdit;
    if (editing && !configuring && form && form.group === groupKey && form.section === String(section.key ?? '')) {
        return html`
            <section class="sf-property-view-group sf-property-view-group--editing sf-property-view-group--form" data-group=${groupKey}>
                ${titled || readEdit ? html`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? html`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}</div>`
                            : html`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit
                            // The head read had, kept edited (VR14-3, view round
                            // 15m): its «Изменить» stays as an unseen, inert
                            // stand-in, so the rows under it do not climb by the
                            // head's height when the group turns into its form.
                            ? html`<span class="sf-list-description-action sf-property-view-group-action-kept" aria-hidden="true" inert><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? nothing}
                                    text=${context.editText}
                                    tabindex="-1"
                            ></sf-button></span>`
                            : nothing}
                </div>` : nothing}
                <sf-form class="sf-property-view-form"
                         label=${String(group.label ?? groupKey)}
                         labels=${context.sectionsLayout === 'phone' ? 'top' : 'start'}
                         footer=${context.panel || context.sectionsLayout === 'phone' ? 'sticky' : 'static'}
                         .fields=${guard([form], () => form.fields)}
                         .value=${guard([form], () => form.value)}
                         @sf-form-submit=${(event) => context.component.submitForm(event)}
                         @sf-form-cancel=${() => context.component.cancelEdit()}
                         @sf-form-input=${(event) => {
                             const at = context.component.fieldAt(event.detail?.key);
                             if (at) context.component.changeField(at.field, event.detail?.value);
                         }}
                ></sf-form>
            </section>`;
    }
    // Edited in the card's own form (a group sf-form does not draw: a lookup,
    // a file, a person), the group stays a part of the record's list (VL-64):
    // the read head with its «Изменить» kept as an unseen stand-in, and each
    // field a row of the list at the place it read in.
    if (editing && !configuring && !context.openAll && group.kind !== 'related' && waiting === 0) {
        return html`
            <section class="sf-property-view-group sf-property-view-group--list sf-property-view-group--editing sf-property-view-group--in-place" data-group=${groupKey}>
                ${titled || readEdit ? html`<div class="sf-list-description-head sf-property-view-group-header">
                    ${titled ? html`<div class="sf-list-description-title sf-property-view-group-title" role="heading" aria-level="3">${String(group.label ?? groupKey)}</div>`
                            : html`<span class="sf-property-view-group-title-gap" aria-hidden="true"></span>`}
                    ${readEdit
                            ? html`<span class="sf-list-description-action sf-property-view-group-action-kept" aria-hidden="true" inert><sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? nothing}
                                    text=${context.editText}
                                    tabindex="-1"
                            ></sf-button></span>`
                            : nothing}
                </div>` : nothing}
                ${fields.length ? html`<div class="sf-list-description-part sf-property-view-group-fields" role="group" aria-label=${String(group.label ?? groupKey)}>${fields.map((field) => renderEditRow(context, field))}</div>` : nothing}
            </section>`;
    }
    const rows = waiting > 0
        ? html`${Array.from({length: waiting}, (_, at) => html`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true">
            <div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`)}`
        : html`${fields.map((field) => renderField(context, field, editing, String(section.key ?? ''), groupKey))}`;

    return html`
        <section class="sf-property-view-group ${groupSurface(context)} flex flex-col gap-2 ${editing ? 'sf-property-view-group--editing' : ''} ${group.kind === 'related' && !editing && !configuring ? 'sf-property-view-group--related' : ''}"
                 data-group=${groupKey}
                 aria-busy=${reading ? 'true' : nothing}
                 data-sf-sortable-item=${configuring ? groupKey : nothing}
                 data-hidden=${configuring && group.hidden ? 'true' : nothing}
                 data-columns=${group.columns === 2 ? '2' : '1'}>
            ${titled || configuring || cardEdit ? html`<header class="sf-property-view-group-header flex items-cross-center justify-between gap-2">
                ${configuring
                        ? html`<i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle
                                  aria-hidden="true">drag_indicator</i>`
                        : nothing}
                ${renderEntryName(context, 'group', groupKey, String(group.label ?? groupKey),
                        'sf-property-view-group-title')}
                ${group.rare ? html`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : nothing}
                ${configuring
                        ? html`
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
                                    title=${groupLocked ? (context.layerDenied('shared') || context.hiddenText) : context.removeGroupText}
                                    aria-label=${context.removeGroupText}
                                    @click=${() => context.component.removeGroup(groupKey)}
                            ></sf-button-icon>
                            </span>`
                        : nothing}
                ${cardEdit
                        ? html`
                            <sf-button
                                    appearance="ghost"
                                    size=${context.controlSize ?? nothing}
                                    text=${context.editText}
                                    data-action="edit"
                                    @click=${() => context.component.editGroup(String(section.key ?? ''), groupKey)}
                            ></sf-button>`
                        : nothing}
            </header>` : nothing}
            ${groupError
                    ? html`<div class="sf-property-view-group-error" role="alert">${groupError}</div>`
                    : nothing}
            ${group.kind === 'related'
                    ? html`<div class="sf-property-view-group-related">${renderRelatedList(context, group, groupKey)}</div>`
                    : configuring
                            ? html`
                                <sf-sortable
                                        class="sf-property-view-group-fields min-w-0"
                                        group="field"
                                        accepts="field"
                                        id=${`field:${groupKey}`}
                                        label=${String(group.label ?? groupKey)}
                                >${rows}</sf-sortable>`
                            : html`<div class="sf-property-view-group-fields min-w-0">${rows}</div>`}
        </section>
    `;
}

// The phone's first screen: the sections as a list, each one leading to its own
// screen. Drawn only when there is more than one, for the same reason the desktop
// list is: a list of one is a control nobody can use, and it would put a screen
// between a person and the only groups there are.
function renderPhoneSectionList(context, sections) {
    // The rows are sf-list's (C289 (5), C148 (4)): a section opens as a level
    // of the panel, «←» in its head (C157 (6)). They are the phone list's rows
    // of the size ladder whatever the card's control size, and each ends in
    // «›», the mark of a row that opens (VRS-8, view round 12): on the card's
    // size 1/2 they were 28 px control rows with nothing saying they open.
    const items = sections.map((section) => ({
        id: String(section.key),
        text: String(section.label ?? section.key),
        ...(section.icon ? {icon: String(section.icon)} : {}),
    }));
    return html`
        <sf-list
                class="sf-property-view-phone-sections"
                label=${context.sectionsLabel}
                size="1"
                divided
                .items=${items}
                @sf-list-open=${(event) => {
                    const id = event.detail?.id;
                    if (id !== undefined && id !== null) context.component.openPhoneSection(String(id));
                }}
        ></sf-list>
    `;
}

// The second screen's head: back to the list, and the name of where you are.
function renderPhoneSectionHead(context) {
    return html`
        <div class="sf-property-view-phone-head flex items-cross-center gap-2">
            <sf-button-icon
                    size=${context.controlSize ?? nothing}
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
    if (sections.length < 2 && !context.configuring) return nothing;

    // Reading, the column holds one tablist, which is named itself; a landmark
    // around it would name the same list twice and call a set of panels a
    // navigation. Arranged, the column is this component's own rows.
    if (!context.configuring) {
        // C305 (3): the column is sf-menu (the C96 (5) menu column) until the
        // pair's sf-tabs judges a lone tab column by its wrapper (VP-26,
        // sf-tabs 1.4.4): this pair's vertical tabs fold any column under
        // 48rem into the line with «Ещё (n)», full screen at 1440 too.
        return html`
            <div class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0">
                ${context.sectionColumnTabs && context.sectionsLayout !== 'rail' ? renderSectionVerticalTabs(context, sections) : renderSectionMenu(context, sections)}
            </div>
        `;
    }

    return html`
        <nav class="sf-property-view-sections self-cross-stretch flex flex-col min-w-0" aria-label=${context.sectionsLabel}>
            ${renderSectionTabsArranged(context, sections)}
            <div class="sf-property-view-additions flex">${renderAddSection(context)}</div>
        </nav>
    `;
}

// Reading: the sections are vertical tabs (decision C96 point 5). They switch
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
    const items = sections.map((section) => ({
        id: String(section.key),
        label: sectionName(context, section),
        ...(section.icon ? {icon: String(section.icon)} : {}),
    }));
    const selected = sections.some((section) => String(section.key) === context.selectedSection)
        ? context.selectedSection
        : String(sections[0]?.key ?? '');

    return html`
        <sf-tabs
                class="sf-property-view-section-list"
                type="vertical"
                fold=${context.tabsHoldColumn ? 'never' : nothing}
                size=${context.controlSize ?? nothing}
                selected=${selected}
                aria-label=${context.sectionsLabel}
                .items=${items}
                @sf-tabs-change=${(event) => {
                    // sf-tabs (standard 1.3.8 §8): change carries the entry's id,
                    // which is the section key.
                    const id = event.detail?.selected ?? sections[Number(event.detail?.current)]?.key;
                    if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
                }}
        ></sf-tabs>
    `;
}

function renderSectionMenu(context, sections) {
    const selected = sections.some((section) => String(section.key) === context.selectedSection)
        ? context.selectedSection
        : String(sections[0]?.key ?? '');
    const items = sections.map((section) => ({
        id: String(section.key),
        label: sectionName(context, section),
        href: `#${String(section.key)}`,
        current: String(section.key) === selected,
        ...(section.icon ? {icon: String(section.icon)} : {}),
    }));
    return html`
        <sf-menu class="sf-property-view-section-list sf-property-view-section-menu"
                 label=${context.sectionsLabel}
                 .items=${items}
                 @sf-menu-navigate=${(event) => {
                     event.preventDefault();
                     const id = event.detail?.id ?? String(event.detail?.href ?? '').replace(/^#/u, '');
                     if (id !== undefined && id !== null && id !== '') context.component.selectSection(String(id));
                 }}
        ></sf-menu>
    `;
}

// Arranging: the same tabs, in an order a drag can change, and each one still a
// place to drop a field or an area. Tabs cannot be reordered by a pointer --
// sf-tabs owns its tab buttons -- so while the view is arranged
// the tabs are rows of this component's own, which is also what lets a tab carry
// a handle.
function renderSectionTabsArranged(context, sections) {
    // «Вкладки» (C311 (4), TB-1): the tabs as a list with handles over the
    // fields (a column beside them on the full screen); each row selects its
    // tab, says when it is hidden or locked, and has one «⋯» with the name,
    // the icon, up and down, hide, delete and the admin's lock.
    return html`
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
            ${sections.map((section) => {
                const key = String(section.key);
                const locked = context.isLocked(`sections.${key}`);
                const mine = !context.lockedForMe(`sections.${key}`);
                return html`
                <div class="sf-property-view-section-tab flex items-cross-center gap-1/3 min-w-0"
                     data-section-tab=${key}
                     data-sf-sortable-item=${key}
                     data-hidden=${section.hidden ? 'true' : 'false'}
                     aria-current=${key === context.selectedSection ? 'true' : nothing}>
                    <i class="sf-icon sf-property-view-section-grip color-on-surface-variant" data-sf-sortable-handle
                       aria-hidden="true">drag_indicator</i>
                    <button type="button"
                            class="sf-property-view-section-tab-select flex items-cross-center gap-1/3 flex-auto min-w-0 text-start cursor-pointer"
                            data-action="select-tab"
                            aria-pressed=${key === context.selectedSection ? 'true' : 'false'}
                            @click=${() => context.component.selectSection(key)}>
                        ${section.icon ? html`<i class="sf-icon" aria-hidden="true">${String(section.icon)}</i>` : nothing}
                        <span class="sf-property-view-section-tab-label flex-auto min-w-0">${sectionName(context, section)}</span>
                    </button>
                    ${locked ? html`<i class="sf-icon sf-property-view-lock color-on-surface-variant" role="img" data-lock=${`sections.${key}`}
                            aria-label=${context.word('lockedText')} title=${context.word('lockedText')}>lock</i>` : nothing}
                    ${section.hidden ? html`<i class="sf-icon color-on-surface-variant" role="img"
                            aria-label=${context.word('tabHiddenText')} title=${context.word('tabHiddenText')}>visibility_off</i>` : nothing}
                    <sf-button-icon
                            size="1/2"
                            appearance="ghost"
                            scheme="on-surface-variant"
                            icon="more_horiz"
                            data-action="tab-menu"
                            aria-haspopup="menu"
                            ?disabled=${!mine && !context.canWriteShared}
                            aria-label=${context.word('tabMenuText').replace('{name}', String(section.label ?? key))}
                            @click=${(event) => context.component.openTabMenu(event.currentTarget.querySelector('button') ?? event.currentTarget, key)}
                    ></sf-button-icon>
                </div>`;
            })}
        </sf-sortable>
    `;
}

// A rare section says so in its own name. A tab takes a label string and draws
// it as text, so a trailing mark of its own is a gap in that component rather
// than something to work around here.
function sectionName(context, section) {
    const label = String(section.label ?? section.key);
    return section.rare ? `${label} · ${context.rareText}` : label;
}

// The bar at the foot of the panel: what is being done to the record right now,
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
}

// The tab row only. The groups are drawn under it by the layout, as they are
// beside the list, so a section's content is in one place whichever way the
// sections are read. Slotting empty panels in here drew empty tabs: a slot for
// a tab replaces its label.
function renderSectionTabs(context, sections) {
    const at = Math.max(0, sections.findIndex((section) => String(section.key) === context.selectedSection));
    // A phone's tabs scroll sideways (all names reachable, no «Ещё»), and a
    // swipe over the fields turns them (S-A 3): the press is the visible way.
    const phone = context.sectionsLayout === 'phone';
    return html`
        <sf-tabs
                class="sf-property-view-tabs"
                type="underline"
                overflow=${phone ? 'scroll' : 'more'}
                ?data-phone-tabs=${phone}
                ?sticky=${context.panel}
                size=${context.controlSize ?? nothing}
                active-index=${String(at)}
                aria-label=${context.sectionsLabel}
                items=${sections.map((section) => tabLabel(context, section)).join('|')}
                @sf-tabs-change=${(event) => {
                    const section = sections[Number(event.detail?.current)];
                    if (section) context.component.selectSection(String(section.key));
                }}
        ></sf-tabs>
    `;
}

// The type of a view at 1/2: a step down from 1 in every role, so the record
// reads at the table's size. Variables rather than a class: the panel is drawn
// in a drawer moved to the page's end, outside the element. The title is rung 2,
// one below the full title's rung 3, read from the text ladder: the heading-5
// role it took is a content heading, which the heading ladder (C21) moves to
// rung 1, the size of the fields under it.
function sizeStyle(context) {
    if (context.size !== '1/2') return '';
    return ' --sf-property-view--title-size: var(--sf-text--size-2); --sf-property-view--title-height: var(--sf-title--height-2);'
        + ' --sf-property-view--group-size: var(--sf-text-medium--size); --sf-property-view--group-height: var(--sf-text-medium--height);'
        + ' --sf-property-view--label-size: var(--sf-label-medium--size); --sf-property-view--label-height: var(--sf-label-medium--height);'
        + ' --sf-property-view--value-size: var(--sf-text-small--size); --sf-property-view--value-height: var(--sf-text-small--height);';
}

// A save the host makes only once confirmed (port 1.14.0): its words, and the
// two answers, in the bar where save was pressed -- the same place and the same
// arrangement as the view's reset question. Going back sends nothing and keeps
// what was entered.
function renderConfirmation(context) {
    // The Framework's question in place (C289, C182; sf-confirm inline, C166):
    // the host's words and the two answers where Save was pressed. It was a bar
    // of this component's own.
    return html`
        <div class="sf-property-view-actions sf-property-view-confirm" data-confirming="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? nothing}
                    question=${context.confirmation.text}
                    confirm-id="save"
                    accept-text=${context.confirmSaveText}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${(event) => {
                        event.preventDefault?.();
                        if (event.detail?.accepted) context.component.confirmSave();
                        else context.component.cancelConfirmation();
                    }}
            ></sf-confirm>
        </div>
    `;
}

// The foot of a surface open all at once: Create or Save, and Cancel, with
// what went wrong beside them.
function renderOpenAllBar(context) {
    if (context.confirmation) return renderConfirmation(context);
    const creating = context.mode === 'create';
    return html`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            <sf-button
                    appearance="default"
                    size=${context.controlSize ?? nothing}
                    text=${creating ? context.createText : context.saveText}
                    data-action=${creating ? 'create' : 'save'}
                    @click=${() => context.component.saveAll()}
            ></sf-button>
            <sf-button
                    appearance="ghost"
                    scheme="on-surface"
                    size=${context.controlSize ?? nothing}
                    text=${context.cancelText}
                    data-action="cancel"
                    @click=${() => context.component.cancelEdit()}
            ></sf-button>
            ${context.errors.size
                    ? html`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>`
                    : nothing}
            ${context.conflict
                    ? html`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>`
                    : nothing}
        </div>
    `;
}

// Closing (or stepping to the next record) over unsaved entries asks first
// (C159 (6)): sf-confirm in the foot, «Закрыть без сохранения» or back.
function renderLeaveAsk(context) {
    return html`
        <div class="sf-property-view-actions sf-property-view-confirm" data-leaving="true">
            <sf-confirm
                    appearance="inline"
                    size=${context.controlSize ?? nothing}
                    question=${context.word('closeUnsavedText')}
                    confirm-id="leave"
                    accept-text=${context.leaveAsk.kind === 'step' ? context.word('leaveUnsavedText') : context.word('closeUnsavedAcceptText')}
                    decline-text=${context.keepEditingText}
                    @sf-confirm-answer=${(event) => {
                        event.preventDefault?.();
                        context.component.answerLeave(Boolean(event.detail?.accepted));
                    }}
            ></sf-confirm>
        </div>
    `;
}

function renderActions(context, {panel = false} = {}) {
    if (context.leaveAsk) return renderLeaveAsk(context);
    // A surface placed to show the object has no footer of its own (owner,
    // 2026-10-14): a reader sees values, not controls that would refuse.
    if (context.mode === 'view') return nothing;
    if (context.openAll) return renderOpenAllBar(context);
    // While the view is arranged the foot carries that mode's controls instead:
    // saving a record and arranging the view it is read in are two modes, and a
    // bar holding both would offer a save for something nobody was editing.
    if (context.configuring) return renderConfigureBar(context);
    if (context.editing && context.confirmation) return renderConfirmation(context);
    // A panel's foot holds the host's own actions, slotted as `footer`, and
    // the group's Save and Cancel. Deleting is a row of the head's «⋯» (C289
    // (3), C180 (2)): a foot stands for two actions or more, never for one delete.
    const hosted = panel && context.hasHostSlot('footer');
    // sf-form carries its own Save and Cancel.
    const own = context.editing && !context.formEdit;
    if (!own && !hosted && !(context.editing && context.conflict)) return nothing;

    return html`
        <div class="sf-property-view-actions flex items-cross-center gap-1/3 flex-wrap" role="group">
            ${own
                    ? html`
                        <sf-button
                                appearance="default"
                                size=${context.controlSize ?? nothing}
                                text=${context.saveText}
                                data-action="save"
                                @click=${() => context.component.saveGroup()}
                        ></sf-button>
                        <sf-button
                                appearance="ghost"
                                scheme="on-surface"
                                size=${context.controlSize ?? nothing}
                                text=${context.cancelText}
                                data-action="cancel"
                                @click=${() => context.component.cancelEdit()}
                        ></sf-button>`
                    : nothing}
            ${own && context.errors.size
                    ? html`<span class="sf-property-view-errors color-error">${context.errorsText}: ${context.errors.size}</span>`
                    : nothing}
            ${context.conflict
                    ? html`<span class="sf-property-view-conflict color-error" role="alert">${context.conflict}</span>`
                    : nothing}
            <span class="grow"></span>
            ${hosted ? html`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>` : nothing}
        </div>
    `;
}

// An unplaced field is being arranged, not read: it shows its name and a handle
// and nothing else. Drawn like a placed one it carried its value, so the area
// read as a group of fields that happen to be last rather than as the fields
// this view does not show.
function renderUnplacedField(context, field) {
    const key = String(field.key ?? '');
    return html`
        <div class="sf-property-view-field sf-property-view-field--unplaced flex flex-col gap-1 min-w-0"
             data-field=${key}
             data-sf-sortable-item=${key}
             data-arranging="true">
            <i class="sf-icon sf-property-view-grip items-cross-center" data-sf-sortable-handle aria-hidden="true">drag_indicator</i>
            <div class="sf-property-view-field-label flex items-cross-center gap-1/3 color-on-surface-variant">
                <span class="flex-auto min-w-0">${String(field.label ?? key)}</span>
                ${field.rare ? html`<span class="sf-property-view-rare color-on-surface-variant">${context.rareText}</span>` : nothing}
                ${renderFieldActions(context, field, key, {hidden: true})}
            </div>
        </div>
    `;
}

// Fields the view places nowhere. Drawn only while the view is being arranged,
// because they are not part of what a person reads -- and drawn even when there
// are none, so that dragging a field out of every group has somewhere to land
// and a person can see that taking a field out does not destroy it.
function renderUnplaced(context) {
    if (!context.configuring) return nothing;

    const fields = context.unplaced;
    // The count beside the bin's title is a count, read and never pressed: the
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
    return html`
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
                        ${fields.length
                            ? html`<sf-badge
                                    size="1/3"
                                    text=${String(fields.length)}
                            ></sf-badge>`
                            : nothing}
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
                >${fields.map((field) => renderUnplacedField(context, field))}</sf-sortable>
            </div>
        </article>
    `;
}

// The three controls a panel carries, and none of them invents anything. Close is
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
    const host = context.hasHostSlot('menu') ? context.hostSlot('menu') : null;
    // The views are chosen from this menu too, so more than one of them is a
    // reason for it to stand even with nothing else in it.
    const views = !context.configuring && (context.viewProfiles?.length ?? 0) > 1;
    const record = (context.recordMenuItems?.length ?? 0) > 0 || context.canDeleteRecord;
    if (!items.length && !host && !views && !record) return nothing;

    // Always the menu, never the one item drawn in its place. The place is the
    // panel's own: what belongs in it depends on the task, and a consumer that
    // slots its items into `menu` finds the same «\u2026» wherever it looks --
    // which it could not when one item meant a different glyph in that corner
    // (owner, 2026-10-08).
    // The «⋯» opens the Framework's standard menu (owner, 2026-10-12), and so
    // do the items a host slots into `menu` (owner, 2026-10-14): they were a
    // popover of link buttons, the one menu of the panel drawn otherwise. The
    // slotted elements stay in the page, hidden, and a row of the menu stands
    // for each -- a link row for a link, a press on the element for the rest.
    return html`
        <sf-button-icon
                appearance="ghost"
                scheme="on-surface"
                size=${context.panel ? '1/3' : (context.controlSize ?? nothing)}
                icon="more_horiz"
                data-action="menu"
                aria-haspopup="menu"
                aria-expanded="false"
                aria-label=${context.menuLabel}
                @click=${(event) => context.component.openPanelMenu(event.currentTarget.querySelector('button') ?? event.currentTarget)}
        ></sf-button-icon>
        ${host ? html`<div class="sf-property-view-host-menu" data-host-menu hidden>${host}</div>` : nothing}
    `;
}

// The panel has one head (C157 (6), C180 (2)): «Назад» when a level is open,
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
const TITLE_ROW_STYLE = 'display: flex; align-items: center; gap: var(--sf-space-1\\/3); min-inline-size: 0;'
    + ' min-block-size: calc(var(--sf-ui-2--control-height) - var(--sf-px))';
// The title's box as the sheet sets it (the window step, one line), so the star
// beside it does not move when the sheet comes.
const TITLE_STYLE = 'margin: 0; min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700;'
    + ' font-size: var(--sf-property-view--title-size, var(--sf-drawer--title-size, var(--sf-heading-4--size)));'
    + ' line-height: var(--sf-property-view--title-height, var(--sf-drawer--title-height, var(--sf-heading-4--height)))';
const HEAD_STYLE = 'box-sizing: border-box;'
    + ' margin-inline: calc(-1 * var(--sf-property-view--panel-bleed, var(--sf-drawer-gutter, var(--sf-space-1))));'
    + ' padding-inline: var(--sf-property-view--panel-axis, calc(var(--sf-drawer-gutter, var(--sf-space-1)) + var(--sf-scroll-bg-width, 0px)))';

function renderPanelHead(context) {
    const level = phoneLevel(context);
    const record = context.panelLabel || context.recordLabel || context.recordId || '';
    // The history is a level of the same panel (C305 (2)): the C289 head with
    // the back line to the record over its title.
    const history = context.historyOpen;
    // One row of the ladder's step 2 (48 at a desktop; C289 (6), R254), its
    // buttons the head's 1/3 as sf-drawer draws its own (C180 (2)). A related
    // record opened from this one is drawn inside the same panel (sf-drawer
    // C157 (6)); its way back is the line «← <Запись>» over the title, on the
    // drawer's own back part (data-sf-drawer-back), so the title does not move
    // and the close still closes the whole chain.
    return html`
        <header class="sf-property-view-head flex flex-col" style=${HEAD_STYLE}>
            ${history ? html`<div class="sf-property-view-back">
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
            </div>` : context.nestedUnder ? html`<div class="sf-property-view-back">
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
            </div>` : nothing}
            <div class="sf-property-view-title-row" style=${TITLE_ROW_STYLE}>
                ${level ? html`<sf-button-icon
                        size="1/3"
                        appearance="ghost"
                        scheme="on-surface"
                        icon="arrow_back"
                        data-action="phone-back"
                        aria-label=${context.backLabel}
                        title=${context.backLabel}
                        @click=${() => context.component.closePhoneSection()}
                ></sf-button-icon>` : nothing}
                <h2 class="sf-property-view-title min-w-0 overflow-hidden" style=${TITLE_STYLE} tabindex="-1">${history ? context.word('historyText') : level ? context.phoneSectionLabel : record}</h2>
                ${context.recordId && context.mode !== 'create' && !history ? (context.starLook
                    // The toggle look (C393): off a quiet ghost, on the soft
                    // primary plate with a 1 px primary ring inside, the glyph
                    // kept outline; pressed writes aria-pressed on the native
                    // button, one name says the action.
                    ? html`<sf-button-icon
                        appearance=${context.starLook}
                        size="1/3"
                        icon="star"
                        pressed=${context.favourite ? 'true' : 'false'}
                        data-action="favourite"
                        aria-label=${context.favouriteLabel}
                        title=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>`
                    : html`<sf-button-icon
                        appearance="ghost"
                        scheme="on-surface"
                        size="1/3"
                        icon="star"
                        ?filled=${context.favourite}
                        data-action="favourite"
                        aria-pressed=${context.favourite ? 'true' : 'false'}
                        aria-label=${context.favouriteLabel}
                        @click=${() => context.component.toggleFavourite()}
                ></sf-button-icon>`) : nothing}
                ${context.ownView ? html`<sf-badge class="sf-property-view-own-mark" size="1/2" appearance="tonal" scheme="primary"
                        data-own-view text=${context.word('ownViewText')}></sf-badge>` : nothing}
                <span class="sf-property-view-head-spacer" style="flex: 1 1 auto"></span>
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : nothing}
                ${renderMenuControl(context)}
                <sf-button-close
                        size="1/3"
                        aria-label=${context.closeLabel}
                        data-action="close"
                        @click=${() => context.component.closePanel('close')}
                ></sf-button-close>
            </div>
            ${history || level ? nothing : renderHeadLine(context)}
        </header>
    `;
}

// The line under the title (C289 (6), C311 (2)): the stage as a tonal badge,
// then up to two fields' values joined by « · ». Nothing when the head names
// none: the title alone, as before.
// A card in place (no panel) has no title row of its own -- the page owns the
// title -- so its actions («⋯», the host's) end this line rather than stand
// alone on an empty row above it (view round 12, VHF-6).
function renderHeadLine(context, end = nothing) {
    const line = context.headLine;
    if (!headLineDrawn(context)) return nothing;
    return html`
        <div class="sf-property-view-head-line flex items-cross-center gap-1/3 min-w-0" data-head-line>
            ${line.status ? html`<sf-badge size="1/2" appearance="tonal" scheme=${line.status.scheme}
                    text=${line.status.text} data-head-status=${line.status.key}></sf-badge>` : nothing}
            ${line.subtitle.length ? html`<span class="sf-property-view-head-subtitle color-on-surface-variant min-w-0 overflow-hidden"
                    data-head-subtitle>${line.subtitle.map((item) => item.text).join(' · ')}</span>` : nothing}
            ${end === nothing ? nothing : html`<div class="sf-property-view-head-line-end flex items-cross-center gap-1">${end}</div>`}
        </div>
    `;
}

function headLineDrawn(context) {
    const line = context.headLine;
    return Boolean(line && (line.status || line.subtitle.length));
}

// The actions of a card in place: the host's and the card's menu («⋯»).
function inPlaceActions(context) {
    return Boolean(context.hasHostSlot('actions') || context.hasHostSlot('menu') || context.panelMenuItems.length
        || context.canDeleteRecord || (context.recordMenuItems?.length ?? 0) > 0);
}

// The sections as a list, each a level with «←» (C386): in a side panel the
// rail would leave the fields under 20rem (C403). On a phone the sections
// are tabs on top that a swipe also turns (study S-A 3, VL-86): the list
// with «←» hid the record's title inside a section (SB-19).
function sectionLevels(context) {
    return context.sectionsLayout === 'level';
}

// A section opened on a phone, inside a panel: a level of the panel (C157 (6)).
function phoneLevel(context) {
    return Boolean(context.panel && sectionLevels(context) && (context.sections?.length ?? 0) > 1 && context.phoneSection !== null);
}

// The phone's list screen: below the breakpoint, with more than one section and
// none of them opened. Named once rather than written out at each of the three
// places that ask it -- the first version repeated the expression and the third
// copy was the one that forgot to suppress the groups, so the list screen drew the
// list with a section's groups underneath it.
function onPhoneSectionList(context, sections) {
    // Arranging draws «Вкладки» over the fields at every width (C311 (4)): the
    // phone's list screen is a way to read, not to arrange.
    return !context.configuring && sectionLevels(context) && sections.length > 1 && context.phoneSection === null;
}

// The section being arranged, named where its areas are. The section list is
// drawn by sf-tabs, whose tabs take a label as a string and nothing else, so
// neither a pencil nor a field can stand in the list
// itself -- and a section shown as a tab has no list at all. The name of the
// place you are arranging belongs above the things you are arranging anyway.
function renderSectionBar(context, section, count) {
    if (!section) return nothing;

    return html`
        <div class="sf-property-view-section-bar flex items-cross-center gap-1/4"
             data-section=${String(section.key)}>
            ${context.configuring
                    ? renderSectionIcon(context, section)
                    : html`<i class="sf-icon" aria-hidden="true">${section.icon ? String(section.icon) : 'folder'}</i>`}
            ${renderEntryName(context, 'section', String(section.key),
                    String(section.label ?? section.key), 'sf-property-view-section-title min-w-0')}
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
}

// The glyph a section is marked with, chosen from a grid of them. A column of a
// hundred icons is a column nobody scrolls to the end of, so the dropdown lays
// its options out several to a row and searches by the name of the glyph, which
// is the only thing about an icon a person can type.
function renderSectionIcon(context, section) {
    const current = section.icon ? String(section.icon) : '';
    const options = context.sectionIconChoices.map((icon) => ({
        kind: 'icon',
        icon,
        text: icon,
        value: icon,
        ariaLabel: icon,
        selected: icon === current,
    }));

    // The chooser is the dropdown laid out as a grid: a hundred and twenty
    // glyphs in a column is a column nobody scrolls to the end of, and the
    // search is the only thing about a glyph a person can type. The trigger is
    // the glyph itself, because a field spelling out the name of what is drawn
    // beside it says the same thing twice.
    return html`
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
                @change=${(event) => context.component.setSectionIcon(
                        String(section.key), event.detail?.value ?? '')}
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
}

// Making something new, at the end of the arrangement, where a person who has
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
    return html`
        <div class="sf-property-view-additions flex flex-col items-cross-stretch gap-1">
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? nothing}
                    text=${context.addGroupText}
                    data-action="add-group"
                    @click=${() => context.component.addGroup(section ? String(section.key) : '')}
            ></sf-button>
            <sf-button
                    appearance="outline"
                    scheme="on-surface"
                    size=${context.controlSize ?? nothing}
                    icon-start="add"
                    text=${context.word('newFieldText')}
                    data-action="new-field"
                    @click=${() => context.component.openStructureEditor()}
            ></sf-button>
        </div>
    `;
}

// A new section is made at the end of the sections (owner, 2026-10-08), which is
// where a person looks for one: under the list of them. Without a rail there is
// no list to put it under, so it stands beside «add an area» as before.
function renderAddSection(context) {
    // «+ Вкладка» makes a tab with a «Поля» area (C311 (4)).
    return html`
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
}

// Whether the column of tabs is drawn beside the fields. It holds the tabs and
// nothing else (owner, 2026-10-07), so what used to stand above the whole panel
// -- the band of the arranging mode -- stands above the fields instead, and the
// column reaches the top of the panel the way a rail of tabs does.
function sidebarDrawn(context) {
    const sections = listed(context, context.sections);
    // The rail of a side panel (C403) stands where the column does.
    return Boolean((context.sectionsLayout === 'column' || context.sectionsLayout === 'rail')
        && (sections.length > 1 || context.configuring));
}

// The line of tabs under the head (C289 (1)): a panel narrower than the whole
// screen, or a page that asked for tabs, with more than one section. While the
// view is arranged the sections are rows that take a drop, drawn over the
// groups instead (sectionsStacked).
function lineTabsDrawn(context, sections) {
    return (context.sectionsLayout === 'tabs' || context.sectionsLayout === 'phone') && sections.length > 1 && !context.configuring;
}

// While arranging, «Вкладки» stand over the fields wherever the sections are
// not a column beside them -- tabs, and a narrow card (C311 (4)).
function sectionsStacked(context) {
    return context.configuring && (context.sectionsLayout === 'tabs' || context.sectionsLayout === 'phone');
}

// The errors of a save, from two of them (C182 (6)): a summary over the
// fields with a link to each, which takes the focus; one error takes the
// focus to its field. The look is sf-form's summary (the quiet error
// container), so a record and a form say it the same way.
function renderErrorSummary(context) {
    const list = context.errorList ?? [];
    if (list.length < 2 || !(context.editing || context.openAll)) return nothing;
    return html`<div class="sf-property-view-error-summary" role="alert" tabindex="-1">
        <p class="sf-property-view-error-summary-title">${context.errorsText}: ${list.length}</p>
        <ul class="sf-property-view-error-summary-list">${list.map((error) => html`<li><a href=${`#${error.key}`}
            data-field-link=${error.key}
            @click=${(event) => { event.preventDefault(); context.component.focusField(error.key); }}>${error.label}: ${error.message}</a></li>`)}</ul>
    </div>`;
}

// The record's history (C305 (2), RC-3): sf-list-timeline by day, newest
// first, each change's before and after drawn by its field's template, the
// author and the time; «Показать ещё» asks the host for the next page.
function renderHistoryFeed(context) {
    const feed = context.history;
    const items = feed?.items ?? [];
    const loading = !feed || feed.loading;
    return html`
        <sf-list-timeline class="sf-property-view-history"
                size=${context.size === '1/2' ? '1/2' : nothing}
                group="day"
                label=${context.word('historyText')}
                .items=${items}
                ?has-more=${Boolean(feed?.hasMore)}
                ?loading=${loading}
                empty-text=${feed?.failed ? context.word('historyFailedText') : context.word('historyEmptyText')}
                @sf-list-timeline-load-more=${() => context.component.loadHistory({more: true})}
        ></sf-list-timeline>
    `;
}

// The full screen from 80rem: the history in a column of its own beside the
// fields (C305 (3), VP-22), --sf-view-properties-side-width (24rem).
function renderHistorySide(context) {
    return html`
        <aside class="sf-property-view-side min-w-0" aria-label=${context.word('historyText')}>
            <div class="sf-property-view-side-title" role="heading" aria-level="3">${context.word('historyText')}</div>
            ${renderHistoryFeed(context)}
        </aside>
    `;
}

// The record on its way: the arrangement's shape in the Framework's skeleton
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
const groupSurface = (context) => (context.panel ? 'bg-surface-card' : 'bg-surface-page');

const SKELETON_WIDTHS = ['w-1/3', 'w-2/3', 'w-1/2', 'w-3/4', 'w-2/5'];
const SKELETON_GROUPS = 3;
const SKELETON_FIELDS = 3;
function renderLoading(context) {
    const bar = (at) => html`<div class="sf-skeleton sf-skeleton--animation-pulse" aria-hidden="true"><div class="sf-skeleton-text sf-skeleton-text--size-1 ${SKELETON_WIDTHS[at % SKELETON_WIDTHS.length]}"></div></div>`;
    // The section tabs are drawn with the skeleton, in the box the tabs take
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
    const tabs = html`<div class="sf-property-view-tabs sf-property-view-tabs--skeleton" aria-hidden="true" data-sf-skeleton="tabs" data-sections-as=${context.sectionsLayout === 'tabs' ? 'tabs' : 'list'} data-size=${context.size}><div class="sf-tabs-top-container"><div class="sf-property-view-tabs-skeleton-strip flex items-cross-center gap-2">${[0, 1, 2].map((at) => html`<div class="flex-none" style="inline-size: 6rem">${bar(at + 3)}</div>`)}</div></div></div>`;
    return html`${tabs}<div class="sf-property-view-loading flex flex-col gap-4" data-state="loading">${Array.from({length: SKELETON_GROUPS}, (_, group) => html`<section class="sf-property-view-group ${groupSurface(context)} flex flex-col gap-2" aria-busy="true"><header class="sf-property-view-group-header flex items-cross-center content-main-between gap-2"><div class="flex-1">${bar(group)}</div></header>${Array.from({length: SKELETON_FIELDS}, (_, field) => bar(group + field + 1))}</section>`)}<span class="sr-only" role="status">${context.message}</span></div>`;
}

function renderLoadFailure(context) {
    const failure = context.loadFailure;
    return html`<sf-empty-state kind=${failure.kind} size=${context.size === '1/2' ? '1/2' : '1'} heading-level="2"
        text=${failure.text || nothing}
        .actions=${failure.kind === 'error' ? null : []}
        @sf-empty-state-action=${(event) => { if (event.detail?.id === 'retry') context.component.load('retry'); }}></sf-empty-state>`;
}

function renderBody(context, railOutside = false, withActions = true) {
    if (context.loading) return renderLoading(context);
    if (context.loadFailure) return renderLoadFailure(context);
    // In place, the history level stands where the record was, its back line
    // over it (a panel draws it under its head).
    if (!context.panel && context.historyOpen) {
        const record = context.panelLabel || context.recordLabel || context.recordId || '';
        return html`
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
    }
    // Sections are listed the same way fields and groups are while the view is
    // being configured: a hidden section filtered out here would be a section
    // nobody could ever show again.
    const sections = listed(context, context.sections);
    const current = sections.find((section) => String(section.key) === context.selectedSection)
        ?? sections[0] ?? null;

    return html`
        <div class="sf-property-view-status" role="status" aria-live="polite" ?hidden=${!context.message}>
            ${context.message}
        </div>
        ${!context.panel && inPlaceActions(context) && !headLineDrawn(context)
                ? html`
                    <div class="sf-property-view-host-actions flex flex-wrap items-cross-center justify-end gap-1">
                        ${context.hasHostSlot('actions') ? context.hostSlot('actions') : nothing}
                        ${renderMenuControl(context)}
                    </div>`
                : nothing}
        ${context.panel ? nothing : renderHeadLine(context, inPlaceActions(context) ? html`
                ${context.hasHostSlot('actions') ? context.hostSlot('actions') : nothing}
                ${renderMenuControl(context)}` : nothing)}
        ${onPhoneSectionList(context, sections) ? renderPhoneSectionList(context, sections) : nothing}
        ${lineTabsDrawn(context, sections) ? renderSectionTabs(context, sections) : nothing}
        <div class="sf-property-view-layout"
             @pointerdown=${(event) => context.component.sectionSwipeStart(event)}
             style=${`--sf-property-view--sections-width: ${context.sectionsWidth};${context.panel ? '' : sizeStyle(context)}`}
             data-sections=${String(sections.length)}
             data-screen=${onPhoneSectionList(context, sections) ? 'sections' : 'groups'}
             data-stacked=${sectionsStacked(context) ? 'true' : nothing}>
            ${!context.panel && !context.wide && !context.configuring && sections.length > 1 && context.phoneSection !== null
                    ? renderPhoneSectionHead(context)
                    : nothing}
            ${onPhoneSectionList(context, sections) ? renderViewChooser(context) : nothing}
            ${sectionsStacked(context) ? renderConfigureTop(context) : nothing}
            ${(sidebarDrawn(context) && !railOutside) || sectionsStacked(context) ? renderSectionList(context, sections) : nothing}
            ${context.isEmptyRecord && !context.configuring
                    ? html`<p class="sf-property-view-empty-record color-on-surface-variant"
                              role="status">${context.emptyRecordText}</p>`
                    : nothing}
            ${onPhoneSectionList(context, sections) ? nothing : context.configuring
                    ? html`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4" data-arranging
                             data-size=${context.size === '1/2' ? 'half' : '1'}>
                            ${sectionsStacked(context) ? nothing : renderConfigureTop(context)}
                            ${renderSectionBar(context, current, sections.length)}
                            <sf-sortable
                                    class="sf-property-view-groups flex flex-col gap-4"
                                    group="group"
                                    accepts="group"
                                    id=${`group:${current ? String(current.key) : ''}`}
                                    label=${String(current?.label ?? current?.key ?? '')}
                            >${listed(context, current?.groups).map((group) => renderGroup(context, current, group))}</sf-sortable>
                            ${renderArrangementAdditions(context, current)}
                            ${renderUnplaced(context)}
                        </div>`
                    : html`
                        <div class="sf-property-view-body flex-auto min-w-0 flex flex-col gap-4">
                            ${renderViewChooser(context)}
                            ${renderErrorSummary(context)}
                            <div class="sf-list-description sf-list-description--size-${context.size === '1/2' ? 'half' : '1'} sf-list-description--layout-auto sf-list-description--sections sf-property-view-list">
                                <div class="sf-list-description-list">${context.visible(current?.groups).map((group) => renderGroup(context, current, group))}</div>
                            </div>
                        </div>`}
            ${!context.panel && context.historySide ? renderHistorySide(context) : nothing}
        </div>
        ${withActions && context.hasHostSlot('footer')
                ? html`<div class="sf-property-view-host-footer flex flex-wrap items-cross-center gap-1/3">${context.hostSlot('footer')}</div>`
                : nothing}
        ${withActions ? renderActions(context) : nothing}
    `;
}

// A deeper window is narrower by a step, so the one below shows along the
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
export function renderPropertyViewTemplate(context) {
    if (!context.panel) return renderBody(context);

    // The panel is laid out the way a page is (owner, 2026-10-08): a head across
    // the top, a foot across the bottom, and what is between them scrolling
    // under both. The bands were sticky inside the panel's own scroller before,
    // which held them only while their containing block was on screen -- so a
    // record scrolled far enough took its own head and foot with it.
    //
    // With a rail of tabs what is between them is two columns, each with its own
    // scrollbar: a long list of sections scrolls without moving the record, and
    // a long record scrolls without moving the list.
    const rail = sidebarDrawn(context);

    // `show-close` is off because the panel draws its own close, sf-button-close
    // last in its head (1.16.0; it stood in the strip beside copy-link and
    // open-full before). With both, a panel carried two close
    // buttons a step apart, and on a phone neither was reachable: the strip is
    // placed a gutter's width beyond the panel's inline start, which on a
    // full-screen drawer is off the screen.
    return html`
        <sf-drawer
                ?open=${context.panelOpen}
                placement="inline-end"
                modal="true"
                overlay="true"
                ?docked=${context.docked}
                dock-breakpoint=${context.docked ? context.dockBreakpoint : nothing}
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
                 data-nested=${context.nestedUnder ? 'true' : nothing}
            >
                ${renderPanelHead(context)}
                <div class="sf-property-view-scroll flex-auto min-h-0 ${rail && !context.historyOpen ? 'flex' : 'flex flex-col'}"
                     data-history=${context.historyOpen ? 'level' : context.historySide ? 'side' : nothing}>
                    ${context.historyOpen
                            ? html`<div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">${renderHistoryFeed(context)}</div>`
                            : rail
                            ? html`
                                ${renderSectionList(context, listed(context, context.sections))}
                                <div class="sf-property-view-frame flex-auto min-w-0 flex flex-col gap-2">
                                    ${renderBody(context, true, false)}
                                </div>
                                ${context.historySide ? renderHistorySide(context) : nothing}`
                            : renderBody(context, false, false)}
                </div>
                ${renderActions(context, {panel: true})}
            </div>
        </sf-drawer>
    `;
}
