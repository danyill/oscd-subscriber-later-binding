import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import {
  extRefById,
  subscriptionAttributes,
  supervisionReferences
} from './testing/scl-queries.js';

const FIXTURE = 'SMV-2007B4-LSVS.scd';

const CURRENT_ONLY = 'SMV_Publisher>>CurrentTransformer>currrentOnly';
const CURRENT_ONLY_TCTR1_I =
  'SMV_Publisher>>CurrentTransformer>currrentOnlysDataSet>CurrentTransformer/L1 TCTR 1.AmpSv instMag.i (MX)';
const FULL_SMV = 'SMV_Publisher>>CurrentTransformer>fullSmv';

describe('sampled values', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: FIXTURE });
    driver = new PluginDriver(mounted);
  });

  afterEach(() => {
    mounted.unmount();
  });

  describe('switching between GOOSE and sampled values', () => {
    it('starts with GOOSE, which this document does not contain', () => {
      expect(mounted.plugin.controlTag).to.equal('GSEControl');
      expect(driver.controls()).to.have.length(0);
    });

    it('shows sampled value control blocks after switching', async () => {
      await driver.switchControlType();
      expect(mounted.plugin.controlTag).to.equal('SampledValueControl');
      expect(driver.controls()).to.have.length(
        mounted.doc.querySelectorAll('SampledValueControl').length
      );
      expect(driver.controlTitles()[0]).to.equal('SMV_Publisher > fullSmv');
    });

    it('titles the list for sampled values', async () => {
      await driver.switchControlType();
      expect(driver.headings().join(' ')).to.contain('Select SV Publisher');
    });

    it('switches back to GOOSE', async () => {
      await driver.switchControlType();
      await driver.switchControlType();
      expect(mounted.plugin.controlTag).to.equal('GSEControl');
      expect(driver.controls()).to.have.length(0);
    });

    it('clears the selection and the search', async () => {
      await driver.switchControlType();
      const all = driver.fcdas().length;
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      await driver.search('fcda', 'currrentOnly');
      expect(driver.fcdas().length).to.be.lessThan(all);
      await driver.switchControlType();
      await driver.switchControlType();
      expect(mounted.plugin.selectedFCDA).to.equal(undefined);
      expect(driver.fcdas()).to.have.length(all);
      expect(driver.headings()).to.include('No published item selected');
    });
  });

  describe('publisher view', () => {
    beforeEach(async () => {
      await driver.switchControlType();
    });

    it('lists the FCDAs of every sampled value control block', () => {
      const expected = Array.from(
        mounted.doc.querySelectorAll('SampledValueControl')
      ).reduce(
        (sum, cb) =>
          sum +
          cb.parentElement!.querySelectorAll(
            `:scope > DataSet[name="${cb.getAttribute('datSet')}"] > FCDA`
          ).length,
        0
      );
      expect(driver.fcdas()).to.have.length(expected);
    });

    it('shows how many ExtRefs subscribe to an FCDA', () => {
      expect(driver.fcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I)!.meta).to.equal('5');
    });

    it('shows no count for an FCDA without subscriptions', () => {
      const unsubscribed = driver
        .fcdas()
        .find(f => f.element.dataset.control === FULL_SMV)!;
      expect(unsubscribed.meta).to.equal('');
    });

    it('lists the ExtRefs which subscribe to the selected FCDA', async () => {
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      expect(
        driver.publisherSubscribedExtRefs().map(e => e.id.split('>>')[0]).sort()
      ).to.deep.equal([
        'SMV_Subscriber2',
        'SMV_Subscriber4',
        'SMV_Subscriber5',
        'SMV_Subscriber6',
        'SMV_Subscriber7'
      ]);
    });

    it('does not offer ExtRefs for another service type', async () => {
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      expect(
        driver.publisherAvailableExtRefs().some(e => e.id.includes('sillyLikeA'))
      ).to.equal(false);
    });

    it('shows the supervision of a subscribed ExtRef', async () => {
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      const supervised = driver
        .publisherSubscribedExtRefs()
        .find(e => e.id.startsWith('SMV_Subscriber2'))!;
      expect(supervised.secondary).to.contain('LSVS');
      expect(supervised.meta).to.equal('monitor_heart');
    });

    describe('subscribing', () => {
      beforeEach(async () => {
        await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      });

      it('sets the data, control block and service type of the ExtRef', async () => {
        const id = driver
          .publisherAvailableExtRefs()
          .find(e => e.id.startsWith('SMV_Subscriber3') && e.id.includes('TCTR1/AmpSv/instMag.i'))!
          .id;
        await driver.selectExtRef(id, 'publisher');
        expect(
          subscriptionAttributes(extRefById(mounted.doc, id))
        ).to.deep.include({
          iedName: 'SMV_Publisher',
          ldInst: 'CurrentTransformer',
          lnClass: 'TCTR',
          lnInst: '1',
          doName: 'AmpSv',
          daName: 'instMag.i',
          srcCBName: 'currrentOnly'
        });
        expect(extRefById(mounted.doc, id).getAttribute('serviceType')).to.equal(
          'SMV'
        );
      });

      it('increases the subscription count', async () => {
        await driver.click(
          driver
            .publisherAvailableExtRefs()
            .find(e => e.id.startsWith('SMV_Subscriber3'))
        );
        expect(driver.fcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I)!.meta).to.equal('6');
      });

      it('does not create a supervision when the IED has no supervision logical nodes', async () => {
        const before = supervisionReferences(mounted.doc, 'SMV_Subscriber3', 'LSVS');
        await driver.click(
          driver
            .publisherAvailableExtRefs()
            .find(e => e.id.startsWith('SMV_Subscriber3'))
        );
        expect(supervisionReferences(mounted.doc, 'SMV_Subscriber3', 'LSVS')).to.deep.equal(before);
      });

      it('creates a supervision in a free LSVS for a new control block', async () => {
        const fullSmvFcda = driver
          .fcdas()
          .find(f => f.element.dataset.control === FULL_SMV)!;
        await driver.selectFcda(FULL_SMV, fullSmvFcda.id);
        const before = supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS');
        const free = driver
          .publisherAvailableExtRefs()
          .find(e => e.id.startsWith('SMV_Subscriber2'))!;
        await driver.click(free);
        expect(
          supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS')
        ).to.deep.equal(
          [...before, 'SMV_PublisherCurrentTransformer/LLN0.fullSmv'].sort()
        );
      });

      it('does not create a second supervision for a control block already supervised', async () => {
        const before = supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS');
        const free = driver
          .publisherAvailableExtRefs()
          .find(e => e.id.startsWith('SMV_Subscriber2'))!;
        await driver.click(free);
        expect(supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS')).to.deep.equal(before);
      });
    });

    describe('unsubscribing', () => {
      it('removes the subscription from the ExtRef', async () => {
        await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
        const bound = driver
          .publisherSubscribedExtRefs()
          .find(e => e.id.startsWith('SMV_Subscriber4'))!;
        await driver.click(bound);
        expect(
          subscriptionAttributes(extRefById(mounted.doc, bound.id))
        ).to.deep.equal({});
        expect(driver.fcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I)!.meta).to.equal('4');
      });

      it('removes the supervision when the last ExtRef using the control block is unsubscribed', async () => {
        await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
        const before = supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS');
        expect(before.length).to.be.greaterThan(0);
        const bound = driver
          .publisherSubscribedExtRefs()
          .find(e => e.id.startsWith('SMV_Subscriber2'))!;
        await driver.click(bound);
        expect(
          supervisionReferences(mounted.doc, 'SMV_Subscriber2', 'LSVS').length
        ).to.be.lessThan(before.length);
      });
    });
  });

  describe('subscriber view', () => {
    beforeEach(async () => {
      await driver.switchControlType();
      await driver.switchView();
    });

    it('lists IEDs with sampled value inputs', () => {
      expect(driver.ieds().map(i => i.label)).to.include.members([
        'SMV_Subscriber',
        'SMV_Subscriber2',
        'SMV_Subscriber7'
      ]);
    });

    it('does not list ExtRefs for another service type', () => {
      expect(
        driver.subscriberExtRefs().some(e => e.id.includes('sillyLikeA'))
      ).to.equal(false);
    });

    it('shows the subscription of a bound ExtRef', () => {
      const bound = driver
        .subscriberExtRefs()
        .find(
          e =>
            e.id.startsWith('SMV_Subscriber2') &&
            e.id.includes('AmpSv;TCTR1/AmpSv/instMag.i')
        )!;
      expect(bound.label).to.contain('SMV_Publisher');
      expect(bound.secondary).to.contain('currrentOnly');
    });

    it('subscribes an ExtRef to an FCDA', async () => {
      const free = driver
        .subscriberExtRefs()
        .find(
          e =>
            e.id.startsWith('SMV_Subscriber3') &&
            e.id.includes('AmpSv;TCTR1/AmpSv/instMag.i')
        )!;
      await driver.click(free);
      await driver.selectFcda(CURRENT_ONLY, CURRENT_ONLY_TCTR1_I);
      const attrs = subscriptionAttributes(extRefById(mounted.doc, free.id));
      expect(attrs.srcCBName).to.equal('currrentOnly');
      expect(attrs.iedName).to.equal('SMV_Publisher');
    });

    it('unsubscribes a bound ExtRef', async () => {
      const bound = driver
        .subscriberExtRefs()
        .find(
          e =>
            e.id.startsWith('SMV_Subscriber2') &&
            e.id.includes('AmpSv;TCTR1/AmpSv/instMag.i')
        )!;
      await driver.click(bound);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, bound.id))
      ).to.deep.equal({});
    });

    it('exports sampled value inputs as Markdown', async () => {
      await driver.search('subscriberExtRef', 'SMV_Subscriber2 "AmpSv;TCTR1/AmpSv/instMag.i"');
      const markdown = await driver.copyMarkdown('subscriber');
      expect(markdown).to.contain('📦 SMV_Subscriber2');
      expect(markdown).to.contain('currrentOnly');
    });
  });

  describe('publisher markdown', () => {
    it('exports sampled value control blocks', async () => {
      await driver.switchControlType();
      await driver.search('fcda', 'currrentOnly "L1 TCTR 1" instMag.i');
      const markdown = await driver.copyMarkdown('publisher');
      expect(markdown).to.contain('* SMV_Publisher > currrentOnly');
      expect(markdown).to.contain('(5 subscriptions)');
    });
  });
});
