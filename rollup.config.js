import copy from 'rollup-plugin-copy';
import oscdRollupConfig from '@omicronenergy/oscd-tooling/configs/rollup.config.js';

// Extends the shared bundle config: the plugin entry point only, plus the
// deploy page this repository has always published next to it.
const [pluginBundle] = oscdRollupConfig;

export default {
  ...pluginBundle,
  plugins: [
    ...pluginBundle.plugins,
    copy({ targets: [{ src: 'demo/index.deploy.html', dest: 'dist' }] })
  ]
};
