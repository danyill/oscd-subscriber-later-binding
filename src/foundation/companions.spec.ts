import { expect } from '@open-wc/testing';

import {
  activeCompanionNames,
  companionEntries,
  enabledCompanionIdentities,
  isCompanionActive,
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

  describe('with settings', () => {
    const companions = [
      announced('s', 'SEL'),
      announced('n', 'NR Electric'),
      announced('x', 'Siemens', false),
      { version: 1, identity: 'b', name: 'Background', description: 'Does things' }
    ].reduce(withAnnounced, none);

    it('lists the companions by name with their identities and descriptions', () => {
      expect(companionEntries(companions).map(entry => entry.identity)).to.deep.equal([
        'b',
        'n',
        's',
        'x'
      ]);
      expect(companionEntries(companions)[0]).to.deep.equal({
        identity: 'b',
        name: 'Background',
        description: 'Does things'
      });
    });

    it('names the companions which are on in the settings and by their own switch', () => {
      expect(activeCompanionNames(companionEntries(companions), ['n'])).to.deep.equal([
        'Background',
        'SEL'
      ]);
    });

    it('takes a companion without its own switch to be on', () => {
      const [background] = companionEntries(companions);
      expect(isCompanionActive(background, [])).to.equal(true);
      expect(isCompanionActive(background, ['b'])).to.equal(false);
    });

    it('gives the identities of the companions not turned off in the settings', () => {
      expect(enabledCompanionIdentities(companions, ['n'])).to.deep.equal(['b', 's', 'x']);
    });
  });
});
