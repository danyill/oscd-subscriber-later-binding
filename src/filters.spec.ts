import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import type { ListedItem } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

const shown = (items: ListedItem[]) => items.filter(i => i.visible);
const labels = (items: ListedItem[]) => shown(items).map(i => i.label);

// Positions of the items in the FCDA filter menu
const SUBSCRIBED = 0;
const NOT_SUBSCRIBED = 1;
const DATA_OBJECTS = 2;
const QUALITY = 3;
const NON_MATCHING = 4;

describe('filters', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(fixture: string, subscriberView = false) {
    mounted = await mountPlugin({ fixture });
    driver = new PluginDriver(mounted);
    if (subscriberView) {
      await driver.switchView();
    }
  }

  describe('of FCDAs', () => {
    describe('in the publisher view', () => {
      beforeEach(async () => {
        await mount('GOOSE-2007B4-LGOS.scd');
      });

      it('shows everything by default', () => {
        expect(driver.menuSelection('filterFcdaMenu')).to.deep.equal([
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        expect(shown(driver.fcdas())).to.have.length(8);
      });

      it('names the filter options', () => {
        expect(driver.menuLabels('filterFcdaMenu')).to.deep.equal([
          'Subscribed',
          'Not Subscribed',
          'Data Objects',
          'Quality'
        ]);
      });

      it('hides subscribed FCDAs', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [
          NOT_SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        expect(shown(driver.fcdas()).every(f => f.meta === '')).to.equal(true);
        expect(shown(driver.fcdas())).to.have.length(4);
      });

      it('hides FCDAs which are not subscribed', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        expect(shown(driver.fcdas()).every(f => f.meta !== '')).to.equal(true);
        expect(shown(driver.fcdas())).to.have.length(4);
      });

      it('hides quality attributes', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          DATA_OBJECTS
        ]);
        expect(shown(driver.fcdas()).some(f => f.label.endsWith('.q'))).to.equal(
          false
        );
        expect(shown(driver.fcdas())).to.have.length(4);
      });

      it('shows everything again when the options are re-enabled', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [QUALITY]);
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        expect(shown(driver.fcdas())).to.have.length(8);
      });

      it('hides control blocks whose FCDAs are all subscribed when hiding subscribed', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [
          NOT_SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        const controls = shown(driver.controls()).map(c => c.label);
        expect(controls).to.not.include('GOOSE_Publisher > GOOSE2');
        expect(controls).to.include('GOOSE_Publisher2 > GOOSE1');
      });

      it('hides control blocks without subscribed FCDAs when hiding those not subscribed', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        const controls = shown(driver.controls()).map(c => c.label);
        expect(controls).to.not.include('GOOSE_Publisher2 > GOOSE1');
        expect(controls).to.include('GOOSE_Publisher > GOOSE2');
      });

      it('hides everything when neither subscribed nor not subscribed are shown', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [DATA_OBJECTS, QUALITY]);
        expect(shown(driver.controls())).to.have.length(0);
        expect(shown(driver.fcdas())).to.have.length(0);
      });

      it('sets the filter flags on the plugin', async () => {
        await driver.chooseMenuItems('filterFcdaMenu', [DATA_OBJECTS]);
        expect(mounted.plugin.filterOutSubscribed).to.equal(true);
        expect(mounted.plugin.filterOutNotSubscribed).to.equal(true);
        expect(mounted.plugin.filterOutQuality).to.equal(true);
        expect(mounted.plugin.filterOutDataObjects).to.equal(false);
      });
    });

    describe('with data objects', () => {
      beforeEach(async () => {
        await mount('GOOSE-2007B4-filter-test.scd');
      });

      it('lists data object references as disabled', () => {
        const dataObjects = driver.fcdas().filter(f => !f.label.includes('.'));
        expect(dataObjects.length).to.be.greaterThan(0);
        expect(dataObjects.every(f => f.disabled)).to.equal(true);
      });

      it('hides data objects when filtered', async () => {
        const before = shown(driver.fcdas()).length;
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          QUALITY
        ]);
        const after = shown(driver.fcdas());
        expect(after.length).to.be.lessThan(before);
        expect(after.every(f => f.label.includes('.'))).to.equal(true);
      });

      it('hides a control block containing only data objects', async () => {
        expect(
          shown(driver.controls()).some(c => c.label.includes('OnlyDODataset'))
        ).to.equal(true);
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          QUALITY
        ]);
        expect(
          shown(driver.controls()).some(c => c.label.includes('OnlyDODataset'))
        ).to.equal(false);
      });
    });

    describe('in the subscriber view', () => {
      const restricted = `GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]`;

      beforeEach(async () => {
        await mount('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd', true);
      });

      it('has an option for non-matching preconfigured FCDAs', () => {
        expect(driver.menuLabels('filterFcdaMenu')).to.include(
          'Non-Matching Preconfigured'
        );
        expect(driver.menuSelection('filterFcdaMenu')).to.include(NON_MATCHING);
      });

      it('shows FCDAs which do not match the selected ExtRef as disabled', async () => {
        await driver.selectExtRef(restricted, 'subscriber');
        const disabled = driver.fcdas().filter(f => f.disabled);
        expect(disabled.length).to.be.greaterThan(0);
        expect(shown(disabled)).to.have.length(disabled.length);
      });

      it('hides FCDAs which do not match the selected ExtRef', async () => {
        await driver.selectExtRef(restricted, 'subscriber');
        const before = shown(driver.fcdas()).length;
        await driver.chooseMenuItems('filterFcdaMenu', [
          SUBSCRIBED,
          NOT_SUBSCRIBED,
          DATA_OBJECTS,
          QUALITY
        ]);
        const after = shown(driver.fcdas());
        expect(after.length).to.be.lessThan(before);
        expect(after.some(f => f.disabled)).to.equal(false);
      });
    });
  });

  describe('of ExtRefs in the subscriber view', () => {
    // positions in the subscriber view filter menu
    const BOUND = 0;
    const NOT_BOUND = 1;
    const UNSPECIFIED_SERVICE = 2;
    const PDA_Q = 3;
    const PDA_T = 4;

    beforeEach(async () => {
      await mount('GOOSE-2007B4-filter-test.scd', true);
    });

    it('shows everything by default', () => {
      expect(driver.menuSelection('filterExtRefMenuSubscriber')).to.deep.equal([
        BOUND,
        NOT_BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q,
        PDA_T
      ]);
    });

    it('hides subscribed ExtRefs', async () => {
      const all = shown(driver.subscriberExtRefs()).length;
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        NOT_BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q,
        PDA_T
      ]);
      const remaining = shown(driver.subscriberExtRefs());
      expect(remaining.length).to.be.lessThan(all);
      expect(remaining.every(e => !e.label.includes('arrow_back'))).to.equal(true);
    });

    it('hides ExtRefs which are not subscribed', async () => {
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q,
        PDA_T
      ]);
      const remaining = shown(driver.subscriberExtRefs());
      expect(remaining.length).to.be.greaterThan(0);
      expect(remaining.every(e => e.label.includes('arrow_back'))).to.equal(true);
    });

    it('hides IEDs which have no remaining ExtRefs', async () => {
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        NOT_BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q,
        PDA_T
      ]);
      const ieds = shown(driver.ieds()).map(i => i.label);
      expect(ieds).to.not.include('Has_Only_Subscribed_ExtRefs');
      expect(ieds).to.include('Has_Only_Unsubscribed_ExtRefs');
      expect(ieds).to.include('GOOSE_Subscriber');
    });

    it('hides ExtRefs with unspecified service types', async () => {
      expect(
        shown(driver.ieds()).map(i => i.label)
      ).to.include('Has_Only_Unsubscribed_ExtRefs_with_No_Service_Type');
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        BOUND,
        NOT_BOUND,
        PDA_Q,
        PDA_T
      ]);
      expect(mounted.plugin.strictServiceTypes).to.equal(true);
      expect(driver.ieds().map(i => i.label)).to.not.include(
        'Has_Only_Unsubscribed_ExtRefs_with_No_Service_Type'
      );
    });

    it('hides ExtRefs preconfigured for a quality attribute', async () => {
      expect(driver.ieds().map(i => i.label)).to.include(
        'Has_Only_Preconfigured_pDAq'
      );
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        BOUND,
        NOT_BOUND,
        UNSPECIFIED_SERVICE,
        PDA_T
      ]);
      expect(driver.ieds().map(i => i.label)).to.not.include(
        'Has_Only_Preconfigured_pDAq'
      );
      expect(driver.ieds().map(i => i.label)).to.include(
        'Has_Only_Preconfigured_pDAt'
      );
    });

    it('hides ExtRefs preconfigured for a time attribute', async () => {
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        BOUND,
        NOT_BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q
      ]);
      expect(driver.ieds().map(i => i.label)).to.not.include(
        'Has_Only_Preconfigured_pDAt'
      );
      expect(driver.ieds().map(i => i.label)).to.include(
        'Has_Only_Preconfigured_pDAq'
      );
    });

    it('shows no ExtRefs when searching for one hidden by a filter', async () => {
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [
        BOUND,
        UNSPECIFIED_SERVICE,
        PDA_Q,
        PDA_T
      ]);
      await driver.search('subscriberExtRef', 'Restricted To Pos');
      expect(shown(driver.subscriberExtRefs())).to.have.length(0);
    });
  });

  describe('of ExtRefs in the publisher view', () => {
    const UNSPECIFIED_SERVICE = 0;
    const NON_MATCHING_PRECONFIGURED = 1;

    beforeEach(async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.selectFcda(
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
    });

    it('shows everything by default', () => {
      expect(driver.menuSelection('filterExtRefMenuPublisher')).to.deep.equal([
        UNSPECIFIED_SERVICE,
        NON_MATCHING_PRECONFIGURED
      ]);
    });

    it('hides ExtRefs with an unspecified service type', async () => {
      const before = driver.publisherAvailableExtRefs().length;
      await driver.chooseMenuItems('filterExtRefMenuPublisher', [
        NON_MATCHING_PRECONFIGURED
      ]);
      expect(driver.publisherAvailableExtRefs().length).to.be.lessThan(before);
      expect(mounted.plugin.strictServiceTypes).to.equal(true);
    });

    it('hides non-matching preconfigured ExtRefs', async () => {
      await driver.chooseMenuItems('filterExtRefMenuPublisher', [
        UNSPECIFIED_SERVICE
      ]);
      expect(mounted.plugin.filterOutPreconfiguredUnmatched).to.equal(true);
      expect(labels(driver.publisherAvailableExtRefs()).length).to.be.greaterThan(
        0
      );
    });
  });

  describe('explaining every option', () => {
    it('explains each FCDA filter and sort option', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      expect(
        driver.menuExplanations('filterFcdaMenu').every(text => text !== '')
      ).to.equal(true);
      expect(
        driver.menuExplanations('sortFcdaMenu').every(text => text !== '')
      ).to.equal(true);
    });

    it('explains each ExtRef filter and sort option', async () => {
      await mount('GOOSE-2007B4-filter-test.scd', true);
      expect(
        driver
          .menuExplanations('filterExtRefMenuSubscriber')
          .every(text => text !== '')
      ).to.equal(true);
      expect(
        driver
          .menuExplanations('sortExtRefSubscriberMenu')
          .every(text => text !== '')
      ).to.equal(true);
    });
  });

  describe('showing and resetting off-nominal options', () => {
    it('does not mark a filter or sort which is at its default', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      expect(driver.menuActive('filterFcdaMenu')).to.equal(false);
      expect(driver.menuActive('sortFcdaMenu')).to.equal(false);
    });

    it('marks a filter which differs from its default', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.chooseMenuItems('filterFcdaMenu', [DATA_OBJECTS]);
      expect(driver.menuActive('filterFcdaMenu')).to.equal(true);
    });

    it('marks a sort which differs from its default', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.chooseMenuItem('sortFcdaMenu', 1);
      expect(driver.menuActive('sortFcdaMenu')).to.equal(true);
    });

    it('returns the FCDA filter to its defaults', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.chooseMenuItems('filterFcdaMenu', [DATA_OBJECTS]);
      await driver.resetMenu('filterFcdaMenu');
      expect(driver.menuSelection('filterFcdaMenu')).to.deep.equal([
        SUBSCRIBED,
        NOT_SUBSCRIBED,
        DATA_OBJECTS,
        QUALITY
      ]);
      expect(driver.menuActive('filterFcdaMenu')).to.equal(false);
      expect(shown(driver.fcdas())).to.have.length(8);
    });

    it('returns the subscriber ExtRef filter to its defaults', async () => {
      await mount('GOOSE-2007B4-filter-test.scd', true);
      await driver.chooseMenuItems('filterExtRefMenuSubscriber', [0, 1, 2, 3]);
      expect(mounted.plugin.filterOutpDAt).to.equal(true);
      await driver.resetMenu('filterExtRefMenuSubscriber');
      expect(driver.menuSelection('filterExtRefMenuSubscriber')).to.deep.equal([
        0, 1, 2, 3, 4
      ]);
      expect(mounted.plugin.filterOutpDAt).to.equal(false);
      expect(driver.menuActive('filterExtRefMenuSubscriber')).to.equal(false);
    });

    it('returns the publisher ExtRef filter to its defaults', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.selectFcda(
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await driver.chooseMenuItems('filterExtRefMenuPublisher', [1]);
      await driver.resetMenu('filterExtRefMenuPublisher');
      expect(driver.menuSelection('filterExtRefMenuPublisher')).to.deep.equal([
        0, 1
      ]);
      expect(driver.menuActive('filterExtRefMenuPublisher')).to.equal(false);
    });

    it('returns the sort order to its default', async () => {
      await mount('GOOSE-2007B4-LGOS.scd');
      await driver.chooseMenuItem('sortFcdaMenu', 2);
      expect(mounted.plugin.sortFcda).to.equal(2);
      await driver.resetMenu('sortFcdaMenu');
      expect(driver.menuSelection('sortFcdaMenu')).to.deep.equal([0]);
      expect(mounted.plugin.sortFcda).to.equal(0);
      expect(driver.menuActive('sortFcdaMenu')).to.equal(false);
    });
  });
});
