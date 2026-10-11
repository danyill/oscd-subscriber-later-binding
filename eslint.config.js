import oscdEsLintConfig from '@omicronenergy/oscd-tooling/configs/eslint.config.js';

export default [
  ...oscdEsLintConfig,
  // Test helpers are not specs but may import test dependencies.
  {
    files: ['src/testing/**/*.ts'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true }
      ]
    }
  },
  // Screenshot tests being replaced by behavioural specs; deleted in the final phase.
  { ignores: ['src/legacy-visual/'] }
];
