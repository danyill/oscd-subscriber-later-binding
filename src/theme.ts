import { unsafeCSS } from 'lit';
import { oscdMd3Mappings } from '@omicronenergy/oscd-ui/oscd-md3-mappings.js';

/**
 * The Material colour tokens used by the `oscd-ui` components, mapped to the
 * plugin's internal `--oscd-*` palette instead of to the distro's
 * `--oscd-theme-*` variables, so that every colour in the plugin comes from the
 * one palette defined on the root component.
 */
export const oscdPaletteMd3 = unsafeCSS(
  oscdMd3Mappings.cssText.replaceAll('--oscd-theme-', '--oscd-')
);
