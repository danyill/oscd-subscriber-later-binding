import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import {
  extRefById,
  subscriptionAttributes,
  supervisionReferences
} from './testing/scl-queries.js';

const GOOSE1 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE1';
const GOOSE1_QB1_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)';
const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';

const SUB = 'GOOSE_Subscriber>>Earth_Switch>';
const SUB1 = 'GOOSE_Subscriber1>>Earth_Switch>';
const SUB3 = 'GOOSE_Subscriber3>>Earth_Switch>';

const MISSING_IED = `${SUB} CILO 1>Pos;CSWI1/Pos/stVal[0]`;
const INVALID_MAPPING = `${SUB} CILO 1>Pos;CSWI1/Pos/q[0]`;
const BOUND = `${SUB} CSWI 1>Pos;CSWI1/Pos/stVal[0]`;
const RESTRICTED = `${SUB} CSWI 1>someRestrictedExtRef[0]`;
const SUB1_CILO_STVAL = `${SUB1} CILO 1>Pos;CSWI1/Pos/stVal[0]`;
const SUB1_CILO_Q = `${SUB1} CILO 1>Pos;CSWI1/Pos/q[0]`;
const SUB1_BOUND_SUPERVISED = `${SUB1} CSWI 1>Pos;CSWI1/Pos/stVal[0]`;

describe('subscriber view', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    driver = new PluginDriver(mounted);
    await driver.switchView();
  });

  afterEach(() => {
    mounted.unmount();
  });

  describe('initially', () => {
    it('is the subscriber view', () => {
      expect(mounted.plugin.subscriberView).to.equal(true);
    });

    it('lists IEDs which have later binding inputs, ordered by name', () => {
      expect(driver.ieds().map(i => i.label)).to.deep.equal([
        'GOOSE_Subscriber',
        'GOOSE_Subscriber1',
        'GOOSE_Subscriber3'
      ]);
    });

    it('lists only ExtRefs with an internal address', () => {
      expect(
        driver.subscriberExtRefs().every(e => e.label.includes(': '))
      ).to.equal(true);
      expect(driver.subscriberExtRefs()).to.have.length(13);
    });

    it('does not list ExtRefs for another service type', () => {
      expect(
        driver.subscriberExtRefs().filter(e => e.id.includes('someWeirdAnalogue'))
      ).to.have.length(0);
    });

    it('asks for an input to be selected', () => {
      expect(driver.headings().join(' ')).to.contain('Select Subscriber Input');
    });

    it('shows no FCDA as selected', () => {
      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
    });
  });

  describe('describing an ExtRef', () => {
    const item = (id: string) =>
      driver.subscriberExtRefs().find(e => e.id === id)!;

    it('shows the logical node and internal address', () => {
      expect(item(BOUND).label).to.contain(
        'Earth_Switch / CSWI 1: Pos;CSWI1/Pos/stVal'
      );
    });

    it('shows the subscribed data for a bound ExtRef', () => {
      expect(item(BOUND).label).to.contain(
        'GOOSE_Publisher > QB2_Disconnector / CSWI 1 Pos.stVal'
      );
    });

    it('shows nothing about data for an unbound ExtRef', () => {
      expect(item(SUB1_CILO_STVAL).label).to.not.contain('GOOSE_Publisher');
    });

    it('shows the ExtRef description', () => {
      expect(item(BOUND).secondary).to.contain('Interlocking.Input2');
    });

    it('shows the control block of a subscription', () => {
      expect(item(BOUND).secondary).to.contain('QB2_Disconnector / LLN0 GOOSE2');
    });

    it('shows the description of the subscribed data', () => {
      expect(item(BOUND).secondary).to.contain('Animalia > Arthropoda > SpiderLegs');
    });

    it('shows the supervision of a subscription', () => {
      const supervised = item(SUB1_BOUND_SUPERVISED);
      expect(supervised.secondary).to.contain('GOOSE_supervision > LGOS 1');
      expect(supervised.meta).to.equal('monitor_heart');
    });

    it('shows no supervision for a subscription without one', () => {
      expect(item(BOUND).secondary).to.not.contain('LGOS');
      expect(item(BOUND).meta).to.equal('');
    });

    it('flags a mapping to data which is not present', () => {
      expect(item(MISSING_IED).meta).to.equal('warning');
      expect(item(MISSING_IED).label).to.contain('SomethingNotPresent');
    });

    it('flags an invalid mapping', () => {
      expect(item(INVALID_MAPPING).meta).to.equal('error');
      expect(item(INVALID_MAPPING).label).to.contain('Invalid Mapping');
    });

    it('shows the CDC and basic type of a preconfigured ExtRef', () => {
      expect(item(RESTRICTED).title).to.contain('CDC: DPC');
      expect(item(RESTRICTED).title).to.contain('Basic Type: Dbpos');
    });
  });

  describe('selecting an ExtRef', () => {
    it('selects the ExtRef', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      expect(mounted.plugin.selectedExtRef?.getAttribute('intAddr')).to.equal(
        'Pos;CSWI1/Pos/stVal'
      );
    });

    it('shows the selected ExtRef in the title', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      expect(driver.headings().join(' ')).to.contain(
        'GOOSE_Subscriber1 > Earth_Switch / CILO 1: Pos;CSWI1/Pos/stVal'
      );
    });

    it('does not edit the document', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      expect(mounted.edits).to.have.length(0);
    });

    it('does not offer FCDAs which the selected ExtRef does not allow', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      const disabled = driver.fcdas().filter(f => f.disabled);
      expect(disabled.length).to.be.greaterThan(0);
      expect(disabled.every(f => f.label.endsWith('.q'))).to.equal(true);
    });
  });

  describe('subscribing an ExtRef to an FCDA', () => {
    beforeEach(async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
    });

    it('sets the data and control block attributes of the ExtRef', () => {
      expect(
        subscriptionAttributes(extRefById(mounted.doc, SUB1_CILO_STVAL))
      ).to.deep.equal({
        iedName: 'GOOSE_Publisher',
        ldInst: 'QB1_Disconnector',
        prefix: '',
        lnClass: 'CSWI',
        lnInst: '1',
        doName: 'Pos',
        daName: 'stVal',
        srcLDInst: 'QB2_Disconnector',
        srcPrefix: '',
        srcLNClass: 'LLN0',
        srcCBName: 'GOOSE1'
      });
    });

    it('dispatches an edit', () => {
      expect(mounted.edits).to.have.length(1);
    });

    it('shows the new subscription on the ExtRef', () => {
      const item = driver
        .subscriberExtRefs()
        .find(e => e.id === SUB1_CILO_STVAL)!;
      expect(item.label).to.contain(
        'GOOSE_Publisher > QB1_Disconnector / CSWI 1 Pos.stVal'
      );
    });

    it('increases the subscription count of the FCDA', () => {
      expect(driver.fcda(GOOSE1, GOOSE1_QB1_STVAL)!.meta).to.equal('2');
    });

    it('does not change supervisions already present for the control block', () => {
      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber1')).to.deep.equal(
        [
          'GOOSE_Publisher2QB2_Disconnector/LLN0.GOOSE2',
          'GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE1',
          'GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE2'
        ]
      );
    });
  });

  describe('auto-incrementing', () => {
    it('selects the next ExtRef after a subscription', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.plugin.selectedExtRef?.getAttribute('intAddr')).to.equal(
        'Pos;CSWI1/Pos/q'
      );
    });

    it('stops when the next ExtRef is already bound', async () => {
      await driver.selectExtRef(SUB1_CILO_Q, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
    });

    it('continues into the next IED', async () => {
      await driver.selectExtRef(RESTRICTED, 'subscriber');
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(mounted.plugin.selectedExtRef?.closest('IED')?.getAttribute('name')).to.equal(
        'GOOSE_Subscriber1'
      );
    });

    it('does not increment when the setting is off', async () => {
      mounted.plugin.autoIncrement = false;
      await mounted.settle();
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
    });
  });

  describe('unsubscribing an ExtRef', () => {
    it('removes the subscription attributes', async () => {
      await driver.selectExtRef(BOUND, 'subscriber');
      expect(subscriptionAttributes(extRefById(mounted.doc, BOUND))).to.deep.equal({});
    });

    it('keeps the ExtRef selected so it can be subscribed again', async () => {
      await driver.selectExtRef(BOUND, 'subscriber');
      expect(mounted.plugin.selectedExtRef?.getAttribute('desc')).to.equal(
        'Interlocking.Input2'
      );
    });

    it('decreases the subscription count of the FCDA', async () => {
      await driver.selectExtRef(BOUND, 'subscriber');
      expect(driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta).to.equal('2');
    });

    it('removes a mapping to data which is not present', async () => {
      await driver.selectExtRef(MISSING_IED, 'subscriber');
      expect(subscriptionAttributes(extRefById(mounted.doc, MISSING_IED))).to.deep.equal({});
    });

    it('removes an invalid mapping', async () => {
      await driver.selectExtRef(INVALID_MAPPING, 'subscriber');
      expect(subscriptionAttributes(extRefById(mounted.doc, INVALID_MAPPING))).to.deep.equal({});
    });

    it('can be followed by a new subscription', async () => {
      await driver.selectExtRef(BOUND, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, BOUND)).srcCBName
      ).to.equal('GOOSE1');
    });

    it('removes the supervision when the last ExtRef using the control block is unsubscribed', async () => {
      const lastUser = `${SUB3} CILO 1>ESW_Thing2[0]`;
      await driver.selectExtRef(lastUser, 'subscriber');
      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber3')).to.not.include(
        'GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE1'
      );
    });
  });
});
