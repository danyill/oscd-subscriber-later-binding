# Test Plan: Fast, Modern Test Suite Before the Refactor

Status: proposed · Date: 2026-10-11

## 1. Purpose

We are about to make major UI and logic changes to this plugin, bringing in the
theming, components and tooling used in
[OMICRONEnergyOSS/oscd-editor-subscriber-databinding](https://github.com/OMICRONEnergyOSS/oscd-editor-subscriber-databinding)
(hereafter "the reference plugin"). Before that starts we need a test suite that:

1. **Is fast.** Engineers should run it on every save and every push.
2. **Asserts behaviour, not pixels.** Tests must keep passing when the UI is
   rebuilt with different components, as long as the behaviour is the same.
3. **Has high, enforced coverage** of the subscription logic, which is the part
   of this plugin that has to be correct.
4. **Uses the same conventions and tooling as the reference plugin** so the
   later migration is a move, not a rewrite.

This document covers only the test suite. The refactor itself is out of scope,
except for small, behaviour-preserving extractions needed to make code testable.

### Targets

| Metric | Today (estimated) | Target |
| --- | --- | --- |
| Default `npm test` wall time (local) | ~6–7 min | **< 30 s** |
| Default test job in CI (excluding install) | ~13 min | **< 2 min** |
| Visual regression suite | 145 screenshots, every run | ~10–15 screenshots, opt-in / PR only |
| Tests with a behavioural assertion (`expect`) | 26 of 152 | **all** |
| Coverage enforced in CI | none | lines ≥ 90 %, branches ≥ 85 % overall; `foundation/` ≥ 95 % / 90 % |
| Fixed `setTimeout` sleeps in tests | ~390 s per run (unscaled) | **0** |

## 2. Current state

### 2.1 What exists

- **4 test files, 152 tests**, all in `test/integration/`:
  `goose-publisher` (70), `goose-subscriber` (70), `smv-publisher` (7),
  `smv-subscriber` (5).
- **145 PNG baselines** (21 MB, Git LFS) in `test/screenshots/baseline/`.
- Every test boots the full `open-scd` shell from `@openscd/open-scd-core`,
  loads the plugin through a `<script>` tag, loads an `.scd` fixture over
  `fetch`, drives the UI with `sendMouse` at computed pixel coordinates, and
  ends with `visualDiff(plugin, …)`.
- Only **26 `expect()` calls** across the suite, and none in the SMV files.
  For ~85 % of tests, the screenshot is the only assertion.
- Single WTR group (`visual`), Chromium only. Firefox and WebKit are disabled
  because screenshots are not reproducible on them.
- Last recorded coverage (`coverage/lcov.info`, Jan 2025):
  main component 99.7 % lines / 92 % branches; `foundation/` 96–99 % lines
  but 58–83 % branches. This coverage is **incidental**: code runs during a
  screenshot test, so it counts as covered, but nothing checks its output
  apart from pixels.

### 2.2 Why it is slow

The slowness comes from the test design, not from the test runner:

- Every `beforeEach` sleeps `1500 ms` (after load) + `400 ms` (after switching
  view), scaled by `factor` (×2 locally, ×4 on CI).
- 238 further `timeout(standardWait)` calls at 400 ms each, plus about 15
  sleeps of 200–1500 ms, all scaled the same way.
- `resetMouseState()` adds a further sleep and mouse round-trips before each
  screenshot.
- Unscaled, that is about **390 s of sleeping**. With the ×2 local factor and
  `concurrency: 2`, that is about 6.5 min locally; on CI (×4) about 13 min.
  This explains why `testsFinishTimeout` is set to 30 minutes.
- Every test mounts the whole `open-scd` shell, not just the plugin.

### 2.3 Why it is fragile

- Pixel output depends on font hinting, the OS, the Chromium version and
  fonts loaded from Google over the network. The config already needs five
  Chromium font flags, a CSS reset and a MutationObserver "deanimator".
  Commit `7de4740` ("Update screenshots tests due to font differences") is a
  typical result.
- Any visual change to the UI (and the refactor is mostly visual changes)
  invalidates almost every baseline. At that point the suite stops protecting
  behaviour, because reviewers end up bulk-accepting new screenshots.
- `sendMouse` with coordinates from `getBoundingClientRect()` depends on
  layout and viewport size.
- The test harness monkey-patches `customElements.define` to work around
  double registration.

### 2.4 Code structure obstacles to unit testing

- `oscd-subscriber-later-binding.ts` is a single 3,433-line `LitElement`.
  It contains many pure functions that are module-private and so cannot be
  imported by tests: `trimIdentityParent`, `sortExtRefItems`,
  `objectReferenceInIed`, `doesExtRefpDAIncludeQ/T`, `getSearchRegex`,
  `debounce`, `isBasicTypeEqual`, `serviceTypeLookup`, and all the
  `renderXxxMarkdown` and `includeFcda`/`isFcdaDisabled` logic.
- Caching logic (`updateCaching`, `buildExtRefCount`, the supervision cache) is
  `protected`/`private` and tied to `window` listeners.
- **The constructor adds two `window` `oscd-edit` listeners and never removes
  them.** Each mounted instance stays subscribed for the life of the page, so
  in a fast suite that mounts hundreds of instances in one page, earlier
  instances will react to later tests' edits. This needs fixing before
  component tests can be reliable (see Phase 1).
- `restoreSettings()` reads `localStorage` in `connectedCallback`, so tests
  must clear storage *before* mounting the plugin.
- Test-only packages (`@open-wc/testing`, `sinon`,
  `@web/test-runner-commands`, `@web/test-runner-visual-regression`) are
  listed under `dependencies` instead of `devDependencies`.

## 3. Target architecture

### 3.1 Conventions (from the reference plugin / `@omicronenergy/oscd-tooling`)

The reference plugin delegates build, lint and test to the `oscd` CLI from
`@omicronenergy/oscd-tooling`. Its shared Web Test Runner config defines two
groups:

| File suffix | WTR group | Command | Purpose |
| --- | --- | --- | --- |
| `*.spec.ts` | `unit` | `npm test` (`oscd test`) | Fast logic and component tests. Default. |
| `*.test.ts` | `visual` | `npm run test:visual` / `test:update` | Screenshot tests, opt-in |

We adopt this convention, and we put tests **next to the code they test**
under `src/`, as the reference plugin does:

```
src/
  oscd-subscriber-later-binding.ts
  oscd-subscriber-later-binding.spec.ts      # component behaviour
  oscd-subscriber-later-binding.test.ts      # curated visual set
  foundation/
    search.ts            search.spec.ts
    sort.ts              sort.spec.ts
    subscription.ts      subscription.spec.ts
    ...
test/
  fixtures/*.scd                 # unchanged
  support/                       # driver, edit harness, fixture loader
  screenshots/baseline/          # visual group only
```

`@omicronenergy/oscd-tooling` lets a project use its own config file in place
of the shared default (`resolveToolConfig` checks for a project-local file
first), or extend the default by importing from
`@omicronenergy/oscd-tooling/configs/web-test-runner.config.js`. We will
**extend** it locally for two things the shared config does not do:

- **Exclude test files from coverage.** The shared `coverageConfig.include` is
  `dist/**/*.js`, which counts `*.spec.js` itself and inflates the numbers.
- **Enforce coverage thresholds** (`coverageConfig.threshold`).

### 3.2 The test pyramid

```
            ┌───────────────────────┐
            │  Visual (≈10–15)      │  *.test.ts · opt-in · Playwright container
            ├───────────────────────┤
            │  Shell smoke (1–2)    │  plugin mounts in the real host and receives doc/edits
            ├───────────────────────┤
            │  Component (≈150)     │  *.spec.ts · plugin mounted alone · DOM + edit assertions
            ├───────────────────────┤
            │  Unit (≈150+)         │  *.spec.ts · pure functions on parsed XML · no rendering
            └───────────────────────┘
```

#### Layer 1: Unit tests (pure logic)

- Inputs are small SCL strings built inline, as the reference plugin's
  `subscription.spec.ts` does, or the existing `.scd` fixtures. No rendering.
- These should take milliseconds each. Use table-driven tests (`for … of`
  cases) for search, sort and type-matching rules.
- Areas to cover:
  - **Search:** `getSearchRegex`, covering empty input, multiple terms (AND),
    `*` and `?` wildcards, single and double quotes, and regex metacharacter
    escaping. Also the search-string builders `getFcdaSearchString` and
    `getExtRefSubscriberSearchString`.
  - **Sorting:** `sortExtRefItems` (data model, internal address, description
    with "descriptions first", mapped reference) and `sortFcdaSubscriberItems`.
  - **Matching rules:** `isBasicTypeEqual` (including the INT32 ↔ Enum
    allowance), `isFcdaDisabled`/restriction checks (`pServT`, `pLN`, `pDO`,
    `pDA`, `checkOnlyPreferredBasicType`, `strictServiceTypes`).
  - **Filtering predicates:** `includeFcda`, `isExtRefViewable`,
    `filterOutpDAq/t`, `filterOutPreconfiguredNotMatching`.
  - **Everything in `foundation/`:** `subscription.ts` (currently 77 %
    branches), `foundation.ts` (58 % branches) and `getFcdaInstDesc.ts`.
  - **Caching:** given an `Edit` (insert, remove or update of an ExtRef, FCDA,
    LGOS/LSVS LN, DOI/DAI/Val, or a text node), check the right cache entries
    are invalidated. This is where stale-cache bugs come from (see commit
    `f01cbc2`), so it should have the most thorough tests.
  - **Settings persistence:** round-trip `storeSettings`/`restoreSettings`
    for every key in `storedProperties`. Also check corrupt or missing JSON.
  - **Markdown export:** `renderFCDAtoMarkdown`,
    `renderControlListToMarkdown` and `renderSubscriberViewExtRef(s)Markdown`,
    checked as exact strings. This needs no screenshot.

#### Layer 2: Component tests (behaviour through the DOM)

These replace most of the 152 screenshot tests.

- **Mount the plugin on its own** with `fixture(html\`<oscd-subscriber-later-binding …>\`)`.
  Set `doc`, `docName` and `editCount` directly. No `open-scd` shell, no
  `<script>` injection, no `customElements.define` patch.
- **No fixed sleeps.** Wait on real signals: `await el.updateComplete`,
  `oneEvent(el, 'oscd-edit')`, or `waitUntil(() => …)` from
  `@open-wc/testing`. Debounced search input can use `sinon.useFakeTimers()`
  or a test-only `debounceDelay = 0`.
- **No coordinate clicks.** Trigger interactions with `element.click()`,
  `dispatchEvent`, or `sendKeys` for keyboard paths.
- **Assert on three things:**
  1. **Edits emitted.** Capture `oscd-edit` events and assert on the edit
     list: which ExtRef got which `iedName`/`srcCBName`/…, and whether an
     LGOS/LSVS supervision was created, reused or removed.
  2. **Resulting SCL.** Apply the edits to the document with a small **edit
     harness** in `test/support/`, re-render, and assert on the XML. This
     checks the full subscribe/unsubscribe flow end to end, including the
     cache invalidation that `oscd-edit` drives. The harness should wrap
     whichever edit-application API is current (`open-scd-core` today,
     `@openscd/oscd-api` / `oscd-editor` after migration), so that only the
     harness changes when we migrate.
  3. **What the user sees, as text and state.** Item labels, counts, the
     "no inputs" messages, which items are disabled or selected, which filter
     and sort options are checked, and tooltips. Assert on text content and
     attributes, not on pixels or DOM structure.
- **Page-object driver.** All component lookups go through one driver in
  `test/support/driver.ts` (for example `driver.fcdaItem(control, fcda)`,
  `driver.extRefItem(id)`, `driver.search('…')`, `driver.switchToSubscriberView()`,
  `driver.toggleFilter('quality')`). The refactor will replace `mwc-*` with
  `oscd-ui` components and change selectors. When that happens, **only the
  driver changes and the test bodies stay the same**, so the tests stay valid
  as a safety net throughout the refactor.
- **Accessibility smoke.** Add `await expect(el).to.be.accessible()`
  (chai-a11y-axe, bundled with `@open-wc/testing`) for each main view and
  state. This costs little and will catch regressions when components are
  swapped.
- **Do not use DOM snapshot tests** (`semantic-dom-diff`) on the main views.
  They tie tests to `mwc-*` markup, which the refactor will delete.

#### Layer 3: Shell smoke test (1–2 tests)

A single test that mounts the plugin inside the real host (today
`open-scd-core`, later `@omicronenergy/oscd-shell`), opens a fixture, makes
one subscription and checks the host's document changed. This checks the
plugin contract (properties in, `oscd-edit` out) without paying the shell's
start-up cost in every test.

#### Layer 4: Visual regression (curated, opt-in)

- Keep **about 10–15 screenshots** that each protect a distinct visual state:
  publisher view and subscriber view × GOOSE and SMV; filter, sort and settings
  menus open; read-only theme; tooltip; empty states. After the theming work
  lands, add one per theme (light/dark).
- Lives in `*.test.ts` (`visual` group), run with `npm run test:visual`.
- Run it **in the official Playwright Docker image**
  (`mcr.microsoft.com/playwright:<pinned version>`), both in CI and locally
  through a `test:visual:docker` script. This makes fonts and rendering
  deterministic and lets us drop the Chromium font flags and OS fuzz
  thresholds.
- **Self-host the test fonts** (Roboto, Material Symbols) under `test/fonts/`
  instead of loading them from `fonts.googleapis.com`. A network dependency
  inside a screenshot test is a source of flakes.
- Rebaseline only through `npm run test:update` in the container, and review
  the baselines in the PR.

### 3.3 What happens to the existing 152 tests

Each existing test is moved to the lowest layer that can verify the same
behaviour. Its screenshot is kept only if the test is in the curated visual set.

| Existing area (≈ count) | New home | Asserts on |
| --- | --- | --- |
| Subscribe / unsubscribe, with and without supervision (~20) | Component + edit harness | Edits emitted, resulting ExtRef/LGOS/LSVS XML |
| Read-only setting blocks (un)subscribe (~4) | Component | No `oscd-edit` dispatched; styling class or attribute present |
| Settings: external plugins, bypass service/basic types (~6) | Component + unit | Edits emitted; restriction predicate unit tests |
| Filters, FCDA and ExtRef (~15) | Unit (predicates) + component (menu → list contents) | Visible item ids |
| Sorting, FCDA and ExtRef (~15) | Unit (comparators) + component (order of item ids) | Ordered id list |
| Search, FCDA and ExtRef (~35) | Unit (`getSearchRegex`, search-string builders), table-driven | Match/no-match tables; a few component tests for wiring |
| Counts with shared datasets (~2) | Unit (`buildExtRefCount`) + component | Count text |
| Tooltips with CDC / basic type (~3) | Component | `title`/tooltip text |
| Switching views and control type, deselection, new document resets selection (~8) | Component | State and selection |
| Markdown export (~2) | Unit | Exact markdown string; clipboard call stubbed with sinon |
| Empty states, initial render (~6) | Component + **visual (curated)** | Message text; one screenshot per view |
| SMV variants (12) | Same tests, parameterised over GOOSE/SMV | Same as GOOSE |

GOOSE and SMV tests are currently copied by hand. They should become
**parameterised** suites (`for (const kind of ['GOOSE', 'SMV'])`), which also
fixes the current gap where SMV has no `expect()` at all.

## 4. Coverage policy

- Measured with WTR's built-in V8 coverage on the **`unit` group only**.
  Code that runs during a screenshot test does not count as covered.
- Test files and `test/support/` are excluded from the coverage report.
- Thresholds are enforced in `web-test-runner.config.js`
  (`coverageConfig.threshold`), so `npm test` fails if coverage drops below
  them:
  - **Phase 1 exit:** `foundation/` and the extracted logic modules at
    ≥ 95 % lines / ≥ 90 % branches.
  - **Phase 2 exit:** whole project at ≥ 90 % lines / ≥ 85 % branches /
    ≥ 90 % functions.
  - These are a floor and only ever go up. Raise them when coverage improves.
- CI uploads the `lcov` report as an artifact and writes a coverage summary
  to the job summary or a PR comment.
- Coverage is a minimum bar, not the goal. Code review should check that each
  test asserts on an observable outcome and does not just execute the code.

## 5. Tooling and CI changes

1. **Adopt `@omicronenergy/oscd-tooling`**: `oscd build | test | lint |
   start | bundle`. Remove the duplicated local Rollup, ESLint and WTR
   dependencies it already provides. Keep the project-local
   `web-test-runner.config.js` that extends the shared one (§3.1).
2. **`src/` layout, `"type": "module"`, and a `tsconfig.json` that extends**
   `@omicronenergy/oscd-tooling/configs/base.tsconfig.json`, matching the
   reference plugin.
3. **Move test-only packages to `devDependencies`.**
4. **Lint rules for tests**: `no-only-tests` (shipped in the tooling's ESLint
   config). Also add a rule or grep check that bans `setTimeout`-based sleeps
   and `sendMouse` in `*.spec.ts`.
5. **Git hooks**: replace `.husky/` with the tooling's `.githooks/`
   (lint-staged, commitlint). LFS hooks are kept only while there are LFS
   baselines.
6. **CI workflows** (replace both `test.yml` and `test-on-pr-branch.yml`):
   - `unit` job on every push and PR: `npm ci` → `oscd test` → coverage
     report. Install only Chromium with `playwright install --with-deps chromium`,
     and cache the Playwright browsers.
   - `visual` job on PRs only, inside the Playwright container, uploading
     diffs on failure (as today).
   - Once these are stable, use the shared
     `OMICRONEnergyOSS/oscd-gh-workflows` reusable workflows
     (`unit-and-vrt-tests.yml`), as the reference plugin does.
   - Update `actions/checkout` / `setup-node` to current major versions.
7. **Cross-browser:** without screenshots, unit and component tests are cheap
   to run on more browsers. Add Firefox (and WebKit if stable) to the `unit`
   group in a **nightly** CI job, without slowing PR feedback.

## 6. Phased delivery

Each phase is a small PR series that keeps `main` green. The old
`test/integration/` suite keeps running (as the `visual` group) until
Phase 3 deletes it, so behaviour is never left unprotected.

### Phase 0: Baseline and tooling (≈1–2 days)

- [ ] Record the current suite's real wall time locally and in CI, to use as
      the baseline.
- [ ] Introduce `@omicronenergy/oscd-tooling`, the `src/` layout, the
      `unit`/`visual` WTR groups, and the local config extension (coverage
      exclude, thresholds initially set to 0).
- [ ] Move the existing `test/integration/*.test.ts` into the `visual` group
      unchanged. `npm test` now runs only the (initially empty) unit group;
      `npm run test:visual` runs the old suite.
- [ ] Split CI into `unit` (every push) and `visual` (PR) jobs.
- [ ] Move test dependencies to `devDependencies`.

**Exit:** `npm test` runs in seconds; the old suite still passes under
`test:visual`.

### Phase 1: Extract and unit-test pure logic (≈3–5 days)

- [ ] **Mechanically** move module-private helpers into `src/foundation/*`
      modules and export them. Do not change behaviour. Candidates: search,
      sort, type matching, filter predicates, markdown rendering, caching,
      settings serialisation.
- [ ] Fix the `window` listener leak: register the listeners in
      `connectedCallback` and remove them in `disconnectedCallback`.
- [ ] Write table-driven unit tests for each module (§3.2, Layer 1).
- [ ] Add a unit-test SCL builder in `test/support/scl.ts` (inline
      publisher/subscriber IED templates, in the style of the reference
      plugin's `subscription.spec.ts`).
- [ ] Turn on thresholds for `foundation/` (95 / 90).

**Exit:** all logic has fast unit tests; foundation thresholds are enforced.

### Phase 2: Component tests and driver (≈1–2 weeks)

- [ ] Build `test/support/driver.ts` (page object), `edit-harness.ts` and
      `fixtures.ts` (cached `.scd` loading and parsing).
- [ ] Port the existing tests area by area using the §3.3 table, publisher
      view first, then subscriber view. Parameterise each area over GOOSE and
      SMV.
- [ ] Add accessibility smoke tests for each view and state.
- [ ] Add the 1–2 shell smoke tests.
- [ ] Raise thresholds to the project targets (90 / 85 / 90).

**Exit:** every behaviour in the old suite has an equivalent behavioural test.
Show this with a checklist in the PR that maps each old test title to its
replacement.

### Phase 3: Curate the visual suite (≈1–2 days)

- [ ] Write the ~10–15 curated `*.test.ts` screenshots, with self-hosted fonts,
      running in the Playwright container.
- [ ] Delete `test/integration/` and its 145 baselines. Remove the
      Chromium font flags, OS fuzz thresholds and `factor` sleeps.

**Exit:** targets in §1 met. `npm test` < 30 s; visual suite < 2 min in CI.

### Phase 4: Start the refactor

- When `mwc-*` is replaced with `oscd-ui` components, update **the driver
  only**. A test body should change only when behaviour changes on purpose.
- Rebaseline the curated visual suite once per deliberate visual change, in a
  separate commit, so the diffs can be reviewed.
- When moving from `@openscd/open-scd-core` to `@openscd/oscd-api` and from
  `@openenergytools/scl-lib` 1.x to `@openscd/scl-lib` 2.x, **update the edit
  harness only**. Component tests that assert on resulting XML should not
  need to change.

## 7. Test-writing rules

1. No fixed sleeps. Await `updateComplete`, an event, or `waitUntil`.
2. No coordinate-based mouse input in `*.spec.ts`.
3. Each test mounts its own plugin, clears `localStorage` **before** mounting,
   and leaves no global listeners behind.
4. Assert on outcomes the user or the SCL file can observe (edits, XML, text,
   state), never on internal private fields.
5. One behaviour per test, with descriptive names
   (`subscribes an unbound ExtRef to an FCDA and creates an LGOS`).
6. Element lookups in component tests go through the driver only.
7. Visual tests are for visual concerns only (layout, theme, iconography).
   If a screenshot is the only thing that would catch a behaviour bug, add a
   behavioural test for it.
8. `.only` and `.skip` must not be merged (enforced by lint).

## 8. Risks and open questions

- **Hidden behaviour in screenshots.** Some of the 152 screenshots may check
  things that no title mentions (counts, icons, disabled states). Mitigation:
  before deleting each baseline in Phase 3, review it and confirm a
  behavioural test covers what it shows.
- **`oscd-tooling` is pre-1.0 (0.0.x).** Pin it exactly. Our local config
  extension keeps us independent of changes to its shared defaults.
- **Edit API migration.** `open-scd-core` `oscd-edit` and `oscd-api`
  `EditV2` have different shapes. Keeping the edit harness as the only place
  that knows this limits the impact.
- **Scoped custom element registries.** The reference plugin uses
  `ScopedElementsMixin` and the polyfill. Once we adopt it, component tests
  must register the plugin the same way the reference plugin's spec does
  (`customElements.define` once at the top of the spec file).
- **Open question:** should the nightly cross-browser job also gate releases?
  Recommendation: yes, once it has been stable for two weeks.

## 9. Upstream issues to file

Found while implementing this plan. File each upstream, then link the issue
here and remove the workaround when it is fixed.

| Where | Issue | Workaround here |
| --- | --- | --- |
| `@omicronenergy/oscd-tooling` 0.0.6 | `oscd clean` (and so `oscd build`, `oscd test`) does nothing on Linux. It passes the glob `'dist/!(__snapshots__)'` to `rimraf` with the single quotes still in it, so nothing matches. Stale compiled files stay in `dist/`, and removed specs keep running. | `clean` script using Node `fs.rmSync`, run from `build` and `pretest*` in `package.json` |
| `@omicronenergy/oscd-tooling` 0.0.6 | The shared WTR config counts `*.spec.js`/`*.test.js` in coverage (`coverageConfig.include` is `dist/**/*.js` with no test exclusion) and has no coverage threshold. | Local `web-test-runner.config.js` overrides `coverageConfig` |
| `@omicronenergy/oscd-tooling` 0.0.6 | `oscd install-hooks` refuses to run while `core.hooksPath` is `.husky`, which makes `npm install` fail in the `prepare` step when migrating from Husky. It needs `--force`, which `prepare` does not pass. | Run `npx oscd install-hooks --force` once after migrating |
| `@omicronenergy/oscd-tooling` 0.0.6 | The shared ESLint rule `import-x/no-extraneous-dependencies` allows devDependencies only in `*.spec.ts`, so shared test helpers (for example `src/testing/`) fail lint when they import `@open-wc/testing`. | Local `eslint.config.js` override for `src/testing/**` |
| `@omicronenergy/oscd-tooling` 0.0.6 | The shared WTR `visual` group has no Chromium flags for stable fonts and no way to set the screenshot directory or baseline names. | Legacy visual group overrides browsers, plugin and runner page locally |
| Playwright | `playwright install` fails on Ubuntu 26.04 (`does not support chromium on ubuntu26.04-x64`). | `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 npx playwright install chromium` |
| `oscd-subscriber-later-binding` | Settings persistence is inconsistent: `storeSettings` writes `filterOutNotSubscribed` and `filterOutPreconfiguredUnmatched`, but `restoreSettings` reads `filterOutUnsubscribed` and `filterOutPreconfiguredNotMatching`, and `storedProperties` lists the latter names, so changing those two filters does not save settings and they are never restored. | Specs for this are skipped with a reference to the issue until it is fixed |
| `@openenergytools/scl-lib` | `isBasicTypeEqual` is copied into this plugin because it is not exported (see the comment above it). | Local copy in `src/foundation/extref.ts`, now unit tested |
| `@openscd/open-scd-core` | The host reuses the same document object when the same file is opened twice, so a plugin cannot detect a re-opened document (see the TODO in `updated()`, issue openscd/open-scd-core#92). | None needed yet |
