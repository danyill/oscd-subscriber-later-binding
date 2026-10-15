import { expect } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';

import { newCompanionAnnounceEvent } from './foundation/companion-protocol.js';
import { PluginDriver } from './testing/driver.js';
import { deepQueryAll } from './testing/dom.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

/**
 * Screenshot tests for how the plugin looks. What the plugin does is checked by
 * the `*.spec.ts` files, so each screenshot here protects a distinct visual
 * state: the two views, selection, menus, empty states, read-only and sampled
 * values.
 *
 * Baselines are owned by CI and must not be created or updated locally, see
 * `.github/workflows/update-visual-baselines.yml`.
 */

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';

const CURRENT_ONLY = 'SMV_Publisher>>CurrentTransformer>currrentOnly';
const CURRENT_ONLY_TCTR1_I =
  'SMV_Publisher>>CurrentTransformer>currrentOnlysDataSet>CurrentTransformer/L1 TCTR 1.AmpSv instMag.i (MX)';

describe('oscd-editor-subscriber-later-binding screenshots', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  before(async () => {
    await setViewport({ width: 1280, height: 800 });
  });

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(
    fixture: string,
    settings: Record<string, unknown> = {}
  ): Promise<void> {
    await Promise.all([
      document.fonts.load('400 16px Roboto'),
      document.fonts.load('24px "Material Symbols Outlined"')
    ]);
    mounted = await mountPlugin({ fixture, settings, layout: 'fit' });
    driver = new PluginDriver(mounted);
    await document.fonts.ready;
  }

  const shot = (name: string) => visualDiff(mounted.plugin, name);

  /**
   * The companion plugins announce themselves as the real ones do, as they
   * have no view of their own and show only in this plugin's settings.
   */
  async function announceCompanions(): Promise<void> {
    [
      {
        identity: 'test.sel',
        name: 'SEL',
        description: 'Subscribes and unsubscribes further inputs of SEL relays',
        features: [
          'Double position values (DPC, Dbpos): the next input of the pair',
          'Sampled values: the other phases'
        ]
      },
      {
        identity: 'test.nr',
        name: 'NR Electric',
        description:
          'Subscribes and unsubscribes further inputs of NR Electric devices',
        features: ['Values: the input for their quality']
      },
      {
        identity: 'test.siemens',
        name: 'Siemens',
        description:
          'Subscribes and unsubscribes further inputs of Siemens SIPROTEC 5 relays',
        features: [
          'Values: the input for their quality',
          'Sampled values: the other phases and the neutral'
        ]
      }
    ].forEach(companion =>
      window.dispatchEvent(
        newCompanionAnnounceEvent({ ...companion, enabled: true })
      )
    );
    await mounted.settle();
  }

  /**
   * A screenshot of a selection is of no use if the selected item is scrolled
   * out of the captured area, so fail rather than record that.
   */
  function expectSelectionShown(): void {
    const selected = Array.from(
      deepQueryAll(mounted.plugin.shadowRoot!, 'oscd-list-item.selected')
    );
    expect(selected.length, 'an item is selected').to.be.greaterThan(0);
    const area = mounted.plugin.getBoundingClientRect();
    selected.forEach((item) => {
      const box = item.getBoundingClientRect();
      expect(
        box.top >= area.top && box.bottom <= area.bottom,
        `the selected item "${item.textContent?.trim().slice(0, 40)}" is within the screenshot`
      ).to.equal(true);
    });
  }

  describe('publisher view', () => {
    it('initially', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await shot('publisher initially');
    });

    it('with an FCDA selected', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expectSelectionShown();
      await shot('publisher with an FCDA selected');
    });

    it('with the FCDA filter menu open', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.showMenu('filterFcdaMenu');
      await shot('publisher with the FCDA filter menu open');
    });

    it('with the FCDA sort menu open', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.showMenu('sortFcdaMenu');
      await shot('publisher with the FCDA sort menu open');
    });

    it('with a filter which differs from the default', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      // hide the subscribed FCDAs, so the filter icon is shown as off-nominal
      await driver.chooseMenuItems('filterFcdaMenu', [1, 2, 3], true);
      await shot('publisher with an off-nominal filter');
    });

    it('with active companion plugins', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      // the count of active companions is shown as a badge on the settings
      await announceCompanions();
      await shot('publisher with active companion plugins');
    });

    it('with a search which matches', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.search('fcda', 'Birch');
      await shot('publisher with a search which matches');
    });

    it('without inputs', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd');
      await driver.click(driver.fcdas()[0]);
      await shot('publisher without inputs');
    });

    it('as a read-only view', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { readOnlyView: true });
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expectSelectionShown();
      await shot('publisher as a read-only view');
    });
  });

  describe('subscriber view', () => {
    it('initially', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { subscriberView: true });
      await shot('subscriber initially');
    });

    it('with an ExtRef selected', async () => {
      await mount('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd', {
        subscriberView: true
      });
      await driver.selectExtRef(
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]',
        'subscriber'
      );
      expectSelectionShown();
      await shot('subscriber with an ExtRef selected');
    });

    it('with the settings menu open', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { subscriberView: true });
      await driver.showMenu('settingsExtRefSubscriberMenu');
      await shot('subscriber with the settings menu open');
    });

    it('with companion plugins in the settings menu', async () => {
      // the companions can be turned off one by one, here NR Electric, which is
      // listed first so that it is in view
      await mount('GOOSE-2007B4-LGOS.scd', {
        subscriberView: true,
        disabledCompanions: ['test.nr']
      });
      await announceCompanions();
      await driver.showMenu('settingsExtRefSubscriberMenu');
      await shot('subscriber with companion plugins in the settings menu');
    });

    it('with the filter menu open', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { subscriberView: true });
      await driver.showMenu('filterExtRefMenuSubscriber');
      await shot('subscriber with the filter menu open');
    });

    it('without inputs', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd', {
        subscriberView: true
      });
      await shot('subscriber without inputs');
    });

    it('as a read-only view', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', {
        subscriberView: true,
        readOnlyView: true
      });
      await shot('subscriber as a read-only view');
    });
  });

  describe('sampled values', () => {
    it('in the publisher view with an FCDA selected', async () => {
      await mount('SMV-2007B4-LSVS.scd', { controlTag: 'SampledValueControl' });
      // the document has 120 FCDAs, so show only this control block to keep
      // the selected FCDA within the screenshot
      await driver.search('fcda', CURRENT_ONLY);
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      expectSelectionShown();
      await shot('sampled values publisher with an FCDA selected');
    });

    it('in the subscriber view', async () => {
      await mount('SMV-2007B4-LSVS.scd', {
        controlTag: 'SampledValueControl',
        subscriberView: true
      });
      await shot('sampled values subscriber initially');
    });
  });
});
