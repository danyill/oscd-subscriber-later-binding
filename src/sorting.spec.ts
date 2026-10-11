import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import type { ListedItem } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

const FIXTURE = 'GOOSE-2007B4-LGOS-sorting.scd';

/** The FCDA labels of a control block, e.g. `GOOSE_Publisher > GOOSE2`. */
function fcdasOf(driver: PluginDriver, controlTitle: string): string[] {
  const control = driver.controls().find(c => c.label === controlTitle)!;
  const result: string[] = [];
  let next = control.element.nextElementSibling;
  while (next !== null && next.classList.contains('fcda')) {
    result.push(
      `${next.querySelector('span:not([slot])')!.textContent!.trim()}`
    );
    next = next.nextElementSibling;
  }
  return result;
}

/** `intAddr` of a listed ExtRef: the last part of its identity. */
const intAddr = (item: ListedItem): string =>
  item.id.split('>').pop()!.replace(/\[0\]$/, '');

describe('sorting', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: FIXTURE });
    driver = new PluginDriver(mounted);
  });

  afterEach(() => {
    mounted.unmount();
  });

  describe('of FCDAs', () => {
    const first = 'GOOSE_Publisher > GOOSE2';
    const second = 'GOOSE_Publisher > GOOSE1';

    it('offers the sort orders', () => {
      expect(driver.menuLabels('sortFcdaMenu').map(l => l.replace(' check', ''))).to.deep.equal([
        'Data Model',
        'Object Reference',
        'Full Description',
        'Data Object and Attribute Description',
        'Data Attribute Description'
      ]);
    });

    it('defaults to data model order', () => {
      expect(driver.menuSelection('sortFcdaMenu')).to.deep.equal([0]);
      expect(fcdasOf(driver, first)).to.deep.equal([
        'QB2_Disconnector / CSWI 1 Pos.stVal',
        'QB2_Disconnector / CSWI 1 Pos.q',
        'QB2_Disconnector / CILO 1 EnaOpn.stVal',
        'QB2_Disconnector / CILO 1 EnaCls.q'
      ]);
    });

    it('sorts by object reference', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 1);
      expect(mounted.plugin.sortFcda).to.equal(1);
      expect(fcdasOf(driver, first)).to.deep.equal([
        'QB2_Disconnector / CILO 1 EnaCls.q',
        'QB2_Disconnector / CILO 1 EnaOpn.stVal',
        'QB2_Disconnector / CSWI 1 Pos.q',
        'QB2_Disconnector / CSWI 1 Pos.stVal'
      ]);
    });

    it('sorts by full description', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 2);
      expect(fcdasOf(driver, first)).to.deep.equal([
        'QB2_Disconnector / CSWI 1 Pos.q',
        'QB2_Disconnector / CSWI 1 Pos.stVal',
        'QB2_Disconnector / CILO 1 EnaOpn.stVal',
        'QB2_Disconnector / CILO 1 EnaCls.q'
      ]);
    });

    it('sorts by data object and attribute description', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 3);
      expect(fcdasOf(driver, second)).to.deep.equal([
        'QB1_Disconnector / CSWI 1 Pos.stVal',
        'QB1_Disconnector / CSWI 1 Pos.q',
        'QB1_Disconnector / CILO 1 EnaOpn.stVal',
        'QB1_Disconnector / CILO 1 EnaCls.q'
      ]);
    });

    it('sorts by data attribute description', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 4);
      expect(fcdasOf(driver, second)).to.deep.equal([
        'QB1_Disconnector / CILO 1 EnaCls.q',
        'QB1_Disconnector / CILO 1 EnaOpn.stVal',
        'QB1_Disconnector / CSWI 1 Pos.stVal',
        'QB1_Disconnector / CSWI 1 Pos.q'
      ]);
    });

    it('keeps FCDAs with their own control block', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 1);
      expect(
        driver.fcdas().every(f => f.element.dataset.control !== undefined)
      ).to.equal(true);
      expect(fcdasOf(driver, first)).to.have.length(4);
      expect(fcdasOf(driver, second)).to.have.length(4);
    });

    it('does not reorder the control blocks', async () => {
      await driver.chooseMenuItem('sortFcdaMenu', 1);
      expect(driver.controlTitles()).to.deep.equal([
        'GOOSE_Publisher > GOOSE2',
        'GOOSE_Publisher > GOOSE1',
        'GOOSE_Publisher2 > GOOSE2',
        'GOOSE_Publisher2 > GOOSE1'
      ]);
    });
  });

  describe('of ExtRefs in the publisher view', () => {
    const available = () => driver.publisherAvailableExtRefs().map(intAddr);

    beforeEach(async () => {
      await driver.selectFcda(
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        driver.fcdas()[0].id
      );
    });

    it('offers the sort orders', () => {
      expect(driver.menuLabels('sortExtRefPublisherMenu').map(l => l.replace(' check', ''))).to.deep.equal([
        'Data Model',
        'Internal Address',
        'Description'
      ]);
    });

    it('defaults to data model order', () => {
      expect(driver.menuSelection('sortExtRefPublisherMenu')).to.deep.equal([0]);
      expect(available().slice(0, 4)).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/q'
      ]);
    });

    it('sorts by internal address', async () => {
      await driver.chooseMenuItem('sortExtRefPublisherMenu', 1);
      expect(mounted.plugin.sortExtRefPublisher).to.equal(1);
      expect(available()).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'NoDesc3',
        'NoDesc4',
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/stVal',
        'someRestrictedExtRef',
        'someRestrictedExtRef'
      ]);
    });

    it('sorts by description, with described ExtRefs first', async () => {
      await driver.chooseMenuItem('sortExtRefPublisherMenu', 2);
      const items = driver.publisherAvailableExtRefs();
      const described = items.filter(i => i.secondary !== '');
      const undescribed = items.filter(i => i.secondary === '');
      expect(items.slice(0, described.length)).to.deep.equal(described);
      expect(undescribed.map(intAddr)).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'NoDesc3',
        'NoDesc4'
      ]);
      expect(described.map(i => i.secondary)).to.deep.equal(
        [...described.map(i => i.secondary)].sort((a, b) => a.localeCompare(b))
      );
    });
  });

  describe('of ExtRefs in the subscriber view', () => {
    const firstIed = () =>
      driver
        .subscriberExtRefs()
        .filter(e => e.id.startsWith('GOOSE_Subscriber>'))
        .map(intAddr);

    beforeEach(async () => {
      await driver.switchView();
    });

    it('offers the sort orders', () => {
      expect(driver.menuLabels('sortExtRefSubscriberMenu').map(l => l.replace(' check', ''))).to.deep.equal([
        'Data Model',
        'Internal Address',
        'Description',
        'Mapped Reference'
      ]);
    });

    it('defaults to data model order', () => {
      expect(driver.menuSelection('sortExtRefSubscriberMenu')).to.deep.equal([0]);
      expect(firstIed()).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/q',
        'someRestrictedExtRef',
        'NoDesc3',
        'NoDesc4'
      ]);
    });

    it('sorts by internal address within each IED', async () => {
      await driver.chooseMenuItem('sortExtRefSubscriberMenu', 1);
      expect(mounted.plugin.sortExtRefSubscriber).to.equal(1);
      expect(firstIed()).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'NoDesc3',
        'NoDesc4',
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/stVal',
        'someRestrictedExtRef'
      ]);
    });

    it('sorts by description within each IED, described ExtRefs first', async () => {
      await driver.chooseMenuItem('sortExtRefSubscriberMenu', 2);
      expect(firstIed().slice(-4)).to.deep.equal([
        'NoDesc1',
        'NoDesc2',
        'NoDesc3',
        'NoDesc4'
      ]);
    });

    it('sorts by mapped reference, with unmapped ExtRefs last', async () => {
      await driver.chooseMenuItem('sortExtRefSubscriberMenu', 3);
      const order = firstIed();
      expect(order.slice(0, 2)).to.deep.equal([
        'Pos;CSWI1/Pos/q',
        'Pos;CSWI1/Pos/stVal'
      ]);
      expect(order.slice(-3)).to.deep.equal(['NoDesc3', 'NoDesc4', 'someRestrictedExtRef'].slice(0, 0).concat(order.slice(-3)));
      expect(order.indexOf('someRestrictedExtRef')).to.be.greaterThan(
        order.indexOf('Pos;CSWI1/Pos/stVal')
      );
    });

    it('does not reorder the IEDs', async () => {
      await driver.chooseMenuItem('sortExtRefSubscriberMenu', 1);
      expect(driver.ieds().map(i => i.label)).to.deep.equal([
        'GOOSE_Subscriber',
        'GOOSE_Subscriber1',
        'GOOSE_Subscriber3'
      ]);
    });
  });
});
