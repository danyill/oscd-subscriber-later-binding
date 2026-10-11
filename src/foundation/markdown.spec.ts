import { expect } from '@open-wc/testing';

import { loadFixture } from '../testing/fixtures.js';
import { fcdaRowsToMarkdown, subscriberRowsToMarkdown } from './markdown.js';
import { SubscriptionModel } from './model.js';
import { buildFcdaRows, buildSubscriberRows } from './rows.js';
import { getSearchRegex } from './search.js';
import { defaultSettings } from './settings.js';

const settings = defaultSettings;

describe('markdown', () => {
  let model: SubscriptionModel;

  beforeEach(async () => {
    model = new SubscriptionModel(
      await loadFixture('GOOSE-2007B4-LGOS.scd'),
      'GSEControl'
    );
  });

  describe('of control blocks and FCDAs', () => {
    const markdown = (search: string, changes = {}) =>
      fcdaRowsToMarkdown(
        buildFcdaRows(
          model,
          { ...settings, ...changes },
          undefined,
          getSearchRegex(search)
        )
      );

    it('describes a control block with its description and an FCDA with one subscription', () => {
      expect(markdown('Botany1 Pos.stVal')).to.equal(
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

    it('pluralises subscriptions and includes the description of the data', () => {
      expect(markdown('SpiderLegs Pos.stVal')).to.equal(
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

    it('does not mention subscriptions for an FCDA which has none', () => {
      expect(markdown('"Tree Birch" Pos.q')).to.not.contain('subscription');
    });

    it('is empty when there are no rows', () => {
      expect(markdown('zzzz')).to.equal('');
      expect(fcdaRowsToMarkdown([])).to.equal('');
    });

    it('separates control blocks with a blank line', () => {
      const all = markdown('');
      expect(all.split('\n').filter(line => line.startsWith('* '))).to.have.length(4);
      expect(all).to.contain('\n\n* GOOSE_Publisher > GOOSE1');
    });

    it('leaves out FCDAs which are filtered', () => {
      const text = markdown('', { filterOutQuality: true });
      expect(text).to.contain('Pos.stVal');
      expect(text).to.not.contain('Pos.q');
    });
  });

  describe('of IEDs and ExtRefs', () => {
    const markdown = (search: string, changes = {}) =>
      subscriberRowsToMarkdown(
        buildSubscriberRows(model, { ...settings, ...changes }, getSearchRegex(search))
      );

    it('describes subscribed ExtRefs with their data, supervision and control block', () => {
      expect(markdown('Subscriber3')).to.equal(
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

    it('marks a missing mapping and an invalid mapping', () => {
      const text = markdown('Missing');
      expect(text).to.contain('(⚠️ Missing Mapping)');
      expect(text).to.contain('(❌ Invalid)');
      expect(text).to.contain('⬅  Invalid Mapping ');
    });

    it('does not link an ExtRef which is not subscribed', () => {
      const text = markdown('Subscriber1 "CILO 1"');
      expect(text).to.contain('  * Earth_Switch / CILO 1: Pos;CSWI1/Pos/stVal\n');
      expect(text).to.not.contain('🔗');
    });

    it('lists each IED once, separated by a blank line', () => {
      const text = markdown('');
      expect(text.split('\n').filter(line => line.startsWith('* 📦'))).to.deep.equal([
        '* 📦 GOOSE_Subscriber',
        '* 📦 GOOSE_Subscriber1',
        '* 📦 GOOSE_Subscriber3'
      ]);
    });

    it('is empty when there are no rows', () => {
      expect(markdown('zzzz')).to.equal('');
      expect(subscriberRowsToMarkdown([])).to.equal('');
    });

    it('leaves out bound ExtRefs which are filtered', () => {
      const text = markdown('', { filterOutBound: true });
      expect(text).to.not.contain('🔗');
      expect(text).to.not.contain('📦 GOOSE_Subscriber3');
    });
  });
});
