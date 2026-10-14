import { expect } from '@open-wc/testing';
import * as sinon from 'sinon';

import { SubscriptionModel } from '../foundation/model.js';
import { defaultSettings } from '../foundation/settings.js';
import type { SubscriberSettings } from '../foundation/settings.js';
import { deepQueryAll } from '../testing/dom.js';
import {
  clickFilterButtonItem,
  closeFilterButton,
  openFilterButton
} from '../testing/filter-button.js';
import type { FilterButton } from '../testing/filter-button.js';
import { loadFixture } from '../testing/fixtures.js';
import {
  mountList,
  recordEvents,
  rowsDrawn,
  rowsOf,
  typeSearch
} from '../testing/lists.js';
import { SubscriberExtRefList } from './subscriber-extref-list.js';
import type { ExtRefSelectDetail, SettingsChangeDetail } from './subscription.js';

customElements.define('subscriber-extref-list', SubscriberExtRefList);

describe('subscriber-extref-list', () => {
  let doc: XMLDocument;

  async function mount(
    settings: Partial<SubscriberSettings> = {},
    extra: Record<string, unknown> = {},
    fixture = 'GOOSE-2007B4-LGOS.scd'
  ): Promise<SubscriberExtRefList> {
    doc = await loadFixture(fixture);
    const merged = { ...defaultSettings, subscriberView: true, ...settings };
    return mountList<SubscriberExtRefList>('subscriber-extref-list', {
      model: new SubscriptionModel(doc, merged.controlTag),
      settings: merged,
      ...extra
    });
  }

  const extRefs = (list: SubscriberExtRefList) =>
    rowsOf(list, 'oscd-list-item.extref');
  const button = (list: SubscriberExtRefList, id: string) =>
    deepQueryAll(list.shadowRoot!, `#${id}`)[0] as FilterButton;
  const heading = (list: SubscriberExtRefList) =>
    deepQueryAll(list.shadowRoot!, '.list-title .title')[0].textContent!.trim();

  describe('rows', () => {
    it('shows each IED followed by its ExtRefs', async () => {
      const list = await mount();
      expect(rowsOf(list, 'oscd-list-item.ied').map(r => r.label)).to.deep.equal([
        'GOOSE_Subscriber',
        'GOOSE_Subscriber1',
        'GOOSE_Subscriber3'
      ]);
      expect(extRefs(list)).to.have.length(13);
    });

    it('describes the IED', async () => {
      const list = await mount({}, {}, 'GOOSE-2007B4-LGOS-sorting.scd');
      const ied = rowsOf(list, 'oscd-list-item.ied').find(r => r.label === 'GOOSE_Subscriber1')!;
      expect(ied.secondary).to.equal('GOOSE subscriber - Dummy - Taxonomist');
    });

    it('shows what a subscribed ExtRef is subscribed to, and its supervision', async () => {
      const list = await mount();
      const row = extRefs(list).find(r => r.element.dataset.extref!.startsWith('GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal'))!;
      expect(row.label).to.contain('Earth_Switch / CSWI 1: Pos;CSWI1/Pos/stVal');
      expect(row.label).to.contain('GOOSE_Publisher');
      expect(row.secondary).to.contain('Interlocking.Input2');
      expect(row.secondary).to.contain('SpiderLegs');
      expect(row.secondary).to.contain('QB2_Disconnector / LLN0 GOOSE2');
      expect(row.meta).to.equal('monitor_heart');
    });

    it('shows an ExtRef which is not subscribed without a subscription', async () => {
      const list = await mount();
      const row = extRefs(list).find(r => r.element.dataset.extref!.startsWith('GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal'))!;
      expect(row.label).to.not.contain('GOOSE_Publisher');
      expect(row.meta).to.equal('');
      expect(row.element.querySelector('oscd-icon[slot="start"]')!.textContent).to.equal('link_off');
    });

    it('flags a mapping which is missing and one which is invalid', async () => {
      const list = await mount();
      const metas = extRefs(list).map(r => r.meta);
      expect(metas).to.include.members(['warning', 'error']);
      expect(extRefs(list).some(r => r.label.includes('Invalid Mapping'))).to.equal(true);
    });

    it('shows the type of a preconfigured ExtRef in its tooltip', async () => {
      const list = await mount();
      const row = extRefs(list).find(r => r.element.dataset.extref!.endsWith('someRestrictedExtRef[0]'))!;
      expect(row.element.getAttribute('title')).to.contain('Basic Type: Dbpos');
    });
  });

  describe('selection', () => {
    it('sends an event with the ExtRef which is chosen', async () => {
      const list = await mount();
      const events = recordEvents<ExtRefSelectDetail>(list, 'extref-select');
      extRefs(list)[0].element.click();
      expect(events).to.have.length(1);
    });

    it('shows the ExtRef chosen as selected, and names it in the title', async () => {
      const list = await mount();
      const target = doc.querySelector('IED[name="GOOSE_Subscriber1"] ExtRef[intAddr]')!;
      list.selectedExtRef = target;
      await rowsDrawn(list);
      expect(extRefs(list).filter(r => r.selected)).to.have.length(1);
      expect(heading(list)).to.equal(
        'GOOSE_Subscriber1 > Earth_Switch / CILO 1: Pos;CSWI1/Pos/stVal'
      );
    });

    it('asks for an input to be chosen when none is', async () => {
      expect(heading(await mount())).to.equal('Select Subscriber Input');
    });

    it('shows a lock when read-only', async () => {
      const list = await mount({ readOnlyView: true });
      expect(deepQueryAll(list.shadowRoot!, '.read-only-icon')).to.have.length(1);
    });
  });

  describe('next ExtRef', () => {
    it('is the next ExtRef listed when it is not subscribed', async () => {
      const list = await mount();
      const [first, second] = Array.from(
        doc.querySelectorAll('IED[name="GOOSE_Subscriber1"] ExtRef[intAddr]')
      );
      expect(list.nextExtRefAfter(first)).to.equal(second);
    });

    it('is nothing when the next ExtRef is subscribed', async () => {
      const list = await mount();
      const second = doc.querySelectorAll('IED[name="GOOSE_Subscriber1"] ExtRef[intAddr]')[1];
      expect(list.nextExtRefAfter(second)).to.equal(undefined);
    });

    it('follows the list as searched', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber1 CILO');
      const [first, second] = Array.from(
        doc.querySelectorAll('IED[name="GOOSE_Subscriber1"] ExtRef[intAddr]')
      );
      expect(list.nextExtRefAfter(first)).to.equal(second);
      expect(list.nextExtRefAfter(second)).to.equal(undefined);
    });
  });

  describe('messages', () => {
    it('says there are no inputs for a document without any', async () => {
      const list = await mount({}, {}, 'GOOSE-no-inputs-or-subscriptions.scd');
      expect(
        deepQueryAll(list.shadowRoot!, 'h3').map(h => h.textContent!.trim())
      ).to.deep.equal(['No inputs']);
    });
  });

  describe('search', () => {
    it('shows only the ExtRefs which match', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber3 Thing2');
      expect(extRefs(list)).to.have.length(1);
    });

    it('starts again for another document', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber3');
      list.model = new SubscriptionModel(
        await loadFixture('GOOSE-2007B4-LGOS-sorting.scd'),
        'GSEControl'
      );
      await rowsDrawn(list);
      const field = deepQueryAll(list.shadowRoot!, 'oscd-outlined-text-field')[0] as unknown as HTMLInputElement;
      expect(field.value).to.equal('');
    });
  });

  describe('menus', () => {
    it('offers five filters', async () => {
      const list = await mount();
      expect(button(list, 'filterExtRefMenuSubscriber').items.map(i => i.headline)).to.deep.equal([
        'Subscribed',
        'Not Subscribed',
        'Unspecified Service Types',
        'Preconfigured Quality Attribute',
        'Preconfigured Time Attribute'
      ]);
    });

    it('sends the filters which are chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const filter = button(list, 'filterExtRefMenuSubscriber');
      await openFilterButton(filter);
      await clickFilterButtonItem(filter, 0);
      await closeFilterButton(filter, 'apply');
      expect(events[0].changes).to.deep.equal({
        filterOutBound: true,
        filterOutNotBound: false,
        strictServiceTypes: false,
        filterOutpDAq: false,
        filterOutpDAt: false
      });
    });

    it('marks the filter button when something is filtered', async () => {
      const list = await mount({ filterOutpDAt: true });
      expect(button(list, 'filterExtRefMenuSubscriber').classList.contains('filter-off')).to.equal(true);
    });

    it('offers four sort orders and sends the one which is chosen', async () => {
      const list = await mount();
      const sort = button(list, 'sortExtRefSubscriberMenu');
      expect(sort.items).to.have.length(4);
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 3);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortExtRefSubscriber: 3 });
    });

    it('goes back to data model order when the sort order is unchosen', async () => {
      const list = await mount({ sortExtRefSubscriber: 1 });
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const sort = button(list, 'sortExtRefSubscriberMenu');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 1);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortExtRefSubscriber: 0 });
    });

    it('sends the settings which are chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const settings = button(list, 'settingsExtRefSubscriberMenu');
      expect(settings.items.map(i => i.selected)).to.deep.equal([true, true, true, false, false]);
      await openFilterButton(settings);
      await clickFilterButtonItem(settings, 0);
      await closeFilterButton(settings, 'apply');
      expect(events[0].changes).to.deep.equal({
        autoIncrement: false,
        ignoreSupervision: false,
        allowExternalPlugins: true,
        checkOnlyPreferredBasicType: false,
        readOnlyView: false,
        disabledCompanions: []
      });
    });
  });

  describe('copying', () => {
    it('copies the rows shown as Markdown', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber3');
      const writeText = sinon.stub(navigator.clipboard, 'writeText').resolves();
      try {
        deepQueryAll(list.shadowRoot!, '#saveSubscriberExtRefToMarkdown')[0].click();
        expect(writeText.callCount).to.equal(1);
        expect(writeText.firstCall.args[0]).to.contain('📦 GOOSE_Subscriber3');
      } finally {
        writeText.restore();
      }
    });
  });
});
