import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

/**
 * Names of custom elements rendered below `root`, including in shadow roots,
 * which were not upgraded because nothing registered them for that root.
 */
function notUpgraded(root: ParentNode, found = new Set<string>()): Set<string> {
  root.querySelectorAll('*').forEach((element) => {
    const name = element.tagName.toLowerCase();
    if (name.includes('-') && element.constructor === HTMLElement) {
      found.add(name);
    }
    if (element.shadowRoot !== null) {
      notUpgraded(element.shadowRoot, found);
    }
  });
  return found;
}

describe('oscd-editor-subscriber-later-binding', () => {
  let mounted: MountedPlugin;

  afterEach(() => {
    mounted.unmount();
  });

  // Components only know the elements registered for them, so a tag which is
  // used without being registered shows nothing, and without an error.
  it('registers every custom element it renders, in the publisher view', async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    const driver = new PluginDriver(mounted);
    await driver.selectFcda(
      'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
      driver.fcdas()[0].id
    );
    expect([...notUpgraded(mounted.plugin.shadowRoot!)]).to.deep.equal([]);
  });

  it('registers every custom element it renders, in the subscriber view', async () => {
    mounted = await mountPlugin({
      fixture: 'GOOSE-2007B4-LGOS.scd',
      settings: { subscriberView: true }
    });
    expect([...notUpgraded(mounted.plugin.shadowRoot!)]).to.deep.equal([]);
  });

  it('renders icons on its buttons', async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    const buttons = Array.from(
      mounted.plugin.shadowRoot!.querySelectorAll('fcda-list')
    ).flatMap(list =>
      Array.from(list.shadowRoot!.querySelectorAll('oscd-icon-button'))
    );
    expect(buttons.length).to.be.greaterThan(0);
    expect(
      buttons.every(button => button.getBoundingClientRect().width > 0)
    ).to.equal(true);
  });
});
