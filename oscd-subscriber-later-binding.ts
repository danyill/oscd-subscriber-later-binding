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

import '@material/dialog';
import '@material/mwc-button';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-menu';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import '@material/mwc-icon-button-toggle';

import { newEditEvent, Remove } from '@openscd/open-scd-core';
import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { List } from '@material/mwc-list';
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
  isSubscribed,
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
import { gooseIcon, smvIcon } from './foundation/icons.js';

// const controlTag = 'GSEControl';

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

  @property({ type: Boolean })
  get hideSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${this.controlTag}$hideSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideSubscribed(value: boolean) {
    const oldValue = this.hideSubscribed;
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
    const oldValue = this.hideNotSubscribed;
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
    const oldValue = this.hideBound;
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
    const oldValue = this.hideBound;
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

  @query('.filter-menu')
  filterMenu!: Menu;

  @query('.settings-menu')
  settingsMenu!: Menu;

  @query('.filter-action-menu-icon')
  filterMenuIcon!: Icon;

  @query('.settings-action-menu-icon')
  settingsMenuIcon!: Icon;

  @query('.extref-list') extRefList!: List;

  @query('mwc-list-item.activated')
  currentActivatedExtRefItem!: ListItem;

  @query('.actions-menu') actionsMenu!: Menu;

  @query('.actions-menu-icon') actionsMenuIcon!: Icon;

  @query('.control-block-list') controlBlockList!: List;

  @query('#switchView')
  switchViewUI?: IconButtonToggle;

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
  }

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    const filterClasses = {
      subitem: true,
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
    };

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
      class="${classMap(filterClasses)}"
      @click=${() => this.onFcdaSelect(controlElement, fcdaElement)}
      value="${identity(controlElement)}
             ${identity(fcdaElement)}"
    >
      <span>${getFcdaTitleValue(fcdaElement)}</span>
      <span slot="secondary">${getFcdaSubtitleValue(fcdaElement)}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  updateBaseFilterState(): void {
    if (!this.hideSubscribed) {
      this.controlBlockList!.classList.add('show-subscribed');
    } else {
      this.controlBlockList!.classList.remove('show-subscribed');
    }

    if (!this.hideNotSubscribed) {
      this.controlBlockList!.classList.add('show-not-subscribed');
    } else {
      this.controlBlockList!.classList.remove('show-not-subscribed');
    }
  }

  protected firstUpdated(): void {
    this.actionsMenu.anchor = <HTMLElement>this.actionsMenuIcon;

    this.actionsMenu.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.actionsMenu.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.actionsMenu.index).has(1);
      this.updateBaseFilterState();
    });

    this.updateBaseFilterState();
  }

  renderFCDAListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideSubscribed || this.hideNotSubscribed,
    };
    return html`<h1>
      ${msg(`subscription.${this.controlTag}.controlBlockList.title`)}
      <mwc-icon-button
        class="actions-menu-icon ${classMap(menuClasses)}"
        icon="filter_list"
        @click=${() => {
          if (!this.actionsMenu.open) this.actionsMenu.show();
          else this.actionsMenu.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        multi
        class="actions-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="filter-subscribed"
          left
          ?selected=${!this.hideSubscribed}
        >
          <span>${msg('subscription.subscriber.subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-not-subscribed"
          left
          ?selected=${!this.hideNotSubscribed}
        >
          <span>${msg('subscription.subscriber.notSubscribed')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1> `;
  }

  renderControls(controlElements: Element[]): TemplateResult {
    const filteredListClasses = {
      'control-block-list': true,
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
    };
    return html`<filtered-list
      class="${classMap(filteredListClasses)}"
      activatable
    >
      ${controlElements
        .filter(controlElement => getFcdaElements(controlElement).length)
        .map(controlElement => {
          const fcdaElements = getFcdaElements(controlElement);
          const showSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) !== 0
          );
          const showNotSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) === 0
          );

          const filterClasses = {
            control: true,
            'show-subscribed': showSubscribed,
            'show-not-subscribed': showNotSubscribed,
          };

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
              class="${classMap(filterClasses)}"
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
    </filtered-list>`;
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
        !isSubscribed(extRefElement) &&
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
        <span>${msg('subscription.subscriber.subscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${subscribedExtRefs.length > 0
        ? html`${subscribedExtRefs.map(extRefElement =>
            this.renderExtRefElement(extRefElement)
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${msg('subscription.laterBinding.extRefList.noSubscribedExtRefs')}
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
        <span> ${msg('subscription.subscriber.availableToSubscribe')} </span>
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
            ${msg('subscription.laterBinding.extRefList.noAvailableExtRefs')}
          </mwc-list-item>`}
    `;
  }

  private renderExtRefSubscriberListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideBound || this.hideNotBound,
    };
    return html`<h1>
      ${msg(`subscription.laterBinding.extRefList.title`)}
      <mwc-icon-button
        class="filter-action-menu-icon ${classMap(menuClasses)}"
        title="${msg(`subscription.laterBinding.extRefList.filter`)}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenu.open) this.filterMenu.show();
          else this.filterMenu.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
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
          <span>${msg('subscription.laterBinding.extRefList.bound')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-not-bound"
          left
          ?selected=${!this.hideNotBound}
        >
          <span>${msg('subscription.laterBinding.extRefList.unBound')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        class="settings-action-menu-icon"
        title="${msg(`subscription.laterBinding.extRefList.settings`)}"
        icon="settings"
        @click=${() => {
          if (!this.settingsMenu.open) this.settingsMenu.show();
          else this.settingsMenu.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        multi
        class="settings-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="auto-increment"
          left
          ?selected=${!this.notAutoIncrement}
        >
          <span
            >${msg('subscription.laterBinding.extRefList.autoIncrement')}</span
          >
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

    const subscribed = isSubscribed(extRefElement);

    const filterClasses = {
      extref: true,
      'show-bound': subscribed,
      'show-not-bound': !subscribed,
    };

    if (subscribed) {
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
      class="${classMap(filterClasses)}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined}
      @click=${() => {
        this.currentSelectedExtRefElement = extRefElement;

        if (!subscribed) {
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
        ${subscribed && subscriberFCDA
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
      <mwc-icon slot="graphic">${subscribed ? 'link' : 'link_off'}</mwc-icon>
      ${subscribed && supervisionNode !== undefined
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
        const showSubscribed = extRefs.some(extRef => isSubscribed(extRef));
        const showNotSubscribed = extRefs.some(extRef => !isSubscribed(extRef));
        const filterClasses = {
          ied: true,
          'show-bound': showSubscribed,
          'show-not-bound': showNotSubscribed,
        };
        if (!extRefs.length) return html``;
        return html`
      <mwc-list-item
        class="${classMap(filterClasses)}"
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

  renderControlTypeSelector(): TemplateResult {
    return html`<div>
      <mwc-formfield label="${msg('subscription.select.goose')}">
        <mwc-radio
          class="goose-view"
          name="view"
          value="goose"
          ?checked=${this.controlTag === 'GSEControl'}
          @click=${() => {
            this.controlTag = 'GSEControl';
          }}
        ></mwc-radio>
      </mwc-formfield>
      <mwc-formfield label="${msg('subscription.select.sampledValue')}">
        <mwc-radio
          class="sv-view"
          name="view"
          value="sampled-value"
          ?checked=${this.controlTag === 'SampledValueControl'}
          @click=${() => {
            this.controlTag = 'SampledValueControl';
          }}
        ></mwc-radio>
      </mwc-formfield>
    </div>`;
  }

  renderFCDAs(): TemplateResult {
    const controlElements = this.getControlElements(this.controlTag);
    return html`<section tabindex="0">
      ${this.renderFCDAListTitle()}
      ${controlElements
        ? this.renderControls(controlElements)
        : html`<h3>${msg('subscription.subscriber.notSubscribed')}</h3> `}
    </section>`;
  }

  renderExtRefs(): TemplateResult {
    const filteredListClasses = {
      'extref-list': true,
      'show-bound': !this.hideBound,
      'show-not-bound': !this.hideNotBound,
    };

    return !this.subscriberView
      ? html`<section>
          <h1>${msg(`subscription.laterBinding.extRefList.title`)}</h1>
          ${this.currentSelectedControlElement &&
          this.currentSelectedFcdaElement
            ? html`<filtered-list>
                ${this.renderSubscribedExtRefs()}
                ${this.renderAvailableExtRefs()}
              </filtered-list>`
            : html`<h3>
                ${msg('subscription.laterBinding.extRefList.noSelection')}
              </h3>`}
        </section>`
      : html` <section>
          ${this.renderExtRefSubscriberListTitle()}
          <filtered-list class="${classMap(filteredListClasses)}" activatable
            >${this.renderExtRefsByIED()}</filtered-list
          >
        </section>`;
  }

  render(): TemplateResult {
    return html`<mwc-icon-button-toggle
        id="switchView"
        onIcon="alt_route"
        offIcon="alt_route"
        title="${msg(`subscription.laterBinding.switchControlBlockView`)}"
        @click=${() => this.requestUpdate()}
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

    .actions-menu-icon {
      float: right;
    }

    .actions-menu-icon.filter-off {
      color: var(--secondary);
      background-color: var(--mdc-theme-background);
    }

    /* remove all control blocks if no filters */
    filtered-list.control-block-list:not(.show-subscribed, .show-not-subscribed)
      mwc-list-item {
      display: none;
    }

    /* remove control blocks taking care to respect multiple conditions */
    filtered-list.control-block-list.show-not-subscribed:not(.show-subscribed)
      mwc-list-item.control.show-subscribed:not(.show-not-subscribed) {
      display: none;
    }

    filtered-list.control-block-list.show-subscribed:not(.show-not-subscribed)
      mwc-list-item.control.show-not-subscribed:not(.show-subscribed) {
      display: none;
    }

    /* remove fcdas if not part of filter */
    filtered-list.control-block-list:not(.show-not-subscribed)
      mwc-list-item.subitem.show-not-subscribed {
      display: none;
    }

    filtered-list.control-block-list:not(.show-subscribed)
      mwc-list-item.subitem.show-subscribed {
      display: none;
    }

    .interactive {
      pointer-events: all;
    }

    .subitem {
      padding-left: var(--mdc-list-side-padding, 16px);
    }
  `;
}
