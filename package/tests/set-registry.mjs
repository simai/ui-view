// The shared name registry's view of one set (standard simai.component-set
// 1.0.0, family-has-one-owner, names-start-with-owned-family), shared by
// tests/set-passport.contract.test.mjs and scripts/check-registry.mjs.
//
// A new name waits its registration by name here: sf-view-board (view round 2,
// owner decisions C298, C304) is registered with the next SIMAI Framework group
// build (order through the dispatcher, 2026-11-18). The entry goes when the
// registry has the name.
// sf-view-cards (view-cards, owner decisions C297, C306) waits the same way.
export const REGISTRATION_PENDING = new Set(['sf-view-board', 'sf-view-cards']);

export function registryProblems(registry, passport) {
  const problems = [];
  const owner = registry.owners.find((entry) => entry.id === passport.id);
  if (!owner) return [`the registry has no owner ${passport.id}`];
  if (owner.kind !== 'set') problems.push(`owner ${passport.id} is a ${owner.kind}, not a set`);
  if (owner.repository !== passport.repository) problems.push(`owner ${passport.id} names ${owner.repository}`);
  if (JSON.stringify([...owner.families].sort()) !== JSON.stringify([...passport.families].sort())) {
    problems.push(`families: the registry gives ${owner.families.join(', ')}, the passport lists ${passport.families.join(', ')}`);
  }
  for (const family of passport.families) {
    const others = registry.owners.filter((entry) => entry.id !== passport.id && entry.families.includes(family));
    if (others.length) problems.push(`family ${family} is also owned by ${others.map((entry) => entry.id).join(', ')}`);
  }
  const names = new Set((owner.names ?? []).map((entry) => entry.element));
  for (const component of passport.components) {
    if (!names.has(component.element) && !REGISTRATION_PENDING.has(component.element)) problems.push(`${component.element} is not a registered name of ${passport.id}`);
  }
  return problems;
}
