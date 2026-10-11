import { expect } from '@open-wc/testing';

import { parseScl } from '../testing/scl.js';
import {
  doesExtRefpDAIncludeQ,
  doesExtRefpDAIncludeT,
  isBasicTypeEqual
} from './extref.js';

const extRef = (attrs: string): Element =>
  parseScl(`<ExtRef ${attrs}/>`).querySelector('ExtRef')!;

describe('extref', () => {
  describe('doesExtRefpDAIncludeQ / doesExtRefpDAIncludeT', () => {
    [
      ['pDA="q"', true, false],
      ['pDA="cVal.q"', true, false],
      ['pDA="t"', false, true],
      ['pDA="Oper.origin.t"', false, true],
      ['pDA="stVal"', false, false],
      ['pDA="q.stVal"', false, false],
      ['pDA=""', false, false],
      ['', false, false]
    ].forEach(([attrs, isQ, isT]) => {
      it(`recognises ${attrs || 'no pDA attribute'}`, () => {
        const ref = extRef(attrs as string);
        expect(doesExtRefpDAIncludeQ(ref)).to.equal(isQ);
        expect(doesExtRefpDAIncludeT(ref)).to.equal(isT);
      });
    });
  });

  describe('isBasicTypeEqual', () => {
    [
      ['FLOAT32', 'FLOAT32', true],
      ['BOOLEAN', 'BOOLEAN', true],
      [undefined, undefined, true],
      ['FLOAT32', 'INT32', false],
      ['FLOAT32', undefined, false],
      [undefined, 'FLOAT32', false],
      ['INT32', 'Enum', true],
      ['Enum', 'INT32', true],
      ['Enum', 'FLOAT32', false],
      ['INT32', 'INT16', false]
    ].forEach(([fcda, extRefType, expected]) => {
      it(`compares ${fcda} with ${extRefType}`, () => {
        expect(
          isBasicTypeEqual(
            fcda as string | undefined,
            extRefType as string | undefined
          )
        ).to.equal(expected);
      });
    });
  });
});
