// What sf-view-property-block knows about its fields and its answer, as plain
// functions: the groups it draws, the fields a condition shows, the values a
// Send carries, the required fields left empty and the host's answer read.
// No rendering and no DOM, so the contract test runs them as they are.
//
// The field descriptors are sf-view-properties' (simai.property-view-port), and
// a field's `when` is read with that component's own conditions module.
import {fieldConditions} from "../../view-properties/js/conditions.js";

const keyOf = (field) => (field && field.key !== undefined && field.key !== null ? String(field.key) : "");

/**
 * The groups the block draws: the host's groups, or its flat fields as one
 * group without a label. A group or a field without a key is left out: a value
 * nobody can name cannot be sent back.
 */
export function groupsOf({fields = [], groups = []} = {}) {
    const given = Array.isArray(groups) && groups.length
        ? groups
        : [{key: "", label: "", fields: Array.isArray(fields) ? fields : []}];
    return given
        .filter((group) => group && typeof group === "object")
        .map((group, index) => ({
            key: group.key !== undefined && group.key !== null && String(group.key) !== "" ? String(group.key) : `group-${index + 1}`,
            label: group.label ? String(group.label) : "",
            collapsible: group.collapsible === true && Boolean(group.label),
            collapsed: group.collapsible === true && Boolean(group.label) && group.collapsed === true,
            fields: (Array.isArray(group.fields) ? group.fields : []).filter((field) => field && typeof field === "object" && keyOf(field)),
        }));
}

/** Every field of every group, in order. */
export function allFields(groups) {
    return groups.flatMap((group) => group.fields);
}

/**
 * Every field's value as it stands on screen: what the host gave, or what the
 * person typed and has not sent. The conditions read these, so a field appears
 * the moment the value it waits for is chosen.
 */
export function valuesOnScreen(groups, changed = new Map()) {
    const values = new Map();
    for (const field of allFields(groups)) {
        const key = keyOf(field);
        values.set(key, changed.has(key) ? changed.get(key) : field.value);
    }
    return values;
}

/** The fields of a group that are drawn: not hidden, and shown by their condition. */
export function shownFields(fields, values) {
    return (fields ?? []).filter((field) => field.hidden !== true && (!field.when || fieldConditions(field, values).visible));
}

/** A field as its conditions make it now: required as `when.required` says, read-only while `when.enabled` does not hold. */
export function conditionedField(field, values) {
    if (!field?.when) return field;
    const decided = fieldConditions(field, values);
    return {...field, required: decided.required, readonly: field.readonly === true || !decided.enabled};
}

/** Whether a field's condition turns it off now (drawn disabled where the renderer set draws disabled apart). */
export function fieldDisabled(field, values) {
    return Boolean(field?.when) && !fieldConditions(field, values).enabled;
}

/** Nothing: null, an empty text, an empty list, or a {value} holding nothing. */
export function isEmptyValue(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object" && "value" in value) return isEmptyValue(value.value);
    return false;
}

// The fields a Send answers for: drawn, and open to the person (not read-only,
// not turned off by a condition).
function answeredFields(groups, values) {
    return groups.flatMap((group) => shownFields(group.fields, values))
        .map((field) => conditionedField(field, values))
        .filter((field) => field.readonly !== true);
}

/** The keys of the required fields a Send would leave empty, in the order they are drawn. */
export function missingRequired(groups, changed = new Map()) {
    const values = valuesOnScreen(groups, changed);
    return answeredFields(groups, values)
        .filter((field) => field.required === true && isEmptyValue(values.get(keyOf(field))))
        .map(keyOf);
}

/**
 * What a Send carries: every drawn, editable field by key -- the whole answer,
 * not the changes. A field its condition hides is left out, as the record
 * component leaves it out of a save. An empty field is sent as null.
 */
export function answerValues(groups, changed = new Map()) {
    const values = valuesOnScreen(groups, changed);
    return Object.fromEntries(answeredFields(groups, values).map((field) => {
        const value = values.get(keyOf(field));
        return [keyOf(field), value === undefined ? null : value];
    }));
}

const SETTLE_CLOSED = new Set(["closed", "expired"]);

/**
 * The host's answer to a Send or a Cancel, in the record port's words, as the
 * state the block goes to: {state, errors, message, values}.
 *   applied                      accepted (Send) or declined (Cancel)
 *   refused, reason closed|expired   expired
 *   refused (anything else)      open again, with the field errors and the sentence
 * `accepted` is the answer the person gave (true for Send).
 */
export function readSettle(result, {accepted = true} = {}) {
    const answer = result?.answer;
    const message = typeof result?.message === "string" && result.message.trim() ? result.message : "";
    if (answer === "applied") {
        const values = result.values && typeof result.values === "object" && !Array.isArray(result.values) ? {...result.values} : null;
        return {state: accepted ? "accepted" : "declined", errors: {}, message: "", values};
    }
    if (answer === "refused" && SETTLE_CLOSED.has(result?.reason)) return {state: "expired", errors: {}, message, values: null};
    const errors = result?.errors && typeof result.errors === "object" && !Array.isArray(result.errors)
        ? Object.fromEntries(Object.entries(result.errors).filter(([, text]) => typeof text === "string" && text.trim()))
        : {};
    return {state: "open", errors, message, values: null};
}
