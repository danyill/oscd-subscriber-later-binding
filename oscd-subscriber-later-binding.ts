import {
  css,
  html,
  LitElement,
  nothing,
  PropertyValues,
  SVGTemplateResult,
  TemplateResult,
} from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, queryAll, state } from 'lit/decorators.js';

import '@material/dialog';
import '@material/mwc-button';
import '@material/mwc-list/mwc-check-list-item';
import { Menu } from '@material/mwc-menu';
import { List } from '@material/mwc-list';
import { Icon } from '@material/mwc-icon';

import { styles } from './foundation/styles/styles';
import { identity } from './foundation/identities/identity';
import {
  canRemoveSubscriptionSupervision,
  getExistingSupervision,
  getExtRefElements,
  getFcdaSubtitleValue,
  getFcdaTitleValue,
  getSubscribedExtRefElements,
  instantiateSubscriptionSupervision,
  isSubscribed,
  removeSubscriptionSupervision,
  unsupportedExtRefElement,
  updateExtRefElement,
} from './foundation/subscription/subscription';
import {
  createUpdateEdit,
  getDescriptionAttribute,
  getNameAttribute,
} from './foundation/foundation';
import { gooseIcon, smvIcon } from './foundation/icons';
import {
  ExtRefSelectionChangedEvent,
  FcdaSelectEvent,
  SubscriptionChangedEvent,
} from './foundation/events/events';
import { Remove } from '@openscd/open-scd-core';

const controlTag = 'GSEControl';

type controlTag = 'SampledValueControl' | 'GSEControl';

type iconLookup = Record<controlTag, SVGTemplateResult>;

function translate(name: string): string {
  return name;
}

export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property()
  controlTag: typeof controlTag = 'GSEControl'; // eventually parameterise
  @property()
  includeLaterBinding!: boolean;
  @property({ attribute: true })
  subscriberview!: boolean;

  @state()
  private extRefCounters = new Map();

  @property({ type: Boolean })
  get hideSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${
          this.includeLaterBinding ? 'later-binding' : 'data-binding'
        }-${this.controlTag}$hideSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideSubscribed(value: boolean) {
    const oldValue = this.hideSubscribed;
    localStorage.setItem(
      `fcda-binding-list-${
        this.includeLaterBinding ? 'later-binding' : 'data-binding'
      }-${this.controlTag}$hideSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideSubscribed', oldValue);
  }

  @property({ type: Boolean })
  get hideNotSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${
          this.includeLaterBinding ? 'later-binding' : 'data-binding'
        }-${this.controlTag}$hideNotSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideNotSubscribed(value: boolean) {
    const oldValue = this.hideNotSubscribed;
    localStorage.setItem(
      `fcda-binding-list-${
        this.includeLaterBinding ? 'later-binding' : 'data-binding'
      }-${this.controlTag}$hideNotSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideNotSubscribed', oldValue);
  }

  @query('.actions-menu') actionsMenu!: Menu;
  @query('.actions-menu-icon') actionsMenuIcon!: Icon;
  @query('.control-block-list') controlBlockList!: List;
  // The selected elements when a FCDA Line is clicked.
  private selectedControlElement: Element | undefined;
  private selectedFcdaElement: Element | undefined;
  private selectedExtRefElement: Element | undefined;

  private iconControlLookup: iconLookup = {
    SampledValueControl: smvIcon,
    GSEControl: gooseIcon,
  };

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
    parent.addEventListener('open-doc', this.resetSelection);

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

  private getControlElements(): Element[] {
    if (this.doc) {
      return Array.from(this.doc.querySelectorAll(`LN0 > ${this.controlTag}`));
    }
    return [];
  }

  private getFcdaElements(controlElement: Element): Element[] {
    const lnElement = controlElement.parentElement;
    if (lnElement) {
      return Array.from(
        lnElement.querySelectorAll(
          `:scope > DataSet[name=${controlElement.getAttribute(
            'datSet'
          )}] > FCDA`
        )
      );
    }
    return [];
  }

  private resetExtRefCount(event: SubscriptionChangedEvent): void {
    //   if (!this.subscriberview) {
    //     this.resetSelection();
    //   }
    //   if (event.detail.control && event.detail.fcda) {
    //     const controlBlockFcdaId = `${identity(event.detail.control)} ${identity(
    //       event.detail.fcda
    //     )}`;
    //     this.extRefCounters.delete(controlBlockFcdaId);
    //   }
  }

  private updateExtRefSelection(event: ExtRefSelectionChangedEvent): void {
    //   if (event.detail.extRefElement) {
    //     this.selectedExtRefElement = event.detail.extRefElement;
    //     this.requestUpdate();
    //   }
  }

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
        this.includeLaterBinding
      ).length;
      this.extRefCounters.set(controlBlockFcdaId, extRefCount);
    }
    return this.extRefCounters.get(controlBlockFcdaId);
  }

  private openEditWizard(controlElement: Element): void {
    // const wizard = wizards[this.controlTag].edit(controlElement);
    // if (wizard) this.dispatchEvent(newWizardEvent(wizard));
  }

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
      ?disabled=${this.subscriberview &&
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
    !this.hideSubscribed
      ? this.controlBlockList!.classList.add('show-subscribed')
      : this.controlBlockList!.classList.remove('show-subscribed');
    !this.hideNotSubscribed
      ? this.controlBlockList!.classList.add('show-not-subscribed')
      : this.controlBlockList!.classList.remove('show-not-subscribed');
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
      ${translate(`subscription.${this.controlTag}.controlBlockList.title`)}
      ${!this.subscriberview && this.includeLaterBinding
        ? html`<mwc-icon-button
            class="switch-view"
            icon="alt_route"
            title="${translate(
              `subscription.laterBinding.switchControlBlockView`
            )}"
            @click=${() =>
              this.dispatchEvent(
                new Event('change-view', { bubbles: true, composed: true })
              )}
          ></mwc-icon-button>`
        : nothing}
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
          <span>${translate('subscription.subscriber.subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-not-subscribed"
          left
          ?selected=${!this.hideNotSubscribed}
        >
          <span>${translate('subscription.subscriber.notSubscribed')}</span>
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
        .filter(controlElement => this.getFcdaElements(controlElement).length)
        .map(controlElement => {
          const fcdaElements = this.getFcdaElements(controlElement);
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
              <mwc-icon-button
                slot="meta"
                icon="edit"
                class="interactive"
                @click=${() => this.openEditWizard(controlElement)}
              ></mwc-icon-button>
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

  private async onFcdaSelectEvent(event: FcdaSelectEvent) {
    this.currentSelectedControlElement = event.detail.control;
    this.currentSelectedFcdaElement = event.detail.fcda;

    // Retrieve the IED Element to which the FCDA belongs.
    // These ExtRef Elements will be excluded.
    this.currentIedElement = this.currentSelectedFcdaElement
      ? this.currentSelectedFcdaElement.closest('IED') ?? undefined
      : undefined;
  }

  /**
   * Unsubscribing means removing a list of attributes from the ExtRef Element.
   *
   * @param extRef - The Ext Ref Element to clean from attributes.
   */
  private unsubscribe(extRef: Element): void {
    const updateAction = createUpdateEdit(extRef, {
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
    // const removeSubscriptionActions: Delete[] = [];
    const removeSubscriptionEdits: Remove[] = [];

    if (canRemoveSubscriptionSupervision(extRef))
      // removeSubscriptionActions.push(
      //   ...removeSubscriptionSupervision(
      //     this.currentSelectedControlElement,
      //     subscriberIed
      //   )
      // );
      removeSubscriptionEdits.push(
        ...removeSubscriptionSupervision(
          this.currentSelectedControlElement,
          subscriberIed
        )
      );

    // this.dispatchEvent(
    //   newActionEvent({
    //     title: get(`subscription.disconnect`),
    //     actions: [updateAction, ...removeSubscriptionActions],
    //   })
    // );

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

    const updateAction = updateExtRefElement(
      extRef,
      this.currentSelectedControlElement,
      this.currentSelectedFcdaElement
    );

    const subscriberIed = extRef.closest('IED') || undefined;

    const supervisionActions = instantiateSubscriptionSupervision(
      this.currentSelectedControlElement,
      subscriberIed
    );

    // this.dispatchEvent(
    //   newActionEvent({
    //     title: get(`subscription.connect`),
    //     actions: [updateAction, ...supervisionActions],
    //   })
    // );
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

  private renderExtRefListTitle(): TemplateResult {
    return html`<h1>
      ${translate(`subscription.laterBinding.extRefList.title`)}
    </h1>`;
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
              getDescriptionAttribute(extRefElement) +
              ' ' +
              identity(extRefElement)
          )
          .join(' ')}"
      >
        <span>${translate('subscription.subscriber.subscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${subscribedExtRefs.length > 0
        ? html`${subscribedExtRefs.map(extRefElement =>
            this.renderExtRefElement(extRefElement)
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${translate(
              'subscription.laterBinding.extRefList.noSubscribedExtRefs'
            )}
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
              getDescriptionAttribute(extRefElement) +
              ' ' +
              identity(extRefElement)
          )
          .join(' ')}"
      >
        <span>
          ${translate('subscription.subscriber.availableToSubscribe')}
        </span>
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
            ${translate(
              'subscription.laterBinding.extRefList.noAvailableExtRefs'
            )}
          </mwc-list-item>`}
    `;
  }

  render(): TemplateResult {
    const controlElements = this.getControlElements();
    return html`<div class="container">
      <section tabindex="0">
        ${this.renderFCDAListTitle()}
        ${controlElements
          ? this.renderControls(controlElements)
          : html`<h3>
              ${translate('subscription.subscriber.notSubscribed')}
            </h3> `}
      </section>
      <section tabindex="0">
        ${this.renderExtRefListTitle()}
        ${this.currentSelectedControlElement && this.currentSelectedFcdaElement
          ? html`<filtered-list>
              ${this.renderSubscribedExtRefs()} ${this.renderAvailableExtRefs()}
            </filtered-list>`
          : html`<h3>
              ${translate('subscription.laterBinding.extRefList.noSelection')}
            </h3>`}
      </section>
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

    .container:not(subscriberview) {
      flex-direction: row;
    }

    .container[subscriberview] {
      width: 100%;
      flex-direction: row-reverse;
    }

    .container[subscriberview] fcda-binding-list.column {
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
      .container[subscriberview] {
        width: calc(100vw - 20px);
        flex: auto;
      }

      .container[subscriberview] extref-later-binding-list-subscriber.column {
        resize: horizontal;
        width: 65%;
        flex: none;
      }

      .container[subscriberview] fcda-binding-list.column {
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
