import { expect } from '@open-wc/testing';
import { find } from '@openscd/scl-lib';
import { handleEdit } from '@openscd/oscd-editor';

import { loadFixture } from '../testing/fixtures.js';
import { mustQuery } from '../testing/scl.js';
import {
  extRefById,
  subscriptionAttributes,
  supervisionReferences
} from '../testing/scl-queries.js';
import {
  needsUnsubscribe,
  subscribeEdits,
  unsubscribeEdits
} from './actions.js';

const settings = { ignoreSupervision: false, checkOnlyPreferredBasicType: false };

describe('actions', () => {
  let doc: XMLDocument;

  beforeEach(async () => {
    doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
  });

  const control = (ied: string, name: string): Element =>
    mustQuery(doc, `IED[name="${ied}"] GSEControl[name="${name}"]`);

  describe('unsubscribeEdits', () => {
    it('removes the subscription of an ExtRef', () => {
      const id = 'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]';
      unsubscribeEdits(extRefById(doc, id), settings).forEach(edit => handleEdit(edit));
      expect(subscriptionAttributes(extRefById(doc, id))).to.deep.equal({});
    });

    it('removes the supervision of the last subscription to a control block', () => {
      const id = 'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing2[0]';
      const before = supervisionReferences(doc, 'GOOSE_Subscriber3');
      unsubscribeEdits(extRefById(doc, id), settings).forEach(edit => handleEdit(edit));
      expect(supervisionReferences(doc, 'GOOSE_Subscriber3')).to.have.length(
        before.length - 1
      );
    });

    it('leaves supervisions alone when asked to', () => {
      const id = 'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing2[0]';
      const before = supervisionReferences(doc, 'GOOSE_Subscriber3');
      unsubscribeEdits(extRefById(doc, id), {
        ignoreSupervision: true
      }).forEach(edit => handleEdit(edit));
      expect(supervisionReferences(doc, 'GOOSE_Subscriber3')).to.deep.equal(before);
    });
  });

  describe('subscribeEdits', () => {
    const unbound = 'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';

    it('subscribes an ExtRef to an FCDA', () => {
      const goose1 = control('GOOSE_Publisher', 'GOOSE1');
      const fcda = mustQuery(
        goose1.parentElement!,
        'DataSet[name="GOOSE1sDataSet"] > FCDA[daName="stVal"]'
      );
      subscribeEdits(extRefById(doc, unbound), goose1, fcda, settings).forEach(edit =>
        handleEdit(edit)
      );
      expect(subscriptionAttributes(extRefById(doc, unbound))).to.deep.include({
        iedName: 'GOOSE_Publisher',
        srcCBName: 'GOOSE1',
        doName: 'Pos',
        daName: 'stVal'
      });
    });

    it('adds a supervision for a new control block when there is a free LGOS', () => {
      const val = mustQuery(
        doc,
        'IED[name="GOOSE_Subscriber1"] LN[lnClass="LGOS"][inst="2"] Val'
      );
      handleEdit({ element: val, textContent: '' });

      const other = control('GOOSE_Publisher2', 'GOOSE1');
      const fcda = other.parentElement!.querySelector(
        'DataSet[name="GOOSE1sDataSet"] > FCDA'
      )!;
      subscribeEdits(extRefById(doc, unbound), other, fcda, settings).forEach(edit =>
        handleEdit(edit)
      );
      expect(supervisionReferences(doc, 'GOOSE_Subscriber1')).to.include(
        'GOOSE_Publisher2QB2_Disconnector/LLN0.GOOSE1'
      );
    });

    it('does not add a supervision when asked not to', () => {
      const val = mustQuery(
        doc,
        'IED[name="GOOSE_Subscriber1"] LN[lnClass="LGOS"][inst="2"] Val'
      );
      handleEdit({ element: val, textContent: '' });

      const other = control('GOOSE_Publisher2', 'GOOSE1');
      const fcda = other.parentElement!.querySelector(
        'DataSet[name="GOOSE1sDataSet"] > FCDA'
      )!;
      subscribeEdits(extRefById(doc, unbound), other, fcda, {
        ...settings,
        ignoreSupervision: true
      }).forEach(edit => handleEdit(edit));
      expect(supervisionReferences(doc, 'GOOSE_Subscriber1')).to.not.include(
        'GOOSE_Publisher2QB2_Disconnector/LLN0.GOOSE1'
      );
    });
  });

  describe('needsUnsubscribe', () => {
    const extRef = (id: string) => find(doc, 'ExtRef', id) as Element;

    it('is true for a subscribed ExtRef', () => {
      expect(
        needsUnsubscribe(
          extRef('GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]')
        )
      ).to.equal(true);
    });

    it('is true for an ExtRef with an incomplete subscription', () => {
      expect(
        needsUnsubscribe(
          extRef('GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/q[0]')
        )
      ).to.equal(true);
    });

    it('is false for an ExtRef without a subscription', () => {
      expect(
        needsUnsubscribe(
          extRef('GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]')
        )
      ).to.equal(false);
    });
  });
});
