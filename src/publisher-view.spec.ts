import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import {
  extRefById,
  subscriptionAttributes,
  supervisionReferences
} from './testing/scl-queries.js';

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';
const GOOSE1 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE1';
const GOOSE1_QB1_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)';

// ExtRefs in GOOSE-2007B4-LGOS.scd
const UNBOUND_NO_SUPERVISION =
  'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';
const BOUND_NO_SUPERVISION =
  'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]';
const BOUND_WITH_SUPERVISION =
  'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]';
// Subscribed, but to a publishing IED which is not in the document.
const BROKEN_SUBSCRIPTION =
  'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';

describe('publisher view', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    driver = new PluginDriver(mounted);
  });

  afterEach(() => {
    mounted.unmount();
  });

  describe('initially', () => {
    it('is the publisher view for GOOSE', () => {
      expect(mounted.plugin.subscriberView).to.equal(false);
      expect(mounted.plugin.controlTag).to.equal('GSEControl');
    });

    it('lists the GOOSE control blocks of all IEDs in the document', () => {
      expect(driver.controlTitles()).to.deep.equal([
        'GOOSE_Publisher > GOOSE2',
        'GOOSE_Publisher > GOOSE1',
        'GOOSE_Publisher2 > GOOSE2',
        'GOOSE_Publisher2 > GOOSE1'
      ]);
    });

    it('lists the FCDAs of each control block in data model order', () => {
      expect(driver.fcdas().map(f => f.label)).to.deep.equal([
        'QB2_Disconnector / CSWI 1 Pos.stVal',
        'QB2_Disconnector / CSWI 1 Pos.q',
        'QB1_Disconnector / CSWI 1 Pos.stVal',
        'QB1_Disconnector / CSWI 1 Pos.q',
        'QB2_Disconnector / CSWI 1 Pos.stVal',
        'QB2_Disconnector / CSWI 1 Pos.q',
        'QB1_Disconnector / CSWI 1 Pos.stVal',
        'QB1_Disconnector / CSWI 1 Pos.q'
      ]);
    });

    it('shows the description of the logical node and data', () => {
      expect(driver.fcdas().map(f => f.secondary)).to.deep.equal([
        'Animalia > Arthropoda > SpiderLegs',
        'Animalia > Arthropoda > SpiderLegs',
        'Triangles',
        'Triangles',
        '',
        '',
        'Tree > Birch',
        'Tree > Birch'
      ]);
    });

    it('shows how many ExtRefs subscribe to each FCDA', () => {
      expect(driver.fcdas().map(f => f.meta)).to.deep.equal([
        '3',
        '2',
        '1',
        '',
        '1',
        '',
        '',
        ''
      ]);
    });

    it('asks for a published item to be selected', () => {
      expect(driver.headings()).to.include('No published item selected');
      expect(driver.publisherExtRefs()).to.have.length(0);
    });

    it('shows the CDC and basic type of an FCDA in its tooltip', () => {
      const [first] = driver.fcdas();
      expect(first.title).to.match(/^CDC: [A-Z]+\s+Basic Type: \S+$/);
    });
  });

  describe('selecting an FCDA', () => {
    beforeEach(async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
    });

    it('lists the ExtRefs which subscribe to it', () => {
      expect(driver.publisherSubscribedExtRefs().map(e => e.id)).to.have.members(
        [
          BOUND_NO_SUPERVISION,
          BOUND_WITH_SUPERVISION,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]'
        ]
      );
    });

    it('shows subscribed ExtRef count matching the FCDA subscription count', () => {
      expect(driver.publisherSubscribedExtRefs()).to.have.length(
        Number(driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta)
      );
    });

    it('shows the supervision of a subscribed ExtRef', () => {
      const supervised = driver
        .publisherSubscribedExtRefs()
        .find(e => e.id === BOUND_WITH_SUPERVISION)!;
      expect(supervised.secondary).to.contain('GOOSE_supervision > LGOS 1');
      expect(supervised.meta).to.equal('monitor_heart');
    });

    it('does not show a supervision for an ExtRef without one', () => {
      const unsupervised = driver
        .publisherSubscribedExtRefs()
        .find(e => e.id === BOUND_NO_SUPERVISION)!;
      expect(unsupervised.meta).to.equal('');
    });

    it('lists unsubscribed ExtRefs as available', () => {
      const available = driver.publisherAvailableExtRefs().map(e => e.id);
      expect(available).to.include(UNBOUND_NO_SUPERVISION);
      expect(available).to.not.include(BOUND_NO_SUPERVISION);
    });

    it('does not offer ExtRefs of the publishing IED', () => {
      const ownIed = driver
        .publisherExtRefs()
        .filter(e => e.id.startsWith('GOOSE_Publisher>'));
      expect(ownIed).to.have.length(0);
    });

    it('flags an ExtRef whose mapping is missing or invalid', () => {
      const flagged = driver
        .publisherAvailableExtRefs()
        .filter(e => e.meta !== '')
        .map(e => e.meta);
      expect(flagged).to.include.members(['warning', 'error']);
    });

    it('can select a different FCDA', async () => {
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(driver.publisherSubscribedExtRefs()).to.have.length(1);
    });
  });

  describe('subscribing to an FCDA', () => {
    beforeEach(async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
    });

    it('sets the data and control block attributes of the ExtRef', async () => {
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');

      expect(
        subscriptionAttributes(extRefById(mounted.doc, UNBOUND_NO_SUPERVISION))
      ).to.deep.equal({
        iedName: 'GOOSE_Publisher',
        ldInst: 'QB2_Disconnector',
        lnClass: 'CSWI',
        lnInst: '1',
        doName: 'Pos',
        daName: 'stVal',
        srcLDInst: 'QB2_Disconnector',
        srcLNClass: 'LLN0',
        srcCBName: 'GOOSE2',
        prefix: '',
        srcPrefix: ''
      });
    });

    it('dispatches a single edit event', async () => {
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      expect(mounted.edits.length).to.be.greaterThan(0);
    });

    it('moves the ExtRef to the subscribed list', async () => {
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      expect(driver.publisherSubscribedExtRefs().map(e => e.id)).to.include(
        UNBOUND_NO_SUPERVISION
      );
      expect(driver.publisherAvailableExtRefs().map(e => e.id)).to.not.include(
        UNBOUND_NO_SUPERVISION
      );
    });

    it('increases the subscription count of the FCDA', async () => {
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      expect(driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta).to.equal('4');
    });

    it('does not create a supervision when the IED has no supervision LNs', async () => {
      const before = supervisionReferences(mounted.doc, 'GOOSE_Subscriber');
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber')).to.deep.equal(
        before
      );
    });

    it('can be repeated for another ExtRef', async () => {
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      const another = driver.publisherAvailableExtRefs()[0];
      await driver.click(another);
      expect(driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta).to.equal('5');
    });
  });

  describe('unsubscribing an ExtRef', () => {
    beforeEach(async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
    });

    it('removes the subscription attributes', async () => {
      await driver.selectExtRef(BOUND_NO_SUPERVISION, 'publisher');
      expect(
        subscriptionAttributes(extRefById(mounted.doc, BOUND_NO_SUPERVISION))
      ).to.deep.equal({});
    });

    it('keeps the internal address and description', async () => {
      await driver.selectExtRef(BOUND_NO_SUPERVISION, 'publisher');
      const extRef = extRefById(mounted.doc, BOUND_NO_SUPERVISION);
      expect(extRef.getAttribute('intAddr')).to.equal('Pos;CSWI1/Pos/stVal');
      expect(extRef.getAttribute('desc')).to.equal('Interlocking.Input2');
    });

    it('moves the ExtRef to the available list', async () => {
      await driver.selectExtRef(BOUND_NO_SUPERVISION, 'publisher');
      expect(driver.publisherAvailableExtRefs().map(e => e.id)).to.include(
        BOUND_NO_SUPERVISION
      );
    });

    it('decreases the subscription count of the FCDA', async () => {
      await driver.selectExtRef(BOUND_NO_SUPERVISION, 'publisher');
      expect(driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta).to.equal('2');
    });

    it('keeps the supervision while other ExtRefs still use the control block', async () => {
      const before = supervisionReferences(mounted.doc, 'GOOSE_Subscriber1');
      await driver.selectExtRef(BOUND_WITH_SUPERVISION, 'publisher');
      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber1')).to.deep.equal(
        before
      );
    });

    it('removes the supervision when it was the last ExtRef using the control block', async () => {
      const lastUser = 'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing2[0]';
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      const before = supervisionReferences(mounted.doc, 'GOOSE_Subscriber3');
      expect(before).to.include('GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE1');

      await driver.selectExtRef(lastUser, 'publisher');

      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber3')).to.deep.equal(
        before.filter(ref => ref !== 'GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE1')
      );
    });

    it('leaves supervisions alone when the setting to change them is off', async () => {
      mounted.plugin.ignoreSupervision = true;
      await mounted.settle();
      const lastUser = 'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing2[0]';
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      const before = supervisionReferences(mounted.doc, 'GOOSE_Subscriber3');

      await driver.selectExtRef(lastUser, 'publisher');

      expect(supervisionReferences(mounted.doc, 'GOOSE_Subscriber3')).to.deep.equal(
        before
      );
    });
  });

  describe('undoable edits', () => {
    // A user action may need several edits, e.g. removing an old subscription
    // before adding a new one. Those edits must undo and redo together.
    const undoDepth = (): number => mounted.editor.past.length;

    beforeEach(async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
    });

    it('subscribing an ExtRef adds one undoable edit', async () => {
      const before = undoDepth();
      await driver.selectExtRef(UNBOUND_NO_SUPERVISION, 'publisher');
      expect(undoDepth() - before).to.equal(1);
    });

    it('unsubscribing an ExtRef adds one undoable edit', async () => {
      const before = undoDepth();
      await driver.selectExtRef(BOUND_NO_SUPERVISION, 'publisher');
      expect(undoDepth() - before).to.equal(1);
    });

    it('replacing a broken subscription adds one undoable edit', async () => {
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      const before = undoDepth();
      await driver.selectExtRef(BROKEN_SUBSCRIPTION, 'publisher');
      expect(undoDepth() - before).to.equal(1);
    });
  });
});
