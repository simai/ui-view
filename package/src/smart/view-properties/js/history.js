import {renderCellField} from '../../field-renderers/index.js';
import {HISTORY_KINDS, cellText} from './history-port.js';

export {HISTORY_KINDS, historyFromRevisions} from './history-port.js';

// The record's change history drawn as sf-list-timeline items (C305 (2),
// RC-3); the port and its adapter are in js/history-port.js.

export function valueText(field, value, host) {
    if (value === null || value === undefined || value === '') return '';
    const own = typeof value === 'object' ? String(value.label ?? value.name ?? value.text ?? '') : String(value);
    if (!field) return own;
    let drawn = null;
    try {
        drawn = renderCellField(field, value, host);
    } catch {
        drawn = null;
    }
    const text = cellText(drawn).replace(/\s+/gu, ' ').trim();
    return text || own;
}

/**
 * The port's events as sf-list-timeline items: the actor, the time, a title by
 * kind, and every change's before and after drawn by its field's template.
 * `words` are the card's (historyCreate…), `fieldOf(key)` finds a descriptor.
 */
export function timelineItems(events, {words, fieldOf, host}) {
    return (Array.isArray(events) ? events : []).filter((event) => event && event.id !== undefined).map((event) => {
        const kind = HISTORY_KINDS.includes(event.kind) ? event.kind : 'update';
        const all = Array.isArray(event.changes) ? event.changes : [];
        // A sealed field (encrypted, closed by rights) is named, never drawn.
        const sealed = all.filter((change) => change && change.sealed === true)
            .map((change) => String(change.label ?? fieldOf(String(change.field ?? ''))?.label ?? change.field ?? ''));
        const changes = all.filter((change) => change && change.sealed !== true).map((change) => {
            const field = fieldOf(String(change.field ?? ''));
            return {
                label: String(change.label ?? field?.label ?? change.field ?? ''),
                before: valueText(field, change.before, host),
                after: valueText(field, change.after, host),
            };
        });
        const actor = event.actor && typeof event.actor === 'object' ? event.actor : event.actor ? {name: String(event.actor)} : null;
        const count = changes.length + sealed.length;
        const title = kind === 'update'
            ? (count === 1 ? words.historyChangedOne.replace('{field}', changes[0]?.label ?? sealed[0]) : words.historyChangedMany.replace('{n}', String(count)))
            : words[`history${kind[0].toUpperCase()}${kind.slice(1)}`];
        return {
            id: String(event.id),
            ...(event.time ? {time: String(event.time)} : {}),
            ...(actor ? {actor} : {}),
            title,
            ...(kind === 'delete' ? {status: 'error'} : kind === 'publish' || kind === 'restore' ? {status: 'success'} : {}),
            ...(changes.length === 1 ? {change: changes[0]} : changes.length > 1 ? {changes} : {}),
            ...(sealed.length ? {text: words.historySealed.replace('{fields}', sealed.join(', '))} : {}),
        };
    });
}
