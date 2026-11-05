# SIMAI View

The component set `view` of SIMAI Framework: `sf-view`, `sf-view-table`,
`sf-view-properties` and the data views to come. Read `README.md`,
`package/README.md` and `docs/SET-TEMPLATE.md` first.

- Write only in this repository. A missing Framework part (a token, a
  utility, a core API, a Loader change, the registry entry) is ordered from
  the SIMAI Framework dispatcher (work `task-fcda784dfeba45c1bf64`) through
  the Federation bus, never written in `simai/ui-source` or `simai/ui-pro`
  from here. A missing Docara feature is a request to the Docara thread.
- Follow standard `simai.component-set` 1.0.0 and the Smart component
  standard of the pinned ui-source; the set describes its own components in
  `package/set.json`.
- Pin exact SIMAI Framework releases (`ui-<12>`, the ui-source revision of
  its release lock); never `latest` or `main`.
- Every component entering the set passes the framework-first review: what
  another set or product could use is ordered from SIMAI Framework first.
- English in code, commits, docs and evidence; site content in Russian;
  interface text RU/EN through dictionaries.
- No secrets, `.env`, real customer data or local paths in the repository.
- Nothing is published (npm, release, site deploy, opening the repository)
  without the dispatcher's release route and the owner's yes.
