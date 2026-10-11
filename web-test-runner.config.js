/* eslint-disable no-undef */
import path from 'path';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import oscdConfig from '@omicronenergy/oscd-tooling/configs/web-test-runner.config.js';

import { legacyVisualHtml } from './test/support/legacy-visual-html.js';

/**
 * Extends the shared oscd-tooling config:
 * - `unit` group: `dist/**\/*.spec.js`, the default `npm test`. Only this group
 *   counts towards coverage, which is enforced by the thresholds below.
 * - `visual` group: screenshot tests, `npm run test:visual`. Currently the
 *   legacy suite in `src/legacy-visual`, kept unchanged until its behaviour is
 *   covered by specs.
 */

// Thresholds only ever go up. Raise them as each phase of docs/test_plan.md lands.
const coverageThreshold = { statements: 0, branches: 0, functions: 0, lines: 0 };

// The legacy baselines were generated with these Chromium flags.
const legacyBrowsers = [
  playwrightLauncher({
    product: 'chromium',
    launchOptions: {
      args: [
        '--font-render-hinting=none',
        '--disable-skia-runtime-opts',
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
        '--disable-gpu'
      ]
    }
  })
];

const legacyVisualRegression = visualRegressionPlugin({
  update: process.argv.includes('--update-visual-baseline'),
  baseDir: 'test/screenshots',
  diffOptions: { includeAA: true },
  getBaselineName: ({ browser, name }) =>
    path.join('baseline', `${name}-${browser}`),
  getDiffName: ({ browser, name }) =>
    path.join('failed', `${name}-${browser}-diff`),
  getFailedName: ({ browser, name }) =>
    path.join('failed', `${name}-${browser}`)
});

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  ...oscdConfig,

  coverageConfig: {
    include: ['dist/**/*.js'],
    exclude: [
      '**/node_modules/**',
      '**/__wds-outside-root__/**',
      '**/*.spec.js',
      '**/*.test.js',
      'dist/legacy-visual/**',
      'dist/**/testing/**'
    ],
    threshold: coverageThreshold
  },

  plugins: [
    ...oscdConfig.plugins.filter(p => p.name !== 'visual-regression'),
    legacyVisualRegression
  ],

  groups: oscdConfig.groups.map(group =>
    group.name === 'visual'
      ? {
          ...group,
          browsers: legacyBrowsers,
          testRunnerHtml: legacyVisualHtml
        }
      : group
  ),

  testsFinishTimeout: 30 * 60 * 1000
});
