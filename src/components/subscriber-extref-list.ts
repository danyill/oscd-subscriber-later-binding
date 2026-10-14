import { html, LitElement, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';

import { getNameAttribute } from '../foundation/foundation.js';
import { objectReferenceInIed } from '../foundation/identity.js';
import { subscriberRowsToMarkdown } from '../foundation/markdown.js';
import type { SubscriptionModel } from '../foundation/model.js';
import {
  buildSubscriberRows,
  matchAll,
  nextExtRefToSubscribe
} from '../foundation/rows.js';
import type {
  IedRow,
  SubscriberExtRefRow,
  SubscriberListRow
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
 * In the subscriber view, the IEDs with later binding inputs and their ExtRefs.
 * Choosing one sends an `extref-select` event.
 */
export class SubscriberExtRefList extends ScopedElementsMixin(LitElement) {
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

  /** Names of the companion plugins which are active. */
  @property({ attribute: false })
  companionNames: string[] = [];

  /** The ExtRef chosen to be subscribed, shown as selected. */
  @property({ attribute: false })
  selectedExtRef?: Element;

  @state()
  private search = matchAll;

  @state()
  private searchValue = '';

  private rows: SubscriberListRow[] = [];

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
    this.rows = buildSubscriberRows(this.model, this.settings, this.search);
  }

  /**
   * The ExtRef to choose after one has been subscribed, which is the next one
   * in the list as it is shown, if it is not bound already.
   * @param extRef - the ExtRef which was subscribed.
   * @returns the next ExtRef, if there is one.
   */
  nextExtRefAfter(extRef: Element): Element | undefined {
    return nextExtRefToSubscribe(this.rows, extRef);
  }

  private get hasExtRefs(): boolean {
    return !!this.model.doc?.querySelector(
      `:root > IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef,
       :root > IED > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
    );
  }

  private get heading(): string {
    const { selectedExtRef } = this;
    return selectedExtRef
      ? `${getNameAttribute(
        selectedExtRef.closest('IED')!
      )} > ${objectReferenceInIed(selectedExtRef)}: ${selectedExtRef.getAttribute(
        'intAddr'
      )}`
      : msg('Select Subscriber Input');
  }

  private onSearchChange(event: CustomEvent<SearchChangeDetail>): void {
    this.searchValue = event.detail.value;
    this.search = event.detail.regex;
  }

  private change(changes: Partial<SubscriberSettings>): void {
    this.dispatchEvent(newSettingsChangeEvent(changes));
  }

  private copyAsMarkdown(): void {
    navigator.clipboard.writeText(subscriberRowsToMarkdown(this.rows));
  }

  private renderIed(row: IedRow): TemplateResult {
    return html`<oscd-list-item class="ied" data-ied=${row.name}>
      <oscd-icon slot="start">developer_board</oscd-icon>
      <div slot="headline">${row.name}</div>
      <div slot="supporting-text">${row.info}</div>
    </oscd-list-item>`;
  }

  private renderExtRef(row: SubscriberExtRefRow): TemplateResult {
    const selected = this.selectedExtRef === row.extRef;
    const { subscribed, invalidMapping, missingMapping } = row;
    const showData = row.description && row.dataDescription !== '';
    const source = row.description && row.source !== '' ? `(${row.source})` : row.source;
    return html`<oscd-list-item
      type="button"
      class="extref ${selected ? 'selected' : ''}"
      data-extref=${row.extRefId}
      title=${row.tooltip}
      @click=${() => this.dispatchEvent(newExtRefSelectEvent(row.extRef))}
    >
      <oscd-icon slot="start">${subscribed ? 'link' : 'link_off'}</oscd-icon>
      <div slot="headline">
        ${row.title}
        ${subscribed || invalidMapping
          ? html`<oscd-icon class="arrow">arrow_back</oscd-icon> ${row.mapping}`
          : nothing}
      </div>
      <div slot="supporting-text">
        ${row.description}
        ${showData
          ? html`<oscd-icon class="arrow">arrow_left</oscd-icon>${row.dataDescription}`
          : nothing}
        ${source}
      </div>
      ${row.supervised
        ? html`<oscd-icon slot="end">monitor_heart</oscd-icon>`
        : nothing}
      ${invalidMapping
        ? html`<oscd-icon slot="end" class="error" title=${msg('Invalid Mapping')}>error</oscd-icon>`
        : nothing}
      ${missingMapping
        ? html`<oscd-icon
            slot="end"
            class="warning"
            title=${msg('The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.')}
            >warning</oscd-icon
          >`
        : nothing}
    </oscd-list-item>`;
  }

  private renderRow(row: SubscriberListRow): TemplateResult {
    return row.type === 'ied' ? this.renderIed(row) : this.renderExtRef(row);
  }

  private renderFilterButton(): TemplateResult {
    const { settings } = this;
    return renderOptionButton({
      id: 'filterExtRefMenuSubscriber',
      header: msg('Filter'),
      icon: 'filter_list',
      title: msg('Filter'),
      items: [
        {
          headline: msg('Subscribed'),
          supportingText: msg('Inputs which subscribe to something.'),
          selected: !settings.filterOutBound,
          defaultSelected: true
        },
        {
          headline: msg('Not Subscribed'),
          supportingText: msg('Inputs which subscribe to nothing.'),
          selected: !settings.filterOutNotBound,
          defaultSelected: true
        },
        {
          headline: msg('Unspecified Service Types'),
          supportingText: msg(
            'Inputs which do not say whether they use GOOSE or sampled values.'
          ),
          selected: !settings.strictServiceTypes,
          defaultSelected: true
        },
        {
          headline: msg('Preconfigured Quality Attribute'),
          supportingText: msg('Inputs preconfigured for the quality attribute.'),
          selected: !settings.filterOutpDAq,
          defaultSelected: true
        },
        {
          headline: msg('Preconfigured Time Attribute'),
          supportingText: msg('Inputs preconfigured for the time attribute.'),
          selected: !settings.filterOutpDAt,
          defaultSelected: true
        }
      ],
      multiselect: true,
      active:
        settings.filterOutBound ||
        settings.filterOutNotBound ||
        settings.strictServiceTypes ||
        settings.filterOutpDAq ||
        settings.filterOutpDAt,
      onApply: chosen =>
        this.change({
          filterOutBound: !chosen[0].selected,
          filterOutNotBound: !chosen[1].selected,
          strictServiceTypes: !chosen[2].selected,
          filterOutpDAq: !chosen[3].selected,
          filterOutpDAt: !chosen[4].selected
        }),
      host: this
    });
  }

  private renderSortButton(): TemplateResult {
    const options: [string, string][] = [
      [msg('Data Model'), msg('In the order of the data model.')],
      [msg('Internal Address'), msg('By the internal address of the input.')],
      [msg('Description'), msg('By the description of the input.')],
      [msg('Mapped Reference'), msg('By the published item the input subscribes to.')]
    ];
    return renderOptionButton({
      id: 'sortExtRefSubscriberMenu',
      header: msg('Sort'),
      icon: 'sort',
      title: msg('Sort'),
      items: options.map(([headline, supportingText], index) => ({
        headline,
        supportingText,
        selected: this.settings.sortExtRefSubscriber === index,
        defaultSelected: index === ExtRefSortOrder.DataModel
      })),
      multiselect: false,
      active: this.settings.sortExtRefSubscriber !== ExtRefSortOrder.DataModel,
      onApply: (chosen) => {
        const index = chosen.findIndex(item => item.selected);
        this.change({
          sortExtRefSubscriber: index === -1 ? ExtRefSortOrder.DataModel : index
        });
      },
      host: this
    });
  }

  private renderSettingsButton(): TemplateResult {
    const { settings } = this;
    const items: OptionItem[] = [
      {
        headline: msg('Auto-increment'),
        selected: settings.autoIncrement,
        defaultSelected: true
      },
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
      id: 'settingsExtRefSubscriberMenu',
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
          autoIncrement: chosen[0].selected,
          ignoreSupervision: !chosen[1].selected,
          allowExternalPlugins: chosen[2].selected,
          checkOnlyPreferredBasicType: chosen[3].selected,
          readOnlyView: chosen[4].selected
        }),
      host: this
    });
  }

  render(): TemplateResult {
    return html`<section>
      <h1 class="list-title">
        <span class="title ${this.selectedExtRef ? 'selected' : ''}" title=${this.heading}
          >${this.heading}${this.settings.readOnlyView
            ? html`<oscd-icon class="read-only-icon" title=${msg('Read-only view')}>lock</oscd-icon>`
            : nothing}</span
        >
        <oscd-icon-button
          id="saveSubscriberExtRefToMarkdown"
          title=${msg('Copy to Clipboard as Markdown')}
          @click=${() => this.copyAsMarkdown()}
        >
          <oscd-icon>content_copy</oscd-icon>
        </oscd-icon-button>
        ${this.renderFilterButton()} ${this.renderSortButton()}
        ${this.renderSettingsButton()}
      </h1>
      ${this.hasExtRefs
        ? html`<virtualized-filtered-list
            class="extref-list"
            .items=${this.rows}
            ?readonly=${this.settings.readOnlyView}
            .searchValue=${this.searchValue}
            .keyFunction=${(row: unknown) => (row as SubscriberListRow).key}
            .renderItem=${(row: unknown) => this.renderRow(row as SubscriberListRow)}
            @search-change=${(event: CustomEvent<SearchChangeDetail>) =>
              this.onSearchChange(event)}
          ></virtualized-filtered-list>`
        : html`<h3>${msg('No inputs')}</h3>`}
    </section>`;
  }

  static styles = [sharedStyles];
}
