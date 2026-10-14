import { expect } from '@open-wc/testing';

import {
  activeCompanionNames,
  withAnnounced,
  withWithdrawn
} from './companions.js';
import type { Companions } from './companions.js';

const announced = (identity: string, name: string, enabled = true) => ({
  version: 1,
  identity,
  name,
  enabled
});

describe('companions', () => {
  const none: Companions = new Map();

  describe('withAnnounced', () => {
    it('adds a companion', () => {
      const companions = withAnnounced(none, announced('a', 'A'));
      expect(companions.get('a')).to.deep.equal({ name: 'A', enabled: true });
    });

    it('replaces what a companion announced before', () => {
      const companions = withAnnounced(
        withAnnounced(none, announced('a', 'A')),
        announced('a', 'A', false)
      );
      expect(companions.get('a')).to.deep.equal({ name: 'A', enabled: false });
      expect(companions.size).to.equal(1);
    });

    it('returns a new map', () => {
      expect(withAnnounced(none, announced('a', 'A'))).to.not.equal(none);
      expect(none.size).to.equal(0);
    });
  });

  describe('withWithdrawn', () => {
    it('removes a companion', () => {
      const companions = withWithdrawn(
        withAnnounced(none, announced('a', 'A')),
        { version: 1, identity: 'a' }
      );
      expect(companions.size).to.equal(0);
    });

    it('ignores a companion which is not known', () => {
      expect(withWithdrawn(none, { version: 1, identity: 'a' }).size).to.equal(0);
    });
  });

  describe('activeCompanionNames', () => {
    it('lists the enabled companions by name', () => {
      const companions = [
        announced('s', 'SEL'),
        announced('n', 'NR Electric'),
        announced('x', 'Siemens', false)
      ].reduce(withAnnounced, none);
      expect(activeCompanionNames(companions)).to.deep.equal([
        'NR Electric',
        'SEL'
      ]);
    });
  });
});
