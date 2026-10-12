import OscdMenuOpen from '@omicronenergy/oscd-menu-open';
import OscdMenuSave from '@omicronenergy/oscd-menu-save';
import OscdBackgroundEditV1 from '@omicronenergy/oscd-background-editv1';

// built from src/ by `tsc --watch` when serving from source and by `npm run
// bundle` before the demo is bundled
import SubscriberLaterBinding from '../dist/oscd-subscriber-later-binding.js';

/**
 * The shell shows plugins in its own scoped registry, so they are defined there.
 * @param registry - the registry of the `oscd-shell`.
 */
export function definePlugins(registry) {
  registry.define('oscd-menu-open', OscdMenuOpen);
  registry.define('oscd-menu-save', OscdMenuSave);
  registry.define('oscd-background-editv1', OscdBackgroundEditV1);
  registry.define('oscd-subscriber-later-binding', SubscriberLaterBinding);
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
      tagName: 'oscd-subscriber-later-binding'
    }
  ],
  background: [
    {
      name: 'EditV1 Events Listener',
      icon: 'none',
      requireDoc: true,
      tagName: 'oscd-background-editv1'
    }
  ]
};
