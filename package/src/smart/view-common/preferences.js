// SIMAI View package core (package.json simai.core, ui-builder libs/packageCore.js):
// built once as smart/view-common and taken by the other View bundles as
// SF.runtimeModule("view/preferences", 1) instead of a copy in each bundle.
// The Framework preferences store (the bundled fallback of SF.preferences).
export * from '../../core/js/preferences.js';
export {default} from '../../core/js/preferences.js';
