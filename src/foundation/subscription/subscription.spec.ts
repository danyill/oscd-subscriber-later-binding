import { expect } from '@open-wc/testing';

import { mustQuery, parseScl } from '../../testing/scl.js';
import {
  getCbReference,
  getExtRefControlBlockPath,
  getExtRefElements,
  getFcdaElements,
  getFcdaOrExtRefTitle,
  getOrderedIeds,
  getSubscribedExtRefElements,
  getUsedSupervisionInstances,
  isPartiallyConfigured,
  isSubscribed
} from './subscription.js';

const doc = parseScl(`
  <IED name="Zeta">
    <AccessPoint name="AP"><Server>
      <LDevice inst="LD0">
        <LN0 lnClass="LLN0" inst="">
          <DataSet name="ds">
            <FCDA ldInst="LD0" prefix="" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
            <FCDA ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
          </DataSet>
          <DataSet name="other">
            <FCDA ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
          </DataSet>
          <GSEControl name="gcb" datSet="ds"/>
          <GSEControl name="orphan" datSet="missing"/>
        </LN0>
      </LDevice>
    </Server></AccessPoint>
  </IED>
  <IED name="Alpha">
    <AccessPoint name="AP"><Server>
      <LDevice inst="LD0">
        <LN0 lnClass="LLN0" inst=""/>
        <LN lnClass="LGOS" inst="1">
          <DOI name="GoCBRef"><DAI name="setSrcRef"><Val>ZetaLD0/LLN0.gcb</Val></DAI></DOI>
        </LN>
        <LN lnClass="LGOS" inst="2">
          <DOI name="GoCBRef"><DAI name="setSrcRef"><Val></Val></DAI></DOI>
        </LN>
        <LN lnClass="LSVS" inst="1">
          <DOI name="SvCBRef"><DAI name="setSrcRef"><Val>ZetaLD0/LLN0.smv</Val></DAI></DOI>
        </LN>
        <LN lnClass="MMXU" inst="1">
          <Inputs>
            <ExtRef intAddr="in1" serviceType="GOOSE" iedName="Zeta" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal" srcLDInst="LD0" srcLNClass="LLN0" srcCBName="gcb"/>
            <ExtRef intAddr="in2" serviceType="GOOSE" iedName="Zeta" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="q" srcLDInst="LD0" srcLNClass="LLN0" srcCBName="other"/>
            <ExtRef intAddr="in3"/>
            <ExtRef serviceType="SMV" iedName="Zeta" srcCBName="smv" srcLDInst="LD0"/>
            <ExtRef iedName="Zeta" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos"/>
          </Inputs>
        </LN>
      </LDevice>
    </Server></AccessPoint>
  </IED>`);

const [lateGoose, , lateEmpty] = Array.from(
  doc.querySelectorAll('ExtRef[intAddr]')
);
const noIntAddr = doc.querySelectorAll('ExtRef:not([intAddr])');
const gse = mustQuery(doc, 'GSEControl[name="gcb"]');
const [fcdaStVal, fcdaQ] = Array.from(
  doc.querySelectorAll('DataSet[name="ds"] > FCDA')
);

describe('subscription foundation', () => {
  describe('getFcdaOrExtRefTitle', () => {
    it('formats a complete FCDA', () => {
      expect(getFcdaOrExtRefTitle(fcdaStVal).replace(/\s+/g, ' ')).to.equal(
        'LD0 / CSWI 1 Pos.stVal'
      );
    });

    it('includes a prefix', () => {
      const el = parseScl(
        '<FCDA ldInst="LD0" prefix="Pre" lnClass="X" lnInst="1" doName="A" daName="b"/>'
      ).querySelector('FCDA')!;
      expect(getFcdaOrExtRefTitle(el).replace(/\s+/g, ' ')).to.equal(
        'LD0 / Pre X 1 A.b'
      );
    });

    it('omits the daName separator when there is no daName', () => {
      const el = parseScl(
        '<FCDA ldInst="LD0" lnClass="X" lnInst="1" doName="A"/>'
      ).querySelector('FCDA')!;
      expect(getFcdaOrExtRefTitle(el)).to.not.contain('.');
    });

    it('copes with a missing ldInst', () => {
      const el = parseScl('<FCDA lnClass="X"/>').querySelector('FCDA')!;
      expect(getFcdaOrExtRefTitle(el)).to.not.contain('/');
    });
  });

  describe('getExtRefElements', () => {
    it('returns later binding ExtRefs (with intAddr) outside the FCDA IED', () => {
      const result = getExtRefElements(doc.documentElement, fcdaStVal, true);
      expect(result.length).to.equal(3);
      expect(result.every(e => e.hasAttribute('intAddr'))).to.equal(true);
    });

    it('returns early binding ExtRefs (without intAddr) when later binding is excluded', () => {
      const result = getExtRefElements(doc.documentElement, fcdaStVal, false);
      expect(result.length).to.equal(noIntAddr.length);
      expect(result.some(e => e.hasAttribute('intAddr'))).to.equal(false);
    });

    it('excludes ExtRefs in the same IED as the FCDA', () => {
      const own = mustQuery(doc, 'IED[name="Alpha"]');
      const ownElement = mustQuery(own, 'LN0');
      const result = getExtRefElements(own, ownElement, true);
      expect(result.length).to.equal(0);
    });

    it('includes everything when no FCDA is selected', () => {
      const result = getExtRefElements(doc.documentElement, undefined, true);
      expect(result.length).to.equal(3);
    });
  });

  describe('getSubscribedExtRefElements', () => {
    it('returns only ExtRefs matching the FCDA, IED and control block', () => {
      const result = getSubscribedExtRefElements(
        doc.documentElement,
        fcdaStVal,
        gse,
        true
      );
      expect(result.length).to.equal(1);
      expect(result[0].getAttribute('intAddr')).to.equal('in1');
    });

    it('does not match a different FCDA', () => {
      const result = getSubscribedExtRefElements(
        doc.documentElement,
        fcdaQ,
        gse,
        true
      );
      expect(result.length).to.equal(0);
    });

    it('returns nothing without a control block', () => {
      expect(
        getSubscribedExtRefElements(
          doc.documentElement,
          fcdaStVal,
          undefined,
          true
        ).length
      ).to.equal(0);
    });

    it('returns nothing without an FCDA', () => {
      expect(
        getSubscribedExtRefElements(doc.documentElement, undefined, gse, true)
          .length
      ).to.equal(0);
    });
  });

  describe('getCbReference', () => {
    it('builds a reference from the source attributes', () => {
      expect(getCbReference(lateGoose)).to.equal('ZetaLD0/LLN0.gcb');
    });

    it('falls back to ldInst and LLN0', () => {
      const el = parseScl(
        '<ExtRef iedName="I" ldInst="L" srcCBName="cb"/>'
      ).querySelector('ExtRef')!;
      expect(getCbReference(el)).to.equal('IL/LLN0.cb');
    });

    it('includes the source prefix', () => {
      const el = parseScl(
        '<ExtRef iedName="I" srcPrefix="P" srcLDInst="L" srcLNClass="LLN0" srcCBName="cb"/>'
      ).querySelector('ExtRef')!;
      expect(getCbReference(el)).to.equal('IPL/LLN0.cb');
    });
  });

  describe('isSubscribed / isPartiallyConfigured', () => {
    it('detects a complete subscription', () => {
      expect(isSubscribed(lateGoose)).to.equal(true);
      expect(isPartiallyConfigured(lateGoose)).to.equal(false);
    });

    it('detects an unconfigured ExtRef', () => {
      expect(isSubscribed(lateEmpty)).to.equal(false);
      expect(isPartiallyConfigured(lateEmpty)).to.equal(false);
    });

    it('detects a partial configuration', () => {
      const partial = doc.querySelector('ExtRef[serviceType="SMV"]')!;
      expect(isSubscribed(partial)).to.equal(false);
      expect(isPartiallyConfigured(partial)).to.equal(true);
    });

    it('requires doName for a subscription', () => {
      const el = parseScl(
        '<ExtRef iedName="I" ldInst="L" lnClass="C" lnInst="1"/>'
      ).querySelector('ExtRef')!;
      expect(isSubscribed(el)).to.equal(false);
      expect(isPartiallyConfigured(el)).to.equal(true);
    });
  });

  describe('getOrderedIeds', () => {
    it('sorts IEDs by name', () => {
      expect(
        getOrderedIeds(doc).map(i => i.getAttribute('name'))
      ).to.deep.equal(['Alpha', 'Zeta']);
    });

    it('returns an empty list without a document', () => {
      expect(getOrderedIeds(undefined as unknown as XMLDocument)).to.deep.equal(
        []
      );
    });
  });

  describe('getUsedSupervisionInstances', () => {
    it('returns LGOS instances with a reference for GOOSE', () => {
      const result = getUsedSupervisionInstances(doc, 'GOOSE');
      expect(result.map(l => l.getAttribute('inst'))).to.deep.equal(['1']);
    });

    it('returns LSVS instances for SMV', () => {
      const result = getUsedSupervisionInstances(doc, 'SMV');
      expect(result.map(l => l.getAttribute('lnClass'))).to.deep.equal([
        'LSVS'
      ]);
    });

    it('returns an empty list without a document', () => {
      expect(
        getUsedSupervisionInstances(undefined as unknown as Document, 'GOOSE')
      ).to.deep.equal([]);
    });
  });

  describe('getExtRefControlBlockPath', () => {
    it('describes the source control block', () => {
      expect(getExtRefControlBlockPath(lateGoose)).to.equal('LD0 / LLN0 gcb');
    });

    it('includes the source prefix', () => {
      const el = parseScl(
        '<ExtRef srcPrefix="P" srcLDInst="L" srcLNClass="C" srcCBName="cb"/>'
      ).querySelector('ExtRef')!;
      expect(getExtRefControlBlockPath(el)).to.equal('P L / C cb');
    });
  });

  describe('getFcdaElements', () => {
    it('returns the FCDAs of the control block data set', () => {
      expect(getFcdaElements(gse).length).to.equal(2);
    });

    it('returns nothing when the data set does not exist', () => {
      expect(
        getFcdaElements(mustQuery(doc, 'GSEControl[name="orphan"]')).length
      ).to.equal(0);
    });

    it('returns nothing for a detached element', () => {
      expect(getFcdaElements(doc.createElement('GSEControl')).length).to.equal(
        0
      );
    });
  });

});
