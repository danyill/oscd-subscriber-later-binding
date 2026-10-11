import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

/** Names of custom elements rendered below `root` which nothing has defined. */
function undefinedElements(root: ParentNode, found = new Set<string>()) {
  root.querySelectorAll('*').forEach((element) => {
    const name = element.tagName.toLowerCase();
    if (name.includes('-') && customElements.get(name) === undefined) {
      found.add(name);
    }
    if (element.shadowRoot !== null) {
      undefinedElements(element.shadowRoot, found);
    }
  });
  return found;
}

describe('oscd-subscriber-later-binding', () => {
  let mounted: MountedPlugin;

  afterEach(() => {
    mounted.unmount();
  });

  // The host shell defines many Material Web elements, which can hide a missing
  // import until the plugin is used elsewhere.
  it('defines every custom element it renders, in the publisher view', async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    const driver = new PluginDriver(mounted);
    await driver.selectFcda(
      'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
      driver.fcdas()[0].id
    );
    expect([...undefinedElements(mounted.plugin.shadowRoot!)]).to.deep.equal([]);
  });

  it('defines every custom element it renders, in the subscriber view', async () => {
    mounted = await mountPlugin({
      fixture: 'GOOSE-2007B4-LGOS.scd',
      settings: { subscriberView: true }
    });
    expect([...undefinedElements(mounted.plugin.shadowRoot!)]).to.deep.equal([]);
  });

  it('renders icons on its buttons', async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    const buttons = Array.from(
      mounted.plugin.shadowRoot!.querySelectorAll('mwc-icon-button')
    );
    expect(buttons.length).to.be.greaterThan(0);
    expect(buttons.every(button => button.getBoundingClientRect().width > 0)).to.equal(
      true
    );
  });
});
