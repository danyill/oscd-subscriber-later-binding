import { expect } from '@open-wc/testing';

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
import { PublisherExtRefList } from './publisher-extref-list.js';
import type { ExtRefSelectDetail, SettingsChangeDetail } from './subscription.js';

customElements.define('publisher-extref-list', PublisherExtRefList);

describe('publisher-extref-list', () => {
  async function mount(
    settings: Partial<SubscriberSettings> = {},
    selectFcda = true,
    fixture = 'GOOSE-2007B4-LGOS.scd'
  ): Promise<PublisherExtRefList> {
    const doc = await loadFixture(fixture);
    const merged = { ...defaultSettings, ...settings };
    const model = new SubscriptionModel(doc, merged.controlTag);
    const [control] = model.controls;
    return mountList<PublisherExtRefList>('publisher-extref-list', {
      model,
      settings: merged,
      selectedControl: selectFcda ? control : undefined,
      selectedFcda: selectFcda ? model.fcdasOf(control)[0] : undefined
    });
  }

  const extRefs = (list: PublisherExtRefList) =>
    rowsOf(list, 'oscd-list-item.extref');
  const button = (list: PublisherExtRefList, id: string) =>
    deepQueryAll(list.shadowRoot!, `#${id}`)[0] as FilterButton;

  describe('without an FCDA chosen', () => {
    it('says that nothing is chosen', async () => {
      const list = await mount({}, false);
      expect(
        deepQueryAll(list.shadowRoot!, 'h3').map(h => h.textContent!.trim())
      ).to.deep.equal(['No published item selected']);
      expect(extRefs(list)).to.have.length(0);
    });
  });

  describe('rows', () => {
    it('shows a heading for subscribed and for available ExtRefs', async () => {
      const list = await mount();
      expect(rowsOf(list, 'oscd-list-item.heading').map(r => r.label)).to.deep.equal([
        'Subscribed',
        'Available to subscribe'
      ]);
    });

    it('shows the ExtRefs subscribed to the FCDA, linked', async () => {
      const subscribed = rowsOf(await mount(), 'oscd-list-item.extref.subscribed');
      expect(subscribed).to.have.length(3);
      expect(
        subscribed.every(r => r.element.querySelector('oscd-icon[slot="start"]')!.textContent === 'link')
      ).to.equal(true);
    });

    it('shows the other ExtRefs as available, not linked', async () => {
      const available = rowsOf(await mount(), 'oscd-list-item.extref.available');
      expect(available.length).to.be.greaterThan(0);
      expect(
        available.every(
          r => r.element.querySelector('oscd-icon[slot="start"]')!.textContent === 'link_off'
        )
      ).to.equal(true);
    });

    it('describes an ExtRef by its IED, logical node and internal address', async () => {
      const [first] = rowsOf(await mount(), 'oscd-list-item.extref.subscribed');
      expect(first.label).to.equal('GOOSE_Subscriber > Earth_Switch / CSWI 1: Pos;CSWI1/Pos/stVal');
      expect(first.secondary).to.equal('Interlocking.Input2');
    });

    it('shows the supervision of a subscribed ExtRef', async () => {
      const supervised = rowsOf(await mount(), 'oscd-list-item.extref.subscribed').find(
        r => r.label.startsWith('GOOSE_Subscriber1')
      )!;
      expect(supervised.meta).to.equal('monitor_heart');
      expect(supervised.secondary).to.contain('LGOS 1');
    });

    it('flags a mapping which is missing and one which is invalid', async () => {
      const metas = rowsOf(await mount(), 'oscd-list-item.extref.available').map(r => r.meta);
      expect(metas).to.include.members(['warning', 'error']);
    });

    it('identifies each row by the ExtRef', async () => {
      const [first] = rowsOf(await mount(), 'oscd-list-item.extref');
      expect(first.element.dataset.extref).to.contain('GOOSE_Subscriber>>');
    });

    it('disables ExtRefs which are preconfigured for other data', async () => {
      const doc = await loadFixture('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const control = model.controls[0];
      const op = model.fcdasOf(control).find(f => f.getAttribute('doName') === 'Op')!;
      const list = await mountList<PublisherExtRefList>('publisher-extref-list', {
        model,
        settings: defaultSettings,
        selectedControl: control,
        selectedFcda: op
      });
      const restricted = extRefs(list).filter(r => /Restricted/.test(r.secondary));
      expect(restricted.length).to.be.greaterThan(0);
      expect(restricted.every(r => r.disabled)).to.equal(true);
    });

    it('shows messages for an empty group', async () => {
      const list = await mount();
      await typeSearch(list, 'nothing like this');
      expect(rowsOf(list, 'oscd-list-item.placeholder').map(r => r.label)).to.deep.equal([
        'No subscribed inputs',
        'No available inputs to subscribe'
      ]);
    });

    it('updates when the FCDA chosen changes', async () => {
      const list = await mount();
      const other = list.model.controls[1];
      list.selectedControl = other;
      list.selectedFcda = list.model.fcdasOf(other)[0];
      await rowsDrawn(list);
      expect(rowsOf(list, 'oscd-list-item.extref.subscribed')).to.have.length(1);
    });
  });

  describe('selection', () => {
    it('sends an event with the ExtRef which is chosen', async () => {
      const list = await mount();
      const events = recordEvents<ExtRefSelectDetail>(list, 'extref-select');
      extRefs(list)[0].element.click();
      expect(events).to.have.length(1);
      expect(events[0].extRef.getAttribute('intAddr')).to.equal('Pos;CSWI1/Pos/stVal');
    });

    it('does not send an event for a row which is disabled', async () => {
      const doc = await loadFixture('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const control = model.controls[0];
      const op = model.fcdasOf(control).find(f => f.getAttribute('doName') === 'Op')!;
      const list = await mountList<PublisherExtRefList>('publisher-extref-list', {
        model,
        settings: defaultSettings,
        selectedControl: control,
        selectedFcda: op
      });
      const events = recordEvents<ExtRefSelectDetail>(list, 'extref-select');
      extRefs(list).find(r => r.disabled)!.element.click();
      expect(events).to.have.length(0);
    });
  });

  describe('search', () => {
    it('shows only the ExtRefs which match', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber3');
      expect(extRefs(list)).to.have.length(1);
    });

    it('starts again for another document', async () => {
      const list = await mount();
      await typeSearch(list, 'Subscriber3');
      const doc = await loadFixture('GOOSE-2007B4-LGOS-sorting.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      list.model = model;
      list.selectedControl = model.controls[0];
      list.selectedFcda = model.fcdasOf(model.controls[0])[0];
      await rowsDrawn(list);
      const field = deepQueryAll(list.shadowRoot!, 'oscd-outlined-text-field')[0] as unknown as HTMLInputElement;
      expect(field.value).to.equal('');
    });
  });

  describe('menus', () => {
    it('offers to filter service types and preconfigured ExtRefs', async () => {
      const list = await mount();
      expect(button(list, 'filterExtRefMenuPublisher').items.map(i => i.headline)).to.deep.equal([
        'Unspecified Service Types',
        'Non-Matching Preconfigured'
      ]);
    });

    it('sends the filters which are chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const filter = button(list, 'filterExtRefMenuPublisher');
      await openFilterButton(filter);
      await clickFilterButtonItem(filter, 0);
      await closeFilterButton(filter, 'apply');
      expect(events[0].changes).to.deep.equal({
        strictServiceTypes: true,
        filterOutPreconfiguredUnmatched: false
      });
    });

    it('marks the filter button when something is filtered', async () => {
      const list = await mount({ strictServiceTypes: true });
      expect(button(list, 'filterExtRefMenuPublisher').classList.contains('filter-off')).to.equal(true);
    });

    it('sends the sort order which is chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const sort = button(list, 'sortExtRefPublisherMenu');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 1);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortExtRefPublisher: 1 });
    });

    it('goes back to data model order when the sort order is unchosen', async () => {
      const list = await mount({ sortExtRefPublisher: 2 });
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const sort = button(list, 'sortExtRefPublisherMenu');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 2);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortExtRefPublisher: 0 });
    });

    it('shows the settings as they are', async () => {
      const list = await mount({ ignoreSupervision: true, readOnlyView: true });
      expect(button(list, 'settingsExtRefPublisherMenu').items.map(i => i.selected)).to.deep.equal([
        false,
        true,
        false,
        true
      ]);
    });

    it('sends the settings which are chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const settings = button(list, 'settingsExtRefPublisherMenu');
      await openFilterButton(settings);
      await clickFilterButtonItem(settings, 0);
      await clickFilterButtonItem(settings, 3);
      await closeFilterButton(settings, 'apply');
      expect(events[0].changes).to.deep.equal({
        ignoreSupervision: true,
        allowExternalPlugins: true,
        checkOnlyPreferredBasicType: false,
        readOnlyView: true
      });
    });
  });
});
