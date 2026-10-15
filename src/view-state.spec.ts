import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import { extRefById, subscriptionAttributes } from './testing/scl-queries.js';

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';

describe('view state', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(fixture = 'GOOSE-2007B4-LGOS.scd', settings = {}) {
    mounted = await mountPlugin({ fixture, settings });
    driver = new PluginDriver(mounted);
  }

  describe('without a document', () => {
    beforeEach(async () => {
      mounted = await mountPlugin({ noDocument: true });
      driver = new PluginDriver(mounted);
    });

    it('lists nothing in the publisher view', () => {
      expect(driver.controls()).to.have.length(0);
      expect(driver.fcdas()).to.have.length(0);
    });

    it('lists nothing in the subscriber view', async () => {
      await driver.switchView();
      expect(driver.ieds()).to.have.length(0);
      expect(driver.subscriberExtRefs()).to.have.length(0);
    });

    it('shows the list once a document is opened', async () => {
      const { loadFixture } = await import('./testing/plugin.js');
      await mounted.openDocument(
        await loadFixture('GOOSE-2007B4-LGOS.scd'),
        'GOOSE-2007B4-LGOS.scd'
      );
      expect(driver.controls()).to.have.length(4);
    });
  });

  describe('empty documents', () => {
    it('says there are no inputs in the subscriber view', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd', { subscriberView: true });
      expect(driver.headings()).to.include('No inputs');
      expect(driver.subscriberExtRefs()).to.have.length(0);
    });

    it('says there are no subscribed or available inputs in the publisher view', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd');
      await driver.click(driver.fcdas()[0]);
      expect(driver.placeholders()).to.include('No subscribed inputs');
      expect(driver.placeholders()).to.include('No available inputs to subscribe');
    });

    it('shows no counts when nothing is subscribed', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd');
      expect(driver.fcdas().every(f => f.meta === '')).to.equal(true);
    });

    it('lists IEDs without inputs only in the publisher view', async () => {
      await mount('GOOSE-no-inputs-or-subscriptions.scd');
      expect(driver.controlTitles().every(t => t.startsWith('GOOSE_Publisher'))).to.equal(true);
    });
  });

  describe('control blocks sharing a data set', () => {
    beforeEach(async () => {
      await mount('GOOSE-2007B4-LGOS-two-cbs.scd');
    });

    it('counts subscriptions separately for each control block', () => {
      const stVal = driver
        .fcdas()
        .filter(
          f =>
            f.element.dataset.control!.startsWith('GOOSE_Publisher>') &&
            f.label.endsWith('Pos.stVal')
        );
      const byControl = Object.fromEntries(
        stVal.map(f => [f.element.dataset.control!.split('>').pop(), f.meta])
      );
      expect(byControl).to.deep.equal({ GOOSE1: '1', GOOSE2: '' });
    });

    it('lists the same FCDA under each control block', () => {
      const names = driver
        .fcdas()
        .filter(f => f.element.dataset.control!.startsWith('GOOSE_Publisher>'))
        .map(f => f.element.dataset.control!.split('>').pop());
      expect(names.filter(n => n === 'GOOSE1').length).to.equal(
        names.filter(n => n === 'GOOSE2').length
      );
    });
  });

  describe('switching views', () => {
    beforeEach(async () => {
      await mount();
    });

    it('shows the subscriber view and back', async () => {
      await driver.switchView();
      expect(driver.ieds().length).to.be.greaterThan(0);
      await driver.switchView();
      expect(driver.ieds()).to.have.length(0);
      expect(driver.controls().length).to.be.greaterThan(0);
    });

    it('does not leave an FCDA selected for subscribing', async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      await driver.switchView();
      expect(
        driver.fcdas().filter(f => f.selected)
      ).to.have.length(0);
    });

    it('keeps the control type', async () => {
      await driver.switchView();
      expect(mounted.plugin.controlTag).to.equal('GSEControl');
    });
  });

  describe('switching control type', () => {
    it('clears the selected FCDA', async () => {
      mounted = await mountPlugin({ fixture: 'SMV-2007B4-LSVS.scd' });
      driver = new PluginDriver(mounted);
      await driver.switchControlType();
      await driver.click(driver.fcdas()[0]);
      expect(mounted.plugin.selectedFCDA).to.not.equal(undefined);
      await driver.switchControlType();
      expect(mounted.plugin.selectedFCDA).to.equal(undefined);
      expect(mounted.plugin.selectedControl).to.equal(undefined);
    });

    it('clears the selected ExtRef', async () => {
      mounted = await mountPlugin({
        fixture: 'SMV-2007B4-LSVS.scd',
        settings: { subscriberView: true, controlTag: 'SampledValueControl' }
      });
      driver = new PluginDriver(mounted);
      await driver.click(driver.subscriberExtRefs()[0]);
      expect(mounted.plugin.selectedExtRef).to.not.equal(undefined);
      await driver.switchControlType();
      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
    });
  });

  describe('selecting an FCDA in the subscriber view without an ExtRef', () => {
    beforeEach(async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { subscriberView: true });
    });

    it('does not edit the document', async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(mounted.edits).to.have.length(0);
    });

    it('does not keep the FCDA selected, so it can be chosen again', async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(
        driver.fcdas().filter(f => f.selected)
      ).to.have.length(0);
    });

    it('subscribes the ExtRef selected afterwards when an FCDA is chosen again', async () => {
      const id = 'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      await driver.selectExtRef(id, 'subscriber');
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, id)).srcCBName
      ).to.equal('GOOSE2');
    });
  });

  describe('auto-increment at the end of the list', () => {
    it('deselects the ExtRef when there is no next ExtRef', async () => {
      await mount('GOOSE-2007B4-LGOS.scd', { subscriberView: true });
      const last = driver.subscriberExtRefs().pop()!;
      await driver.click(last); // unsubscribes it and keeps it selected
      expect(mounted.plugin.selectedExtRef).to.not.equal(undefined);
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, last.id)).srcCBName
      ).to.equal('GOOSE2');
      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
      expect(
        driver.subscriberExtRefs().filter(e => e.selected)
      ).to.have.length(0);
    });
  });
});
