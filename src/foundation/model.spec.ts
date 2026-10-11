import { expect } from '@open-wc/testing';
import { find } from '@openscd/scl-lib';

import { loadFixture } from '../testing/fixtures.js';
import { mustQuery, parseScl } from '../testing/scl.js';
import { SubscriptionModel } from './model.js';

const control = (doc: XMLDocument, ied: string, name: string): Element =>
  mustQuery(doc, `IED[name="${ied}"] GSEControl[name="${name}"]`);

const extRef = (doc: XMLDocument, id: string): Element => {
  const found = find(doc, 'ExtRef', id);
  if (found === null) {
    throw new Error(`No ExtRef ${id}`);
  }
  return found as Element;
};

describe('SubscriptionModel', () => {
  describe('for GOOSE', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    it('is for the GOOSE service', () => {
      expect(model.serviceType).to.equal('GOOSE');
      expect(model.controlTag).to.equal('GSEControl');
    });

    it('lists the control blocks of every IED in document order', () => {
      expect(
        model.controls.map(
          c => `${c.closest('IED')!.getAttribute('name')} ${c.getAttribute('name')}`
        )
      ).to.deep.equal([
        'GOOSE_Publisher GOOSE2',
        'GOOSE_Publisher GOOSE1',
        'GOOSE_Publisher2 GOOSE2',
        'GOOSE_Publisher2 GOOSE1'
      ]);
    });

    it('does not list sampled value control blocks', () => {
      expect(
        model.controls.every(c => c.tagName === 'GSEControl')
      ).to.equal(true);
    });

    it('lists the FCDAs of a control block', () => {
      const fcdas = model.fcdasOf(control(doc, 'GOOSE_Publisher', 'GOOSE2'));
      expect(fcdas.map(f => f.getAttribute('daName'))).to.deep.equal([
        'stVal',
        'q'
      ]);
    });

    it('counts the ExtRefs subscribed to each FCDA of each control block', () => {
      const counts = model.controls.map(c =>
        model.fcdasOf(c).map(f => model.extRefCount(f, c))
      );
      expect(counts).to.deep.equal([
        [3, 2],
        [1, 0],
        [1, 0],
        [0, 0]
      ]);
    });

    it('answers the same count again', () => {
      const [c] = model.controls;
      const [fcda] = model.fcdasOf(c);
      expect(model.extRefCount(fcda, c)).to.equal(model.extRefCount(fcda, c));
    });

    it('counts a control block it was not built for by searching the document', () => {
      const other = new SubscriptionModel(doc, 'SampledValueControl');
      const [c] = model.controls;
      const [fcda] = model.fcdasOf(c);
      expect(other.extRefCount(fcda, c)).to.equal(3);
    });

    it('describes the data type of an FCDA', () => {
      const [c] = model.controls;
      const [fcda] = model.fcdasOf(c);
      expect(model.fcdaInfo(fcda).spec).to.deep.equal({
        cdc: 'DPC',
        bType: 'Dbpos'
      });
    });

    it('describes the instance descriptions of an FCDA', () => {
      const [c] = model.controls;
      const [fcda] = model.fcdasOf(c);
      expect(
        Object.values(model.fcdaInfo(fcda).desc).flat().join(' > ')
      ).to.equal('Animalia > Arthropoda > SpiderLegs');
    });

    it('answers the same FCDA information again', () => {
      const [c] = model.controls;
      const [fcda] = model.fcdasOf(c);
      expect(model.fcdaInfo(fcda)).to.equal(model.fcdaInfo(fcda));
    });

    it('describes the data type a preconfigured ExtRef is restricted to', () => {
      const restricted = extRef(
        doc,
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      );
      expect(model.extRefInfo(restricted).spec).to.deep.equal({
        cdc: 'DPC',
        bType: 'Dbpos'
      });
    });

    it('has no data type for an ExtRef which is not preconfigured', () => {
      const plain = extRef(
        doc,
        'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
      );
      expect(model.extRefInfo(plain).spec).to.equal(undefined);
    });

    it('answers the same ExtRef information again', () => {
      const plain = extRef(
        doc,
        'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
      );
      expect(model.extRefInfo(plain)).to.equal(model.extRefInfo(plain));
    });

    it('finds the supervision of a subscribed ExtRef', () => {
      const supervised = extRef(
        doc,
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
      );
      const supervision = model.supervisionOf(supervised);
      expect(supervision?.getAttribute('lnClass')).to.equal('LGOS');
      expect(supervision?.getAttribute('inst')).to.equal('1');
    });

    it('finds no supervision for a subscription without one', () => {
      const unsupervised = extRef(
        doc,
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
      );
      expect(model.supervisionOf(unsupervised)).to.equal(undefined);
    });

    it('finds no supervision for an ExtRef which is not subscribed', () => {
      const plain = extRef(
        doc,
        'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
      );
      expect(model.supervisionOf(plain)).to.equal(undefined);
    });
  });

  describe('for sampled values', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('SMV-2007B4-LSVS.scd');
      model = new SubscriptionModel(doc, 'SampledValueControl');
    });

    it('is for the SMV service', () => {
      expect(model.serviceType).to.equal('SMV');
    });

    it('lists sampled value control blocks only', () => {
      expect(model.controls).to.have.length(15);
      expect(
        model.controls.every(c => c.tagName === 'SampledValueControl')
      ).to.equal(true);
    });

    it('counts subscriptions', () => {
      const publisherControl = mustQuery(
        doc,
        'IED[name="SMV_Publisher"] SampledValueControl[name="currrentOnly"]'
      );
      const [first] = model.fcdasOf(publisherControl).filter(
        f => f.getAttribute('lnInst') === '1' && f.getAttribute('daName') === 'instMag.i'
      );
      expect(model.extRefCount(first, publisherControl)).to.equal(5);
    });

    it('finds supervisions by their LSVS logical node', () => {
      const bound = extRef(
        doc,
        'SMV_Subscriber2>>Overvoltage> PTRC 1>AmpSv;TCTR1/AmpSv/instMag.i[0]'
      );
      expect(model.supervisionOf(bound)?.getAttribute('lnClass')).to.equal('LSVS');
    });
  });

  describe('with control blocks sharing a data set', () => {
    it('counts each control block separately', async () => {
      const doc = await loadFixture('GOOSE-2007B4-LGOS-two-cbs.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const counts = Object.fromEntries(
        model.controls
          .filter(c => c.closest('IED')!.getAttribute('name') === 'GOOSE_Publisher')
          .map(c => [
            c.getAttribute('name'),
            model
              .fcdasOf(c)
              .filter(f => f.getAttribute('daName') === 'stVal')
              .map(f => model.extRefCount(f, c))
          ])
      );
      expect(counts).to.deep.equal({ GOOSE1: [1], GOOSE2: [0] });
    });
  });

  describe('without a document', () => {
    it('has no control blocks', () => {
      const model = new SubscriptionModel(undefined, 'GSEControl');
      expect(model.controls).to.deep.equal([]);
    });
  });

  describe('for a document without subscriptions', () => {
    it('counts nothing', () => {
      const doc = parseScl(`
        <IED name="P"><AccessPoint name="AP"><Server><LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="">
            <DataSet name="ds"><FCDA ldInst="LD0" lnClass="MMXU" lnInst="1" doName="A" daName="b" fc="MX"/></DataSet>
            <GSEControl name="gcb" datSet="ds"/>
          </LN0>
        </LDevice></Server></AccessPoint></IED>`);
      const model = new SubscriptionModel(doc, 'GSEControl');
      const [c] = model.controls;
      expect(model.fcdasOf(c).map(f => model.extRefCount(f, c))).to.deep.equal([0]);
    });

    it('ignores a control block whose data set does not exist', () => {
      const doc = parseScl(`
        <IED name="P"><AccessPoint name="AP"><Server><LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst=""><GSEControl name="gcb" datSet="missing"/></LN0>
        </LDevice></Server></AccessPoint></IED>`);
      const model = new SubscriptionModel(doc, 'GSEControl');
      expect(model.controls).to.have.length(1);
      expect(model.fcdasOf(model.controls[0])).to.deep.equal([]);
    });
  });
});
