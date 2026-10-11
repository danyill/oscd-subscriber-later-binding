import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import type { ListedItem } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import { extRefById, subscriptionAttributes } from './testing/scl-queries.js';

const FIXTURE = 'GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd';

// Preconfigured with pLN="CSWI" pDO="Pos" pDA="stVal" pServT="GOOSE"
const RESTRICTED = 'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]';
// Preconfigured with pLN="CILO" pDO="EnaOpn" pDA="stVal" (a BOOLEAN)
const RESTRICTED_SPS =
  'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRefSPS[0]';
// Not preconfigured
const UNRESTRICTED = 'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';

/** Short names of FCDAs in the first control block, e.g. `Pos.stVal`. */
const fcdaName = (item: ListedItem): string => item.label.split(' ').pop()!;

describe('preconfigured ExtRef restrictions', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(settings: Record<string, unknown> = {}) {
    mounted = await mountPlugin({ fixture: FIXTURE, settings });
    driver = new PluginDriver(mounted);
  }

  const enabledInFirstControl = () =>
    driver
      .fcdas()
      .filter(f => f.element.dataset.control === GOOSE2 && !f.disabled)
      .map(fcdaName);

  describe('in the subscriber view', () => {
    beforeEach(async () => {
      await mount({ subscriberView: true });
    });

    it('enables every FCDA for an ExtRef which is not preconfigured', async () => {
      await driver.selectExtRef(UNRESTRICTED, 'subscriber');
      expect(driver.fcdas().filter(f => f.disabled)).to.have.length(0);
    });

    it('enables only FCDAs matching the logical node, data object and attribute', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      expect(enabledInFirstControl()).to.deep.equal(['Pos.stVal']);
    });

    it('enables nothing when no FCDA matches the preconfigured data', async () => {
      await driver.selectExtRef(RESTRICTED_SPS, 'subscriber');
      expect(enabledInFirstControl()).to.deep.equal([]);
    });

    it('does not subscribe to an FCDA which does not match', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      const mismatch = driver.fcdas().find(f => f.disabled)!;
      await driver.click(mismatch);
      expect(mounted.edits).to.have.length(0);
    });

    it('subscribes to an FCDA which matches', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      const match = driver.fcdas().find(f => !f.disabled && f.label.endsWith('Pos.stVal'))!;
      await driver.click(match);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, RESTRICTED)).srcCBName
      ).to.equal('GOOSE2');
    });

    it('enables FCDAs of the same basic type when only the basic type is checked', async () => {
      mounted.plugin.checkOnlyPreferredBasicType = true;
      await mounted.settle();
      await driver.selectExtRef(RESTRICTED_SPS, 'subscriber');
      expect(enabledInFirstControl()).to.deep.equal(['Op.general']);
    });

    it('still requires the same basic type when only the basic type is checked', async () => {
      mounted.plugin.checkOnlyPreferredBasicType = true;
      await mounted.settle();
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      expect(enabledInFirstControl()).to.deep.equal(['Pos.stVal']);
    });

    it('subscribes an ExtRef to an FCDA of the same basic type when only the basic type is checked', async () => {
      mounted.plugin.checkOnlyPreferredBasicType = true;
      await mounted.settle();
      await driver.selectExtRef(RESTRICTED_SPS, 'subscriber');
      await driver.click(
        driver.fcdas().find(f => !f.disabled && f.label.endsWith('Op.general'))
      );
      const attrs = subscriptionAttributes(extRefById(mounted.doc, RESTRICTED_SPS));
      expect(attrs.lnClass).to.equal('PTOC');
      expect(attrs.doName).to.equal('Op');
      expect(attrs.daName).to.equal('general');
    });

    it('enables FCDAs again once the ExtRef is no longer selected', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      await driver.selectExtRef(UNRESTRICTED, 'subscriber');
      expect(driver.fcdas().filter(f => f.disabled)).to.have.length(0);
    });
  });

  describe('in the publisher view', () => {
    const restrictedItems = () =>
      driver
        .publisherAvailableExtRefs()
        .filter(e => /someRestrictedExtRef/.test(e.id));

    beforeEach(async () => {
      await mount();
    });

    it('enables matching preconfigured ExtRefs for the selected FCDA', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Pos.stVal')));
      const byName = Object.fromEntries(
        restrictedItems().map(e => [e.id.split('>').pop(), e.disabled])
      );
      expect(byName['someRestrictedExtRef[0]']).to.equal(false);
      expect(byName['someRestrictedExtRefSPS[0]']).to.equal(true);
    });

    it('disables preconfigured ExtRefs which do not match the selected FCDA', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Op.general')));
      expect(restrictedItems().every(e => e.disabled)).to.equal(true);
    });

    it('enables ExtRefs which are not preconfigured for any FCDA', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Op.general')));
      const others = driver
        .publisherAvailableExtRefs()
        .filter(e => !/someRestrictedExtRef/.test(e.id));
      expect(others.length).to.be.greaterThan(0);
      expect(others.every(e => !e.disabled)).to.equal(true);
    });

    it('enables ExtRefs with the same basic type when only the basic type is checked', async () => {
      mounted.plugin.checkOnlyPreferredBasicType = true;
      await mounted.settle();
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Op.general')));
      const sps = restrictedItems().find(e =>
        e.id.endsWith('someRestrictedExtRefSPS[0]')
      )!;
      expect(sps.disabled).to.equal(false);
    });

    it('hides non-matching preconfigured ExtRefs when filtered', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Op.general')));
      expect(restrictedItems().every(e => e.visible)).to.equal(true);
      await driver.chooseMenuItems('filterExtRefMenuPublisher', [0]);
      expect(restrictedItems().every(e => !e.visible)).to.equal(true);
    });

    it('keeps matching preconfigured ExtRefs visible when filtering', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Pos.stVal')));
      await driver.chooseMenuItems('filterExtRefMenuPublisher', [0]);
      const matching = restrictedItems().filter(e => !e.disabled);
      expect(matching.length).to.be.greaterThan(0);
      expect(matching.every(e => e.visible)).to.equal(true);
    });

    it('does not subscribe a disabled ExtRef', async () => {
      await driver.click(driver.fcdas().find(f => f.label.endsWith('Op.general')));
      await driver.click(restrictedItems()[0]);
      expect(mounted.edits).to.have.length(0);
    });
  });
});
