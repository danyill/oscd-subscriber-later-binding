import { expect, fixture, html } from '@open-wc/testing';

import SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

import {
  getExtRefItem,
  getFcdaItem,
  getFcdaItemCount,
} from './test-support.js';

describe('oscd-subscription-later-binding', () => {
  if (customElements.get('oscd-plugin') === undefined)
    customElements.define('oscd-plugin', SubscriberLaterBinding);

  let plugin: SubscriberLaterBinding;
  let doc: XMLDocument;

  describe('When opened for GOOSE', () => {
    describe('in the Subscriber View', () => {
      beforeEach(async () => {
        doc = await fetch('/test/fixtures/GOOSE-2007B4.scd')
          .then(response => response.text())
          .then(str => new DOMParser().parseFromString(str, 'application/xml'));

        plugin = await fixture(
          html`<oscd-plugin .controlTag="GSEControl" .doc=${doc}></oscd-plugin>`
        );
      });

      it('when selecting an FCDA element with subscriptions it looks like the latest snapshot', async () => {
        const fcdaListElement = plugin.fcdaListUI;
        getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        )?.click();
        await plugin.updateComplete;

        expect(plugin).shadowDom.to.equalSnapshot();
      });

      it('when subscribing an available ExtRef then the lists are changed', async () => {
        const fcdaListElement = plugin.fcdaListUI;
        let extRefListElement = plugin.extRefListPublisherUI!;

        const controlId = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE1';
        const fcdaId =
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos q (ST)';

        getFcdaItem(fcdaListElement, controlId, fcdaId)?.click();
        await plugin.updateComplete;

        expect(plugin.getSubscribedExtRefElements().length).to.be.equal(0);
        expect(getFcdaItemCount(fcdaListElement, controlId, fcdaId)).to.be
          .undefined;
        expect(plugin.getAvailableExtRefElements().length).to.be.equal(3);

        const extRefId =
          'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';

        extRefListElement = plugin.extRefListPublisherUI!;

        getExtRefItem(extRefListElement, extRefId)?.click();
        await plugin.updateComplete;

        expect(plugin.getSubscribedExtRefElements().length).to.be.equal(1);
        //   expect(getSelectedSubItemValue(fcdaListElement)).to.have.text('1');
        //   expect(
        //     extRefListElement['getAvailableExtRefElements']().length
        //   ).to.be.equal(4);
      });
    });
  });
});
