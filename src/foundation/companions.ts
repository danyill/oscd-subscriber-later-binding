import type {
  CompanionAnnounceDetail,
  CompanionWithdrawDetail
} from './companion-protocol.js';

/** What a companion plugin has told this plugin about itself. */
export interface Companion {
  name: string;
  enabled: boolean;
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
  { identity, name, enabled }: CompanionAnnounceDetail
): Companions {
  return new Map(companions).set(identity, { name, enabled });
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

/** The names of the enabled companions, sorted. */
export function activeCompanionNames(companions: Companions): string[] {
  return Array.from(companions.values())
    .filter(companion => companion.enabled)
    .map(companion => companion.name)
    .sort((a, b) => a.localeCompare(b));
}
