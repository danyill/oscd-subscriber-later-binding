import OscdMenuOpen from '@omicronenergy/oscd-menu-open';
import OscdMenuSave from '@omicronenergy/oscd-menu-save';

// built from src/ by `tsc --watch` when serving from source and by `npm run
// bundle` before the demo is bundled
import OscdEditorSubscriberLaterBinding from '../dist/oscd-editor-subscriber-later-binding.js';

/**
 * The shell shows plugins in its own scoped registry, so they are defined there.
 * @param registry - the registry of the `oscd-shell`.
 */
export function definePlugins(registry) {
  registry.define('oscd-menu-open', OscdMenuOpen);
  registry.define('oscd-menu-save', OscdMenuSave);
  registry.define('oscd-editor-subscriber-later-binding', OscdEditorSubscriberLaterBinding);
}

/** The companion plugins, which are background plugins. */
const companions = [
  { name: 'SEL', vendor: 'sel' },
  { name: 'Siemens', vendor: 'siemens' },
  { name: 'NR Electric', vendor: 'nr' }
];

const linkedCompanions = await Promise.all(
  companions.map(async ({ vendor }) => {
    if (!['localhost', '127.0.0.1'].includes(document.location.hostname)) {
      return false;
    }
    try {
      const response = await fetch(linkedCompanion(vendor), { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  })
);

/** A build of a local checkout, after `npm link ../oscd-background-subscriber-lb-<vendor>`. */
function linkedCompanion(vendor) {
  return `/node_modules/@openpowershift/oscd-background-subscriber-lb-${vendor}/dist/oscd-background-subscriber-lb-${vendor}.js`;
}

/**
 * Where a companion plugin is loaded from: a linked local build when serving
 * locally, else its deployed bundle.
 */
function companionSrc(vendor) {
  const index = companions.findIndex(companion => companion.vendor === vendor);
  return linkedCompanions[index]
    ? linkedCompanion(vendor)
    : `https://openpowershift.github.io/oscd-background-subscriber-lb-${vendor}/oscd-background-subscriber-lb-${vendor}.js`;
}

export const plugins = {
  menu: [
    {
      name: 'Open File',
      translations: { de: 'Datei öffnen' },
      icon: 'folder_open',
      tagName: 'oscd-menu-open'
    },
    {
      name: 'Save File',
      translations: { de: 'Datei speichern' },
      icon: 'save',
      requireDoc: true,
      tagName: 'oscd-menu-save'
    }
  ],
  editor: [
    {
      name: 'Subscriber Later Binding',
      translations: {
        de: 'Späte Bindung des Abonnenten',
        pt: 'Associação Tardia de Assinante'
      },
      icon: 'link',
      requireDoc: true,
      tagName: 'oscd-editor-subscriber-later-binding'
    }
  ],
  background: companions.map(({ name, vendor }) => ({
    name: `Subscriber Later Binding - ${name}`,
    icon: 'none',
    requireDoc: true,
    src: companionSrc(vendor)
  }))
};
