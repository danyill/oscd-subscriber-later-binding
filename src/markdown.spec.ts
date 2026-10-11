import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';

describe('Markdown export', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    driver = new PluginDriver(mounted);
  });

  afterEach(() => {
    mounted.unmount();
  });

  describe('of published data', () => {
    it('describes a control block and an FCDA with one subscription', async () => {
      await driver.search('fcda', 'Botany1 Pos.stVal');
      expect(await driver.copyMarkdown('publisher')).to.equal(
        '* GOOSE_Publisher2 > GOOSE2\n' +
          '  \n' +
          '  QB2_Disconnector / LLN0  - Botany1\n' +
          '\n' +
          '    * QB2_Disconnector / CSWI 1 Pos.stVal\n' +
          '\n' +
          '       (1 subscription)\n' +
          '\n' +
          '      (DPC, Dbpos)\n' +
          '\n'
      );
    });

    it('pluralises subscriptions and includes the data description', async () => {
      await driver.search('fcda', 'SpiderLegs Pos.stVal');
      expect(await driver.copyMarkdown('publisher')).to.equal(
        '* GOOSE_Publisher > GOOSE2\n' +
          '  \n' +
          '  QB2_Disconnector / LLN0 \n' +
          '\n' +
          '    * QB2_Disconnector / CSWI 1 Pos.stVal\n' +
          '\n' +
          '      Animalia > Arthropoda > SpiderLegs (3 subscriptions)\n' +
          '\n' +
          '      (DPC, Dbpos)\n' +
          '\n'
      );
    });

    it('is empty when nothing matches the search', async () => {
      await driver.search('fcda', 'nothing like this');
      expect(await driver.copyMarkdown('publisher')).to.equal('');
    });

    it('lists every control block when there is no search', async () => {
      const markdown = await driver.copyMarkdown('publisher');
      const controls = markdown.split('\n').filter(l => l.startsWith('* '));
      expect(controls).to.deep.equal([
        '* GOOSE_Publisher > GOOSE2',
        '* GOOSE_Publisher > GOOSE1',
        '* GOOSE_Publisher2 > GOOSE2',
        '* GOOSE_Publisher2 > GOOSE1'
      ]);
    });

    it('leaves out FCDAs hidden by a filter', async () => {
      await driver.chooseMenuItems('filterFcdaMenu', [0, 1, 2]);
      const markdown = await driver.copyMarkdown('publisher');
      expect(markdown).to.contain('Pos.stVal');
      expect(markdown).to.not.contain('Pos.q');
    });

    it('does not change the document', async () => {
      await driver.copyMarkdown('publisher');
      expect(mounted.edits).to.have.length(0);
    });
  });

  describe('of subscriber inputs', () => {
    beforeEach(async () => {
      await driver.switchView();
    });

    it('describes subscribed inputs with their data, supervision and control block', async () => {
      await driver.search('subscriberExtRef', 'Subscriber3');
      expect(await driver.copyMarkdown('subscriber')).to.equal(
        '* 📦 GOOSE_Subscriber3\n' +
          '  GOOSE subscriber - Dummy\n' +
          '\n' +
          '  * 🔗 Earth_Switch / CILO 1: ESW_Thing ⬅ GOOSE_Publisher > QB2_Disconnector / CSWI 1 Pos.stVal  \n' +
          '    A Place to Bind ⬅ Animalia > Arthropoda > SpiderLegs (QB2_Disconnector / LLN0 GOOSE2, 💓 GOOSE_supervision >  LGOS 1)\n' +
          '\n' +
          '  * 🔗 Earth_Switch / CILO 1: ESW_Thing2 ⬅ GOOSE_Publisher > QB1_Disconnector / CSWI 1 Pos.stVal  \n' +
          '    A Place to Bind 2 ⬅ Triangles (QB2_Disconnector / LLN0 GOOSE1, 💓 GOOSE_supervision >  LGOS 2)\n' +
          '\n' +
          '  * 🔗 Earth_Switch / CILO 1: ESW_Thing3 ⬅ GOOSE_Publisher2 > QB2_Disconnector / CSWI 1 Pos.stVal  \n' +
          '    A Place to Bind 3 (QB2_Disconnector / LLN0 GOOSE2, 💓 GOOSE_supervision >  LGOS 3)\n' +
          '\n'
      );
    });

    it('marks missing and invalid mappings', async () => {
      await driver.search('subscriberExtRef', 'Missing');
      const markdown = await driver.copyMarkdown('subscriber');
      expect(markdown).to.contain('(⚠️ Missing Mapping)');
      expect(markdown).to.contain('(❌ Invalid)');
    });

    it('shows unsubscribed inputs without a link', async () => {
      await driver.search('subscriberExtRef', 'Subscriber1 "CILO 1"');
      const markdown = await driver.copyMarkdown('subscriber');
      expect(markdown).to.contain('  * Earth_Switch / CILO 1: Pos;CSWI1/Pos/stVal\n');
      expect(markdown).to.not.contain('🔗');
    });

    it('is empty when nothing matches the search', async () => {
      await driver.search('subscriberExtRef', 'nothing like this');
      expect(await driver.copyMarkdown('subscriber')).to.equal('');
    });

    it('lists each IED with inputs once', async () => {
      const markdown = await driver.copyMarkdown('subscriber');
      expect(markdown.split('\n').filter(l => l.startsWith('* 📦'))).to.deep.equal(
        [
          '* 📦 GOOSE_Subscriber',
          '* 📦 GOOSE_Subscriber1',
          '* 📦 GOOSE_Subscriber3'
        ]
      );
    });
  });
});
