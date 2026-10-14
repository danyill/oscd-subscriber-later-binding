import { html, LitElement, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';

import type { SubscriptionModel } from '../foundation/model.js';
import { buildPublisherExtRefRows, matchAll } from '../foundation/rows.js';
import type {
  PublisherExtRefRow,
  PublisherListRow
} from '../foundation/rows.js';
import type { SubscriberSettings } from '../foundation/settings.js';
import { ExtRefSortOrder } from '../foundation/sort.js';
import { FilterButton } from './filter-button.js';
import { renderOptionButton } from './menu-button.js';
import type { OptionItem } from './menu-button.js';
import {
  companionsBadge,
  companionsBadgeTitle,
  companionsText,
  newExtRefSelectEvent,
  newSettingsChangeEvent,
  sharedStyles
} from './subscription.js';
import { VirtualizedFilteredList } from './virtualized-filtered-list.js';
import type { SearchChangeDetail } from './virtualized-filtered-list.js';

/**
 * In the publisher view, the ExtRefs subscribed to the chosen FCDA and those
 * which could be. Choosing one sends an `extref-select` event.
 */
export class PublisherExtRefList extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-filter-button': FilterButton,
    'oscd-icon': OscdIcon,
    'virtualized-filtered-list': VirtualizedFilteredList
  };

  @property({ attribute: false })
  model!: SubscriptionModel;

  @property({ attribute: false })
  settings!: SubscriberSettings;

  /** Names of the companion plugins which are active. */
  @property({ attribute: false })
  companionNames: string[] = [];

  @property({ attribute: false })
  selectedControl?: Element;

  @property({ attribute: false })
  selectedFcda?: Element;

  @state()
  private search = matchAll;

  @state()
  private searchValue = '';

  private rows: PublisherListRow[] = [];

  protected willUpdate(changed: PropertyValues<this>): void {
    const previous = changed.get('model') as SubscriptionModel | undefined;
    if (
      previous &&
      (previous.doc !== this.model.doc ||
        previous.controlTag !== this.model.controlTag)
    ) {
      this.search = matchAll;
      this.searchValue = '';
    }
    this.rows =
      this.selectedControl && this.selectedFcda
        ? buildPublisherExtRefRows(
          this.model,
          this.settings,
          this.selectedControl,
          this.selectedFcda,
          this.search
        )
        : [];
  }

  private onSearchChange(event: CustomEvent<SearchChangeDetail>): void {
    this.searchValue = event.detail.value;
    this.search = event.detail.regex;
  }

  private change(changes: Partial<SubscriberSettings>): void {
    this.dispatchEvent(newSettingsChangeEvent(changes));
  }

  private renderExtRef(row: PublisherExtRefRow): TemplateResult {
    return html`<oscd-list-item
      type="button"
      class="extref ${row.subscribed ? 'subscribed' : 'available'}"
      ?disabled=${row.disabled}
      data-extref=${row.extRefId}
      title=${row.tooltip}
      @click=${() => this.dispatchEvent(newExtRefSelectEvent(row.extRef))}
    >
      <oscd-icon slot="start">${row.subscribed ? 'link' : 'link_off'}</oscd-icon>
      <div slot="headline">${row.title}</div>
      <div slot="supporting-text">${row.subtitle}</div>
      ${row.supervisionId
        ? html`<oscd-icon slot="end" title=${row.supervisionId}>monitor_heart</oscd-icon>`
        : nothing}
      ${row.invalidMapping
        ? html`<oscd-icon slot="end" class="error" title=${msg('Invalid Mapping')}>error</oscd-icon>`
        : nothing}
      ${row.missingMapping
        ? html`<oscd-icon
            slot="end"
            class="warning"
            title=${msg(
              'The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.'
            )}
            >warning</oscd-icon
          >`
        : nothing}
    </oscd-list-item>`;
  }

  private renderRow(row: PublisherListRow): TemplateResult {
    switch (row.type) {
      case 'heading':
        return html`<oscd-list-item class="heading">
          <div slot="headline">${row.text}</div>
        </oscd-list-item>`;
      case 'placeholder':
        return html`<oscd-list-item class="placeholder">
          <div slot="headline">${row.text}</div>
        </oscd-list-item>`;
      default:
        return this.renderExtRef(row);
    }
  }

  private renderFilterButton(): TemplateResult {
    const { settings } = this;
    return renderOptionButton({
      id: 'filterExtRefMenuPublisher',
      header: msg('Filter'),
      icon: 'filter_list',
      title: msg('Filter'),
      items: [
        {
          headline: msg('Unspecified Service Types'),
          supportingText: msg(
            'Inputs which do not say whether they use GOOSE or sampled values.'
          ),
          selected: !settings.strictServiceTypes,
          defaultSelected: true
        },
        {
          headline: msg('Non-Matching Preconfigured'),
          supportingText: msg(
            'Preconfigured inputs which do not match the chosen published item.'
          ),
          selected: !settings.filterOutPreconfiguredUnmatched,
          defaultSelected: true
        }
      ],
      multiselect: true,
      active: settings.strictServiceTypes || settings.filterOutPreconfiguredUnmatched,
      onApply: chosen =>
        this.change({
          strictServiceTypes: !chosen[0].selected,
          filterOutPreconfiguredUnmatched: !chosen[1].selected
        }),
      host: this
    });
  }

  private renderSortButton(): TemplateResult {
    const options: [string, string][] = [
      [msg('Data Model'), msg('In the order of the data model.')],
      [msg('Internal Address'), msg('By the internal address of the input.')],
      [msg('Description'), msg('By the description of the input.')]
    ];
    return renderOptionButton({
      id: 'sortExtRefPublisherMenu',
      header: msg('Sort'),
      icon: 'sort',
      title: msg('Sort'),
      items: options.map(([headline, supportingText], index) => ({
        headline,
        supportingText,
        selected: this.settings.sortExtRefPublisher === index,
        defaultSelected: index === ExtRefSortOrder.DataModel
      })),
      multiselect: false,
      active: this.settings.sortExtRefPublisher !== ExtRefSortOrder.DataModel,
      onApply: (chosen) => {
        const index = chosen.findIndex(item => item.selected);
        this.change({
          sortExtRefPublisher: index === -1 ? ExtRefSortOrder.DataModel : index
        });
      },
      host: this
    });
  }

  private renderSettingsButton(): TemplateResult {
    const { settings } = this;
    const items: OptionItem[] = [
      {
        headline: msg('Change Supervision LNs'),
        selected: !settings.ignoreSupervision,
        defaultSelected: true
      },
      {
        headline: msg('Allow External Plugins'),
        supportingText: companionsText(this.companionNames),
        selected: settings.allowExternalPlugins,
        defaultSelected: true
      },
      {
        headline: msg('Check Only Preconfigured Service and Basic Types'),
        selected: settings.checkOnlyPreferredBasicType,
        defaultSelected: false
      },
      {
        headline: msg('Read-only view'),
        selected: settings.readOnlyView,
        defaultSelected: false
      }
    ];
    return renderOptionButton({
      id: 'settingsExtRefPublisherMenu',
      badge: settings.allowExternalPlugins
        ? companionsBadge(this.companionNames)
        : undefined,
      badgeTitle: companionsBadgeTitle(this.companionNames),
      header: msg('Settings'),
      icon: 'settings',
      title: msg('Settings'),
      items,
      multiselect: true,
      onApply: chosen =>
        this.change({
          ignoreSupervision: !chosen[0].selected,
          allowExternalPlugins: chosen[1].selected,
          checkOnlyPreferredBasicType: chosen[2].selected,
          readOnlyView: chosen[3].selected
        }),
      host: this
    });
  }

  render(): TemplateResult {
    const hasSelection = this.selectedControl && this.selectedFcda;
    return html`<section>
      <h1 class="list-title">
        <span class="title">${msg('Select Subscriber Input')}</span>
        ${this.renderFilterButton()} ${this.renderSortButton()}
        ${this.renderSettingsButton()}
      </h1>
      ${hasSelection
        ? html`<virtualized-filtered-list
            class="extref-list"
            .items=${this.rows}
            ?readonly=${this.settings.readOnlyView}
            .searchValue=${this.searchValue}
            .keyFunction=${(row: unknown) => (row as PublisherListRow).key}
            .renderItem=${(row: unknown) => this.renderRow(row as PublisherListRow)}
            @search-change=${(event: CustomEvent<SearchChangeDetail>) =>
              this.onSearchChange(event)}
          ></virtualized-filtered-list>`
        : html`<h3>${msg('No published item selected')}</h3>`}
    </section>`;
  }

  static styles = [sharedStyles];
}
