import { css, html, LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdOutlinedSegmentedButton } from '@omicronenergy/oscd-ui/labs/segmentedbutton/OscdOutlinedSegmentedButton.js';
import { OscdOutlinedSegmentedButtonSet } from '@omicronenergy/oscd-ui/labs/segmentedbuttonset/OscdOutlinedSegmentedButtonSet.js';

import { newEditEventV2 } from '@openscd/oscd-api/utils.js';
import type { EditV2 } from '@openscd/oscd-api';

import { FcdaList } from './components/fcda-list.js';
import { PublisherExtRefList } from './components/publisher-extref-list.js';
import { SubscriberExtRefList } from './components/subscriber-extref-list.js';
import type {
  ExtRefSelectEvent,
  FcdaSelectEvent,
  SettingsChangeEvent
} from './components/subscription.js';
import {
  needsUnsubscribe,
  subscribeEdits,
  unsubscribeEdits
} from './foundation/actions.js';
import { controlIconNames } from './foundation/control-tag.js';
import type { ControlTag } from './foundation/control-tag.js';
import { findFCDAs } from './foundation/foundation.js';
import { SubscriptionModel } from './foundation/model.js';
import {
  defaultSettings,
  parseSettings,
  serializeSettings,
  settingsKeys,
  settingsStorageKey
} from './foundation/settings.js';
import type { SubscriberSettings } from './foundation/settings.js';
import type { ExtRefSortOrder, FcdaSortOrder } from './foundation/sort.js';
import {
  isPartiallyConfigured,
  isSubscribed
} from './foundation/subscription/subscription.js';

/**
 * A plugin to subscribe GOOSE and sampled values using the later binding
 * method of IEC 61850-6 Edition 2.1, with a view from the publisher, to choose
 * the inputs which subscribe to an FCDA, and a view from the subscriber, to
 * choose the FCDA each input subscribes to.
 *
 * This component keeps the state and turns choices into edits. The lists are
 * components which show it, and what they show is decided in `foundation/`.
 */
export default class SubscriberLaterBinding extends ScopedElementsMixin(
  LitElement
) {
  static scopedElements = {
    'fcda-list': FcdaList,
    'publisher-extref-list': PublisherExtRefList,
    'subscriber-extref-list': SubscriberExtRefList,
    'oscd-icon': OscdIcon,
    'oscd-outlined-segmented-button': OscdOutlinedSegmentedButton,
    'oscd-outlined-segmented-button-set': OscdOutlinedSegmentedButtonSet
  };

  @property({ attribute: false }) doc!: XMLDocument;

  @property() docName!: string;

  /** Changes whenever the document is edited. */
  @property({ attribute: false }) docVersion?: unknown;

  // Properties read by external plugins to know how this plugin is set up.
  @property({ type: String, reflect: true })
  identity = 'danyill.oscd-subscriber-later-binding';

  @property({ type: Boolean, reflect: true })
  allowExternalPlugins = defaultSettings.allowExternalPlugins;

  @property({ type: Boolean, reflect: true })
  ignoreSupervision = defaultSettings.ignoreSupervision;

  @property({ type: Boolean, reflect: true })
  checkOnlyPreferredBasicType = defaultSettings.checkOnlyPreferredBasicType;

  // Settings which are kept between sessions, see `foundation/settings.ts`.
  @property({ type: Boolean }) readOnlyView = defaultSettings.readOnlyView;

  @property({ type: String }) controlTag: ControlTag = defaultSettings.controlTag;

  @property({ type: Boolean }) subscriberView = defaultSettings.subscriberView;

  @property({ type: Boolean }) autoIncrement = defaultSettings.autoIncrement;

  @property({ type: Boolean })
  filterOutSubscribed = defaultSettings.filterOutSubscribed;

  @property({ type: Boolean })
  filterOutNotSubscribed = defaultSettings.filterOutNotSubscribed;

  @property({ type: Boolean })
  filterOutDataObjects = defaultSettings.filterOutDataObjects;

  @property({ type: Boolean }) filterOutQuality = defaultSettings.filterOutQuality;

  @property({ type: Boolean })
  filterOutPreconfiguredUnmatched =
    defaultSettings.filterOutPreconfiguredUnmatched;

  @property({ type: Boolean }) filterOutBound = defaultSettings.filterOutBound;

  @property({ type: Boolean }) filterOutNotBound = defaultSettings.filterOutNotBound;

  @property({ type: Boolean })
  strictServiceTypes = defaultSettings.strictServiceTypes;

  @property({ type: Boolean }) filterOutpDAq = defaultSettings.filterOutpDAq;

  @property({ type: Boolean }) filterOutpDAt = defaultSettings.filterOutpDAt;

  @property({ type: Number })
  sortExtRefPublisher: ExtRefSortOrder = defaultSettings.sortExtRefPublisher;

  @property({ type: Number })
  sortExtRefSubscriber: ExtRefSortOrder = defaultSettings.sortExtRefSubscriber;

  @property({ type: Number }) sortFcda: FcdaSortOrder = defaultSettings.sortFcda;

  // What the user has chosen.
  @state() selectedControl: Element | undefined;

  @state() selectedFCDA: Element | undefined;

  @state() selectedExtRef: Element | undefined;

  @state() private model = new SubscriptionModel(undefined, 'GSEControl');

  @query('subscriber-extref-list')
  private subscriberList?: SubscriberExtRefList;

  /** The settings as they are now. */
  private get settings(): SubscriberSettings {
    return Object.fromEntries(
      settingsKeys.map(key => [key, this[key]])
    ) as unknown as SubscriberSettings;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // restore the settings kept from earlier sessions
    Object.assign(
      this,
      parseSettings(localStorage.getItem(settingsStorageKey))
    );
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has('doc') ||
      changed.has('docVersion') ||
      changed.has('controlTag')
    ) {
      this.model = new SubscriptionModel(this.doc, this.controlTag);
    }

    // a new document, or another type of control block, starts again
    if (
      changed.has('doc') ||
      changed.has('docName') ||
      changed.has('controlTag') ||
      changed.has('subscriberView')
    ) {
      this.clearSelection();
    }

    // an edit may have removed what is selected
    if (changed.has('docVersion')) {
      [this.selectedControl, this.selectedFCDA, this.selectedExtRef].forEach(
        (element) => {
          if (element && !this.doc?.contains(element)) {
            this.clearSelection();
          }
        }
      );
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    if (settingsKeys.some(key => changed.has(key))) {
      localStorage.setItem(settingsStorageKey, serializeSettings(this.settings));
    }
  }

  private clearSelection(): void {
    this.selectedControl = undefined;
    this.selectedFCDA = undefined;
    this.selectedExtRef = undefined;
  }

  private dispatchEdits(edits: EditV2[], title: string): void {
    this.dispatchEvent(newEditEventV2(edits, { title }));
  }

  private unsubscribe(extRef: Element): void {
    this.dispatchEdits(
      unsubscribeEdits(extRef, this.settings),
      msg('Unsubscribe')
    );
  }

  private subscribe(extRef: Element, control: Element, fcda: Element): void {
    // an old subscription, even part of one, must be removed first
    if (needsUnsubscribe(extRef)) {
      this.unsubscribe(extRef);
    }
    this.dispatchEdits(
      subscribeEdits(extRef, control, fcda, this.settings),
      msg('Subscribe')
    );
  }

  private handleSettingsChange(event: SettingsChangeEvent): void {
    Object.assign(this, event.detail.changes);
  }

  private handleFcdaSelect(event: FcdaSelectEvent): void {
    const { control, fcda } = event.detail;

    if (!this.subscriberView) {
      this.selectedControl = control;
      this.selectedFCDA = fcda;
      return;
    }

    // in the subscriber view an FCDA is used to subscribe the chosen ExtRef
    const { selectedExtRef } = this;
    if (!selectedExtRef) {
      return;
    }

    // the next ExtRef depends on the list as it is before the edit
    const next =
      this.autoIncrement && !this.readOnlyView
        ? this.subscriberList?.nextExtRefAfter(selectedExtRef)
        : undefined;

    if (!this.readOnlyView) {
      this.subscribe(selectedExtRef, control, fcda);
    }

    this.selectedExtRef = undefined;
    if (next) {
      this.chooseSubscriberExtRef(next);
    }
  }

  private handleExtRefSelect(event: ExtRefSelectEvent): void {
    const { extRef } = event.detail;
    if (this.subscriberView) {
      this.chooseSubscriberExtRef(extRef);
    } else {
      this.toggleSubscription(extRef);
    }
  }

  /**
   * In the publisher view an ExtRef is subscribed to the chosen FCDA, or
   * unsubscribed if it already is.
   * @param extRef - the ExtRef which was chosen.
   */
  private toggleSubscription(extRef: Element): void {
    const { selectedControl, selectedFCDA } = this;
    if (this.readOnlyView || !selectedControl || !selectedFCDA) {
      return;
    }

    const hasData = findFCDAs(extRef).some(fcda => fcda !== undefined);
    if (!isSubscribed(extRef) || !hasData) {
      this.subscribe(extRef, selectedControl, selectedFCDA);
    } else {
      this.unsubscribe(extRef);
    }
  }

  /**
   * In the subscriber view the chosen ExtRef waits for an FCDA to subscribe to.
   * Choosing one which is subscribed removes the subscription so that it can be
   * subscribed again.
   * @param extRef - the ExtRef which was chosen.
   */
  private chooseSubscriberExtRef(extRef: Element): void {
    if (
      !this.readOnlyView &&
      (isSubscribed(extRef) || isPartiallyConfigured(extRef))
    ) {
      this.unsubscribe(extRef);
    }
    this.selectedControl = undefined;
    this.selectedFCDA = undefined;
    this.selectedExtRef = extRef;
  }

  private renderSwitches(): TemplateResult {
    return html`<header class="header">
      <oscd-outlined-segmented-button-set class="switch" id="controlSwitch">
        ${(['GSEControl', 'SampledValueControl'] as ControlTag[]).map(
          tag => html`<oscd-outlined-segmented-button
            label=${tag === 'GSEControl' ? msg('GOOSE') : msg('Sampled Values')}
            no-checkmark
            data-control-tag=${tag}
            ?selected=${this.controlTag === tag}
            @click=${() => {
              this.controlTag = tag;
            }}
          >
            <oscd-icon slot="icon">${controlIconNames[tag]}</oscd-icon>
          </oscd-outlined-segmented-button>`
        )}
      </oscd-outlined-segmented-button-set>
      <oscd-outlined-segmented-button-set class="switch" id="viewSwitch">
        <oscd-outlined-segmented-button
          label=${msg('Publisher')}
          no-checkmark
          data-view="publisher"
          ?selected=${!this.subscriberView}
          @click=${() => {
            this.subscriberView = false;
          }}
        >
          <oscd-icon slot="icon">output</oscd-icon>
        </oscd-outlined-segmented-button>
        <oscd-outlined-segmented-button
          label=${msg('Subscriber')}
          no-checkmark
          data-view="subscriber"
          ?selected=${this.subscriberView}
          @click=${() => {
            this.subscriberView = true;
          }}
        >
          <oscd-icon slot="icon">input</oscd-icon>
        </oscd-outlined-segmented-button>
      </oscd-outlined-segmented-button-set>
    </header>`;
  }

  private renderFcdaList(): TemplateResult {
    return html`<fcda-list
      class="column"
      .model=${this.model}
      .settings=${this.settings}
      .selectedControl=${this.selectedControl}
      .selectedFcda=${this.selectedFCDA}
      .selectedExtRef=${this.selectedExtRef}
      @fcda-select=${(event: FcdaSelectEvent) => this.handleFcdaSelect(event)}
      @settings-change=${(event: SettingsChangeEvent) =>
        this.handleSettingsChange(event)}
    ></fcda-list>`;
  }

  render(): TemplateResult {
    return html`${this.renderSwitches()}
      <div class="container">
        ${this.subscriberView
          ? html`<subscriber-extref-list
                class="column"
                .model=${this.model}
                .settings=${this.settings}
                .selectedExtRef=${this.selectedExtRef}
                @extref-select=${(event: ExtRefSelectEvent) =>
                  this.handleExtRefSelect(event)}
                @settings-change=${(event: SettingsChangeEvent) =>
                  this.handleSettingsChange(event)}
              ></subscriber-extref-list>
              ${this.renderFcdaList()}`
          : html`${this.renderFcdaList()}
              <publisher-extref-list
                class="column"
                .model=${this.model}
                .settings=${this.settings}
                .selectedControl=${this.selectedControl}
                .selectedFcda=${this.selectedFCDA}
                @extref-select=${(event: ExtRefSelectEvent) =>
                  this.handleExtRefSelect(event)}
                @settings-change=${(event: SettingsChangeEvent) =>
                  this.handleSettingsChange(event)}
              ></publisher-extref-list>`}
      </div>`;
  }

  static styles = css`
    * {
      --oscd-primary: var(--oscd-theme-primary, #0b335b);
      --oscd-base2: var(--oscd-theme-base2, #f3f5f6);
      --oscd-base3: var(--oscd-theme-base3, white);
    }

    :host {
      display: block;
      container-type: inline-size;
      background-color: var(--oscd-base2);
      font-family: var(--oscd-theme-text-font, 'Roboto'), sans-serif;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 12px;
      flex-wrap: wrap;
      background-color: var(--oscd-base2);
    }

    .switch {
      flex-shrink: 0;
      inline-size: min(100%, 24rem);
      --md-outlined-segmented-button-selected-container-color: var(
        --oscd-primary
      );
      --md-outlined-segmented-button-selected-label-text-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-icon-color: var(--oscd-base3);
      --md-outlined-segmented-button-selected-hover-label-text-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-hover-icon-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-focus-label-text-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-focus-icon-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-pressed-label-text-color: var(
        --oscd-base3
      );
      --md-outlined-segmented-button-selected-pressed-icon-color: var(
        --oscd-base3
      );
    }

    .switch oscd-outlined-segmented-button {
      min-inline-size: 0;
    }

    .container {
      display: flex;
      padding: 8px 6px 16px;
      height: var(--oscd-subscriber-later-binding-height, calc(100vh - 136px));
      gap: 12px;
      background-color: var(--oscd-base2);
    }

    .column {
      flex: 1 1 0;
      width: 100%;
      min-width: 0;
      height: 100%;
    }

    @container (max-width: 900px) {
      .container {
        flex-direction: column;
        height: auto;
      }

      .column {
        width: 100%;
        min-height: 24rem;
      }
    }
  `;
}
