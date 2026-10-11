/* eslint-disable no-undef */
import os from 'os';
import path from 'path';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import oscdConfig from '@omicronenergy/oscd-tooling/configs/web-test-runner.config.js';

import { visualRunnerHtml } from './test/support/visual-runner-html.js';

/**
 * Extends the shared oscd-tooling config:
 * - `unit` group: `dist/**\/*.spec.js`, the default `npm test`. Only this group
 *   counts towards coverage, which is enforced by the thresholds below.
 * - `visual` group: screenshot tests, `npm run test:visual`. Baselines are owned
 *   by CI (see `.github/workflows/update-visual-baselines.yml`) and are not
 *   updated locally. Fonts are served from node_modules.
 */

// Thresholds only ever go up. Raise them as each phase of docs/test_plan.md lands.
const coverageThreshold = {
  statements: 97,
  branches: 95,
  functions: 95,
  lines: 97
};

// Chromium flags which reduce differences in text rendering.
const visualBrowsers = [
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

const visualRegression = visualRegressionPlugin({
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
      'dist/**/testing/**'
    ],
    threshold: coverageThreshold
  },

  plugins: [
    ...oscdConfig.plugins.filter(p => p.name !== 'visual-regression'),
    visualRegression
  ],

  groups: oscdConfig.groups.map(group => {
    const configured =
      group.name === 'visual'
        ? {
            ...group,
            browsers: visualBrowsers,
            testRunnerHtml: visualRunnerHtml
          }
        : group;
    // `SPEC=dist/filters.spec.js npm test` runs a single spec
    return process.env.SPEC ? { ...configured, files: process.env.SPEC } : configured;
  }),

  // Test files run in parallel pages. The shared config runs them one at a time.
  concurrency: Math.min(6, Math.max(1, os.cpus().length - 1)),

  testFramework: { config: { timeout: 10000 } },

  testsFinishTimeout: 30 * 60 * 1000
});
