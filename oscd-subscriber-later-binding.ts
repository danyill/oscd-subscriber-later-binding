import {
  css,
  html,
  LitElement,
  nothing,
  PropertyValues,
  SVGTemplateResult,
  TemplateResult,
} from 'lit';
import { msg } from '@lit/localize';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-menu';
import '@material/mwc-icon-button-toggle';

import { newEditEvent, Remove } from '@openscd/open-scd-core';
import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { List, SingleSelectedEvent } from '@material/mwc-list';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { Menu } from '@material/mwc-menu';

import { styles } from './foundation/styles/styles.js';
import { identity } from './foundation/identities/identity.js';
import {
  canRemoveSubscriptionSupervision,
  getCbReference,
  getExistingSupervision,
  getExtRefElements,
  getFcdaElements,
  getFcdaSrcControlBlockDescription,
  getFcdaSubtitleValue,
  getFcdaTitleValue,
  getOrderedIeds,
  getSubscribedExtRefElements,
  getUsedSupervisionInstances,
  instantiateSubscriptionSupervision,
  isBound,
  removeSubscriptionSupervision,
  unsubscribe,
  unsupportedExtRefElement,
  updateExtRefElement,
} from './foundation/subscription/subscription.js';
import {
  createUpdateEdit,
  findFCDAs,
  getDescriptionAttribute,
  getNameAttribute,
} from './foundation/foundation.js';
import {
  // getFilterIcon,
  gooseIcon,
  smvIcon,
} from './foundation/icons.js';

import './foundation/components/oscd-filtered-list.js';
import { selector } from './foundation/identities/selector.js';

import type { OscdFilteredList } from './foundation/components/oscd-filtered-list.js';

type controlTagType = 'SampledValueControl' | 'GSEControl';

type iconLookup = Record<controlTagType, SVGTemplateResult>;

export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property()
  controlTag: controlTagType = 'GSEControl'; // eventually parameterise

  @state()
  private extRefCounters = new Map();

  @property({ type: Boolean })
  get subscriberView(): boolean {
    return this.switchViewUI?.on ?? false;
  }

  set subscriberView(val) {
    // TODO: Discuss with Christian the use of requestUpdate
    // https://lit.dev/docs/v1/components/properties/#accessors
    const oldValue = this.switchViewUI!.on === true;
    this.switchViewUI!.on = val;
    this.requestUpdate('subscriberview', oldValue);
  }

  @property({ type: Boolean })
  get hideSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${this.controlTag}$hideSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideSubscribed(value: boolean) {
    const oldValue = value;
    localStorage.setItem(
      `fcda-binding-list-${this.controlTag}$hideSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideSubscribed', oldValue);
  }

  @property({ type: Boolean })
  get hideNotSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${this.controlTag}$hideNotSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideNotSubscribed(value: boolean) {
    const oldValue = value;
    localStorage.setItem(
      `fcda-binding-list-${this.controlTag}$hideNotSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideNotSubscribed', oldValue);
  }

  @property({ type: Boolean })
  get notAutoIncrement(): boolean {
    return (
      localStorage.getItem(
        `extref-list-${this.controlTag}$notAutoIncrement`
      ) === 'true' ?? false
    );
  }

  set notAutoIncrement(value: boolean) {
    const oldValue = value;
    localStorage.setItem(
      `extref-list-${this.controlTag}$notAutoIncrement`,
      `${value}`
    );
    this.requestUpdate('notAutoIncrement', oldValue);
  }

  @property({ type: Boolean })
  get hideBound(): boolean {
    return (
      localStorage.getItem(`extref-list-${this.controlTag}$hideBound`) ===
        'true' ?? false
    );
  }

  set hideBound(value: boolean) {
    const oldValue = value;
    localStorage.setItem(
      `extref-list-${this.controlTag}$hideBound`,
      `${value}`
    );
    this.requestUpdate('hideBound', oldValue);
  }

  @property({ type: Boolean })
  get hideNotBound(): boolean {
    return (
      localStorage.getItem(`extref-list-${this.controlTag}$hideNotBound`) ===
        'true' ?? false
    );
  }

  set hideNotBound(value: boolean) {
    const oldValue = this.hideNotBound;
    localStorage.setItem(
      `extref-list-${this.controlTag}$hideNotBound`,
      `${value}`
    );
    this.requestUpdate('hideNotBound', oldValue);
  }

  @query('.extref-list') extRefList!: List;

  @query('mwc-list-item.activated')
  currentActivatedExtRefItem!: ListItem;

  @query('#switchView')
  switchViewUI?: IconButtonToggle;

  @query('#filterFcdaMenu')
  filterMenuFcdaUI!: Menu;

  @query('#filterFcdaIcon')
  filterMenuFcdaButtonUI!: Icon;

  @query('#filterExtRefMenu')
  filterMenuExtRefUI!: Menu;

  @query('#filterExtRefIcon')
  filterMenuExtRefButtonUI!: Icon;

  @query('#settingsExtRefMenu')
  settingsMenuExtRefUI!: Menu;

  @query('#settingsExtRefMenuIcon')
  settingsMenuExtRefButtonUI!: Icon;

  @query('.control-block-list')
  controlBlockList!: List;

  // TODO: Do we actually use this?
  @query('#subscriberExtRefList')
  extRefListSubscriber?: OscdFilteredList;

  // The selected elements when a FCDA Line is clicked.
  private selectedControlElement: Element | undefined;

  private selectedFcdaElement: Element | undefined;

  private selectedExtRefElement: Element | undefined;

  selectedPublisherControlElement: Element | undefined;

  selectedPublisherFcdaElement: Element | undefined;

  selectedPublisherIedElement: Element | undefined;

  currentSelectedExtRefElement: Element | undefined;

  private iconControlLookup: iconLookup = {
    SampledValueControl: smvIcon,
    GSEControl: gooseIcon,
  };

  private supervisionData = new Map();

  @state()
  currentSelectedControlElement: Element | undefined;

  @state()
  currentSelectedFcdaElement: Element | undefined;

  @state()
  currentIedElement: Element | undefined;

  serviceTypeLookup = {
    GSEControl: 'GOOSE',
    SampledValueControl: 'SMV',
  };

  constructor() {
    super();

    this.resetSelection = this.resetSelection.bind(this);
    // parent.addEventListener('open-doc', this.resetSelection);

    // const parentDiv = this.closest('.container');
    // if (parentDiv) {
    //   this.resetExtRefCount = this.resetExtRefCount.bind(this);
    //   parentDiv.addEventListener('subscription-changed', this.resetExtRefCount);

    //   this.updateExtRefSelection = this.updateExtRefSelection.bind(this);
    //   parentDiv.addEventListener(
    //     'extref-selection-changed',
    //     this.updateExtRefSelection
    //   );
    // }
    // const parentDiv = this.closest('.container');
    // if (parentDiv) {
    //   this.onFcdaSelectEvent = this.onFcdaSelectEvent.bind(this);
    //   parentDiv.addEventListener('fcda-select', this.onFcdaSelectEvent);
    // }

    this.switchViewUI?.addEventListener(
      'icon-button-toggle-change',
      (ev: Event) => {
        console.log(ev);
      }
    );
  }

  private getControlElements(controlTag: controlTagType): Element[] {
    if (this.doc) {
      return Array.from(this.doc.querySelectorAll(`LN0 > ${controlTag}`));
    }
    return [];
  }

  // private resetExtRefCount(event: SubscriptionChangedEvent): void {
  //   //   if (!this.subscriberView) {
  //   //     this.resetSelection();
  //   //   }
  //   //   if (event.detail.control && event.detail.fcda) {
  //   //     const controlBlockFcdaId = `${identity(event.detail.control)} ${identity(
  //   //       event.detail.fcda
  //   //     )}`;
  //   //     this.extRefCounters.delete(controlBlockFcdaId);
  //   //   }
  // }

  // private updateExtRefSelection(event: ExtRefSelectionChangedEvent): void {
  //   //   if (event.detail.extRefElement) {
  //   //     this.selectedExtRefElement = event.detail.extRefElement;
  //   //     this.requestUpdate();
  //   //   }
  // }

  private getExtRefCount(
    fcdaElement: Element,
    controlElement: Element
  ): number {
    const controlBlockFcdaId = `${identity(controlElement)} ${identity(
      fcdaElement
    )}`;
    if (!this.extRefCounters.has(controlBlockFcdaId)) {
      const extRefCount = getSubscribedExtRefElements(
        <Element>this.doc.getRootNode(),
        this.controlTag,
        fcdaElement,
        controlElement!,
        true // TODO: do we need this?
      ).length;
      this.extRefCounters.set(controlBlockFcdaId, extRefCount);
    }
    return this.extRefCounters.get(controlBlockFcdaId);
  }

  // private openEditWizard(controlElement: Element): void {
  //   // const wizard = wizards[this.controlTag].edit(controlElement);
  //   // if (wizard) this.dispatchEvent(newWizardEvent(wizard));
  // }

  private resetSelection(): void {
    this.selectedControlElement = undefined;
    this.selectedFcdaElement = undefined;
  }

  private onFcdaSelect(controlElement: Element, fcdaElement: Element) {
    this.selectedControlElement = controlElement;
    this.selectedFcdaElement = fcdaElement;
    // this.dispatchEvent(
    //   newFcdaSelectEvent(this.selectedControlElement, this.selectedFcdaElement)
    // );
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When a new document is loaded we will reset the Map to clear old entries.
    if (_changedProperties.has('doc')) {
      this.extRefCounters = new Map();
    }

    if (_changedProperties.has('subscriberView')) {
      // TODO: These anchors don't seem to work because
      // subscriberView is never changed.
      this.settingsMenuExtRefUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefButtonUI
      );
      this.filterMenuExtRefUI.anchor = <HTMLElement>(
        this.filterMenuExtRefButtonUI
      );

      this.settingsMenuExtRefUI.addEventListener('closed', () => {
        this.notAutoIncrement = !(<Set<number>>(
          this.settingsMenuExtRefUI.index
        )).has(0);
      });

      this.filterMenuExtRefUI.addEventListener('closed', () => {
        this.hideBound = !(<Set<number>>this.filterMenuExtRefUI.index).has(0);
        this.hideNotBound = !(<Set<number>>this.filterMenuExtRefUI.index).has(
          1
        );
        this.requestUpdate();
      });
    }
  }

  protected firstUpdated(): void {
    // anchor drop-down menus to their icons
    this.filterMenuFcdaUI.anchor = <HTMLElement>this.filterMenuFcdaButtonUI;

    this.filterMenuFcdaUI.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(
        1
      );
      this.requestUpdate();
    });
  }

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${this.subscriberView &&
      unsupportedExtRefElement(
        this.selectedExtRefElement,
        fcdaElement,
        controlElement
      )}
      twoline
      class="${(!this.hideSubscribed && fcdaCount !== 0) ||
      (!this.hideNotSubscribed && fcdaCount === 0)
        ? ''
        : 'hidden-element'}"
      data-control="${identity(controlElement)}"
      data-fcda="${identity(fcdaElement)}"
      value="${identity(controlElement)}
             ${identity(fcdaElement)}"
    >
      <span>${getFcdaTitleValue(fcdaElement)}</span>
      <span slot="secondary">${getFcdaSubtitleValue(fcdaElement)}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  renderFCDAListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideSubscribed || this.hideNotSubscribed,
    };
    return html`<h1>
      ${this.controlTag === 'SampledValueControl'
        ? msg('Publisher Sampled Value Messages')
        : msg('Publisher GOOSE Messages')}
      <mwc-icon-button
        id="filterFcdaIcon"
        class="${classMap(menuClasses)}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuFcdaUI.open) this.filterMenuFcdaUI.show();
          else this.filterMenuFcdaUI.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="filterFcdaMenu"
        multi
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="filter-subscribed"
          left
          ?selected=${!this.hideSubscribed}
        >
          <span>${msg('Subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-not-subscribed"
          left
          ?selected=${!this.hideNotSubscribed}
        >
          <span>${msg('Not Subscribed')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1> `;
  }

  renderControlList(controlElements: Element[]): TemplateResult {
    const filteredListClasses = {
      'control-block-list': true,
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
    };
    return html`<oscd-filtered-list
      ?activatable=${!this.subscriberView}
      class="${classMap(filteredListClasses)}"
      @selected=${(ev: SingleSelectedEvent) => {
        const selectedListItem = (<OscdFilteredList>ev.target).selected;
        if (!selectedListItem) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { control, fcda } = (<any>selectedListItem).dataset;
        const controlElement = this.doc.querySelector(
          selector(this.controlTag, control)
        );
        const fcdaElement = this.doc.querySelector(selector('FCDA', fcda));
        if (controlElement && fcdaElement)
          this.onFcdaSelect(controlElement, fcdaElement);
      }}
    >
      ${controlElements
        .filter(controlElement => getFcdaElements(controlElement).length)
        .map(controlElement => {
          const fcdaElements = getFcdaElements(controlElement);
          const someSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) !== 0
          );
          const someNotSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) === 0
          );

          // <!-- TODO: Restore Have removed wizard connection for now @click=${() =>
          //   this.openEditWizard(controlElement)} -->
          // <mwc-icon-button
          //   slot="meta"
          //   icon="edit"
          //   class="interactive"
          // ></mwc-icon-button>

          return html`
            <mwc-list-item
              noninteractive
              class="control ${(!this.hideSubscribed && someSubscribed) ||
              (!this.hideNotSubscribed && someNotSubscribed)
                ? ''
                : 'hidden-element'}"
              graphic="icon"
              twoline
              hasMeta
              value="${identity(controlElement)}${fcdaElements
                .map(
                  fcdaElement => `
                        ${getFcdaTitleValue(fcdaElement)}
                        ${getFcdaSubtitleValue(fcdaElement)}
                        ${identity(fcdaElement)}`
                )
                .join('')}"
            >
              <span
                >${getNameAttribute(controlElement)}
                ${getDescriptionAttribute(controlElement)
                  ? html`${getDescriptionAttribute(controlElement)}`
                  : nothing}</span
              >
              <span slot="secondary">${identity(controlElement)}</span>
              <mwc-icon slot="graphic"
                >${this.iconControlLookup[this.controlTag]}</mwc-icon
              >
            </mwc-list-item>
            <li divider role="separator"></li>
            ${fcdaElements.map(fcdaElement =>
              this.renderFCDA(controlElement, fcdaElement)
            )}
          `;
        })}
    </oscd-filtered-list>`;
  }

  // private async onFcdaSelectEvent(event: FcdaSelectEvent) {
  //   this.currentSelectedControlElement = event.detail.control;
  //   this.currentSelectedFcdaElement = event.detail.fcda;

  //   // Retrieve the IED Element to which the FCDA belongs.
  //   // These ExtRef Elements will be excluded.
  //   this.currentIedElement = this.currentSelectedFcdaElement
  //     ? this.currentSelectedFcdaElement.closest('IED') ?? undefined
  //     : undefined;
  // }

  /**
   * Unsubscribing means removing a list of attributes from the ExtRef Element.
   *
   * @param extRef - The Ext Ref Element to clean from attributes.
   */
  private unsubscribe(extRef: Element): void {
    const updateEdit = createUpdateEdit(extRef, {
      intAddr: extRef.getAttribute('intAddr'),
      desc: extRef.getAttribute('desc'),
      iedName: null,
      ldInst: null,
      prefix: null,
      lnClass: null,
      lnInst: null,
      doName: null,
      daName: null,
      serviceType: null,
      srcLDInst: null,
      srcPrefix: null,
      srcLNClass: null,
      srcLNInst: null,
      srcCBName: null,
    });

    const subscriberIed = extRef.closest('IED') || undefined;
    const removeSubscriptionEdits: Remove[] = [];

    if (canRemoveSubscriptionSupervision(extRef))
      removeSubscriptionEdits.push(
        ...removeSubscriptionSupervision(
          this.currentSelectedControlElement,
          subscriberIed
        )
      );

    this.dispatchEvent(newEditEvent(updateEdit));

    // this.dispatchEvent(
    //   newSubscriptionChangedEvent(
    //     this.currentSelectedControlElement,
    //     this.currentSelectedFcdaElement
    //   )
    // );
  }

  /**
   * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
   *
   * @param extRef - The Ext Ref Element to add the attributes to.
   */
  private subscribe(extRef: Element): void {
    if (
      !this.currentIedElement ||
      !this.currentSelectedFcdaElement ||
      !this.currentSelectedControlElement!
    ) {
      return;
    }

    const updateEdit = updateExtRefElement(
      extRef,
      this.currentSelectedControlElement,
      this.currentSelectedFcdaElement
    );

    const subscriberIed = extRef.closest('IED') || undefined;

    const supervisionActions = instantiateSubscriptionSupervision(
      this.currentSelectedControlElement,
      subscriberIed
    );

    this.dispatchEvent(newEditEvent([updateEdit, ...supervisionActions]));

    // this.dispatchEvent(
    //   newSubscriptionChangedEvent(
    //     this.currentSelectedControlElement,
    //     this.currentSelectedFcdaElement
    //   )
    // );
  }

  private getSubscribedExtRefElements(): Element[] {
    return getSubscribedExtRefElements(
      <Element>this.doc.getRootNode(),
      this.controlTag,
      this.currentSelectedFcdaElement,
      this.currentSelectedControlElement,
      true
    );
  }

  private getAvailableExtRefElements(): Element[] {
    return getExtRefElements(
      <Element>this.doc.getRootNode(),
      this.currentSelectedFcdaElement,
      true
    ).filter(
      extRefElement =>
        !isBound(extRefElement) &&
        (!extRefElement.hasAttribute('serviceType') ||
          extRefElement.getAttribute('serviceType') ===
            this.serviceTypeLookup[this.controlTag])
    );
  }

  private renderExtRefElement(extRefElement: Element): TemplateResult {
    const supervisionNode = getExistingSupervision(extRefElement);
    return html` <mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      twoline
      @click=${() => this.unsubscribe(extRefElement)}
      value="${identity(extRefElement)}"
    >
      <span>
        ${extRefElement.getAttribute('intAddr')}
        ${getDescriptionAttribute(extRefElement)
          ? html` (${getDescriptionAttribute(extRefElement)})`
          : nothing}
      </span>
      <span slot="secondary"
        >${identity(extRefElement.parentElement)}${supervisionNode !== null
          ? ` (${identity(supervisionNode)})`
          : ''}</span
      >
      <mwc-icon slot="graphic">link</mwc-icon>
      ${supervisionNode !== null
        ? html`<mwc-icon title="${identity(supervisionNode)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
        : nothing}
    </mwc-list-item>`;
  }

  private renderSubscribedExtRefs(): TemplateResult {
    const subscribedExtRefs = this.getSubscribedExtRefElements();
    return html`
      <mwc-list-item
        noninteractive
        value="${subscribedExtRefs
          .map(
            extRefElement =>
              `${getDescriptionAttribute(extRefElement)} ${identity(
                extRefElement
              )}`
          )
          .join(' ')}"
      >
        <span>${msg('Subscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${subscribedExtRefs.length > 0
        ? html`${subscribedExtRefs.map(extRefElement =>
            this.renderExtRefElement(extRefElement)
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${msg('No subscribed inputs')}
          </mwc-list-item>`}
    `;
  }

  private renderAvailableExtRefs(): TemplateResult {
    const availableExtRefs = this.getAvailableExtRefElements();
    return html`
      <mwc-list-item
        noninteractive
        value="${availableExtRefs
          .map(
            extRefElement =>
              `${getDescriptionAttribute(extRefElement)} ${identity(
                extRefElement
              )}`
          )
          .join(' ')}"
      >
        <span> ${msg('Available to subscribe')} </span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${availableExtRefs.length > 0
        ? html`${availableExtRefs.map(
            extRefElement => html` <mwc-list-item
              graphic="large"
              ?disabled=${unsupportedExtRefElement(
                extRefElement,
                this.currentSelectedFcdaElement,
                this.currentSelectedControlElement
              )}
              twoline
              @click=${() => this.subscribe(extRefElement)}
              value="${identity(extRefElement)}"
            >
              <span>
                ${extRefElement.getAttribute('intAddr')}
                ${getDescriptionAttribute(extRefElement)
                  ? html` (${getDescriptionAttribute(extRefElement)})`
                  : nothing}
              </span>
              <span slot="secondary"
                >${identity(extRefElement.parentElement)}</span
              >
              <mwc-icon slot="graphic">link_off</mwc-icon>
            </mwc-list-item>`
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${msg('No available inputs to subscribe')}
          </mwc-list-item>`}
    `;
  }

  private renderExtRefSubscriberListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideBound || this.hideNotBound,
    };
    return html`<h1>
      ${msg('Subscriber Inputs')}
      <mwc-icon-button
        id="filterExtRefIcon"
        class="${classMap(menuClasses)}"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuExtRefUI.open) this.filterMenuExtRefUI.show();
          else this.filterMenuExtRefUI.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="filterExtRefMenu"
        multi
        class="filter-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="show-bound"
          left
          ?selected=${!this.hideBound}
        >
          <span>${msg('Bound')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-not-bound"
          left
          ?selected=${!this.hideNotBound}
        >
          <span>${msg('Unbound')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="settingsExtRefIcon"
        title="${msg('Settings')}"
        icon="settings"
        @click=${() => {
          if (!this.settingsMenuExtRefUI.open) this.settingsMenuExtRefUI.show();
          else this.settingsMenuExtRefUI.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="settingsExtRefMenu"
        multi
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="auto-increment"
          left
          ?selected=${!this.notAutoIncrement}
        >
          <span>${msg('Auto-increment')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
  }

  private reCreateSupervisionCache() {
    this.supervisionData = new Map();
    const supervisionType =
      this.serviceTypeLookup[this.controlTag] === 'GOOSE' ? 'LGOS' : 'LSVS';
    const refSelector =
      supervisionType === 'LGOS'
        ? 'DOI[name="GoCBRef"]'
        : 'DOI[name="SvCBRef"]';

    getUsedSupervisionInstances(
      this.doc,
      this.serviceTypeLookup[this.controlTag]
    ).forEach(supervisionLN => {
      const cbRef = supervisionLN!.querySelector(
        `LN[lnClass="${supervisionType}"]>${refSelector}>DAI[name="setSrcRef"]>Val`
      )?.textContent;
      if (cbRef) this.supervisionData.set(cbRef, supervisionLN);
    });
  }

  private getExtRefElementsByIED(
    ied: Element,
    controlTag: controlTagType
  ): Element[] {
    return Array.from(
      ied.querySelectorAll(
        ':scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef'
      )
    ).filter(
      extRefElement =>
        (extRefElement.hasAttribute('intAddr') &&
          !extRefElement.hasAttribute('serviceType') &&
          !extRefElement.hasAttribute('pServT')) ||
        extRefElement.getAttribute('serviceType') ===
          this.serviceTypeLookup[controlTag] ||
        extRefElement.getAttribute('pServT') ===
          this.serviceTypeLookup[controlTag]
    );
  }

  private getCachedSupervision(extRefElement: Element): Element | undefined {
    const cbRefKey = getCbReference(extRefElement);
    return this.supervisionData.get(cbRefKey);
  }

  private renderCompleteExtRefElement(extRefElement: Element): TemplateResult {
    let subscriberFCDA: Element | undefined;
    let supervisionNode: Element | undefined;
    let controlBlockDescription: string | undefined;
    let supervisionDescription: string | undefined;

    const bound = isBound(extRefElement);

    if (bound) {
      subscriberFCDA = findFCDAs(extRefElement).find(x => x !== undefined);
      supervisionNode = this.getCachedSupervision(extRefElement);
      controlBlockDescription =
        getFcdaSrcControlBlockDescription(extRefElement);
    }

    if (supervisionNode) {
      supervisionDescription = (<string>identity(supervisionNode))
        .split('>')
        .slice(1)
        .join('>')
        .trim()
        .slice(1);
    }

    return html`<mwc-list-item
      twoline
      class="control ${(!this.hideBound && bound) ||
      (!this.hideNotBound && !bound)
        ? ''
        : 'hidden-element'}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined}
      @click=${() => {
        this.currentSelectedExtRefElement = extRefElement;

        if (!bound) {
          // this.dispatchEvent(
          //   newExtRefSelectionChangedEvent(this.currentSelectedExtRefElement)
          // );
        } else {
          unsubscribe(extRefElement, this);
          this.reCreateSupervisionCache();
        }
      }}
      @request-selected=${() => {
        this.currentSelectedExtRefElement = extRefElement;
        (<ListItem>(
          this.shadowRoot!.querySelector('mwc-list-item[activated].extref')!
        ))?.requestUpdate();
      }}
      value="${identity(extRefElement)}${supervisionNode
        ? ` ${identity(supervisionNode)}`
        : ''}"
    >
      <span>
        ${(<string>identity(extRefElement.parentElement))
          .split('>')
          .slice(1)
          .join('>')
          .trim()
          .slice(1)}:
        ${extRefElement.getAttribute('intAddr')}
        ${bound && subscriberFCDA
          ? `⬌ ${identity(subscriberFCDA) ?? 'Unknown'}`
          : ''}
      </span>
      <span slot="secondary"
        >${getDescriptionAttribute(extRefElement)
          ? html` ${getDescriptionAttribute(extRefElement)}`
          : nothing}
        ${supervisionDescription || controlBlockDescription
          ? html`(${[controlBlockDescription, supervisionDescription]
              .filter(desc => desc !== undefined)
              .join(', ')})`
          : nothing}
      </span>
      <mwc-icon slot="graphic">${bound ? 'link' : 'link_off'}</mwc-icon>
      ${bound && supervisionNode !== undefined
        ? html`<mwc-icon title="${identity(supervisionNode!)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
        : nothing}
    </mwc-list-item>`;
  }

  private renderExtRefsByIED(): TemplateResult {
    if (this.supervisionData.size === 0) this.reCreateSupervisionCache();
    return html`${repeat(
      getOrderedIeds(this.doc),
      i => `${identity(i)}`,
      ied => {
        const extRefs = Array.from(
          this.getExtRefElementsByIED(ied, this.controlTag)
        );
        const someBound = extRefs.some(extRef => isBound(extRef));
        const someNotBound = extRefs.some(extRef => !isBound(extRef));

        if (!extRefs.length) return html``;
        return html`
      <mwc-list-item
      class="ied ${
        (!this.hideBound && someBound) || (!this.hideNotBound && someNotBound)
          ? ''
          : 'hidden-element'
      }"
        noninteractive
        graphic="icon"
        value="${Array.from(ied.querySelectorAll('Inputs > ExtRef'))
          .map(extRef => {
            const extRefid = identity(extRef) as string;
            const supervisionId =
              this.getCachedSupervision(extRef) !== undefined
                ? identity(this.getCachedSupervision(extRef)!)
                : '';
            return `${
              typeof extRefid === 'string' ? extRefid : ''
            }${supervisionId}`;
          })
          .join(' ')}"
      >
        <span>${getNameAttribute(ied)}</span>
        <mwc-icon slot="graphic">developer_board</mwc-icon>
      </mwc-list-item>
      <li divider role="separator"></li>
          ${repeat(
            Array.from(this.getExtRefElementsByIED(ied, this.controlTag)),
            exId => `${identity(exId)}`,
            extRef => this.renderCompleteExtRefElement(extRef)
          )} 
          </mwc-list-item>`;
      }
    )}`;
  }

  // >${gooseIconString('onIcon')} ${smvIconString('offIcon')}
  // >${getFilterIcon('gooseIcon', true)} ${getFilterIcon('smvIcon', false)}
  // getFilterIcon('gooseIcon', true)

  renderControlTypeSelector(): TemplateResult {
    return html`<div>
      <mwc-icon-button-toggle
        id="switchControlType"
        title="${msg('Change between GOOSE and Sampled Value publishers')}"
        offIcon="link_off"
        onIcon="coronavirus"
        @click=${() => {
          if (this.controlTag === 'GSEControl') {
            this.controlTag = 'SampledValueControl';
          } else {
            this.controlTag = 'GSEControl';
          }
          this.requestUpdate();
        }}
      >
      </mwc-icon-button-toggle>
    </div>`;
  }

  renderFCDAs(): TemplateResult {
    const controlElements = this.getControlElements(this.controlTag);
    return html`<section class="column">
      ${this.renderFCDAListTitle()}
      ${controlElements
        ? this.renderControlList(controlElements)
        : html`<h3>${msg('Not Subscribed')}</h3> `}
    </section>`;
  }

  renderExtRefs(): TemplateResult {
    const filteredListClasses = {
      'show-bound': !this.hideBound,
      'show-not-bound': !this.hideNotBound,
    };

    return !this.subscriberView
      ? html`<section class="column">
          <h1>${msg('Subscriber Inputs')}</h1>
          ${this.currentSelectedControlElement &&
          this.currentSelectedFcdaElement
            ? html`<oscd-filtered-list>
                ${this.renderSubscribedExtRefs()}
                ${this.renderAvailableExtRefs()}
              </oscd-filtered-list>`
            : html`<h3>${msg('No published item selected')}</h3>`}
        </section>`
      : html` <section class="column">
          ${this.renderExtRefSubscriberListTitle()}
          <oscd-filtered-list
            id="subscriberExtRefList"
            class="${classMap(filteredListClasses)}"
            activatable
            >${this.renderExtRefsByIED()}</oscd-filtered-list
          >
        </section>`;
  }

  render(): TemplateResult {
    return html`<mwc-icon-button-toggle
        id="switchView"
        onIcon="alt_route"
        offIcon="alt_route"
        title="${msg('Alternate between Publisher and Subscriber view')}"
        @click=${() => {
          this.requestUpdate();
        }}
      ></mwc-icon-button-toggle>
      ${this.renderControlTypeSelector()}
      <div class="container">
        ${this.renderFCDAs()}${this.renderExtRefs()}
      </div>`;
  }

  static styles = css`
    ${styles}

    :host {
      width: 100vw;
      display: flex;
    }

    .container {
      width: 100%;
      display: flex;
      padding: 8px 6px 16px;
      height: calc(100vh - 136px);
    }

    .container:not(subscriberView) {
      flex-direction: row;
    }

    .container[subscriberView] {
      width: 100%;
      flex-direction: row-reverse;
    }

    .container[subscriberView] fcda-binding-list.column {
      flex: 1;
      width: 25%;
    }

    .column {
      flex: 50%;
      margin: 0px 6px 0px;
      min-width: 300px;
      height: 100%;
      overflow-y: auto;
    }

    @media (min-width: 700px) {
      .container[subscriberView] {
        width: calc(100vw - 20px);
        flex: auto;
      }

      .container[subscriberView] extref-later-binding-list-subscriber.column {
        resize: horizontal;
        width: 65%;
        flex: none;
      }

      .container[subscriberView] fcda-binding-list.column {
        width: auto;
      }
    }

    h3 {
      margin: 4px 8px 16px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    section {
      position: relative;
    }

    .interactive {
      pointer-events: all;
    }

    .subitem {
      padding-left: var(--mdc-list-side-padding, 16px);
    }

    #filterFcdaIcon,
    #filterExtRefIcon,
    #settingsExtRefIcon {
      float: right;
    }

    #filterFcdaIcon.filter-off,
    #filterExtRefIcon.filter-off {
      /* TODO: MDC theme secondary is not defined in open-scd core? */
      color: var(--mdc-theme-secondary);
      background-color: var(--mdc-theme-background);
    }

    .hidden-element {
      display: none;
    }

    h3 {
      margin: 4px 8px 16px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    #switchView {
      position: fixed;
      left: 100;
      top: 70;
    }

    #switchControlType {
      position: fixed;
      left: 300;
      top: 70;
    }
  `;
}
