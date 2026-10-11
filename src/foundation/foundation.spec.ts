import { expect } from '@open-wc/testing';

import { mustQuery, parseScl } from '../testing/scl.js';
import {
  compareNames,
  findFCDAs,
  getDescriptionAttribute,
  getNameAttribute
} from './foundation.js';

const doc = parseScl(`
  <IED name="Pub">
    <AccessPoint name="AP"><Server>
      <LDevice inst="LD0">
        <LN0 lnClass="LLN0" inst="">
          <DataSet name="ds">
            <FCDA ldInst="LD0" prefix="" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
            <FCDA ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="q" fc="ST"/>
            <FCDA ldInst="LD0" prefix="P" lnClass="XCBR" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
          </DataSet>
        </LN0>
        <Private type="ignored">
          <FCDA ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal" fc="ST"/>
        </Private>
      </LDevice>
    </Server></AccessPoint>
  </IED>
  <IED name="Sub">
    <AccessPoint name="AP"><Server>
      <LDevice inst="LD0"><LN lnClass="LGOS" inst="1">
        <Inputs>
          <ExtRef iedName="Pub" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal"/>
          <ExtRef iedName="Pub" ldInst="LD0" prefix="P" lnClass="XCBR" lnInst="1" doName="Pos" daName="stVal"/>
          <ExtRef iedName="Missing" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal"/>
          <ExtRef iedName="Pub" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="other"/>
          <Private type="x"><ExtRef iedName="Pub" ldInst="LD0" lnClass="CSWI" lnInst="1" doName="Pos" daName="stVal"/></Private>
        </Inputs>
      </LN></LDevice>
    </Server></AccessPoint>
  </IED>`);

describe('foundation', () => {
  describe('getNameAttribute / getDescriptionAttribute', () => {
    it('returns the attribute value when present', () => {
      const ied = mustQuery(doc, 'IED[name="Pub"]');
      expect(getNameAttribute(ied)).to.equal('Pub');
    });

    it('returns undefined when the attribute is missing', () => {
      const ln = mustQuery(doc, 'LN0');
      expect(getNameAttribute(ln)).to.equal(undefined);
      expect(getDescriptionAttribute(ln)).to.equal(undefined);
    });

    it('returns descriptions, including an empty one', () => {
      const withDesc = parseScl('<IED name="A" desc="hello"/>').querySelector(
        'IED'
      )!;
      const emptyDesc = parseScl('<IED name="A" desc=""/>').querySelector(
        'IED'
      )!;
      expect(getDescriptionAttribute(withDesc)).to.equal('hello');
      expect(getDescriptionAttribute(emptyDesc)).to.equal('');
    });
  });

  describe('compareNames', () => {
    const el = (name?: string) =>
      parseScl(`<IED ${name === undefined ? '' : `name="${name}"`}/>`)
        .documentElement.firstElementChild!;

    it('compares two strings', () => {
      expect(compareNames('a', 'b')).to.be.lessThan(0);
      expect(compareNames('b', 'a')).to.be.greaterThan(0);
      expect(compareNames('a', 'a')).to.equal(0);
    });

    it('compares two elements by name', () => {
      expect(compareNames(el('a'), el('b'))).to.be.lessThan(0);
      expect(compareNames(el('b'), el('a'))).to.be.greaterThan(0);
    });

    it('compares an element with a string', () => {
      expect(compareNames(el('a'), 'b')).to.be.lessThan(0);
      expect(compareNames('b', el('a'))).to.be.greaterThan(0);
    });

    it('treats a missing name on an element as an empty string', () => {
      expect(compareNames(el(), el('a'))).to.be.lessThan(0);
      expect(compareNames(el(), 'a')).to.be.lessThan(0);
      expect(compareNames(el(), el())).to.equal(0);
    });
  });

  describe('findFCDAs', () => {
    const extRefs = Array.from(doc.querySelectorAll('ExtRef'));

    it('finds the FCDA matching all data attributes', () => {
      const fcdas = findFCDAs(extRefs[0]);
      expect(fcdas.length).to.equal(1);
      expect(fcdas[0].getAttribute('daName')).to.equal('stVal');
      expect(fcdas[0].getAttribute('lnClass')).to.equal('CSWI');
    });

    it('treats a missing prefix as an empty prefix', () => {
      const fcdas = findFCDAs(extRefs[0]);
      expect(fcdas[0].getAttribute('prefix')).to.equal('');
    });

    it('matches on prefix', () => {
      const fcdas = findFCDAs(extRefs[1]);
      expect(fcdas.map(f => f.getAttribute('lnClass'))).to.deep.equal([
        'XCBR'
      ]);
    });

    it('returns nothing when the IED does not exist', () => {
      expect(findFCDAs(extRefs[2]).length).to.equal(0);
    });

    it('returns nothing when no FCDA matches', () => {
      expect(findFCDAs(extRefs[3]).length).to.equal(0);
    });

    it('ignores ExtRefs in Private elements', () => {
      expect(findFCDAs(extRefs[4]).length).to.equal(0);
    });

    it('ignores elements which are not ExtRefs', () => {
      expect(findFCDAs(mustQuery(doc, 'LN')).length).to.equal(0);
    });

    it('does not return FCDAs inside Private elements', () => {
      const all = findFCDAs(extRefs[0]);
      expect(all.every(f => f.closest('Private') === null)).to.equal(true);
    });
  });
});
