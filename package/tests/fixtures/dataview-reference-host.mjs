// A reference host for the data view port. It stores records, column settings
// and saved views in memory and answers intents the way the port declares, so
// a break in the seam is found here and not in a product.

const clone = (value) => JSON.parse(JSON.stringify(value ?? null));

export const createReferenceHost = (state = {}) => {
  const records = new Map((state.records ?? []).map((record) => [String(record.id), clone(record)]));
  const filtersSupported = new Set(state.filters_supported ?? ['status', 'owner']);
  const capabilities = new Set(state.capabilities ?? ['saved-views', 'shared-column-settings', 'bulk-under-filter', 'row-actions']);
  const sharedOnly = new Set(state.shared_only_fields ?? ['pinned']);
  const savedViews = new Map((state.saved_views ?? []).map((view) => [view.key, clone(view)]));
  // Port 1.16.0: a saved view names its level -- system, shared or personal;
  // package is 1.15.0's name of system, read as system until 2027-01-01. A
  // system view ships with the product and is never written through the port.
  const levelOf = (view) => (view?.level === 'package' ? 'system' : view?.level ?? null);
  // Port 1.16.0 personal-preferences: one layer of this person's view state
  // (page size, the view zone, the view opened last) with its revision, sent
  // with every answer to query.change and merged by preferences.save. A host
  // that does not offer the capability (a guest's page) keeps none.
  let preferences = state.preferences ? clone(state.preferences) : null;
  let preferencesRevision = 0;
  const layers = clone(state.column_settings?.layers) ?? {};
  const store = state.store ?? 'up';
  // A host that counts every answer is the ordinary case. One that does not
  // leaves the total out and answers has_next, and gives the number only when
  // it is asked for.
  const counts = state.counts ?? true;
  const hasNext = state.has_next ?? false;
  const totalUnderFilter = state.total_under_filter ?? records.size;
  const applied = [];
  let target = { kind: 'personal', key: null, revision: layers.personal?.revision ?? 's1' };

  const has = (capability) => !capability || capabilities.has(capability);

  const answerQuery = (payload) => {
    if (store === 'down') return { answer: 'unavailable', reason: 'store-unreachable' };
    const query = payload.query ?? {};
    const chosen = query.filters ?? {};
    const rejected = Object.keys(chosen).filter((key) => !filtersSupported.has(key));
    const usable = Object.fromEntries(Object.entries(chosen).filter(([key]) => filtersSupported.has(key)));
    const echo = {
      filters_chosen: chosen,
      filters: usable,
      filters_rejected: rejected,
      search: query.search ?? '',
      sort: query.sort ?? [],
      page: query.page ?? 1,
      per_page: query.per_page ?? 20,
    };
    if (payload.reason === 'view-switch') {
      echo.switch = { query: { filters: usable }, dropped: ['sort'] };
      echo.sort = [];
    }
    const data = { records: [...records.values()], echo, columns: state.columns ?? [] };
    if (capabilities.has('personal-preferences')) data.preferences = clone(preferences ?? { revision: 'p0' });
    if (counts) data.total = records.size;
    else data.has_next = hasNext;
    return { answer: 'applied', sequence: payload.sequence, data };
  };

  const compare = (given, current, extra = {}) =>
    String(given) === String(current) ? null : { answer: 'conflict', current_revision: current, ...extra };

  return {
    capabilities: [...capabilities],
    applied,
    record: (id) => clone(records.get(String(id))),
    preferences: () => clone(preferences),
    level: (key) => levelOf(savedViews.get(key)),
    raise(intent, payload = {}) {
      if (!has(this.capabilityOf(intent))) return { answer: 'unavailable', reason: 'capability-not-provided' };
      if (store === 'down' && intent === 'query.change') return { answer: 'unavailable', reason: 'store-unreachable' };
      switch (intent) {
        case 'query.change':
          return answerQuery(payload);
        case 'query.count':
          return { answer: 'applied', data: { total: records.size } };
        case 'record.open':
        case 'record.mutate': {
          const id = String(payload.record_ids[0]);
          const record = records.get(id);
          if (!record) return { answer: 'refused', reason: 'record-missing' };
          if (!record.actions.includes(payload.action_id)) return { answer: 'refused', reason: 'action-not-allowed' };
          if (intent === 'record.open') return { answer: 'applied' };
          const conflict = compare(payload.revisions?.[id], record.revision);
          if (conflict) return conflict;
          applied.push({ intent, id, action: payload.action_id });
          return { answer: 'applied' };
        }
        case 'bulk.apply_selected': {
          const conflicts = payload.record_ids
            .map(String)
            .filter((id) => String(payload.revisions?.[id]) !== String(records.get(id)?.revision));
          if (conflicts.length) return { answer: 'conflict', conflicts };
          for (const id of payload.record_ids.map(String)) applied.push({ intent, id, action: payload.action_id });
          return { answer: 'applied' };
        }
        case 'bulk.apply_under_filter': {
          if (payload.confirmed_total !== totalUnderFilter) {
            return { answer: 'conflict', current_total: totalUnderFilter };
          }
          applied.push({ intent, action: payload.action_id, filters: payload.filters });
          return { answer: 'applied' };
        }
        case 'settings.save_personal':
        case 'settings.save_shared': {
          const layer = intent === 'settings.save_shared' ? 'shared' : 'personal';
          const offending = Object.values(payload.columnSettings ?? {})
            .flatMap((column) => Object.keys(column))
            .filter((field) => sharedOnly.has(field));
          if (layer === 'personal' && offending.length) {
            return { answer: 'refused', reason: `shared-only-field:${offending[0]}` };
          }
          const current = layers[layer]?.revision ?? (layer === 'personal' ? 's1' : 'h1');
          const conflict = compare(payload.base_revision, current);
          if (conflict) return conflict;
          layers[layer] = { revision: `${current}+`, columns: clone(payload.columnSettings) };
          applied.push({ intent, layer });
          return { answer: 'applied' };
        }
        case 'view.open': {
          const view = savedViews.get(payload.key);
          if (!view) return { answer: 'refused', reason: 'view-missing' };
          target = { kind: 'saved_view', key: view.key, revision: view.revision };
          return {
            answer: 'applied',
            data: {
              column_settings: { layers: clone(layers), target: clone(target) },
              echo: {
                filters_chosen: view.query?.filters ?? {},
                filters: view.query?.filters ?? {},
                filters_rejected: [],
                search: '',
                sort: [],
                page: 1,
                per_page: 20,
              },
            },
          };
        }
        case 'view.save':
        case 'view.save_shared': {
          if (intent === 'view.save_shared' && payload.target !== 'shared') {
            return { answer: 'refused', reason: 'shared-target-required' };
          }
          const view = savedViews.get(payload.key);
          if (levelOf(view) === 'system') return { answer: 'refused', reason: 'forbidden' };
          if (view) {
            const conflict = compare(payload.revision, view.revision);
            if (conflict) return conflict;
          }
          savedViews.set(payload.key, {
            ...clone(view ?? {}), key: payload.key, label: payload.label ?? view?.label ?? payload.key,
            query: clone(payload.query ?? view?.query ?? {}), roles: clone(payload.roles ?? view?.roles ?? {}),
            layout: clone(payload.layout ?? view?.layout ?? {}), settings: clone(payload.settings ?? view?.settings ?? {}),
            revision: `${payload.revision ?? 'v0'}+`, level: intent === 'view.save_shared' ? 'shared' : 'personal',
          });
          applied.push({ intent, key: payload.key });
          return { answer: 'applied' };
        }
        case 'preferences.save': {
          const current = preferences?.revision ?? 'p0';
          const conflict = compare(payload.base_revision, current);
          if (conflict) return conflict;
          const next = { ...(preferences ?? {}) };
          for (const [field, value] of Object.entries(payload.preferences ?? {})) {
            if (value === null) delete next[field];
            else next[field] = clone(value);
          }
          next.revision = `${current}+${++preferencesRevision}`;
          preferences = next;
          applied.push({ intent, fields: Object.keys(payload.preferences ?? {}) });
          return { answer: 'applied', data: { preferences: clone(preferences) } };
        }
        case 'view.delete': {
          if (levelOf(savedViews.get(payload.key)) === 'system') return { answer: 'refused', reason: 'forbidden' };
          if (!savedViews.delete(payload.key)) return { answer: 'refused', reason: 'view-missing' };
          applied.push({ intent, key: payload.key });
          return { answer: 'applied' };
        }
        case 'view.create_record': {
          applied.push({ intent, item: payload.item ?? null });
          return { answer: 'applied' };
        }
        default:
          return { answer: 'refused', reason: 'intent-unknown' };
      }
    },
    capabilityOf: (intent) =>
      ({
        'query.count': 'count-on-request',
        'record.open': 'row-actions',
        'record.mutate': 'row-actions',
        'bulk.apply_under_filter': 'bulk-under-filter',
        'settings.save_shared': 'shared-column-settings',
        'view.open': 'saved-views',
        'view.save': 'saved-views',
        'view.save_shared': 'shared-saved-views',
        'view.delete': 'saved-views',
        'preferences.save': 'personal-preferences',
      })[intent] ?? null,
  };
};
