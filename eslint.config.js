import oscdEsLintConfig from '@omicronenergy/oscd-tooling/configs/eslint.config.js';

export default [
  ...oscdEsLintConfig,
  // Screenshot tests being replaced by behavioural specs; deleted in the final phase.
  { ignores: ['src/legacy-visual/'] }
];
