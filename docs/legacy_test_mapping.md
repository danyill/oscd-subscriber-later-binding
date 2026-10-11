# Legacy screenshot tests and their replacements

The 152 tests in `src/legacy-visual` (formerly `test/integration`) each took a
screenshot and only 26 `expect()` calls were made across all of them. This maps every one of
them to the behavioural specs which now check the same behaviour. The legacy
suite stays in place, run with `npm run test:visual`, until the curated
screenshot suite described in `docs/test_plan.md` exists. This list is the
checklist for deleting it.

"Publisher" and "subscriber" are the two views. Unless stated, GOOSE and
sampled value variants of a test are both covered by the specs named.

## Publisher view (GOOSE, 70 tests)

| Legacy tests | Replaced by |
| --- | --- |
| Initially has no FCDA selected; shows no available or subscribed inputs messages | `publisher-view.spec.ts` "initially"; `view-state.spec.ts` "empty documents" |
| Shows subscriptions for an FCDA including LGOS | `publisher-view.spec.ts` "selecting an FCDA" |
| Subscription counts for multiple control blocks with the same data set | `view-state.spec.ts` "control blocks sharing a data set" |
| Subscribing and unsubscribing, with and without supervisions (6) | `publisher-view.spec.ts` "subscribing to an FCDA" and "unsubscribing an ExtRef"; `settings.spec.ts` for ignoring supervisions |
| FCDA filter options and filters: subscribed, not subscribed, data objects, quality (5) | `filters.spec.ts` "of FCDAs" |
| ExtRef filter options and non-matching preconfigured pXX (2) | `filters.spec.ts` "of ExtRefs in the publisher view"; `restrictions.spec.ts` "in the publisher view" |
| Sort FCDAs: options and five orders (6) | `sorting.spec.ts` "of FCDAs" |
| Sort ExtRefs: options and three orders (4) | `sorting.spec.ts` "of ExtRefs in the publisher view" |
| Search FCDAs: 18 searches including quoting and wildcards | `search.spec.ts` "of FCDAs", with the rules in `foundation/search.spec.ts` |
| Search ExtRefs: 9 searches | `search.spec.ts` "of ExtRefs in the publisher view", with `foundation/search.spec.ts` |
| Tooltips with CDC and basic type for an FCDA and a pXX ExtRef (2) | `publisher-view.spec.ts` "initially"; `subscriber-view.spec.ts` "describing an ExtRef" |
| Changes to subscriber view; deselects FCDAs; changes to sampled values | `view-state.spec.ts` "switching views" and "switching control type" |
| Copy to Markdown for FCDAs | `markdown.spec.ts` "of published data" |
| Resets selection when a new document is opened | `caching.spec.ts` "when a new document is opened" |
| Settings menu, external plugins, read-only default, disabling external plugins (4) | `settings.spec.ts` "defaults", "attributes used by external plugins" and "publisher view settings menu" |
| Subscribes when bypassing service type and basic type checks | `restrictions.spec.ts` |
| Read-only: does not subscribe, does not unsubscribe (2) | `settings.spec.ts` "read-only view" |
| Read-only: uses the secondary or primary colours (2) | **Visual only**, see below |

## Subscriber view (GOOSE, 70 tests)

| Legacy tests | Replaced by |
| --- | --- |
| Initially has no ExtRef selected | `subscriber-view.spec.ts` "initially" |
| Shows no available or subscribed inputs messages | `view-state.spec.ts` "empty documents" |
| Removing a missing or invalid mapping (2) | `subscriber-view.spec.ts` "unsubscribing an ExtRef" |
| Subscribing and unsubscribing, with and without supervisions, including "even if previously selected" (7) | `subscriber-view.spec.ts`, `view-state.spec.ts` "selecting an FCDA in the subscriber view without an ExtRef" |
| Unsubscribing multiple ExtRefs with multiple supervision removal | `subscriber-view.spec.ts` "supervisions when subscribing" |
| Auto-increment: increments, off, jumps over IEDs, stops at a bound ExtRef (4) | `subscriber-view.spec.ts` "auto-incrementing"; `view-state.spec.ts` "auto-increment at the end of the list" |
| FCDA filters (6) and ExtRef filters (6) | `filters.spec.ts` |
| Sort ExtRefs: options and four orders (5) | `sorting.spec.ts` "of ExtRefs in the subscriber view" |
| Search FCDAs with a string; search ExtRefs, 21 searches | `search.spec.ts` "of ExtRefs in the subscriber view" and "of FCDAs" |
| Search and filter together | `filters.spec.ts` "shows no ExtRefs when searching for one hidden by a filter" |
| Deselects an ExtRef when a new document is opened | `caching.spec.ts` |
| Changes to publisher view; changes to sampled values | `view-state.spec.ts` |
| Copy to Markdown for FCDAs and ExtRefs | `markdown.spec.ts` |
| Settings menu and settings (5) | `settings.spec.ts` "subscriber view settings menu" |
| Read-only: does not subscribe, does not unsubscribe (2) | `settings.spec.ts` "read-only view" |
| Read-only: uses the secondary or primary colours (2) | **Visual only**, see below |

## Sampled values (12 tests)

| Legacy tests | Replaced by |
| --- | --- |
| Publisher: shows subscriptions including LSVS; subscribing and unsubscribing with and without supervisions (5) | `sampled-values.spec.ts` "publisher view" |
| Subscriber: initially has no ExtRef selected; subscribing and unsubscribing with supervisions (3) | `sampled-values.spec.ts` "subscriber view" |
| Changes to subscriber, publisher and GOOSE views (4) | `sampled-values.spec.ts` "switching between GOOSE and sampled values"; `view-state.spec.ts` |

## Visual only

These check how the plugin looks and are what the curated screenshot suite should
keep, once there is a UI to take baselines of:

* The four "read-only: uses the secondary or primary colours" tests, which check
  theme colours of the title.
* The initial state of each view, for layout and iconography.

## Behaviour the legacy tests did not check

The new specs also check things no screenshot could, including the edits that
are dispatched, the resulting SCL, supervision cleanup, the stored settings and
the attributes external plugins read, cache invalidation by edits from other
plugins, and the unit behaviour of search, sorting, identity and restriction
helpers.
