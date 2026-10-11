import { expect } from '@open-wc/testing';

import { mustQuery, parseScl } from '../testing/scl.js';
import { objectReferenceInIed, trimIdentityParent } from './identity.js';

describe('identity', () => {
  describe('trimIdentityParent', () => {
    it('removes the IED name and spaces the separators', () => {
      expect(trimIdentityParent('IED1>>LD0/LGOS 1>Val')).to.equal(
        'LD0/LGOS 1 > Val'
      );
    });

    it('returns an empty string for a bare IED name', () => {
      expect(trimIdentityParent('IED1')).to.equal('');
    });

    it('returns an empty string for an empty identity', () => {
      expect(trimIdentityParent('')).to.equal('');
    });

    it('keeps a single remaining segment', () => {
      expect(trimIdentityParent('IED1>LD0')).to.equal('LD0');
    });
  });

  describe('objectReferenceInIed', () => {
    const doc = parseScl(`
      <IED name="I"><AccessPoint name="AP"><Server>
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst=""><GSEControl name="gcb"/></LN0>
          <LN lnClass="CSWI" inst="1"><Inputs><ExtRef/></Inputs></LN>
          <LN prefix="Pre" lnClass="XCBR" inst="2"><Inputs><ExtRef/></Inputs></LN>
        </LDevice>
      </Server></AccessPoint></IED>`);

    it('describes an element within an LN0 without an instance', () => {
      expect(objectReferenceInIed(mustQuery(doc, 'GSEControl'))).to.equal(
        'LD0 / LLN0'
      );
    });

    it('describes an element within an LN', () => {
      expect(
        objectReferenceInIed(mustQuery(doc, 'LN[lnClass="CSWI"] ExtRef'))
      ).to.equal('LD0 / CSWI 1');
    });

    it('includes the logical node prefix', () => {
      expect(
        objectReferenceInIed(mustQuery(doc, 'LN[lnClass="XCBR"] ExtRef'))
      ).to.equal('LD0 / Pre XCBR 2');
    });

    it('describes the LN element itself', () => {
      expect(objectReferenceInIed(mustQuery(doc, 'LN[lnClass="CSWI"]'))).to.equal(
        'LD0 / CSWI 1'
      );
    });
  });
});
