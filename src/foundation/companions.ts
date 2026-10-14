import type {
  CompanionAnnounceDetail,
  CompanionWithdrawDetail
} from './companion-protocol.js';

/** What a companion plugin has told this plugin about itself. */
export interface Companion {
  name: string;
  description?: string;
  features?: string[];
  /** Only for a companion with its own switch: whether it is on. */
  enabled?: boolean;
}

/** A companion with its identity, as listed in the settings. */
export interface CompanionEntry extends Companion {
  identity: string;
}

/** Companion plugins by their identity. */
export type Companions = ReadonlyMap<string, Companion>;

/**
 * The companions after one announces itself.
 * @param companions - the companions known so far.
 * @param detail - what the companion announced.
 * @returns a new map, so that a change is seen by Lit.
 */
export function withAnnounced(
  companions: Companions,
  { identity, name, description, features, enabled }: CompanionAnnounceDetail
): Companions {
  const companion: Companion = { name };
  if (description !== undefined) {
    companion.description = description;
  }
  if (features !== undefined) {
    companion.features = features;
  }
  if (enabled !== undefined) {
    companion.enabled = enabled;
  }
  return new Map(companions).set(identity, companion);
}

/**
 * The companions after one is withdrawn.
 * @param companions - the companions known so far.
 * @param detail - which companion was withdrawn.
 * @returns a new map, so that a change is seen by Lit.
 */
export function withWithdrawn(
  companions: Companions,
  { identity }: CompanionWithdrawDetail
): Companions {
  const next = new Map(companions);
  next.delete(identity);
  return next;
}

/** The companions with their identities, sorted by name. */
export function companionEntries(companions: Companions): CompanionEntry[] {
  return Array.from(companions, ([identity, companion]) => ({
    identity,
    ...companion
  })).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Whether a companion is active: not turned off in the settings, nor by its
 * own switch if it has one.
 * @param entry - the companion.
 * @param disabledCompanions - the identities turned off in the settings.
 */
export function isCompanionActive(
  entry: CompanionEntry,
  disabledCompanions: readonly string[]
): boolean {
  return entry.enabled !== false && !disabledCompanions.includes(entry.identity);
}

/** The identities of the companions which are not turned off in the settings. */
export function enabledCompanionIdentities(
  companions: Companions,
  disabledCompanions: readonly string[]
): string[] {
  return companionEntries(companions)
    .filter(({ identity }) => !disabledCompanions.includes(identity))
    .map(({ identity }) => identity);
}

/** The names of the active companions, sorted. */
export function activeCompanionNames(
  entries: CompanionEntry[],
  disabledCompanions: readonly string[]
): string[] {
  return entries
    .filter(entry => isCompanionActive(entry, disabledCompanions))
    .map(entry => entry.name);
}
