import { expect } from '@open-wc/testing';

import { parseScl } from '../testing/scl.js';
import { ExtRefSortOrder, FcdaSortOrder, sortExtRefItems } from './sort.js';

const extRef = (attrs: string): Element =>
  parseScl(`<ExtRef ${attrs}/>`).querySelector('ExtRef')!;

const sorted = (order: ExtRefSortOrder, extRefs: Element[]): string[] =>
  [...extRefs]
    .sort((a, b) => sortExtRefItems(order, a, b))
    .map(e => e.getAttribute('id') ?? '');

describe('sort', () => {
  it('has stable enumeration values, as they are persisted in local storage', () => {
    expect(ExtRefSortOrder.DataModel).to.equal(0);
    expect(ExtRefSortOrder.InternalAddress).to.equal(1);
    expect(ExtRefSortOrder.Description).to.equal(2);
    expect(ExtRefSortOrder.MappedReference).to.equal(3);
    expect(FcdaSortOrder.DataModel).to.equal(0);
    expect(FcdaSortOrder.Path).to.equal(1);
    expect(FcdaSortOrder.FullDescription).to.equal(2);
    expect(FcdaSortOrder.DODescription).to.equal(3);
    expect(FcdaSortOrder.DADescription).to.equal(4);
  });

  describe('sortExtRefItems', () => {
    it('keeps data model order', () => {
      const a = extRef('id="a" intAddr="z"');
      const b = extRef('id="b" intAddr="a"');
      expect(sortExtRefItems(ExtRefSortOrder.DataModel, a, b)).to.equal(0);
    });

    describe('by internal address', () => {
      it('sorts alphabetically', () => {
        const refs = [
          extRef('id="1" intAddr="c"'),
          extRef('id="2" intAddr="a"'),
          extRef('id="3" intAddr="b"')
        ];
        expect(sorted(ExtRefSortOrder.InternalAddress, refs)).to.deep.equal([
          '2',
          '3',
          '1'
        ]);
      });

      it('sorts a missing address first', () => {
        const refs = [extRef('id="1" intAddr="a"'), extRef('id="2"')];
        expect(sorted(ExtRefSortOrder.InternalAddress, refs)).to.deep.equal([
          '2',
          '1'
        ]);
      });
    });

    describe('by description', () => {
      it('sorts described ExtRefs alphabetically', () => {
        const refs = [
          extRef('id="1" desc="b"'),
          extRef('id="2" desc="a"')
        ];
        expect(sorted(ExtRefSortOrder.Description, refs)).to.deep.equal([
          '2',
          '1'
        ]);
      });

      it('puts described ExtRefs before those without a description', () => {
        const refs = [
          extRef('id="none"'),
          extRef('id="empty" desc=""'),
          extRef('id="desc" desc="z"')
        ];
        expect(sorted(ExtRefSortOrder.Description, refs)[0]).to.equal('desc');
      });

      it('returns -1 and 1 for described versus undescribed', () => {
        const described = extRef('desc="x"');
        const plain = extRef('');
        expect(
          sortExtRefItems(ExtRefSortOrder.Description, described, plain)
        ).to.equal(-1);
        expect(
          sortExtRefItems(ExtRefSortOrder.Description, plain, described)
        ).to.equal(1);
      });

      it('treats two undescribed ExtRefs as equal', () => {
        expect(
          sortExtRefItems(
            ExtRefSortOrder.Description,
            extRef(''),
            extRef('desc=""')
          )
        ).to.equal(0);
      });
    });

    describe('by mapped reference', () => {
      it('sorts by IED name then data reference', () => {
        const refs = [
          extRef('id="1" iedName="B" ldInst="LD0" lnClass="X" doName="a"'),
          extRef('id="2" iedName="A" ldInst="LD0" lnClass="X" doName="z"'),
          extRef('id="3" iedName="A" ldInst="LD0" lnClass="X" doName="a"')
        ];
        expect(sorted(ExtRefSortOrder.MappedReference, refs)).to.deep.equal([
          '3',
          '2',
          '1'
        ]);
      });

      it('sorts unmapped ExtRefs using "Unknown" as the IED name', () => {
        const refs = [
          extRef('id="z" iedName="Z"'),
          extRef('id="unmapped"'),
          extRef('id="a" iedName="A"')
        ];
        expect(sorted(ExtRefSortOrder.MappedReference, refs)).to.deep.equal([
          'a',
          'unmapped',
          'z'
        ]);
      });
    });
  });
});
