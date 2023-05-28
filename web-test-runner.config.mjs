import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { playwrightLauncher } from '@web/test-runner-playwright';

import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const fuzzy = ['win32', 'darwin'].includes(process.platform); // allow for difference on non-linux OSs
const local = !process.env.CI;

const thresholdPercentage = fuzzy && !local ? 0.2 : 0;

// eslint-disable-next-line no-console
console.assert(local, 'Running in CI!');
// eslint-disable-next-line no-console
console.assert(
  !fuzzy,
  `Running on OS with ${thresholdPercentage}% test pixel diff threshold!`
);

const filteredLogs = [
  'Running in dev mode',
  'Lit is in dev mode',
  'scheduled an update',
];

// Consistency in fonts is hard without containers, see:
// https://github.com/microsoft/playwright/issues/20097
// https://github.com/puppeteer/puppeteer/issues/661
const browsers = [
  playwrightLauncher({
    product: 'chromium',
    launchOptions: {
      args: [
        '--font-render-hinting=none',
        '--disable-skia-runtime-opts',
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
        '--disable-gpu',
      ],
    },
  }),
  playwrightLauncher({ product: 'firefox' }),
  // Webkit disabled as unable to get consistent screenshots between
  // local and CI environment
  // playwrightLauncher({ product: 'webkit' }),
];

function defaultGetImageDiff({ baselineImage, image, options }) {
  let error = '';
  let basePng = PNG.sync.read(baselineImage);
  let png = PNG.sync.read(image);
  let { width, height } = png;

  if (basePng.width !== png.width || basePng.height !== png.height) {
    error =
      `Screenshot is not the same width and height as the baseline. ` +
      `Baseline: { width: ${basePng.width}, height: ${basePng.height} }` +
      `Screenshot: { width: ${png.width}, height: ${png.height} }`;
    width = Math.max(basePng.width, png.width);
    height = Math.max(basePng.height, png.height);
    let oldPng = basePng;
    basePng = new PNG({ width, height });
    oldPng.data.copy(basePng.data, 0, 0, oldPng.data.length);
    oldPng = png;
    png = new PNG({ width, height });
    oldPng.data.copy(png.data, 0, 0, oldPng.data.length);
  }

  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    basePng.data,
    png.data,
    diff.data,
    width,
    height,
    options
  );
  const diffPercentage = (numDiffPixels / (width * height)) * 100;

  return {
    error,
    diffImage: PNG.sync.write(diff),
    diffPercentage,
  };
}

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  plugins: [
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
      baseDir: 'test/screenshots',
      diffOptions: {
        includeAA: true,
      },
      getImageDiff: options => {
        const result = defaultGetImageDiff(options);
        if (result.diffPercentage < thresholdPercentage)
          result.diffPercentage = 0;
        return result;
      },
      getBaselineName: ({ browser, name }) =>
        path.join('baseline', `${name}-${browser}`),
      getDiffName: ({ browser, name }) =>
        path.join('failed', `${name}-${browser}-diff`),
      getFailedName: ({ browser, name }) =>
        path.join('failed', `${name}-${browser}`),
    }),
  ],

  groups: [
    {
      name: 'visual',
      files: 'dist/test/**/*.test.js',
      testRunnerHtml: testFramework => `
<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet">
  </head>
  <body>
    <style class="deanimator">
    *, *::before, *::after {
     -moz-transition: none !important;
     transition: none !important;
     -moz-animation: none !important;
     animation: none !important;
    }
    </style>
    <style>
    * { -webkit-font-smoothing: none; 
     font-kerning: none; 
     text-rendering: geometricPrecision;
     font-variant-ligatures: none;
     letter-spacing: 0.01em;}
    </style>
    <script>window.process = { env: ${JSON.stringify(process.env)} }</script>
    <script type="module" src="${testFramework}"></script>
    <script>
    function descendants(parent) {
      return (Array.from(parent.childNodes)).concat(
        ...Array.from(parent.children).map(child => descendants(child))
      );
    }
    const deanimator = document.querySelector('.deanimator');
    function deanimate(element) {
      if (!element.shadowRoot) return;
      if (element.shadowRoot.querySelector('.deanimator')) return;
      const style = deanimator.cloneNode(true);
      element.shadowRoot.appendChild(style);
      descendants(element.shadowRoot).forEach(deanimate);
    }
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          descendants(document.body).forEach(deanimate);
        }
      }
    });
    observer.observe(document.body, {childList: true, subtree:true});
    </script>
    <style>
    * {
      margin: 0px;
      padding: 0px;
    }

    body {
      background: white;
    }
    </style>
  </body>
</html>`,
    },
  ],

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  concurrentBrowsers: 3,

  /** Amount of test files per browser to test concurrently */
  concurrency: 2,

  /** Browsers to run tests on */
  browsers,

  // 10 minutes max test time allowed
  testsFinishTimeout: 10 * 60 * 1000,

  // See documentation for all available options
});
