// TODO: This file is rather long... and doesn't feel modular or well-abstracted. But how best to fix?
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
import type { SelectedDetail, SingleSelectedEvent } from '@material/mwc-list';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import { ListItemBase } from '@material/mwc-list/mwc-list-item-base.js';
import type { Menu } from '@material/mwc-menu';

import { styles } from './foundation/styles/styles.js';
import { identity } from './foundation/identities/identity.js';
import {
  canRemoveSubscriptionSupervision,
  findControlBlock,
  findFCDA,
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

  @query('#listContainer')
  listContainerUI!: HTMLDivElement;

  @query('#settingsExtRefMenu')
  settingsMenuExtRefUI!: Menu;

  @query('#settingsExtRefIcon')
  settingsMenuExtRefButtonUI!: Icon;

  @query('#fcda-list')
  fcdaListUI!: OscdFilteredList;

  @query('#publisherExtRefList')
  extRefListPublisherUI?: OscdFilteredList;

  @query('#publisherExtRefSection')
  publisherExtRefSectionUI?: HTMLElement;

  // TODO: Do we actually use this?
  @query('#subscriberExtRefList')
  extRefListSubscriberUI?: OscdFilteredList;

  @query('#subscriberExtRefList mwc-list-item[selected]')
  extRefListSubscriberSelectedUI?: ListItem;

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

  @state()
  currentSelectedExtRefElement: Element | undefined;

  serviceTypeLookup = {
    GSEControl: 'GOOSE',
    SampledValueControl: 'SMV',
  };

  private getControlElements(controlTag: controlTagType): Element[] {
    if (this.doc) {
      return Array.from(this.doc.querySelectorAll(`LN0 > ${controlTag}`));
    }
    return [];
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
    this.currentSelectedControlElement = undefined;
    this.currentSelectedFcdaElement = undefined;
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When a new document is loaded we will reset the Map to clear old entries.
    if (_changedProperties.has('doc')) {
      this.extRefCounters = new Map();
      this.currentSelectedControlElement = undefined;
      this.currentSelectedFcdaElement = undefined;
      this.currentSelectedExtRefElement = undefined;
    }

    // TODO: If the same document is opened how do I force a change in core?
  }

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
      serviceType: null, // TODO: Should this be retained on unsubscribe?
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

    let controlBlockElement;
    let fcdaElement;
    if (this.subscriberView) {
      controlBlockElement = findControlBlock(extRef);
      fcdaElement = findFCDA(extRef, controlBlockElement);
    } else {
      controlBlockElement = this.currentSelectedControlElement;
      fcdaElement = this.currentSelectedFcdaElement!;
    }

    if (controlBlockElement && fcdaElement) {
      const controlBlockFcdaId = `${identity(controlBlockElement!)} ${identity(
        fcdaElement
      )}`;
      this.extRefCounters.delete(controlBlockFcdaId);
    }

    this.dispatchEvent(newEditEvent(updateEdit));
  }

  /**
   * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
   *
   * @param extRef - The ExtRef Element to add the attributes to.
   */
  private subscribe(extRef: Element): void {
    if (
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

    const controlBlockFcdaId = `${identity(
      this.currentSelectedControlElement
    )} ${identity(this.currentSelectedFcdaElement)}`;
    this.extRefCounters.delete(controlBlockFcdaId);
  }

  public getSubscribedExtRefElements(): Element[] {
    return getSubscribedExtRefElements(
      <Element>this.doc.getRootNode(),
      this.controlTag,
      this.currentSelectedFcdaElement,
      this.currentSelectedControlElement,
      true
    );
  }

  public getAvailableExtRefElements(): Element[] {
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
        extRefElement.hasAttribute('intAddr') &&
        ((!extRefElement.hasAttribute('serviceType') &&
          !extRefElement.hasAttribute('pServT')) ||
          extRefElement.getAttribute('serviceType') ===
            this.serviceTypeLookup[controlTag] ||
          extRefElement.getAttribute('pServT') ===
            this.serviceTypeLookup[controlTag])
    );
  }

  private getCachedSupervision(extRefElement: Element): Element | undefined {
    const cbRefKey = getCbReference(extRefElement);
    return this.supervisionData.get(cbRefKey);
  }

  private updateExtRefFilter(): void {
    const filterClassList = this.extRefListSubscriberUI!.classList;
    // Update filter CSS rules
    // TODO: Should I disable the following rule -- compare each filter implementation
    // eslint-disable-next-line no-unused-expressions
    !this.hideBound
      ? filterClassList.add('show-bound')
      : filterClassList.remove('show-bound');

    // eslint-disable-next-line no-unused-expressions
    !this.hideNotBound
      ? filterClassList.add('show-not-bound')
      : filterClassList.remove('show-not-bound');
  }

  private updateFcdaFilter(): void {
    // Update filter CSS rules
    if (!this.hideSubscribed) {
      this.fcdaListUI!.classList.add('show-subscribed');
    } else {
      this.fcdaListUI!.classList.remove('show-subscribed');
    }

    if (!this.hideNotSubscribed) {
      this.fcdaListUI!.classList.add('show-not-subscribed');
    } else {
      this.fcdaListUI!.classList.remove('show-not-subscribed');
    }
  }

  private updateView(): void {
    if (this.subscriberView) {
      this.listContainerUI.classList.add('subscriber-view');
      this.filterMenuExtRefUI.anchor = <HTMLElement>(
        this.filterMenuExtRefButtonUI
      );

      this.settingsMenuExtRefUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefButtonUI
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
        this.updateExtRefFilter();
        // TODO: Filtering is still calling render for the ExtRefs -- Likely
        // because of the changing in CSS styling. Very like should use a
        // mwc-icon-button-toggle
      });
    } else {
      this.listContainerUI.classList.remove('subscriber-view');
    }
  }

  protected firstUpdated(): void {
    this.filterMenuFcdaUI.anchor = <HTMLElement>this.filterMenuFcdaButtonUI;

    this.filterMenuFcdaUI.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(
        1
      );
      this.updateFcdaFilter();
    });

    this.updateView();
  }

  // TODO: Ask Christian if this is a great crime?
  // eslint-disable-next-line class-methods-use-this
  private renderSubscribedExtRefElement(
    extRefElement: Element
  ): TemplateResult {
    const supervisionNode = getExistingSupervision(extRefElement);
    return html` <mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      twoline
      class="extref"
      value="${identity(extRefElement)}"
      data-extref="${identity(extRefElement)}"
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

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    const filterClasses = {
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
    };

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${this.subscriberView &&
      unsupportedExtRefElement(
        this.currentSelectedExtRefElement,
        fcdaElement,
        controlElement
      )}
      twoline
      class="fcda ${classMap(filterClasses)}"
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
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
    };

    return html`<oscd-filtered-list
      id="fcda-list"
      ?activatable=${!this.subscriberView}
      class="${classMap(filteredListClasses)}"
      @selected="${(ev: SingleSelectedEvent) => {
        console.log('fcda selected');
        const selectedListItem = (<ListItemBase>(
          (<OscdFilteredList>ev.target).selected
        ))!;
        if (!selectedListItem) return;

        const { control, fcda } = (<ListItem>selectedListItem).dataset;
        this.currentSelectedControlElement =
          this.doc.querySelector(
            selector(this.controlTag, control ?? 'Unknown')
          ) ?? undefined;
        this.currentSelectedFcdaElement =
          this.doc.querySelector(selector('FCDA', fcda ?? 'Unknown')) ??
          undefined;

        if (
          this.subscriberView &&
          this.currentSelectedControlElement &&
          this.currentSelectedFcdaElement &&
          this.currentSelectedExtRefElement
        ) {
          this.subscribe(this.currentSelectedExtRefElement);
          this.currentSelectedExtRefElement = undefined;

          // if incrementing, click on next ExtRef list item
          if (this.extRefListSubscriberSelectedUI && !this.notAutoIncrement) {
            const nextActivatableItem = <ListItem>(
              this.extRefListSubscriberUI!.querySelector(
                'mwc-list-item[activated].extref ~ mwc-list-item.extref'
              )
            );
            const { extref } = (<ListItem>nextActivatableItem).dataset;
            const nextExtRef =
              this.doc.querySelector(selector('ExtRef', extref ?? 'Unknown')) ??
              undefined;

            if (nextActivatableItem && nextExtRef && !isBound(nextExtRef)) {
              nextActivatableItem.click();
            } else {
              // next ExtRef is already bound, deselect
              this.extRefListSubscriberSelectedUI.selected = false;
              this.extRefListSubscriberSelectedUI.activated = false;
            }
          }

          // deselect
          if (this.extRefListSubscriberSelectedUI && this.notAutoIncrement) {
            this.extRefListSubscriberSelectedUI.selected = false;
            this.extRefListSubscriberSelectedUI.activated = false;
          }

          // deselect FCDA
          selectedListItem!.selected = false;
          selectedListItem!.activated = false;

          // remove state
          this.currentSelectedControlElement = undefined;
          this.currentSelectedFcdaElement = undefined;

          this.requestUpdate();
        }
      }}"
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

          const filterClasses = {
            'show-subscribed': someSubscribed,
            'show-not-subscribed': someNotSubscribed,
          };

          return html`
            <mwc-list-item
              noninteractive
              class="control ${classMap(filterClasses)}"
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

  private renderPublisherViewSubscribedExtRefs(): TemplateResult {
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
            this.renderSubscribedExtRefElement(extRefElement)
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${msg('No subscribed inputs')}
          </mwc-list-item>`}
    `;
  }

  private renderPublisherViewAvailableExtRefs(): TemplateResult {
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
              class="extref"
              data-extref="${identity(extRefElement)}"
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

  private renderSubscriberViewExtRefListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideBound || this.hideNotBound,
    };
    return html`<h1 class="subscriber-title">
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

  private renderSubscriberViewExtRef(extRefElement: Element): TemplateResult {
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

    const filterClasses = {
      'show-bound': bound,
      'show-not-bound': !bound,
    };

    return html`<mwc-list-item
      twoline
      class="extref ${classMap(filterClasses)}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined}
      data-extref="${identity(extRefElement)}"
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

  private renderSubscriberViewExtRefs(): TemplateResult {
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

        const filterClasses = {
          control: true,
          'show-bound': someBound,
          'show-not-bound': someNotBound,
        };

        return html`
      <mwc-list-item
      class="ied ${classMap(filterClasses)}"
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
            extRef => this.renderSubscriberViewExtRef(extRef)
          )} 
          </mwc-list-item>`;
      }
    )}`;
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
            ? html`<oscd-filtered-list
                id="publisherExtRefList"
                @selected=${(ev: SingleSelectedEvent) => {
                  console.log('extref publisher view selected');
                  const selectedListItem = (<OscdFilteredList>ev.target)
                    .selected;
                  if (!selectedListItem) return;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const { extref } = (<any>selectedListItem).dataset;
                  // TODO: The selector function does not work correctly when there are multiple ExtRefs with the
                  // same desc and intAddr. Alas. It should index them correctly.
                  const selectedExtRefElement = this.doc.querySelector(
                    selector('ExtRef', extref)
                  );
                  if (!selectedExtRefElement) return;
                  if (isBound(selectedExtRefElement)) {
                    this.unsubscribe(selectedExtRefElement);
                  } else {
                    this.subscribe(selectedExtRefElement!);
                    // can be subscribed if the right conditions are there
                  }
                  (<ListItem>selectedListItem).selected = false;
                  // TODO: Should this be scoped more tightly?
                  this.requestUpdate();
                }}
              >
                ${this.renderPublisherViewSubscribedExtRefs()}
                ${this.renderPublisherViewAvailableExtRefs()}
              </oscd-filtered-list>`
            : html`<h3>${msg('No published item selected')}</h3>`}
        </section>`
      : html` <section class="column">
          ${this.renderSubscriberViewExtRefListTitle()}
          <oscd-filtered-list
            id="subscriberExtRefList"
            class="${classMap(filteredListClasses)}"
            activatable
            @selected=${(ev: SingleSelectedEvent) => {
              console.log('extref subscriber view selected');
              const selectedListItem = (<ListItemBase>(
                (<OscdFilteredList>ev.target).selected
              ))!;
              if (!selectedListItem) return;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { extref } = selectedListItem.dataset;
              const selectedExtRefElement = <Element>(
                this.doc.querySelector(selector('ExtRef', extref ?? 'Unknown'))
              );
              if (!selectedExtRefElement) return;
              if (isBound(selectedExtRefElement)) {
                this.unsubscribe(selectedExtRefElement);
                // this.currentSelectedExtRefElement = undefined;
                // TODO: Type definitions appear a bit broken??
                const index = <number>(<SelectedDetail>ev.detail).index;

                selectedListItem!.selected = false;
                selectedListItem!.activated = false;
                this.extRefListSubscriberUI?.toggle(index, false);
                this.extRefListSubscriberUI?.layout(true);
              } else {
                this.currentSelectedExtRefElement = selectedExtRefElement;
              }
              // TODO: Should this be scoped more tightly?
              this.requestUpdate();
            }}
            >${this.renderSubscriberViewExtRefs()}</oscd-filtered-list
          >
        </section>`;
  }

  renderPublisherFCDAs(): TemplateResult {
    const controlElements = this.getControlElements(this.controlTag);
    return html`<section class="column fcda">
      ${this.renderFCDAListTitle()}
      ${controlElements
        ? this.renderControlList(controlElements)
        : html`<h3>${msg('Not Subscribed')}</h3> `}
    </section>`;
  }

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

  // TODO: SwitchView shouldn't be fixed but should the header be sticky?
  render(): TemplateResult {
    console.log('render called');
    return html`<mwc-icon-button-toggle
        id="switchView"
        onIcon="alt_route"
        offIcon="alt_route"
        title="${msg('Alternate between Publisher and Subscriber view')}"
        @click=${async () => {
          this.fcdaListUI.items.forEach(item => {
            // TODO: Should this rule be generally disabled, ask ca-d
            // eslint-disable-next-line no-param-reassign
            item.activated = false;
            // eslint-disable-next-line no-param-reassign
            item.selected = false;
          });
          this.currentSelectedControlElement = undefined;
          this.currentSelectedFcdaElement = undefined;
          this.requestUpdate();
          await this.updateComplete;
          this.updateView();
        }}
      ></mwc-icon-button-toggle>
      ${this.renderControlTypeSelector()}
      <div id="listContainer">
        ${this.renderPublisherFCDAs()}${this.renderExtRefs()}
      </div>`;
  }

  static styles = css`
    ${styles}

    :host {
      width: 100vw;
      display: flex;
    }

    #listContainer {
      width: 100%;
      display: flex;
      padding: 8px 6px 16px;
      height: calc(100vh - 136px);
    }

    #listContainer:not(.subscriber-view) {
      flex-direction: row;
    }

    #listContainer.subscriber-view {
      width: 100%;
      flex-direction: row-reverse;
    }

    #listContainer.subscriber-view .column.fcda {
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
      #listContainer.subscriber-view {
        /* width: calc(100vw - 20px); */
        flex: auto;
      }

      #listContainer.subscriber-view .column {
        resize: horizontal;
        width: 65%;
        flex: none;
      }

      #listContainer.subscriber-view .column.fcda {
        width: auto;
      }
    }

    /* TODO: Need to properly apply rule to h1 for publisher, but how best to do this? */
    #listContainer section.fcda h1,
    .subscriber-title {
      padding-left: 48px;
    }

    h3 {
      margin: 4px 8px 16px;
    }

    .fcda,
    .extref {
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

    .interactive {
      pointer-events: all;
    }

    /* Filtering rules for control blocks end up implementing logic to allow
    very fast CSS response. The following rules appear to be minimal but can be
    hard to understand intuitively for the multiple conditions. If modifying,
    it is suggested to create a truth-table to check for side-effects */

    /* remove all control blocks if no filters */
    #control-block-list:not(.show-subscribed, .show-not-subscribed)
      mwc-list-item {
      display: none;
    }

    /* remove control blocks taking care to respect multiple conditions */
    #control-block-list.show-not-subscribed:not(.show-subscribed)
      mwc-list-item.control.show-subscribed:not(.show-not-subscribed) {
      display: none;
    }

    #control-block-list.show-subscribed:not(.show-not-subscribed)
      mwc-list-item.control.show-not-subscribed:not(.show-subscribed) {
      display: none;
    }

    /* remove fcdas if not part of filter */
    #control-block-list:not(.show-not-subscribed)
      mwc-list-item.fcda.show-not-subscribed {
      display: none;
    }

    #control-block-list:not(.show-subscribed)
      mwc-list-item.fcda.show-subscribed {
      display: none;
    }

    /* Filtering rules for ExtRefs end up implementing logic to allow
    very fast CSS response. The following rules appear to be minimal but can be
    hard to understand intuitively for the multiple conditions. If modifying,
    it is suggested to create a truth-table to check for side-effects */

    /* remove all ExtRefs if no filters */
    #subscriberExtRefList:not(.show-bound, .show-not-bound) mwc-list-item {
      display: none;
    }

    /* remove ExtRefs taking care to respect multiple conditions */
    #subscriberExtRefList.show-not-bound:not(.show-bound)
      mwc-list-item.ied.show-bound:not(.show-not-bound) {
      display: none;
    }

    #subscriberExtRefList.show-bound:not(.show-not-bound)
      mwc-list-item.ied.show-not-bound:not(.show-bound) {
      display: none;
    }

    /* remove ExtRefs if not part of filter */
    #subscriberExtRefList:not(.show-not-bound)
      mwc-list-item.extref.show-not-bound {
      display: none;
    }

    #subscriberExtRefList:not(.show-bound) mwc-list-item.extref.show-bound {
      display: none;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    /* required for anchors */
    section {
      position: relative;
    }

    #switchView {
      position: fixed;
      left: 24px;
      top: 120px;
      /* TODO: How best to fix, pointer-events is not sufficient here? */
      pointer-events: all;
      z-index: 1000;
    }

    #switchControlType {
      position: fixed;
      left: 300;
      top: 70;
    }
  `;
}
