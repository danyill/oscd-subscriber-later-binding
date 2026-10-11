import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin, settingsKey } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import {
  extRefById,
  subscriptionAttributes
} from './testing/scl-queries.js';

const storedSettings = (): Record<string, unknown> =>
  JSON.parse(localStorage.getItem(settingsKey) ?? '{}');

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';
const UNBOUND = 'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';
const BOUND = 'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]';

describe('settings', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(settings?: Record<string, unknown>, fixture?: string) {
    mounted = await mountPlugin({
      fixture: fixture ?? 'GOOSE-2007B4-LGOS.scd',
      settings
    });
    driver = new PluginDriver(mounted);
  }

  describe('defaults', () => {
    beforeEach(async () => {
      await mount();
    });

    it('starts in the publisher view with GOOSE', () => {
      expect(mounted.plugin.subscriberView).to.equal(false);
      expect(mounted.plugin.controlTag).to.equal('GSEControl');
    });

    it('shows everything', () => {
      const { plugin } = mounted;
      expect(
        [
          plugin.filterOutSubscribed,
          plugin.filterOutNotSubscribed,
          plugin.filterOutDataObjects,
          plugin.filterOutQuality,
          plugin.filterOutPreconfiguredUnmatched,
          plugin.filterOutBound,
          plugin.filterOutNotBound,
          plugin.strictServiceTypes,
          plugin.filterOutpDAq,
          plugin.filterOutpDAt
        ]
      ).to.deep.equal(new Array(10).fill(false));
    });

    it('uses data model order', () => {
      const { plugin } = mounted;
      expect([
        plugin.sortFcda,
        plugin.sortExtRefPublisher,
        plugin.sortExtRefSubscriber
      ]).to.deep.equal([0, 0, 0]);
    });

    it('auto-increments, changes supervisions and allows external plugins', () => {
      const { plugin } = mounted;
      expect(plugin.autoIncrement).to.equal(true);
      expect(plugin.ignoreSupervision).to.equal(false);
      expect(plugin.allowExternalPlugins).to.equal(true);
    });

    it('is not read-only and checks pXX attributes fully', () => {
      expect(mounted.plugin.readOnlyView).to.equal(false);
      expect(mounted.plugin.checkOnlyPreferredBasicType).to.equal(false);
    });

    it('stores its settings after the first render', () => {
      expect(Object.keys(storedSettings()).length).to.be.greaterThan(0);
    });
  });

  describe('attributes used by external plugins', () => {
    it('identifies the plugin', async () => {
      await mount();
      expect(mounted.plugin.getAttribute('identity')).to.equal(
        'danyill.oscd-subscriber-later-binding'
      );
    });

    it('reflects that external plugins are allowed by default', async () => {
      await mount();
      expect(mounted.plugin.hasAttribute('allowexternalplugins')).to.equal(true);
    });

    it('does not reflect ignoring supervisions by default', async () => {
      await mount();
      expect(mounted.plugin.hasAttribute('ignoresupervision')).to.equal(false);
    });

    it('does not reflect checking only preferred basic types by default', async () => {
      await mount();
      expect(
        mounted.plugin.hasAttribute('checkonlypreferredbasictype')
      ).to.equal(false);
    });

    it('reflects the settings when they are changed', async () => {
      await mount({
        allowExternalPlugins: false,
        ignoreSupervision: true,
        checkOnlyPreferredBasicType: true
      });
      expect(mounted.plugin.hasAttribute('allowexternalplugins')).to.equal(false);
      expect(mounted.plugin.hasAttribute('ignoresupervision')).to.equal(true);
      expect(
        mounted.plugin.hasAttribute('checkonlypreferredbasictype')
      ).to.equal(true);
    });
  });

  describe('persistence', () => {
    const roundTripped: [string, unknown][] = [
      ['subscriberView', true],
      ['filterOutSubscribed', true],
      ['filterOutDataObjects', true],
      ['filterOutQuality', true],
      ['autoIncrement', false],
      ['ignoreSupervision', true],
      ['allowExternalPlugins', false],
      ['checkOnlyPreferredBasicType', true],
      ['readOnlyView', true],
      ['filterOutBound', true],
      ['filterOutNotBound', true],
      ['strictServiceTypes', true],
      ['filterOutpDAq', true],
      ['filterOutpDAt', true],
      ['sortExtRefPublisher', 2],
      ['sortExtRefSubscriber', 3],
      ['sortFcda', 4]
    ];

    roundTripped.forEach(([key, value]) => {
      it(`restores ${key} from stored settings`, async () => {
        await mount({ [key]: value });
        expect(
          (mounted.plugin as unknown as Record<string, unknown>)[key]
        ).to.equal(value);
      });

      it(`stores ${key} when it changes`, async () => {
        await mount();
        (mounted.plugin as unknown as Record<string, unknown>)[key] = value;
        await mounted.settle();
        expect(storedSettings()[key]).to.equal(value);
      });
    });

    it('restores the control type', async () => {
      await mount({ controlTag: 'SampledValueControl' }, 'SMV-2007B4-LSVS.scd');
      expect(mounted.plugin.controlTag).to.equal('SampledValueControl');
      expect(driver.controlTitles()[0]).to.contain('SMV_Publisher');
    });

    it('stores the control type when it is switched', async () => {
      await mount(undefined, 'SMV-2007B4-LSVS.scd');
      await driver.switchControlType();
      expect(storedSettings().controlTag).to.equal('SampledValueControl');
    });

    it('restores the view', async () => {
      await mount({ subscriberView: true });
      expect(driver.ieds().length).to.be.greaterThan(0);
      expect(driver.controls()).to.have.length.greaterThan(0);
    });

    it('stores the view when it is switched', async () => {
      await mount();
      await driver.switchView();
      expect(storedSettings().subscriberView).to.equal(true);
    });

    it('applies restored settings to what is displayed', async () => {
      await mount({ filterOutQuality: true });
      expect(
        driver.fcdas().filter(f => f.visible).every(f => !f.label.endsWith('.q'))
      ).to.equal(true);
    });

    it('ignores unknown stored settings', async () => {
      await mount({ somethingElse: 'x' });
      expect(mounted.plugin.autoIncrement).to.equal(true);
    });

    // These were stored under one name and read under another, and corrupt
    // stored settings stopped the plugin loading.
    it('restores the filter for FCDAs which are not subscribed', async () => {
      await mount();
      mounted.plugin.filterOutNotSubscribed = true;
      await mounted.settle();
      const stored = storedSettings();
      expect(stored.filterOutNotSubscribed).to.equal(true);
      mounted.unmount();
      await mount(stored);
      expect(mounted.plugin.filterOutNotSubscribed).to.equal(true);
    });

    it('restores the filter for non-matching preconfigured FCDAs', async () => {
      await mount();
      mounted.plugin.filterOutPreconfiguredUnmatched = true;
      await mounted.settle();
      const stored = storedSettings();
      mounted.unmount();
      await mount(stored);
      expect(mounted.plugin.filterOutPreconfiguredUnmatched).to.equal(true);
    });

    it('falls back to defaults when the stored settings are not valid JSON', async () => {
      mounted = await mountPlugin({
        fixture: 'GOOSE-2007B4-LGOS.scd',
        rawSettings: '{not json'
      });
      expect(mounted.plugin.autoIncrement).to.equal(true);
    });
  });

  describe('publisher view settings menu', () => {
    const IGNORE_SUPERVISION_OFF = 0;
    const EXTERNAL = 1;
    const CHECK_ONLY = 2;
    const READ_ONLY = 3;

    beforeEach(async () => {
      await mount();
    });

    it('names the options', () => {
      expect(driver.menuLabels('settingsExtRefPublisherMenu')).to.deep.equal([
        'Change Supervision LNs',
        'Allow External Plugins',
        'Check Only Preconfigured Service and Basic Types',
        'Read-only view'
      ]);
    });

    it('shows the defaults as selected', () => {
      expect(driver.menuSelection('settingsExtRefPublisherMenu')).to.deep.equal([
        IGNORE_SUPERVISION_OFF,
        EXTERNAL
      ]);
    });

    it('can stop changing supervisions', async () => {
      await driver.chooseMenuItems('settingsExtRefPublisherMenu', [EXTERNAL]);
      expect(mounted.plugin.ignoreSupervision).to.equal(true);
      expect(mounted.plugin.hasAttribute('ignoresupervision')).to.equal(true);
    });

    it('can disallow external plugins', async () => {
      await driver.chooseMenuItems('settingsExtRefPublisherMenu', [
        IGNORE_SUPERVISION_OFF
      ]);
      expect(mounted.plugin.allowExternalPlugins).to.equal(false);
      expect(mounted.plugin.hasAttribute('allowexternalplugins')).to.equal(false);
    });

    it('can check only the preconfigured basic type', async () => {
      await driver.chooseMenuItems('settingsExtRefPublisherMenu', [
        IGNORE_SUPERVISION_OFF,
        EXTERNAL,
        CHECK_ONLY
      ]);
      expect(mounted.plugin.checkOnlyPreferredBasicType).to.equal(true);
    });

    it('can make the view read-only', async () => {
      await driver.chooseMenuItems('settingsExtRefPublisherMenu', [
        IGNORE_SUPERVISION_OFF,
        EXTERNAL,
        READ_ONLY
      ]);
      expect(mounted.plugin.readOnlyView).to.equal(true);
      expect(storedSettings().readOnlyView).to.equal(true);
    });
  });

  describe('subscriber view settings menu', () => {
    const AUTO_INCREMENT = 0;
    const CHANGE_SUPERVISION = 1;
    const EXTERNAL = 2;
    const CHECK_ONLY = 3;
    const READ_ONLY = 4;

    beforeEach(async () => {
      await mount({ subscriberView: true });
    });

    it('names the options', () => {
      expect(driver.menuLabels('settingsExtRefSubscriberMenu')).to.deep.equal([
        'Auto-increment',
        'Change Supervision LNs',
        'Allow External Plugins',
        'Check Only Preconfigured Service and Basic Types',
        'Read-only view'
      ]);
    });

    it('shows the defaults as selected', () => {
      expect(driver.menuSelection('settingsExtRefSubscriberMenu')).to.deep.equal([
        AUTO_INCREMENT,
        CHANGE_SUPERVISION,
        EXTERNAL
      ]);
    });

    it('can turn off auto-increment', async () => {
      await driver.chooseMenuItems('settingsExtRefSubscriberMenu', [
        CHANGE_SUPERVISION,
        EXTERNAL
      ]);
      expect(mounted.plugin.autoIncrement).to.equal(false);
    });

    it('can stop changing supervisions', async () => {
      await driver.chooseMenuItems('settingsExtRefSubscriberMenu', [
        AUTO_INCREMENT,
        EXTERNAL
      ]);
      expect(mounted.plugin.ignoreSupervision).to.equal(true);
    });

    it('can disallow external plugins', async () => {
      await driver.chooseMenuItems('settingsExtRefSubscriberMenu', [
        AUTO_INCREMENT,
        CHANGE_SUPERVISION
      ]);
      expect(mounted.plugin.allowExternalPlugins).to.equal(false);
    });

    it('can check only the preconfigured basic type', async () => {
      await driver.chooseMenuItems('settingsExtRefSubscriberMenu', [
        AUTO_INCREMENT,
        CHANGE_SUPERVISION,
        EXTERNAL,
        CHECK_ONLY
      ]);
      expect(mounted.plugin.checkOnlyPreferredBasicType).to.equal(true);
    });

    it('can make the view read-only and shows a lock', async () => {
      expect(driver.showsReadOnlyIcon).to.equal(false);
      await driver.chooseMenuItems('settingsExtRefSubscriberMenu', [
        AUTO_INCREMENT,
        CHANGE_SUPERVISION,
        EXTERNAL,
        READ_ONLY
      ]);
      expect(mounted.plugin.readOnlyView).to.equal(true);
      expect(driver.showsReadOnlyIcon).to.equal(true);
    });
  });

  describe('read-only view', () => {
    describe('in the publisher view', () => {
      beforeEach(async () => {
        await mount({ readOnlyView: true });
        await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      });

      it('shows a lock', () => {
        expect(driver.showsReadOnlyIcon).to.equal(true);
      });

      it('does not subscribe', async () => {
        await driver.selectExtRef(UNBOUND, 'publisher');
        expect(mounted.edits).to.have.length(0);
        expect(subscriptionAttributes(extRefById(mounted.doc, UNBOUND))).to.deep.equal(
          {
            iedName: 'SomethingNotPresent',
            ldInst: 'QB2_Disconnector',
            lnClass: 'CSWI',
            lnInst: '1',
            prefix: '',
            doName: 'Pos',
            daName: 'stVal',
            srcLDInst: 'QB2_Disconnector',
            srcPrefix: '',
            srcLNClass: 'LLN0',
            srcCBName: 'GOOSE2'
          }
        );
      });

      it('does not unsubscribe', async () => {
        await driver.selectExtRef(BOUND, 'publisher');
        expect(mounted.edits).to.have.length(0);
        expect(
          subscriptionAttributes(extRefById(mounted.doc, BOUND)).srcCBName
        ).to.equal('GOOSE2');
      });
    });

    describe('in the subscriber view', () => {
      beforeEach(async () => {
        await mount({ readOnlyView: true, subscriberView: true });
      });

      it('shows a lock', () => {
        expect(driver.showsReadOnlyIcon).to.equal(true);
      });

      it('does not unsubscribe a bound ExtRef', async () => {
        await driver.selectExtRef(BOUND, 'subscriber');
        expect(mounted.edits).to.have.length(0);
      });

      it('does not subscribe an unbound ExtRef', async () => {
        await driver.selectExtRef(
          'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]',
          'subscriber'
        );
        await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
        expect(mounted.edits).to.have.length(0);
      });
    });
  });
});
