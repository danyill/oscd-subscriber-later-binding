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
import { FcdaList } from './fcda-list.js';
import type { FcdaSelectDetail, SettingsChangeDetail } from './subscription.js';

customElements.define('fcda-list', FcdaList);

describe('fcda-list', () => {
  let doc: XMLDocument;

  async function mount(
    settings: Partial<SubscriberSettings> = {},
    extra: Record<string, unknown> = {},
    fixture = 'GOOSE-2007B4-LGOS.scd'
  ): Promise<FcdaList> {
    doc = await loadFixture(fixture);
    const merged = { ...defaultSettings, ...settings };
    return mountList<FcdaList>('fcda-list', {
      model: new SubscriptionModel(doc, merged.controlTag),
      settings: merged,
      ...extra
    });
  }

  const fcdas = (list: FcdaList) => rowsOf(list, 'oscd-list-item.fcda');
  const button = (list: FcdaList, id: string) =>
    deepQueryAll(list.shadowRoot!, `#${id}`)[0] as FilterButton;
  const heading = (list: FcdaList) =>
    deepQueryAll(list.shadowRoot!, '.list-title .title')[0].textContent!.trim();

  describe('rows', () => {
    it('shows each control block followed by its FCDAs', async () => {
      const list = await mount();
      const controls = rowsOf(list, 'oscd-list-item.control').map(r => r.label);
      expect(controls).to.deep.equal([
        'GOOSE_Publisher > GOOSE2',
        'GOOSE_Publisher > GOOSE1',
        'GOOSE_Publisher2 > GOOSE2',
        'GOOSE_Publisher2 > GOOSE1'
      ]);
      expect(fcdas(list)).to.have.length(8);
    });

    it('shows the description and the subscription count of an FCDA', async () => {
      const [first] = fcdas(await mount());
      expect(first.secondary).to.equal('Animalia > Arthropoda > SpiderLegs');
      expect(first.meta).to.equal('3');
    });

    it('shows no count for an FCDA nothing subscribes to', async () => {
      expect(fcdas(await mount())[3].meta).to.equal('');
    });

    it('shows the type of an FCDA in its tooltip', async () => {
      const list = await mount();
      expect(fcdas(list)[0].element.getAttribute('title')).to.equal(
        'CDC: DPC\nBasic Type: Dbpos'
      );
    });

    it('identifies each row by its control block and FCDA', async () => {
      const list = await mount();
      const [first] = fcdas(list);
      expect(first.element.dataset.control).to.contain('GOOSE_Publisher>>');
      expect(first.element.dataset.fcda).to.contain('GOOSE2sDataSet');
    });

    it('updates when the settings change', async () => {
      const list = await mount();
      list.settings = { ...defaultSettings, filterOutQuality: true };
      await rowsDrawn(list);
      expect(fcdas(list)).to.have.length(4);
    });

    it('updates when the model changes', async () => {
      const list = await mount();
      list.model = new SubscriptionModel(
        await loadFixture('GOOSE-no-inputs-or-subscriptions.scd'),
        'GSEControl'
      );
      await rowsDrawn(list);
      expect(fcdas(list).every(row => row.meta === '')).to.equal(true);
    });
  });

  describe('selection', () => {
    it('sends an event with the control block and FCDA which is chosen', async () => {
      const list = await mount();
      const events = recordEvents<FcdaSelectDetail>(list, 'fcda-select');
      fcdas(list)[1].element.click();
      expect(events).to.have.length(1);
      expect(events[0].fcda.getAttribute('daName')).to.equal('q');
      expect(events[0].control.getAttribute('name')).to.equal('GOOSE2');
    });

    it('does not send an event for a row which is disabled', async () => {
      const list = await mount({}, {}, 'GOOSE-2007B4-filter-test.scd');
      const events = recordEvents<FcdaSelectDetail>(list, 'fcda-select');
      const disabled = fcdas(list).find(row => row.disabled)!;
      disabled.element.click();
      expect(events).to.have.length(0);
    });

    it('shows the FCDA chosen in the publisher view as selected', async () => {
      const list = await mount();
      const control = list.model.controls[0];
      const fcda = list.model.fcdasOf(control)[0];
      list.selectedControl = control;
      list.selectedFcda = fcda;
      await rowsDrawn(list);
      expect(fcdas(list).filter(row => row.selected)).to.have.length(1);
      expect(fcdas(list)[0].selected).to.equal(true);
    });

    it('names the FCDA chosen in the publisher view in the title', async () => {
      const list = await mount();
      const control = list.model.controls[0];
      list.selectedControl = control;
      list.selectedFcda = list.model.fcdasOf(control)[0];
      await rowsDrawn(list);
      expect(heading(list).replace(/\s+/g, ' ')).to.equal(
        'GOOSE_Publisher > GOOSE2 : QB2_Disconnector / CSWI 1 Pos.stVal'
      );
    });

    it('does not show an FCDA as selected in the subscriber view', async () => {
      const list = await mount({ subscriberView: true });
      const control = list.model.controls[0];
      list.selectedControl = control;
      list.selectedFcda = list.model.fcdasOf(control)[0];
      await rowsDrawn(list);
      expect(fcdas(list).some(row => row.selected)).to.equal(false);
      expect(heading(list)).to.equal('Select GOOSE Publisher');
    });
  });

  describe('title', () => {
    it('asks for a GOOSE publisher', async () => {
      expect(heading(await mount())).to.equal('Select GOOSE Publisher');
    });

    it('asks for an SV publisher', async () => {
      const list = await mount(
        { controlTag: 'SampledValueControl' },
        {},
        'SMV-2007B4-LSVS.scd'
      );
      expect(heading(list)).to.equal('Select SV Publisher');
    });

    it('shows a lock in the publisher view when read-only', async () => {
      const list = await mount({ readOnlyView: true });
      expect(deepQueryAll(list.shadowRoot!, '.read-only-icon')).to.have.length(1);
    });

    it('shows no lock in the subscriber view, as the other list does', async () => {
      const list = await mount({ readOnlyView: true, subscriberView: true });
      expect(deepQueryAll(list.shadowRoot!, '.read-only-icon')).to.have.length(0);
    });
  });

  describe('search', () => {
    it('shows only the FCDAs which match', async () => {
      const list = await mount();
      await typeSearch(list, 'Birch');
      expect(fcdas(list)).to.have.length(2);
    });

    it('starts again for another document', async () => {
      const list = await mount();
      await typeSearch(list, 'Birch');
      list.model = new SubscriptionModel(
        await loadFixture('GOOSE-2007B4-LGOS-sorting.scd'),
        'GSEControl'
      );
      await rowsDrawn(list);
      const field = deepQueryAll(list.shadowRoot!, 'oscd-outlined-text-field')[0] as unknown as HTMLInputElement;
      expect(field.value).to.equal('');
      expect(fcdas(list).length).to.be.greaterThan(2);
    });

    it('starts again for another type of control block', async () => {
      const list = await mount();
      await typeSearch(list, 'Birch');
      list.model = new SubscriptionModel(doc, 'SampledValueControl');
      await rowsDrawn(list);
      const field = deepQueryAll(list.shadowRoot!, 'oscd-outlined-text-field')[0] as unknown as HTMLInputElement;
      expect(field.value).to.equal('');
    });
  });

  describe('menus', () => {
    it('offers four filters in the publisher view', async () => {
      const list = await mount();
      expect(button(list, 'filterFcdaMenu').items.map(i => i.headline)).to.deep.equal([
        'Subscribed',
        'Not Subscribed',
        'Data Objects',
        'Quality'
      ]);
    });

    it('also offers to filter FCDAs which do not match in the subscriber view', async () => {
      const list = await mount({ subscriberView: true });
      expect(button(list, 'filterFcdaMenu').items.map(i => i.headline)).to.include(
        'Non-Matching Preconfigured'
      );
    });

    it('sends the filters which are chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const filter = button(list, 'filterFcdaMenu');
      await openFilterButton(filter);
      await clickFilterButtonItem(filter, 3);
      await closeFilterButton(filter, 'apply');
      expect(events).to.have.length(1);
      expect(events[0].changes).to.deep.equal({
        filterOutSubscribed: false,
        filterOutNotSubscribed: false,
        filterOutDataObjects: false,
        filterOutQuality: true
      });
    });

    it('sends nothing when a menu is cancelled', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const filter = button(list, 'filterFcdaMenu');
      await openFilterButton(filter);
      await clickFilterButtonItem(filter, 3);
      await closeFilterButton(filter, 'cancel');
      expect(events).to.have.length(0);
      await list.updateComplete;
      expect(filter.items[3].selected).to.equal(true);
    });

    it('marks the filter button when something is filtered', async () => {
      const list = await mount({ filterOutQuality: true });
      expect(button(list, 'filterFcdaMenu').classList.contains('filter-off')).to.equal(true);
    });

    it('does not mark the filter button when nothing is filtered', async () => {
      const list = await mount();
      expect(button(list, 'filterFcdaMenu').classList.contains('filter-off')).to.equal(false);
    });

    it('sends the sort order which is chosen', async () => {
      const list = await mount();
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const sort = button(list, 'sortFcdaMenu');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 2);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortFcda: 2 });
    });

    it('goes back to data model order when the chosen sort order is unchosen', async () => {
      const list = await mount({ sortFcda: 2 });
      const events = recordEvents<SettingsChangeDetail>(list, 'settings-change');
      const sort = button(list, 'sortFcdaMenu');
      await openFilterButton(sort);
      await clickFilterButtonItem(sort, 2);
      await closeFilterButton(sort, 'apply');
      expect(events[0].changes).to.deep.equal({ sortFcda: 0 });
    });
  });

  describe('copying', () => {
    it('copies the rows shown as Markdown', async () => {
      const list = await mount();
      await typeSearch(list, 'Botany1 Pos.stVal');
      const writeText = sinon.stub(navigator.clipboard, 'writeText').resolves();
      try {
        deepQueryAll(list.shadowRoot!, '#savePublisherToMarkdown')[0].click();
        expect(writeText.callCount).to.equal(1);
        expect(writeText.firstCall.args[0]).to.contain('* GOOSE_Publisher2 > GOOSE2');
        expect(writeText.firstCall.args[0]).to.contain('(1 subscription)');
      } finally {
        writeText.restore();
      }
    });
  });
});
