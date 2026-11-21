// The cards layout's reading of its options and of a record, kept apart from
// the element so a unit can hold it without a page (owner decisions C297,
// C306, C300, C302; study ui-control control/research/2026-11-18-cards-view,
// section 5; options under layouts.cards of the draft simai.view-config/1).
//
// Nothing here draws or asks the host: it reads the options, picks the cover
// of a record, says how a field is aligned, which card is next to which, and
// the words of an announcement.

export const PER_PAGE = 24;
export const CARD_FIELDS_MAX = 4;
export const SIZES = Object.freeze(["s", "m", "l"]);
export const RATIOS = Object.freeze({"1:1": "1 / 1", "4:3": "4 / 3", "3:4": "3 / 4", "16:9": "16 / 9"});
export const FITS = Object.freeze(["cover", "contain"]);
// A field of one of these types reads as a number or a date: it stands at the
// end of its row, in tabular digits (study 5, «Decided by the helper»).
const NUMERIC = new Set(["integer", "number", "decimal", "money", "percent", "date", "datetime", "time", "duration", "file"]);
// File templates whose value is a picture (C302).
const IMAGE_TEMPLATES = new Set(["image", "image_card", "image_list", "image-card", "image-list"]);
const IMAGE_FILE = /\.(avif|bmp|gif|jpe?g|png|svg|webp)(\?|#|$)/iu;

const list = (value) => (Array.isArray(value) ? value.map((item) => String(item)) : []);
export const typeOf = (field) => String(field?.propertyType ?? field?.property_type ?? field?.type ?? "");

/** Whether a field holds pictures: a file field in an image template (variant, template). */
export function isImageField(field) {
    if (!field || typeOf(field) !== "file" && typeOf(field) !== "image") return false;
    if (typeOf(field) === "image") return true;
    return IMAGE_TEMPLATES.has(String(field.variant ?? field.template ?? ""));
}

/**
 * layouts.cards of view-config/1 with its defaults (study 5, the options table;
 * C306: size S/M/L, fit cover by default, «Показать ещё»).
 * cover_field: a file field or null; unset, the first image field, else none.
 */
export function cardsOptions(options = {}, fields = []) {
    const given = options && typeof options === "object" && !Array.isArray(options) ? options : {};
    const known = new Map(fields.map((field) => [String(field.key), field]));
    const titleField = given.title_field !== undefined && given.title_field !== null
        ? String(given.title_field)
        : String(fields.find((field) => field.title === true)?.key ?? (known.has("title") ? "title" : known.has("name") ? "name" : "title"));
    let coverField = null;
    if (Object.hasOwn(given, "cover_field")) {
        coverField = given.cover_field === null || given.cover_field === "" ? null : String(given.cover_field);
    } else {
        coverField = fields.find((field) => isImageField(field))?.key ?? null;
        if (coverField !== null) coverField = String(coverField);
    }
    const cover = given.cover && typeof given.cover === "object" ? given.cover : {};
    const fit = FITS.includes(cover.fit) ? cover.fit : "cover";
    const ratio = Object.hasOwn(RATIOS, cover.ratio) ? cover.ratio : "4:3";
    const shown = fields.filter((field) => String(field.key) !== titleField && String(field.key) !== coverField
        && field.title !== true && field.visible !== false && field.hidden !== true);
    const cardFields = (Array.isArray(given.card_fields) ? list(given.card_fields) : shown.map((field) => String(field.key)))
        .filter((key) => key !== titleField && key !== coverField && (!known.size || known.has(key)))
        .slice(0, CARD_FIELDS_MAX);
    const perPage = Number.isSafeInteger(given.per_page) && given.per_page > 0 ? given.per_page : PER_PAGE;
    return {
        coverField,
        cover: {fit, ratio},
        titleField,
        cardFields,
        // Labels over their values unless the view turns them off (D3).
        cardLabels: given.card_labels !== false,
        size: SIZES.includes(String(given.size)) ? String(given.size) : "m",
        density: given.density === "compact" ? "compact" : "default",
        // Only «Показать ещё» is drawn (C306); a written pages is kept for
        // the settings it came from and read as the button.
        more: "button",
        perPage,
    };
}

/** How many columns a phone draws (C306, q-phone В): S two, M and L one. */
export function phoneColumns(size) {
    return size === "s" ? 2 : 1;
}

/**
 * A record's cover from its file value: {src, width, height} for a picture,
 * {icon} for another file (its type's icon on the tint), null for none.
 * A list takes its first picture (else its first file). A host gives a
 * thumbnail of the width needed in thumb {"480": href}.
 */
export function coverOf(value, width = 480) {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) {
        const files = value.filter((item) => item !== null && item !== undefined && item !== "");
        return coverOf(files.find((item) => pictureOf(item)) ?? files[0] ?? null, width);
    }
    if (typeof value === "string") return IMAGE_FILE.test(value) || value.startsWith("data:image/") ? {src: value} : {icon: fileIcon("", value)};
    if (typeof value !== "object") return null;
    const picture = pictureOf(value);
    if (picture) {
        const thumb = value.thumb && typeof value.thumb === "object" ? thumbFor(value.thumb, width) : null;
        const size = (key) => (Number.isFinite(Number(value[key])) && Number(value[key]) > 0 ? Math.round(Number(value[key])) : null);
        return {src: thumb ?? picture, width: size("width") ?? size("w"), height: size("height") ?? size("h")};
    }
    return {icon: fileIcon(value.mime ?? value.type ?? "", value.label ?? value.name ?? value.href ?? "")};
}

function pictureOf(value) {
    if (!value || typeof value !== "object") return typeof value === "string" && IMAGE_FILE.test(value) ? value : null;
    const href = value.href ?? value.url ?? value.src ?? null;
    if (!href) return null;
    const mime = String(value.mime ?? value.type ?? "");
    if (mime.startsWith("image/")) return String(href);
    if (!mime && (IMAGE_FILE.test(String(href)) || String(href).startsWith("data:image/") || IMAGE_FILE.test(String(value.label ?? value.name ?? "")))) return String(href);
    return null;
}

// The smallest thumbnail at least as wide as the frame, else the widest.
function thumbFor(thumb, width) {
    const entries = Object.entries(thumb).map(([key, href]) => [Number.parseInt(key, 10), href]).filter(([key, href]) => Number.isFinite(key) && href);
    if (!entries.length) return null;
    entries.sort((a, b) => a[0] - b[0]);
    return String((entries.find(([key]) => key >= width) ?? entries[entries.length - 1])[1]);
}

/** The Material Symbols name of a file's type, for a cover that is not a picture. */
export function fileIcon(mime = "", name = "") {
    const type = String(mime).toLowerCase();
    const file = String(name).toLowerCase();
    if (type === "application/pdf" || file.endsWith(".pdf")) return "picture_as_pdf";
    if (type.startsWith("video/")) return "movie";
    if (type.startsWith("audio/")) return "audio_file";
    if (/spreadsheet|excel|csv/u.test(type) || /\.(xlsx?|csv|ods)$/u.test(file)) return "table_chart";
    if (/zip|compressed|tar/u.test(type) || /\.(zip|rar|7z|tar|gz)$/u.test(file)) return "folder_zip";
    return "description";
}

/**
 * Where a field stands on its row: the first column at its start whatever it
 * holds; in the second, numbers, dates and files at the end (VC-1, the
 * accepted prototype's END).
 */
export function fieldAlign(field, index = 1) {
    return NUMERIC.has(typeOf(field)) && index % 2 === 1 ? "end" : "start";
}

/** A record's title from the title field (else title, name, id), as text. */
export function titleOf(record, key = "title") {
    const value = record?.[key] ?? record?.title ?? record?.name ?? record?.id;
    if (value && typeof value === "object") return String(value.label ?? value.title ?? value.name ?? "");
    return String(value ?? "");
}

/**
 * The card a key goes to in a grid of `count` cards drawn in rows of
 * `columns` (C146 (8): one Tab stop, the arrows by the rows as drawn).
 * Returns the index, or null for a key the grid does not take.
 */
export function gridStep(key, index, {count, columns, ctrl = false, rtl = false, page = 3}) {
    const n = Math.max(1, columns | 0);
    if (count <= 0) return null;
    const rowStart = index - (index % n);
    const left = rtl ? 1 : -1;
    let to = null;
    switch (key) {
    case "ArrowRight": to = index - left; break;
    case "ArrowLeft": to = index + left; break;
    case "ArrowDown": to = index + n; break;
    case "ArrowUp": to = index - n; break;
    case "Home": to = ctrl ? 0 : rowStart; break;
    case "End": to = ctrl ? count - 1 : Math.min(count - 1, rowStart + n - 1); break;
    case "PageDown": to = Math.min(count - 1, index + n * page); break;
    case "PageUp": to = Math.max(0, index - n * page); break;
    default: return null;
    }
    if (to < 0 || to >= count) return index;
    return to;
}

/** A word with {name} placeholders filled in. */
export function format(text, vars = {}) {
    return String(text ?? "").replace(/\{([a-z]+)\}/gu, (whole, name) => (Object.hasOwn(vars, name) ? String(vars[name]) : whole));
}
