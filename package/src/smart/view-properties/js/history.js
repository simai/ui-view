import {render} from 'lit';
import {renderCellField} from '../../field-renderers/index.js';

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
//               label is the host's when the field is not in the arrangement
//   has_more  whether «Показать ещё» asks for another page
//   cursor    what the next ask carries (the oldest event's revision); absent,
//             the last event's id is sent
//
// kinds narrows the events: ["update"] is «Только изменения полей», null is
// every event. The host pages; the card never asks for the whole history.
//
// historyFromRevisions is the adapter for a host that stores a full snapshot
// of the values per revision (Larena: operation, created_by, created_at,
// revision): an event is the difference of two neighbouring revisions. It is
// published on the element class (SfPropertyView.historyFromRevisions) so a
// host's port answers record.history with it, and the probes and the docs'
// demo source drive the same code.

export const HISTORY_KINDS = ['create', 'update', 'delete', 'restore', 'publish'];

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * The port's answer to record.history from stored revisions. `revisions` are
 * [{revision, operation, created_by, created_at, values}] in any order; `fields`
 * the record's field descriptors (their order and labels); `cursor` the revision
 * the next page starts below (null: the newest); `kinds` null or a list of the
 * kinds to keep; `limit` the page size.
 */
export function historyFromRevisions(revisions, {fields = [], cursor = null, kinds = null, limit = 20} = {}) {
    const list = (Array.isArray(revisions) ? revisions : [])
        .filter((one) => one && one.revision !== undefined && one.revision !== null)
        .slice()
        .sort((a, b) => Number(a.revision) - Number(b.revision));
    const order = fields.map((field) => String(field.key ?? '')).filter(Boolean);
    const labels = new Map(fields.map((field) => [String(field.key ?? ''), String(field.label ?? field.key ?? '')]));
    const events = [];
    for (let at = list.length - 1; at >= 0; at -= 1) {
        const one = list[at];
        const before = at > 0 ? (list[at - 1].values ?? {}) : {};
        const after = one.values ?? {};
        const kind = HISTORY_KINDS.includes(one.operation) ? one.operation : 'update';
        const keys = [...new Set([...order, ...Object.keys(after), ...Object.keys(before)])];
        const changes = kind === 'update'
            ? keys.filter((key) => !same(before[key], after[key]))
                .map((key) => ({field: key, label: labels.get(key) ?? key, before: before[key] ?? null, after: after[key] ?? null}))
            : [];
        if (kind === 'update' && !changes.length) continue;
        events.push({id: `revision-${one.revision}`, revision: one.revision, time: one.created_at ?? null,
            actor: one.created_by ?? null, kind, changes});
    }
    const below = cursor === null || cursor === undefined || cursor === '' ? Infinity : Number(cursor);
    const wanted = Array.isArray(kinds) && kinds.length ? new Set(kinds) : null;
    const left = events.filter((event) => Number(event.revision) < below && (!wanted || wanted.has(event.kind)));
    const page = left.slice(0, Math.max(1, limit));
    const more = left.length > page.length;
    return {
        answer: 'applied',
        events: page.map(({revision, ...event}) => event),
        has_more: more,
        cursor: more ? String(page.at(-1).revision) : null,
    };
}

// A value as its template draws it in the compact place (C302: the table's
// cell, «Кратко»), read as text: sf-change takes text (C279). An element the
// template draws (a badge, a person) gives its text or label attribute.
function plainText(node) {
    let out = '';
    for (const child of node.childNodes) {
        if (child.nodeType === 3) out += child.textContent;
        else if (child.nodeType === 1) {
            if (child.matches?.('.sf-icon, [aria-hidden="true"]') && !child.getAttribute('text')) continue;
            const own = child.childNodes.length ? plainText(child) : '';
            out += own.trim() ? own : (child.getAttribute('text') || child.getAttribute('label') || '');
            if (getComputedStyle?.(child)?.display === 'block') out += ' ';
        }
    }
    return out;
}

export function valueText(field, value, host) {
    if (value === null || value === undefined || value === '') return '';
    if (!field) return typeof value === 'object' ? String(value.label ?? value.name ?? value.text ?? JSON.stringify(value)) : String(value);
    const box = globalThis.document?.createElement?.('div');
    if (!box) return String(value);
    let drawn = null;
    try {
        drawn = renderCellField(field, value, host);
    } catch {
        drawn = null;
    }
    if (drawn === null || drawn === undefined) return typeof value === 'object' ? String(value.label ?? value.name ?? '') : String(value);
    render(drawn, box);
    const text = plainText(box).replace(/\s+/gu, ' ').trim();
    render(null, box);
    return text || (typeof value === 'object' ? String(value.label ?? value.name ?? '') : String(value));
}

/**
 * The port's events as sf-list-timeline items: the actor, the time, a title by
 * kind, and every change's before and after drawn by its field's template.
 * `words` are the card's (historyCreate…), `fieldOf(key)` finds a descriptor.
 */
export function timelineItems(events, {words, fieldOf, host}) {
    return (Array.isArray(events) ? events : []).filter((event) => event && event.id !== undefined).map((event) => {
        const kind = HISTORY_KINDS.includes(event.kind) ? event.kind : 'update';
        const changes = (Array.isArray(event.changes) ? event.changes : []).map((change) => {
            const field = fieldOf(String(change.field ?? ''));
            return {
                label: String(change.label ?? field?.label ?? change.field ?? ''),
                before: valueText(field, change.before, host),
                after: valueText(field, change.after, host),
            };
        });
        const actor = event.actor && typeof event.actor === 'object' ? event.actor : event.actor ? {name: String(event.actor)} : null;
        const title = kind === 'update'
            ? (changes.length === 1 ? words.historyChangedOne.replace('{field}', changes[0].label) : words.historyChangedMany.replace('{n}', String(changes.length)))
            : words[`history${kind[0].toUpperCase()}${kind.slice(1)}`];
        return {
            id: String(event.id),
            ...(event.time ? {time: String(event.time)} : {}),
            ...(actor ? {actor} : {}),
            title,
            ...(kind === 'delete' ? {status: 'error'} : kind === 'publish' || kind === 'restore' ? {status: 'success'} : {}),
            ...(changes.length === 1 ? {change: changes[0]} : changes.length > 1 ? {changes} : {}),
        };
    });
}
