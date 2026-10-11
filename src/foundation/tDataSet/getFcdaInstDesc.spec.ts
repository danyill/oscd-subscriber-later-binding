import { expect } from '@open-wc/testing';

import { mustQuery, parseScl } from '../../testing/scl.js';
import { getFcdaInstDesc } from './getFcdaInstDesc.js';

function fcdaIn(lnContent: string, fcdaAttrs: string, lnAttrs = '') {
  const doc = parseScl(`
    <IED name="Pub"><AccessPoint name="AP"><Server>
      <LDevice inst="LD0" desc="Bay 1">
        <LN lnClass="CSWI" inst="1" ${lnAttrs}>${lnContent}</LN>
        <LN0 lnClass="LLN0" inst="">
          <DataSet name="ds">
            <FCDA ldInst="LD0" lnClass="CSWI" lnInst="1" ${fcdaAttrs} fc="ST"/>
          </DataSet>
        </LN0>
      </LDevice>
    </Server></AccessPoint></IED>`);
  return mustQuery(doc, 'FCDA');
}

describe('getFcdaInstDesc', () => {
  it('returns nothing when the logical node cannot be found', () => {
    const fcda = fcdaIn('', 'doName="Pos" daName="stVal"');
    fcda.setAttribute('lnInst', '99');
    expect(getFcdaInstDesc(fcda)).to.deep.equal({});
  });

  it('returns the LDevice and LN descriptions', () => {
    const fcda = fcdaIn('', 'doName="Pos" daName="stVal"', 'desc="Breaker"');
    expect(getFcdaInstDesc(fcda)).to.deep.equal({
      LDevice: 'Bay 1',
      LN: 'Breaker'
    });
  });

  it('omits empty descriptions', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos" desc=""/>',
      'doName="Pos" daName="stVal"',
      'desc=""'
    );
    expect(getFcdaInstDesc(fcda)).to.deep.equal({ LDevice: 'Bay 1' });
  });

  it('returns the DOI description from the desc attribute', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos" desc="Position"/>',
      'doName="Pos" daName="stVal"'
    );
    expect(getFcdaInstDesc(fcda).DOI).to.equal('Position');
  });

  it('falls back to the DOI "d" data attribute value', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos"><DAI name="d"><Val>From d</Val></DAI></DOI>',
      'doName="Pos" daName="stVal"'
    );
    expect(getFcdaInstDesc(fcda).DOI).to.equal('From d');
  });

  it('prefers the DOI desc attribute over "d"', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos" desc="Attr"><DAI name="d"><Val>From d</Val></DAI></DOI>',
      'doName="Pos" daName="stVal"'
    );
    expect(getFcdaInstDesc(fcda).DOI).to.equal('Attr');
  });

  it('returns only LN level descriptions when the DOI is missing', () => {
    const fcda = fcdaIn(
      '<DOI name="Other" desc="x"/>',
      'doName="Pos" daName="stVal"'
    );
    expect(getFcdaInstDesc(fcda)).to.deep.equal({ LDevice: 'Bay 1' });
  });

  it('returns the DAI description', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos"><DAI name="stVal" desc="State"/></DOI>',
      'doName="Pos" daName="stVal"'
    );
    expect(getFcdaInstDesc(fcda).DAI).to.equal('State');
  });

  it('stops at the data object when there is no daName', () => {
    const fcda = fcdaIn(
      '<DOI name="Pos" desc="P"><DAI name="stVal" desc="State"/></DOI>',
      'doName="Pos"'
    );
    const desc = getFcdaInstDesc(fcda);
    expect(desc.DOI).to.equal('P');
    expect('DAI' in desc).to.equal(false);
  });

  it('collects descriptions of nested sub data objects', () => {
    const fcda = fcdaIn(
      `<DOI name="Phv"><SDI name="phsA" desc="Phase A">
         <SDI name="cVal" desc="Complex"><DAI name="f" desc="Float"/></SDI>
       </SDI></DOI>`,
      'doName="Phv.phsA.cVal" daName="f"'
    );
    const desc = getFcdaInstDesc(fcda);
    expect(desc.SDI).to.deep.equal(['Phase A', 'Complex']);
    expect(desc.DAI).to.equal('Float');
  });

  it('starts the SDI list at the first sub data object with a description', () => {
    const fcda = fcdaIn(
      `<DOI name="Phv"><SDI name="phsA">
         <SDI name="cVal" desc="Complex"/>
       </SDI></DOI>`,
      'doName="Phv.phsA.cVal"'
    );
    expect(getFcdaInstDesc(fcda).SDI).to.deep.equal(['Complex']);
  });

  it('describes the LN0 for LLN0 data', () => {
    const fcda = fcdaIn('', 'doName="Mod" daName="stVal"');
    fcda.setAttribute('lnClass', 'LLN0');
    fcda.setAttribute('lnInst', '');
    fcda.ownerDocument
      .querySelector('LN0')!
      .setAttribute('desc', 'Logical node zero');
    expect(getFcdaInstDesc(fcda).LN).to.equal('Logical node zero');
  });
});
