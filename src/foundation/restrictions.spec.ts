import { expect } from '@open-wc/testing';
import { find } from '@openscd/scl-lib';

import { loadFixture } from '../testing/fixtures.js';
import { parseScl } from '../testing/scl.js';
import { SubscriptionModel } from './model.js';
import {
  doesFcdaMeetExtRefRestrictions,
  meetsRestrictions
} from './restrictions.js';
import type { DataSpec } from './model.js';

const extRef = (attrs: string): Element =>
  parseScl(`<ExtRef ${attrs}/>`).querySelector('ExtRef')!;

const fcda = (lnClass: string): Element =>
  parseScl(`<FCDA lnClass="${lnClass}"/>`).querySelector('FCDA')!;

const spec = (cdc: string, bType?: string): DataSpec => ({ cdc, bType });

describe('restrictions', () => {
  describe('meetsRestrictions', () => {
    it('allows any FCDA for an ExtRef without pDO', () => {
      expect(
        meetsRestrictions(extRef('intAddr="a"'), undefined, fcda('CSWI'), undefined)
      ).to.equal(true);
    });

    it('fails when the type of the ExtRef is not known', () => {
      expect(
        meetsRestrictions(extRef('pDO="Pos"'), undefined, fcda('CSWI'), spec('DPC'))
      ).to.equal(false);
    });

    it('fails when the type of the FCDA is not known', () => {
      expect(
        meetsRestrictions(extRef('pDO="Pos"'), spec('DPC'), fcda('CSWI'), undefined)
      ).to.equal(false);
    });

    it('allows matching common data classes', () => {
      expect(
        meetsRestrictions(
          extRef('pDO="Pos"'),
          spec('DPC', 'Dbpos'),
          fcda('CSWI'),
          spec('DPC', 'Dbpos')
        )
      ).to.equal(true);
    });

    it('fails for different common data classes', () => {
      expect(
        meetsRestrictions(
          extRef('pDO="Pos"'),
          spec('DPC'),
          fcda('CSWI'),
          spec('SPS')
        )
      ).to.equal(false);
    });

    [
      ['ENS', 'INS'],
      ['INS', 'ENS'],
      ['ENC', 'INC'],
      ['INC', 'ENC']
    ].forEach(([fcdaCdc, extRefCdc]) => {
      it(`allows an FCDA of ${fcdaCdc} for an ExtRef restricted to ${extRefCdc}`, () => {
        expect(
          meetsRestrictions(
            extRef('pDO="X"'),
            spec(extRefCdc),
            fcda('CSWI'),
            spec(fcdaCdc)
          )
        ).to.equal(true);
      });
    });

    [
      ['ENS', 'INC'],
      ['ENC', 'INS'],
      ['ENS', 'ENC'],
      ['SPS', 'INS']
    ].forEach(([fcdaCdc, extRefCdc]) => {
      it(`does not allow an FCDA of ${fcdaCdc} for an ExtRef restricted to ${extRefCdc}`, () => {
        expect(
          meetsRestrictions(
            extRef('pDO="X"'),
            spec(extRefCdc),
            fcda('CSWI'),
            spec(fcdaCdc)
          )
        ).to.equal(false);
      });
    });

    it('requires the logical node class when pLN is given', () => {
      const restricted = extRef('pDO="Pos" pLN="CSWI"');
      expect(
        meetsRestrictions(restricted, spec('DPC'), fcda('CSWI'), spec('DPC'))
      ).to.equal(true);
      expect(
        meetsRestrictions(restricted, spec('DPC'), fcda('XSWI'), spec('DPC'))
      ).to.equal(false);
    });

    it('requires the same basic type when pDA is given', () => {
      const restricted = extRef('pDO="Pos" pDA="stVal"');
      expect(
        meetsRestrictions(
          restricted,
          spec('DPC', 'Dbpos'),
          fcda('CSWI'),
          spec('DPC', 'Dbpos')
        )
      ).to.equal(true);
      expect(
        meetsRestrictions(
          restricted,
          spec('DPC', 'Dbpos'),
          fcda('CSWI'),
          spec('DPC', 'Quality')
        )
      ).to.equal(false);
    });

    it('does not compare basic types when pDA is not given', () => {
      expect(
        meetsRestrictions(
          extRef('pDO="Pos"'),
          spec('DPC', 'Dbpos'),
          fcda('CSWI'),
          spec('DPC', 'Quality')
        )
      ).to.equal(true);
    });

    it('allows an enumeration for an INT32 when pDA is given', () => {
      expect(
        meetsRestrictions(
          extRef('pDO="X" pDA="stVal"'),
          spec('INS', 'INT32'),
          fcda('CSWI'),
          spec('ENS', 'Enum')
        )
      ).to.equal(true);
    });

    describe('when checking only the basic type', () => {
      const options = { checkOnlyBType: true };

      it('allows other classes and logical nodes of the same basic type', () => {
        expect(
          meetsRestrictions(
            extRef('pDO="EnaOpn" pLN="CILO"'),
            spec('SPS', 'BOOLEAN'),
            fcda('PTOC'),
            spec('ACT', 'BOOLEAN'),
            options
          )
        ).to.equal(true);
      });

      it('fails for a different basic type', () => {
        expect(
          meetsRestrictions(
            extRef('pDO="EnaOpn"'),
            spec('SPS', 'BOOLEAN'),
            fcda('PTOC'),
            spec('DPC', 'Dbpos'),
            options
          )
        ).to.equal(false);
      });

      it('still allows everything for an ExtRef without pDO', () => {
        expect(
          meetsRestrictions(extRef(''), undefined, fcda('PTOC'), undefined, options)
        ).to.equal(true);
      });

      it('still fails when a type is not known', () => {
        expect(
          meetsRestrictions(
            extRef('pDO="EnaOpn"'),
            undefined,
            fcda('PTOC'),
            spec('ACT', 'BOOLEAN'),
            options
          )
        ).to.equal(false);
      });
    });
  });

  describe('doesFcdaMeetExtRefRestrictions', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    const restricted = () =>
      find(
        doc,
        'ExtRef',
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      ) as Element;

    const fcdaNamed = (lnClass: string, daName: string): Element =>
      Array.from(doc.querySelectorAll('FCDA')).find(
        f =>
          f.getAttribute('lnClass') === lnClass &&
          f.getAttribute('daName') === daName
      )!;

    it('allows everything when there is no ExtRef', () => {
      expect(
        doesFcdaMeetExtRefRestrictions(model, undefined, fcdaNamed('CSWI', 'q'))
      ).to.equal(true);
    });

    it('allows everything when there is no FCDA', () => {
      expect(
        doesFcdaMeetExtRefRestrictions(model, restricted(), undefined)
      ).to.equal(true);
    });

    it('allows the FCDA the ExtRef is preconfigured for', () => {
      expect(
        doesFcdaMeetExtRefRestrictions(model, restricted(), fcdaNamed('CSWI', 'stVal'))
      ).to.equal(true);
    });

    it('does not allow an FCDA of another basic type', () => {
      expect(
        doesFcdaMeetExtRefRestrictions(model, restricted(), fcdaNamed('CSWI', 'q'))
      ).to.equal(false);
    });

    it('does not allow an FCDA of another logical node class', () => {
      expect(
        doesFcdaMeetExtRefRestrictions(model, restricted(), fcdaNamed('PTOC', 'general'))
      ).to.equal(false);
    });

    it('allows an FCDA of the same basic type when only the basic type is checked', () => {
      const sps = find(
        doc,
        'ExtRef',
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRefSPS[0]'
      ) as Element;
      expect(
        doesFcdaMeetExtRefRestrictions(model, sps, fcdaNamed('PTOC', 'general'), {
          checkOnlyBType: true
        })
      ).to.equal(true);
      expect(
        doesFcdaMeetExtRefRestrictions(model, sps, fcdaNamed('PTOC', 'general'))
      ).to.equal(false);
    });
  });
});
