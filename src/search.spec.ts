import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import type { ListedItem } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';

/** `intAddr` of a listed ExtRef: the last part of its identity. */
const intAddr = (item: ListedItem): string =>
  item.id.split('>').pop()!.replace(/\[0\]$/, '');

describe('search', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  afterEach(() => {
    mounted.unmount();
  });

  async function mount(fixture = 'GOOSE-2007B4-LGOS.scd') {
    mounted = await mountPlugin({ fixture });
    driver = new PluginDriver(mounted);
  }

  describe('of FCDAs', () => {
    beforeEach(async () => {
      await mount();
    });

    const found = async (text: string) => {
      await driver.search('fcda', text);
      return driver.fcdas().length;
    };

    it('shows everything for an empty search', async () => {
      expect(await found('')).to.equal(8);
    });

    it('shows nothing when there is no match', async () => {
      expect(await found('nothing like this')).to.equal(0);
      expect(driver.controls()).to.have.length(0);
    });

    it('shows everything again when the search is cleared', async () => {
      await found('Birch');
      expect(await found('')).to.equal(8);
    });

    [
      ['an IED name', 'GOOSE_Publisher2', 4],
      ['a control block name', 'GOOSE1', 4],
      ['an IED and control block name', 'Publisher2 GOOSE2', 2],
      ['a control block description', 'Botany1', 2],
      ['a logical device name', 'QB1_Disconnector', 4],
      ['a data attribute', 'Pos.q', 4],
      ['a data object and attribute', 'Pos.stVal', 4],
      ['a logical node description', 'SpiderLegs', 2],
      ['a data object description', 'Birch', 2],
      ['a combination of terms', 'Birch Pos.q', 1],
      ['a question mark wildcard', 'Pos.stVa?', 4],
      ['an asterisk wildcard', 'Pos.*Val', 4],
      ['a double quoted phrase', '"Tree Birch"', 2],
      ['a single quoted phrase', "'Tree Birch'", 2],
      ['text in a different case', 'SPIDERLEGS', 2]
    ].forEach(([name, text, expected]) => {
      it(`finds FCDAs by ${name}`, async () => {
        expect(await found(text as string)).to.equal(expected);
      });
    });

    it('hides control blocks without matching FCDAs', async () => {
      await found('Botany1');
      expect(driver.controlTitles()).to.deep.equal([
        'GOOSE_Publisher2 > GOOSE2'
      ]);
    });

    it('finds FCDAs by their CDC and basic type', async () => {
      const cdc = driver.fcdas()[0].title.match(/CDC: (\S+)/)![1];
      expect(await found(`CDC: ${cdc}`.split(' ')[1])).to.be.greaterThan(0);
    });
  });

  describe('of ExtRefs in the publisher view', () => {
    beforeEach(async () => {
      await mount();
      await driver.selectFcda(GOOSE2, driver.fcdas()[0].id);
    });

    it('finds available ExtRefs by description', async () => {
      await driver.search('publisherExtRef', 'Restricted');
      expect(driver.publisherAvailableExtRefs().map(intAddr)).to.deep.equal([
        'someRestrictedExtRef',
        'someRestrictedExtRef'
      ]);
    });

    it('finds available ExtRefs by identity', async () => {
      await driver.search('publisherExtRef', 'Subscriber1');
      expect(
        driver.publisherAvailableExtRefs().every(e => e.id.startsWith('GOOSE_Subscriber1'))
      ).to.equal(true);
      expect(driver.publisherAvailableExtRefs().length).to.be.greaterThan(0);
    });

    it('finds subscribed ExtRefs by identity', async () => {
      await driver.search('publisherExtRef', 'Subscriber3');
      expect(driver.publisherSubscribedExtRefs().map(intAddr)).to.deep.equal([
        'ESW_Thing'
      ]);
    });

    it('finds subscribed ExtRefs by supervision', async () => {
      await driver.search('publisherExtRef', 'LGOS 1');
      expect(driver.publisherSubscribedExtRefs().map(e => e.id)).to.deep.equal([
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]',
        'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]'
      ]);
    });

    it('shows a message when nothing matches', async () => {
      await driver.search('publisherExtRef', 'nothing like this');
      expect(driver.placeholders()).to.include('No subscribed inputs');
      expect(driver.placeholders()).to.include(
        'No available inputs to subscribe'
      );
    });
  });

  describe('of ExtRefs in the subscriber view', () => {
    beforeEach(async () => {
      await mount('GOOSE-2007B4-LGOS-sorting.scd');
      await driver.switchView();
    });

    const found = async (text: string) => {
      await driver.search('subscriberExtRef', text);
      return driver.subscriberExtRefs();
    };

    it('shows everything for an empty search', async () => {
      expect((await found('')).length).to.equal(
        mounted.doc.querySelectorAll(
          'LN > Inputs > ExtRef[intAddr]:not([serviceType="SMV"]), LN0 > Inputs > ExtRef[intAddr]:not([serviceType="SMV"])'
        ).length
      );
    });

    it('shows nothing for no match', async () => {
      expect(await found('nothing like this')).to.have.length(0);
      expect(driver.ieds()).to.have.length(0);
    });

    it('finds ExtRefs by IED name', async () => {
      const result = await found('Subscriber3');
      expect(result.map(intAddr)).to.deep.equal([
        'ESW_Thing',
        'ESW_Thing2',
        'ESW_Thing3'
      ]);
      expect(driver.ieds().map(i => i.label)).to.deep.equal(['GOOSE_Subscriber3']);
    });

    it('finds ExtRefs by IED type', async () => {
      await found('Taxonomist');
      expect(driver.ieds().map(i => i.label)).to.deep.equal([
        'GOOSE_Subscriber1'
      ]);
    });

    it('finds ExtRefs by IED description', async () => {
      await found('"GOOSE subscriber"');
      expect(driver.ieds().map(i => i.label)).to.include('GOOSE_Subscriber1');
      expect(driver.ieds().map(i => i.label)).to.not.include('GOOSE_Subscriber');
    });

    it('finds ExtRefs by IED manufacturer', async () => {
      await found('Dummy');
      expect(driver.ieds().map(i => i.label)).to.deep.equal([
        'GOOSE_Subscriber',
        'GOOSE_Subscriber1',
        'GOOSE_Subscriber3'
      ]);
    });

    it('finds ExtRefs by logical node', async () => {
      const result = await found('"CILO 1"');
      expect(result.length).to.be.greaterThan(0);
      expect(result.every(e => e.id.includes(' CILO 1>'))).to.equal(true);
    });

    it('finds ExtRefs by internal address', async () => {
      expect((await found('ESW_Thing2')).map(intAddr)).to.deep.equal([
        'ESW_Thing2'
      ]);
    });

    it('finds ExtRefs by description', async () => {
      expect((await found('"A Place to Bind 3"')).map(intAddr)).to.deep.equal([
        'ESW_Thing3'
      ]);
    });

    it('finds ExtRefs by supervision logical node', async () => {
      const result = await found('GOOSE_supervision');
      expect(result.map(intAddr)).to.deep.equal([
        'Pos;CSWI1/Pos/stVal',
        'Pos;CSWI1/Pos/q',
        'ESW_Thing',
        'ESW_Thing2',
        'ESW_Thing3'
      ]);
    });

    it('finds ExtRefs by subscribed control block', async () => {
      expect((await found('GOOSE1')).map(intAddr)).to.deep.equal([
        'ESW_Thing2'
      ]);
    });

    it('finds ExtRefs by the IED of the subscribed FCDA', async () => {
      expect((await found('GOOSE_Publisher2')).map(intAddr)).to.deep.equal([
        'ESW_Thing3'
      ]);
    });

    it('finds ExtRefs by the description of the subscribed FCDA', async () => {
      const result = await found('DOIDescZ');
      expect(result.length).to.be.greaterThan(0);
      expect(result.every(e => e.secondary.includes('DOIDescZ'))).to.equal(
        true
      );
    });

    it('narrows with multiple terms', async () => {
      expect((await found('Subscriber3 Thing2')).map(intAddr)).to.deep.equal([
        'ESW_Thing2'
      ]);
    });

    it('supports wildcards', async () => {
      expect((await found('ESW_Thin?2')).map(intAddr)).to.deep.equal([
        'ESW_Thing2'
      ]);
      expect((await found('ESW_*ing3')).map(intAddr)).to.deep.equal([
        'ESW_Thing3'
      ]);
    });

    it('supports quoted phrases', async () => {
      expect((await found("'Place to Bind 2'")).map(intAddr)).to.deep.equal([
        'ESW_Thing2'
      ]);
    });
  });
});
