import { html, LitElement, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';

import { controlIconNames } from '../foundation/control-tag.js';
import { getNameAttribute } from '../foundation/foundation.js';
import { fcdaRowsToMarkdown } from '../foundation/markdown.js';
import type { SubscriptionModel } from '../foundation/model.js';
import { buildFcdaRows, matchAll } from '../foundation/rows.js';
import type {
  ControlRow,
  FcdaListRow,
  FcdaRow
} from '../foundation/rows.js';
import type { SubscriberSettings } from '../foundation/settings.js';
import { FcdaSortOrder } from '../foundation/sort.js';
import { getFcdaOrExtRefTitle } from '../foundation/subscription/subscription.js';
import { FilterButton } from './filter-button.js';
import { renderOptionButton } from './menu-button.js';
import type { OptionItem } from './menu-button.js';
import {
  newFcdaSelectEvent,
  newSettingsChangeEvent,
  sharedStyles
} from './subscription.js';
import { VirtualizedFilteredList } from './virtualized-filtered-list.js';
import type { SearchChangeDetail } from './virtualized-filtered-list.js';

/**
 * The control blocks of the document and the FCDAs of their data sets.
 * Choosing an FCDA sends an `fcda-select` event.
 */
export class FcdaList extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-filter-button': FilterButton,
    'oscd-icon': OscdIcon,
    'oscd-icon-button': OscdIconButton,
    'virtualized-filtered-list': VirtualizedFilteredList
  };

  @property({ attribute: false })
  model!: SubscriptionModel;

  @property({ attribute: false })
  settings!: SubscriberSettings;

  /** The FCDA chosen in the publisher view, shown as selected. */
  @property({ attribute: false })
  selectedFcda?: Element;

  @property({ attribute: false })
  selectedControl?: Element;

  /** The ExtRef being subscribed in the subscriber view. */
  @property({ attribute: false })
  selectedExtRef?: Element;

  @state()
  private search = matchAll;

  @state()
  private searchValue = '';

  private rows: FcdaListRow[] = [];

  protected willUpdate(changed: PropertyValues<this>): void {
    const previous = changed.get('model') as SubscriptionModel | undefined;
    if (
      previous &&
      (previous.doc !== this.model.doc ||
        previous.controlTag !== this.model.controlTag)
    ) {
      // a new document or another type of control block starts a new search
      this.search = matchAll;
      this.searchValue = '';
    }
    this.rows = buildFcdaRows(
      this.model,
      this.settings,
      this.selectedExtRef,
      this.search
    );
  }

  /** Whether the title names the FCDA chosen in the publisher view. */
  private get isSelectionShown(): boolean {
    return !!(
      this.selectedControl &&
      this.selectedFcda &&
      !this.settings.subscriberView
    );
  }

  private get heading(): string {
    const { selectedControl, selectedFcda } = this;
    if (selectedControl && selectedFcda && this.isSelectionShown) {
      return `${getNameAttribute(
        selectedFcda.closest('IED')!
      )} > ${getNameAttribute(selectedControl)} : ${getFcdaOrExtRefTitle(
        selectedFcda
      )}`;
    }
    return this.settings.controlTag === 'SampledValueControl'
      ? msg('Select SV Publisher')
      : msg('Select GOOSE Publisher');
  }

  private onSearchChange(event: CustomEvent<SearchChangeDetail>): void {
    this.searchValue = event.detail.value;
    this.search = event.detail.regex;
  }

  private change(changes: Partial<SubscriberSettings>): void {
    this.dispatchEvent(newSettingsChangeEvent(changes));
  }

  private copyAsMarkdown(): void {
    navigator.clipboard.writeText(fcdaRowsToMarkdown(this.rows));
  }

  private renderControl(row: ControlRow): TemplateResult {
    return html`<oscd-list-item class="control" data-control=${row.id}>
      <oscd-icon slot="start">${controlIconNames[this.model.controlTag]}</oscd-icon>
      <div slot="headline">${row.title}</div>
      <div slot="supporting-text">${row.subtitle}</div>
    </oscd-list-item>`;
  }

  private renderFcda(row: FcdaRow): TemplateResult {
    const selected =
      !this.settings.subscriberView && this.selectedFcda === row.fcda;
    return html`<oscd-list-item
      type="button"
      class="fcda ${selected ? 'selected' : ''}"
      ?disabled=${row.disabled}
      data-control=${row.controlId}
      data-fcda=${row.fcdaId}
      title=${row.tooltip}
      @click=${() => this.dispatchEvent(newFcdaSelectEvent(row.control, row.fcda))}
    >
      <oscd-icon slot="start">subdirectory_arrow_right</oscd-icon>
      <div slot="headline">${row.title}</div>
      <div slot="supporting-text">${row.subtitle}</div>
      ${row.count !== 0
        ? html`<span slot="end" class="count">${row.count}</span>`
        : nothing}
    </oscd-list-item>`;
  }

  private renderRow(row: FcdaListRow): TemplateResult {
    return row.type === 'control' ? this.renderControl(row) : this.renderFcda(row);
  }

  private renderFilterButton(): TemplateResult {
    const { settings } = this;
    const items: OptionItem[] = [
      {
        headline: msg('Subscribed'),
        supportingText: msg('Published items which something subscribes to.'),
        selected: !settings.filterOutSubscribed,
        defaultSelected: true
      },
      {
        headline: msg('Not Subscribed'),
        supportingText: msg('Published items which nothing subscribes to.'),
        selected: !settings.filterOutNotSubscribed,
        defaultSelected: true
      },
      {
        headline: msg('Data Objects'),
        supportingText: msg('Published data objects, rather than single attributes.'),
        selected: !settings.filterOutDataObjects,
        defaultSelected: true
      },
      {
        headline: msg('Quality'),
        supportingText: msg('The quality attribute of published data.'),
        selected: !settings.filterOutQuality,
        defaultSelected: true
      }
    ];
    if (settings.subscriberView) {
      items.push({
        headline: msg('Non-Matching Preconfigured'),
        supportingText: msg(
          'Preconfigured inputs which do not match the chosen published item.'
        ),
        selected: !settings.filterOutPreconfiguredUnmatched,
        defaultSelected: true
      });
    }
    return renderOptionButton({
      id: 'filterFcdaMenu',
      header: msg('Filter'),
      icon: 'filter_list',
      title: msg('Filter'),
      items,
      multiselect: true,
      active:
        settings.filterOutSubscribed ||
        settings.filterOutNotSubscribed ||
        settings.filterOutDataObjects ||
        settings.filterOutQuality ||
        (settings.filterOutPreconfiguredUnmatched && settings.subscriberView),
      onApply: chosen =>
        this.change({
          filterOutSubscribed: !chosen[0].selected,
          filterOutNotSubscribed: !chosen[1].selected,
          filterOutDataObjects: !chosen[2].selected,
          filterOutQuality: !chosen[3].selected,
          ...(settings.subscriberView
            ? { filterOutPreconfiguredUnmatched: !chosen[4].selected }
            : {})
        }),
      host: this
    });
  }

  private renderSortButton(): TemplateResult {
    const options: [string, string][] = [
      [msg('Data Model'), msg('In the order of the data model.')],
      [msg('Object Reference'), msg('By the reference of the published item.')],
      [msg('Full Description'), msg('By the full description.')],
      [
        msg('Data Object and Attribute Description'),
        msg('By the description of the data object and its attribute.')
      ],
      [
        msg('Data Attribute Description'),
        msg('By the description of the attribute.')
      ]
    ];
    return renderOptionButton({
      id: 'sortFcdaMenu',
      header: msg('Sort'),
      icon: 'sort',
      title: msg('Sort'),
      items: options.map(([headline, supportingText], index) => ({
        headline,
        supportingText,
        selected: this.settings.sortFcda === index,
        defaultSelected: index === FcdaSortOrder.DataModel
      })),
      multiselect: false,
      active: this.settings.sortFcda !== FcdaSortOrder.DataModel,
      onApply: (chosen) => {
        const index = chosen.findIndex(item => item.selected);
        this.change({
          sortFcda: index === -1 ? FcdaSortOrder.DataModel : index
        });
      },
      host: this
    });
  }

  render(): TemplateResult {
    return html`<section>
      <h1 class="list-title">
        <span class="title ${this.isSelectionShown ? 'selected' : ''}" title=${this.heading}
          >${this.heading}${this.settings.readOnlyView && !this.settings.subscriberView
            ? html`<oscd-icon class="read-only-icon" title=${msg('Read-only view')}>lock</oscd-icon>`
            : nothing}</span
        >
        <oscd-icon-button
          id="savePublisherToMarkdown"
          title=${msg('Copy to Clipboard as Markdown')}
          @click=${() => this.copyAsMarkdown()}
        >
          <oscd-icon>content_copy</oscd-icon>
        </oscd-icon-button>
        ${this.renderFilterButton()} ${this.renderSortButton()}
      </h1>
      <virtualized-filtered-list
        class="control-block-list"
        .items=${this.rows}
            ?readonly=${this.settings.readOnlyView}
        .searchValue=${this.searchValue}
        .keyFunction=${(row: unknown) => (row as FcdaListRow).key}
        .renderItem=${(row: unknown) => this.renderRow(row as FcdaListRow)}
        @search-change=${(event: CustomEvent<SearchChangeDetail>) =>
          this.onSearchChange(event)}
      ></virtualized-filtered-list>
    </section>`;
  }

  static styles = [sharedStyles];
}
