// A table the page wrote inside a list (<sf-view><sf-view-table slot="content">)
// is asked for as soon as the package core runs, not only when sf-view asks for
// its parts. sf-view relates to the table lazily (view modular step 1: a list
// of another kind does not fetch it), and the Loader does not read the parts
// inside a Smart element that is not defined yet: without this, a table in the
// markup waited for sf-view's script, and when that script failed or came late
// the table no longer drew on its own (sf-view-table 1.18.1, saved-views r2 D2;
// tests/browser/data-view-table-without-view.browser.mjs). The core comes first
// as a relation of both elements, so the table is asked for at the time the
// eager relation asked for it. Nothing is asked for on a page without such a
// table.
const LIST = "sf-view, sf-data-view";
const TABLE = "sf-view-table, sf-table";

function askForMarkupTable() {
    const registry = globalThis.customElements;
    const loader = globalThis.SF?.Loader;
    if (typeof loader?.ensure !== "function" || typeof registry?.get !== "function") return;
    const table = [...globalThis.document.querySelectorAll(TABLE)].find((node) => node.parentElement?.closest?.(LIST));
    if (!table || registry.get(table.localName)) return;
    loader.ensure([table.localName], {timeout: Infinity});
}

if (globalThis.document?.querySelectorAll) {
    if (globalThis.document.readyState === "loading") {
        globalThis.document.addEventListener("DOMContentLoaded", askForMarkupTable, {once: true});
    } else {
        askForMarkupTable();
    }
}

export const markupTableAsked = true;
