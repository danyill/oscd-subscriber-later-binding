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

import '@material/mwc-icon';
import '@material/mwc-icon-button-toggle';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-menu';

import { Edit, newEditEvent } from '@openscd/open-scd-core';

import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { SingleSelectedEvent } from '@material/mwc-list';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { ListItemBase } from '@material/mwc-list/mwc-list-item-base.js';
import type { Menu } from '@material/mwc-menu';
import type { OscdFilteredList } from '@openscd/oscd-filtered-list';

import { identity } from './foundation/identities/identity.js';
import {
  canRemoveSubscriptionSupervision,
  fcdaSpecification,
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
  inputRestriction,
  instantiateSubscriptionSupervision,
  isPartiallyConfigured,
  isSubscribed,
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
  gooseIcon,
  smvIcon,
  gooseActionIcon,
  smvActionIcon,
} from './foundation/icons.js';

import { selector } from './foundation/identities/selector.js';

type controlTagType = 'SampledValueControl' | 'GSEControl';

type iconLookup = Record<controlTagType, SVGTemplateResult>;

const iconControlLookup: iconLookup = {
  SampledValueControl: smvIcon,
  GSEControl: gooseIcon,
};

const serviceTypeLookup = {
  GSEControl: 'GOOSE',
  SampledValueControl: 'SMV',
};

type StoredConfiguration = {
  subscriberView: boolean;
  controlTag: controlTagType;
  hideSubscribed: boolean;
  hideNotSubscribed: boolean;
  hideDisabled: boolean;
  notAutoIncrement: boolean;
  hideBound: boolean;
  hideNotBound: boolean;
  strictServiceTypes: boolean;
};

const storedProperties: string[] = [
  'subscriberView',
  'controlTag',
  'hideSubscribed',
  'hideNotSubscribed',
  'hideDisabled',
  'notAutoIncrement',
  'hideBound',
  'hideNotBound',
  'strictServiceTypes',
];

function trimIdentityParent(idString: string): string {
  return idString.split('>').slice(1).join('>').trim().slice(1);
}

function extRefPath(extRef: Element): string {
  if (!extRef) return 'Unknown';
  const lN = extRef.closest('LN') ?? extRef.closest('LN0');
  const lDevice = lN!.closest('LDevice');

  const ldInst = lDevice?.getAttribute('inst');
  const lnPrefix = lN?.getAttribute('prefix');
  const lnClass = lN?.getAttribute('lnClass');
  const lnInst = lN?.getAttribute('inst');

  return [ldInst, '/', lnPrefix, lnClass, lnInst].filter(a => !!a).join(' ');
}

// TODO: This needs careful review!
function getFcdaInstDesc(fcda: Element, includeDai: boolean): string[] {
  const [doName, daName] = ['doName', 'daName'].map(attr =>
    fcda.getAttribute(attr)
  );

  const ied = fcda.closest('IED');

  const anyLn = Array.from(
    ied?.querySelectorAll(
      `LDevice[inst="${fcda.getAttribute(
        'ldInst'
      )}"] > LN, LDevice[inst="${fcda.getAttribute('ldInst')}"] LN0`
    ) ?? []
  ).find(
    lN =>
      (lN.getAttribute('prefix') ?? '') ===
        (fcda.getAttribute('prefix') ?? '') &&
      (lN.getAttribute('lnClass') ?? '') ===
        (fcda.getAttribute('lnClass') ?? '') &&
      (lN.getAttribute('inst') ?? '') === (fcda.getAttribute('lnInst') ?? '')
  );

  if (!anyLn) return [];

  const descs: (string | null | undefined)[] = [];

  descs.push(anyLn.closest('LDevice')?.getAttribute('desc'));
  descs.push(anyLn.getAttribute('desc'));

  const doNames = doName!.split('.');

  const doi = anyLn.querySelector(`DOI[name="${doNames[0]}"`);

  if (!doi) return descs.filter(d => d !== null && d !== undefined) as string[];

  descs.push(doi?.getAttribute('desc'));

  let previousDI: Element = doi;
  doNames.slice(1).forEach(sdiName => {
    const sdi = previousDI.querySelector(`SDI[name="${sdiName}"]`);
    if (sdi) previousDI = sdi;
    descs.push(sdi?.getAttribute('desc'));
  });

  if (!includeDai || !daName)
    return descs.filter(d => d !== null && d !== undefined) as string[];

  const daNames = daName?.split('.');
  const dai = previousDI.querySelector(`DAI[name="${daNames[0]}"]`);
  descs.push(dai?.getAttribute('desc'));

  return descs.filter(d => d !== null && d !== undefined) as string[];
}

function getLnTitle(childElement: Element): string {
  if (!childElement) return 'Unknown';
  const lN = childElement.closest('LN') ?? childElement.closest('LN0');
  const lDevice = lN!.closest('LDevice');

  const ldInst = lDevice?.getAttribute('inst');
  const lnPrefix = lN?.getAttribute('prefix');
  const lnClass = lN?.getAttribute('lnClass');
  const lnInst = lN?.getAttribute('inst');

  return [ldInst, '/', lnPrefix, lnClass, lnInst]
    .filter(a => a !== null)
    .join(' ');
}

export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property() docName!: string;

  @property() editCount!: number;

  @property()
  controlTag: controlTagType = 'SampledValueControl';

  // getters and setters are onelines and firstUpdated reads from
  //  localstorage and updates all the UI elements.
  // in the setter we change the state and write back to local storage.
  @property({ type: Boolean })
  subscriberView!: boolean;

  @property({ type: Boolean })
  hideSubscribed!: boolean;

  @property({ type: Boolean })
  hideNotSubscribed!: boolean;

  @property({ type: Boolean })
  hideDisabled!: boolean;

  @property({ type: Boolean })
  notAutoIncrement!: boolean;

  @property({ type: Boolean })
  hideBound!: boolean;

  @property({ type: Boolean })
  hideNotBound!: boolean;

  @property({ type: Boolean })
  strictServiceTypes!: boolean;

  @query('#switchView')
  switchViewUI?: IconButtonToggle;

  @query('#switchControlType')
  switchControlTypeUI?: IconButtonToggle;

  @query('#filterFcdaMenu')
  filterMenuFcdaUI!: Menu;

  @query('#filterFcdaIcon')
  filterMenuFcdaButtonUI!: Icon;

  @query('#filterExtRefMenu')
  filterMenuExtRefUI!: Menu;

  @query('#filterExtRefMenuPublisher')
  filterMenuExtRefPublisherUI!: Menu;

  @query('#filterExtRefIcon')
  filterMenuExtRefButtonUI!: Icon;

  @query('#filterExtRefPublisherIcon')
  filterMenuExtrefPublisherButtonUI!: Icon;

  @query('#listContainer')
  listContainerUI!: HTMLDivElement;

  @query('#settingsExtRefMenu')
  settingsMenuExtRefUI!: Menu;

  @query('#settingsExtRefIcon')
  settingsMenuExtRefButtonUI!: Icon;

  @query('#fcdaList')
  fcdaListUI!: OscdFilteredList;

  @query('#publisherExtRefList')
  extRefListPublisherUI?: OscdFilteredList;

  @query('#publisherExtRefSection')
  publisherExtRefSectionUI?: HTMLElement;

  @query('#subscriberExtRefList')
  extRefListSubscriberUI?: OscdFilteredList;

  @query('#subscriberExtRefList mwc-list-item[selected]')
  extRefListSubscriberSelectedUI?: ListItem;

  @query('#fcdaList mwc-list-item[selected]')
  fcdaListSelectedUI?: ListItem;

  @state()
  private extRefCounters = new Map();

  @state()
  currentSelectedControlElement: Element | undefined;

  @state()
  currentSelectedFcdaElement: Element | undefined;

  @state()
  currentIedElement: Element | undefined;

  @state()
  currentSelectedExtRefElement: Element | undefined;

  @state()
  private supervisionData = new Map();

  // constructor() {
  //   super();
  //   this.restoreSettings();
  // }

  protected storeSettings(): void {
    const storedConfiguration = {
      subscriberView: this.switchViewUI?.on ?? false,
      controlTag: this.switchControlTypeUI?.on
        ? 'GSEControl'
        : 'SampledValueControl',
      hideSubscribed: this.hideSubscribed,
      hideNotSubscribed: this.hideNotSubscribed,
      hideDisabled: this.hideDisabled,
      notAutoIncrement: this.notAutoIncrement,
      hideBound: this.hideBound,
      hideNotBound: this.hideNotBound,
      strictServiceTypes: this.strictServiceTypes,
    };

    localStorage.setItem(
      'subscriber-later-binding',
      JSON.stringify(storedConfiguration)
    );
  }

  protected restoreSettings(): void {
    const storedSettings = localStorage.getItem('subscriber-later-binding');
    const storedConfiguration: StoredConfiguration = storedSettings
      ? JSON.parse(storedSettings)
      : undefined;

    this.subscriberView = storedConfiguration?.subscriberView ?? false;
    this.switchViewUI!.on = this.subscriberView;

    this.controlTag = storedConfiguration?.controlTag ?? 'GSEControl';
    this.switchControlTypeUI!.on = this.controlTag === 'GSEControl';

    this.hideSubscribed = storedConfiguration?.hideSubscribed || false;
    this.hideNotSubscribed = storedConfiguration?.hideNotSubscribed || false;
    this.hideDisabled = storedConfiguration?.hideDisabled || false;

    this.notAutoIncrement = storedConfiguration?.notAutoIncrement ?? false;

    this.hideBound = storedConfiguration?.hideBound ?? false;
    this.hideNotBound = storedConfiguration?.hideNotBound ?? false;
    this.strictServiceTypes = storedConfiguration?.strictServiceTypes ?? false;
  }

  private getControlElements(controlTag: controlTagType): Element[] {
    if (this.doc) {
      return Array.from(
        this.doc.querySelectorAll(`LN0 > ${controlTag}`)
      ).filter(
        control =>
          !this.subscriberView ||
          !this.currentSelectedExtRefElement ||
          control.closest('IED') !==
            this.currentSelectedExtRefElement?.closest('IED')
      );
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

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When a new document is loaded or we do a subscription/we will reset the Map to clear old entries.
    // TODO: Is this too broadly scoped?
    if (_changedProperties.has('doc')) {
      this.extRefCounters = new Map();
      this.currentSelectedControlElement = undefined;
      this.currentSelectedFcdaElement = undefined;
      this.currentSelectedExtRefElement = undefined;

      // reset supervision cache
      this.reCreateSupervisionCache();

      // deselect in UI
      if (this.extRefListSubscriberSelectedUI) {
        this.extRefListSubscriberSelectedUI.selected = false;
        this.extRefListSubscriberSelectedUI.activated = false;
      }

      if (this.fcdaListSelectedUI) {
        this.fcdaListSelectedUI.selected = false;
        this.fcdaListSelectedUI.activated = false;
      }

      this.updateView();
      // force CSS refresh to remove selected/activated indication
      this.requestUpdate();
    }

    const settingsUpdateRequired = Array.from(_changedProperties.keys()).some(
      r => storedProperties.includes(r.toString())
    );
    if (settingsUpdateRequired) this.storeSettings();

    // TODO: If the same document is opened how do I force a change
    // See: https://github.com/openscd/open-scd-core/issues/92
  }

  /**
   * Unsubscribing means removing a list of attributes from the ExtRef Element.
   *
   * @param extRef - The Ext Ref Element to clean from attributes.
   */
  private unsubscribe(extRef: Element): void {
    const editActions: Edit[] = [];

    // TODO: Fix up for new core update API
    editActions.push(
      createUpdateEdit(extRef, {
        intAddr: extRef.getAttribute('intAddr'),
        desc: extRef.getAttribute('desc'),
        iedName: null,
        ldInst: null,
        prefix: null,
        lnClass: null,
        lnInst: null,
        doName: null,
        daName: null,
        serviceType: extRef.getAttribute('serviceType'),
        srcLDInst: null,
        srcPrefix: null,
        srcLNClass: null,
        srcLNInst: null,
        srcCBName: null,
      })
    );

    const subscriberIed = extRef.closest('IED') || undefined;

    if (canRemoveSubscriptionSupervision(extRef))
      editActions.push(
        ...removeSubscriptionSupervision(
          this.currentSelectedControlElement,
          subscriberIed
        )
      );

    let controlBlockElement;
    let fcdaElement;
    if (this.subscriberView) {
      controlBlockElement = findControlBlock(extRef);
      // invalid mappings may not have a control block but can still be removed
      if (controlBlockElement)
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

    this.dispatchEvent(newEditEvent(editActions));

    this.reCreateSupervisionCache();
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

    this.reCreateSupervisionCache();
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

  private isExtRefViewable(extRefElement: Element): boolean {
    return (
      extRefElement.hasAttribute('intAddr') &&
      ((!this.strictServiceTypes &&
        !extRefElement.hasAttribute('serviceType') &&
        !extRefElement.hasAttribute('pServT')) ||
        extRefElement.getAttribute('serviceType') ===
          serviceTypeLookup[this.controlTag] ||
        extRefElement.getAttribute('pServT') ===
          serviceTypeLookup[this.controlTag])
    );
  }

  public getAvailableExtRefElements(): Element[] {
    return getExtRefElements(
      <Element>this.doc.getRootNode(),
      this.currentSelectedFcdaElement,
      true
    ).filter(
      extRefElement =>
        !isSubscribed(extRefElement) ||
        (!findFCDAs(extRefElement).find(x => x !== undefined) &&
          this.isExtRefViewable(extRefElement))
    );
  }

  private reCreateSupervisionCache() {
    this.supervisionData = new Map();
    const supervisionType =
      serviceTypeLookup[this.controlTag] === 'GOOSE' ? 'LGOS' : 'LSVS';
    const refSelector =
      supervisionType === 'LGOS'
        ? 'DOI[name="GoCBRef"]'
        : 'DOI[name="SvCBRef"]';

    getUsedSupervisionInstances(
      this.doc,
      serviceTypeLookup[this.controlTag]
    ).forEach(supervisionLN => {
      const cbRef = supervisionLN!.querySelector(
        `${refSelector}>DAI[name="setSrcRef"]>Val`
      );
      const iedName =
        supervisionLN.closest('IED')?.getAttribute('name') ?? 'Unknown IED';
      if (cbRef)
        this.supervisionData.set(
          `${iedName} ${cbRef.textContent ?? ''}`,
          supervisionLN
        );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private getExtRefElementsByIED(ied: Element): Element[] {
    return Array.from(
      ied.querySelectorAll(
        ':scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef'
      )
    ).filter(extRefElement => this.isExtRefViewable(extRefElement));
  }

  private getCachedSupervision(extRefElement: Element): Element | undefined {
    const iedName =
      extRefElement.closest('IED')?.getAttribute('name') ?? 'Unknown IED';
    const cbRefKey = getCbReference(extRefElement);
    return this.supervisionData.get(`${iedName} ${cbRefKey}`);
  }

  private updateExtRefFilter(): void {
    const filterClassList = this.extRefListSubscriberUI!.classList;

    if (!this.hideBound) {
      filterClassList.add('show-bound');
    } else {
      filterClassList.remove('show-bound');
    }

    if (!this.hideNotBound) {
      filterClassList.add('show-not-bound');
    } else {
      filterClassList.remove('show-not-bound');
    }

    // force refresh for CSS style change
    this.requestUpdate();
  }

  private updateFilterCSS(): void {
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

    if (this.hideDisabled) {
      if (this.extRefListPublisherUI)
        this.extRefListPublisherUI.classList.remove('show-disabled');
      this.fcdaListUI!.classList.remove('show-disabled');
    } else {
      if (this.extRefListPublisherUI)
        this.extRefListPublisherUI.classList.add('show-disabled');
      this.fcdaListUI!.classList.add('show-disabled');
    }

    // force refresh for CSS style change
    this.requestUpdate();
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
        this.strictServiceTypes = (<Set<number>>(
          this.filterMenuExtRefUI.index
        )).has(2);

        this.updateExtRefFilter();
      });
    } else {
      this.listContainerUI.classList.remove('subscriber-view');

      this.filterMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.filterMenuExtrefPublisherButtonUI
      );

      this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.strictServiceTypes = (<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(0);
        this.hideDisabled = !(<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(1);

        this.updateFilterCSS();
      });
    }
  }

  protected async firstUpdated(): Promise<void> {
    this.restoreSettings();
    this.updateFilterCSS();

    this.filterMenuFcdaUI.anchor = <HTMLElement>this.filterMenuFcdaButtonUI;

    this.filterMenuExtRefPublisherUI.anchor = <HTMLElement>(
      this.filterMenuExtrefPublisherButtonUI
    );

    this.filterMenuFcdaUI.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(
        1
      );
      this.hideDisabled = !(<Set<number>>this.filterMenuFcdaUI.index).has(2);
      this.updateFilterCSS();
    });

    // TODO: Code duplication with the above
    this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
      this.strictServiceTypes = !(<Set<number>>(
        this.filterMenuExtRefPublisherUI.index
      )).has(0);
      this.hideDisabled = !(<Set<number>>(
        this.filterMenuExtRefPublisherUI.index
      )).has(1);

      this.updateFilterCSS();
    });

    this.requestUpdate();
    await this.updateComplete;
  }

  // eslint-disable-next-line class-methods-use-this
  private renderSubscribedExtRefElement(
    extRefElement: Element
  ): TemplateResult {
    const supervisionNode = getExistingSupervision(extRefElement);
    const spec = inputRestriction(extRefElement);
    const desc = getDescriptionAttribute(extRefElement);

    return html` <mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      ?twoline=${desc || supervisionNode}
      class="extref"
      value="${identity(extRefElement)}"
      data-extref="${identity(extRefElement)}"
      title="${spec.cdc && spec.bType
        ? `CDC: ${spec.cdc ?? '?'} 
Basic Type: ${spec.bType ?? '?'}`
        : ''}"
    >
      <span
        >${identity(extRefElement.parentElement)}
        ${extRefElement.getAttribute('intAddr')}
      </span>
      <span slot="secondary"
        >${desc}${supervisionNode !== null
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

  private isFcdaDisabled(
    fcdaElement: Element,
    controlElement: Element
  ): boolean {
    // If daName is missing, we have an FCDO which is not currently supported
    // TODO: Remove this and actually support FCDOs
    const isFcdo = !fcdaElement.getAttribute('daName');

    return (
      (this.subscriberView &&
        unsupportedExtRefElement(
          this.currentSelectedExtRefElement,
          fcdaElement,
          controlElement
        )) ||
      isFcdo
    );
  }

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    const isDisabled = this.isFcdaDisabled(fcdaElement, controlElement);

    const filterClasses = {
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
    };

    const spec = fcdaSpecification(fcdaElement);
    const fcdaDescription = getFcdaInstDesc(fcdaElement, true).join(' > ');

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${isDisabled}
      ?twoline=${fcdaDescription !== ''}
      class="fcda ${classMap(filterClasses)}"
      data-control="${identity(controlElement)}"
      data-fcda="${identity(fcdaElement)}"
      value="${identity(controlElement)}
             ${identity(fcdaElement)}"
      title="CDC: ${spec.cdc ?? '?'} 
Basic Type: ${spec.bType}"
    >
      <span
        >${getFcdaSubtitleValue(fcdaElement)} ${getFcdaTitleValue(fcdaElement)}
      </span>
      <span slot="secondary"> ${fcdaDescription}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  renderFCDAListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideSubscribed || this.hideNotSubscribed,
    };
    return html`
      <h1>
        ${this.renderControlTypeSelector()}
        ${this.controlTag === 'SampledValueControl'
          ? msg('Publisher Sampled Value Messages')
          : msg('Publisher GOOSE Messages')}
        <mwc-icon-button
          id="filterFcdaIcon"
          class="${classMap(menuClasses)}"
          icon="filter_list"
          @click=${() => {
            if (!this.filterMenuFcdaUI.open) this.filterMenuFcdaUI.show();
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
          ${this.subscriberView
            ? html`<mwc-check-list-item
                class="filter-disabled"
                left
                ?selected=${!this.hideDisabled}
              >
                <span>${msg('Disabled')}</span>
              </mwc-check-list-item>`
            : nothing}
        </mwc-menu>
      </h1>
    `;
  }

  renderControlList(controlElements: Element[]): TemplateResult {
    const filteredListClasses = {
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
    };

    // TODO: Activatable is not working correctly on very large files
    return html`<oscd-filtered-list
      id="fcdaList"
      ?activatable=${!this.subscriberView}
      class="styled-scrollbars ${classMap(filteredListClasses)}"
      @selected="${async (ev: SingleSelectedEvent) => {
        const selectedListItem = (<ListItemBase>(
          (<unknown>(<OscdFilteredList>ev.target).selected)
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

        // force update of text filter - breaks abstraction
        // TODO: FIXME
        // this.requestUpdate();
        // await this.updateComplete;
        // this.extRefListPublisherUI?.onFilterInput();

        // only continue if conditions for subscription met
        if (
          !(
            this.subscriberView &&
            this.currentSelectedControlElement &&
            this.currentSelectedFcdaElement &&
            this.currentSelectedExtRefElement
          )
        )
          return;

        this.subscribe(this.currentSelectedExtRefElement);
        this.currentSelectedExtRefElement = undefined;

        // if incrementing, click on next ExtRef list item if not subscribed
        if (this.extRefListSubscriberSelectedUI && !this.notAutoIncrement) {
          const nextActivatableItem = <ListItem>(
            this.extRefListSubscriberUI!.querySelector(
              'mwc-list-item[activated].extref ~ mwc-list-item.extref'
            )
          );

          if (nextActivatableItem) {
            const { extref } = (<ListItem>nextActivatableItem).dataset;
            const nextExtRef =
              this.doc.querySelector(selector('ExtRef', extref ?? 'Unknown')) ??
              undefined;
            if (nextExtRef && !isSubscribed(nextExtRef)) {
              nextActivatableItem.click();
            } else {
              this.extRefListSubscriberSelectedUI.selected = false;
              this.extRefListSubscriberSelectedUI.activated = false;
            }
          } else {
            // next ExtRef is already bound, deselect
            this.extRefListSubscriberSelectedUI.selected = false;
            this.extRefListSubscriberSelectedUI.activated = false;
          }
        }

        // deselect ExtRef
        if (this.extRefListSubscriberSelectedUI && this.notAutoIncrement) {
          this.extRefListSubscriberSelectedUI.selected = false;
          this.extRefListSubscriberSelectedUI.activated = false;
        }

        // deselect FCDA
        selectedListItem!.selected = false;
        selectedListItem!.activated = false;

        // reset state
        this.currentSelectedControlElement = undefined;
        this.currentSelectedFcdaElement = undefined;

        this.requestUpdate();
      }}"
    >
      ${controlElements
        .filter(controlElement => {
          const fcdaElements = getFcdaElements(controlElement);
          // if disabled items are  filtered then don't show them
          const onlyHasDisabledItems =
            this.hideDisabled &&
            fcdaElements.every(fcda =>
              this.isFcdaDisabled(fcda, controlElement)
            );
          return (
            fcdaElements.length && !(onlyHasDisabledItems && this.hideDisabled)
          );
        })
        .map(controlElement => {
          const fcdaElements = getFcdaElements(controlElement);
          const someSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) !== 0
          );
          const someNotSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) === 0
          );

          const filterClasses = {
            'show-subscribed': someSubscribed,
            'show-not-subscribed': someNotSubscribed,
          };

          const iedName = controlElement.closest('IED')?.getAttribute('name');

          // TODO: Restore wizard editing functionality
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
              <span>${iedName} > ${getNameAttribute(controlElement)} </span>
              <span slot="secondary"
                >${getLnTitle(controlElement)}
                ${getDescriptionAttribute(controlElement)
                  ? html` - ${getDescriptionAttribute(controlElement)}`
                  : nothing}</span
              >
              <mwc-icon slot="graphic"
                >${iconControlLookup[this.controlTag]}</mwc-icon
              >
            </mwc-list-item>
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
        ? html`${availableExtRefs.map(extRefElement => {
            const hasMissingMapping =
              isSubscribed(extRefElement) &&
              !findFCDAs(extRefElement).find(x => x !== undefined);
            const spec = inputRestriction(extRefElement);
            const desc = getDescriptionAttribute(extRefElement);

            return html`<mwc-list-item
              graphic="large"
              ?disabled=${unsupportedExtRefElement(
                extRefElement,
                this.currentSelectedFcdaElement,
                this.currentSelectedControlElement
              )}
              ?hasMeta=${isPartiallyConfigured(extRefElement) ||
              hasMissingMapping}
              ?twoline=${desc}
              class="extref"
              data-extref="${identity(extRefElement)}"
              value="${identity(extRefElement)}"
              title="${spec.cdc && spec.bType
                ? `CDC: ${spec.cdc ?? '?'} 
Basic Type: ${spec.bType ?? '?'}`
                : ''}"
            >
              <span>
                ${identity(extRefElement.parentElement)}
                ${extRefElement.getAttribute('intAddr')}
              </span>
              <span slot="secondary">${desc}</span>
              <mwc-icon slot="graphic">link_off</mwc-icon>
              ${isPartiallyConfigured(extRefElement)
                ? html`<mwc-icon
                    slot="meta"
                    class="invalid-mapping"
                    title="${msg('Invalid Mapping')}"
                    >warning</mwc-icon
                  >`
                : nothing}
              ${hasMissingMapping
                ? html`<mwc-icon
                    class="${hasMissingMapping ? 'missing-mapping' : ''}"
                    title="${msg(
                      'The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.'
                    )}"
                    slot="meta"
                    >warning</mwc-icon
                  >`
                : nothing}
            </mwc-list-item>`;
          })}`
        : html`<mwc-list-item graphic="large" noninteractive>
            ${msg('No available inputs to subscribe')}
          </mwc-list-item>`}
    `;
  }

  private renderPublisherViewExtRefListTitle(): TemplateResult {
    return html`<h1>
      ${msg('Subscriber Inputs')}
      <mwc-menu
        id="filterExtRefMenuPublisher"
        multi
        class="filter-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="show-strict-service-types"
          left
          ?selected=${this.strictServiceTypes}
        >
          <span>${msg('Strict Service Types')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-disabled"
          left
          ?selected=${!this.hideDisabled}
        >
          <span>${msg('Disabled')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="filterExtRefPublisherIcon"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuExtRefPublisherUI.open)
            this.filterMenuExtRefPublisherUI.show();
          else this.filterMenuExtRefPublisherUI.close();
        }}
      ></mwc-icon-button>
    </h1>`;
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
          <span>${msg('Subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-not-bound"
          left
          ?selected=${!this.hideNotBound}
        >
          <span>${msg('Not Subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-strict-service-types"
          left
          ?selected=${this.strictServiceTypes}
        >
          <span>${msg('Strict Service Types')}</span>
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

    const subscribed = isSubscribed(extRefElement);

    if (subscribed) {
      subscriberFCDA = findFCDAs(extRefElement).find(x => x !== undefined);
      supervisionNode = this.getCachedSupervision(extRefElement);
      controlBlockDescription =
        getFcdaSrcControlBlockDescription(extRefElement);
    }

    if (supervisionNode) {
      supervisionDescription = trimIdentityParent(
        <string>identity(supervisionNode)
      );
    }

    const extRefDescription = getDescriptionAttribute(extRefElement);

    const supAndctrlDescription =
      supervisionDescription || controlBlockDescription
        ? `${[controlBlockDescription, supervisionDescription]
            .filter(desc => desc !== undefined)
            .join(', ')}`
        : nothing;

    const hasInvalidMapping = isPartiallyConfigured(extRefElement);
    const hasMissingMapping = subscribed && !subscriberFCDA;

    const bound = subscribed || hasInvalidMapping;

    const specExtRef = inputRestriction(extRefElement);
    const specFcda = subscriberFCDA ? fcdaSpecification(subscriberFCDA) : null;

    const fcdaName = subscriberFCDA
      ? `${
          subscriberFCDA.closest('IED')?.getAttribute('name') ?? 'Unknown'
        } > ${getFcdaSubtitleValue(subscriberFCDA)} ${getFcdaTitleValue(
          subscriberFCDA
        )} `
      : '';
    const fcdaDesc = subscriberFCDA
      ? getFcdaInstDesc(subscriberFCDA, true).join('>')
      : null;

    const specExtRefText =
      specExtRef.cdc || specExtRef.bType
        ? `ExtRef: CDC: ${specExtRef.cdc ?? '?'}, Basic Type: ${
            specExtRef.bType ?? '?'
          }`
        : '';
    const specFcdaText =
      specFcda && (specFcda.cdc || specFcda.bType)
        ? `FCDA: CDC: ${specFcda.cdc ?? '?'}, Basic Type: ${
            specFcda.bType ?? '?'
          }`
        : '';

    const filterClasses = {
      'show-bound': bound,
      'show-not-bound': !bound,
    };

    return html`<mwc-list-item
      twoline
      class="extref ${classMap(filterClasses)}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined || hasInvalidMapping}
      data-extref="${identity(extRefElement)}"
      value="${identity(extRefElement)}${supervisionNode
        ? ` ${identity(supervisionNode)}`
        : ''}"
      title="${[specExtRefText, specFcdaText].join('\n')}"
    >
      <span class="extref-firstline">
        ${extRefPath(extRefElement)}: ${extRefElement.getAttribute('intAddr')}
        ${(subscribed && subscriberFCDA) || hasInvalidMapping
          ? html`<mwc-icon class="left-inline-arrow">arrow_back</mwc-icon>
              ${subscribed && subscriberFCDA ? `${fcdaName}` : ''}
              ${hasInvalidMapping ? `${msg('Invalid Mapping')}` : ''} `
          : nothing}
      </span>
      <span slot="secondary"
        >${extRefDescription ? html` ${extRefDescription}` : nothing}
        ${extRefDescription && fcdaDesc && fcdaDesc !== ''
          ? `🡄 ${fcdaDesc}`
          : nothing}
        ${extRefDescription && supAndctrlDescription !== nothing
          ? `(${supAndctrlDescription})`
          : supAndctrlDescription}
      </span>
      <mwc-icon slot="graphic">${subscribed ? 'link' : 'link_off'}</mwc-icon>
      ${subscribed &&
      supervisionNode !== undefined &&
      !hasInvalidMapping &&
      !hasMissingMapping
        ? html`<mwc-icon title="${identity(supervisionNode!)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
        : nothing}
      ${hasInvalidMapping
        ? html`<mwc-icon
            class="${hasInvalidMapping ? 'invalid-mapping' : ''}"
            title="${msg('Invalid Mapping')}"
            slot="meta"
            >error</mwc-icon
          >`
        : nothing}
      ${hasMissingMapping
        ? html`<mwc-icon
            class="${hasMissingMapping ? 'missing-mapping' : ''}"
            title="${msg(
              'The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.'
            )}"
            slot="meta"
            >warning</mwc-icon
          >`
        : nothing}
    </mwc-list-item>`;
  }

  private renderSubscriberViewExtRefs(): TemplateResult {
    if (this.supervisionData.size === 0) this.reCreateSupervisionCache();
    return html`${repeat(
      getOrderedIeds(this.doc),
      i => `${identity(i)} ${this.controlTag}`,
      ied => {
        const extRefs = Array.from(this.getExtRefElementsByIED(ied));
        const someBound = extRefs.some(extRef => isSubscribed(extRef));
        const someNotBound = extRefs.some(extRef => !isSubscribed(extRef));

        if (!extRefs.length) return html``;

        const filterClasses = {
          control: true,
          'show-bound': someBound,
          'show-not-bound': someNotBound,
        };

        const [iedDesc, iedType, iedMfg] = ['desc', 'type', 'manufacturer'].map(
          attr => ied.getAttribute(attr)
        );

        return html`
          <mwc-list-item
            class="ied ${classMap(filterClasses)}"
            ?twoline=${iedDesc || iedType || iedMfg}
            noninteractive
            graphic="icon"
            value="${[iedDesc, iedMfg, iedType].join(' - ')} ${Array.from(
              ied.querySelectorAll('Inputs > ExtRef')
            )
              .map(extRef => {
                const extRefid = identity(extRef) as string;
                const supervisionId =
                  this.getCachedSupervision(extRef) !== undefined
                    ? identity(this.getCachedSupervision(extRef)!)
                    : '';
                const controlBlockDescription =
                  getFcdaSrcControlBlockDescription(extRef);
                const extRefDescription = getDescriptionAttribute(extRef);
                const subscribed = isSubscribed(extRef);

                let subscriberFCDA;
                if (subscribed) {
                  subscriberFCDA = findFCDAs(extRef).find(x => x !== undefined);
                }

                return `${
                  typeof extRefid === 'string' ? extRefid : ''
                } ${supervisionId} ${controlBlockDescription} ${extRefDescription} ${
                  subscriberFCDA ? identity(subscriberFCDA) : ''
                }`;
              })
              .join(' ')}"
          >
            <span>${getNameAttribute(ied)}</span>
            <span slot="secondary"
              >${[iedDesc, iedMfg, iedType]
                .filter(val => !!val)
                .join(' - ')}</span
            >
            <mwc-icon slot="graphic">developer_board</mwc-icon>
          </mwc-list-item>
          ${repeat(
            Array.from(this.getExtRefElementsByIED(ied)),
            exId => `${identity(exId)} ${this.controlTag}`,
            extRef => this.renderSubscriberViewExtRef(extRef)
          )}
        `;
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
          ${this.renderPublisherViewExtRefListTitle()}
          ${this.currentSelectedControlElement &&
          this.currentSelectedFcdaElement
            ? html`<oscd-filtered-list
                id="publisherExtRefList"
                class="styled-scrollbars ${!this.hideDisabled
                  ? 'show-disabled'
                  : ''}"
                @selected=${(ev: SingleSelectedEvent) => {
                  const selectedListItem = (<ListItemBase>(
                    (<unknown>(<OscdFilteredList>ev.target).selected)
                  ))!;

                  if (!selectedListItem) return;

                  const { extref } = selectedListItem.dataset;
                  // TODO: The selector function does not work correctly when there are multiple ExtRefs with the
                  // same desc and intAddr.
                  // See: https://github.com/openscd/open-scd/issues/1214
                  const selectedExtRefElement = this.doc.querySelector(
                    selector('ExtRef', extref ?? 'Unknown ExtRef')
                  );

                  if (!selectedExtRefElement) return;

                  if (
                    !isSubscribed(selectedExtRefElement) ||
                    !findFCDAs(selectedExtRefElement).find(x => x !== undefined)
                  ) {
                    this.subscribe(selectedExtRefElement!);
                  } else {
                    this.unsubscribe(selectedExtRefElement);
                  }

                  selectedListItem.selected = false;
                  // This seems to help with long lists where others the update does not occur
                  this.fcdaListUI.requestUpdate();
                  this.requestUpdate();
                }}
              >
                ${this.renderPublisherViewSubscribedExtRefs()}
                ${this.renderPublisherViewAvailableExtRefs()}
              </oscd-filtered-list>`
            : html`<h3>${msg('No published item selected')}</h3>`}
        </section>`
      : html` <section class="column extref">
          ${this.renderSubscriberViewExtRefListTitle()}
          <oscd-filtered-list
            id="subscriberExtRefList"
            class="styled-scrollbars ${classMap(filteredListClasses)}"
            activatable
            @selected=${(ev: SingleSelectedEvent) => {
              const selectedListItem = (<ListItemBase>(
                (<unknown>(<OscdFilteredList>ev.target).selected)
              ))!;

              if (!selectedListItem) return;

              const { extref } = selectedListItem.dataset;
              const selectedExtRefElement = <Element>(
                this.doc.querySelector(
                  selector('ExtRef', extref ?? 'Unknown ExtRef')
                )
              );

              if (!selectedExtRefElement) return;

              if (
                isSubscribed(selectedExtRefElement) ||
                isPartiallyConfigured(selectedExtRefElement)
              ) {
                this.unsubscribe(selectedExtRefElement);

                // deselect in UI
                selectedListItem.selected = false;
                selectedListItem.activated = false;
                // process de-selection to allow an additional click to unsubscribe
                this.requestUpdate();
              } else {
                this.currentSelectedExtRefElement = selectedExtRefElement;
              }

              this.requestUpdate();
            }}
            >${this.renderSubscriberViewExtRefs()}
          </oscd-filtered-list>
        </section>`;
  }

  renderControlTypeSelector(): TemplateResult {
    return html`
      <mwc-icon-button-toggle
        id="switchControlType"
        title="${msg('Change between GOOSE and Sampled Value publishers')}"
        @click=${() => {
          this.controlTag = this.switchControlTypeUI?.on
            ? 'GSEControl'
            : 'SampledValueControl';
          this.reCreateSupervisionCache();
        }}
      >
        ${gooseActionIcon} ${smvActionIcon}
      </mwc-icon-button-toggle>
    `;
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

  renderswitchView(): TemplateResult {
    return html`<mwc-icon-button-toggle
      id="switchView"
      onIcon="swap_horiz"
      offIcon="swap_horiz"
      title="${msg('Switch between Publisher and Subscriber view')}"
      @click=${async () => {
        this.subscriberView = this.switchViewUI?.on ?? false;

        // deselect in UI
        if (this.fcdaListSelectedUI) {
          this.fcdaListSelectedUI.selected = false;
          this.fcdaListSelectedUI.activated = false;
        }

        // reset state
        this.currentSelectedControlElement = undefined;
        this.currentSelectedFcdaElement = undefined;

        // required to update CSS state for filter buttons?
        this.requestUpdate();
        await this.updateComplete;

        // await for regeneration of UI and then attach anchors
        this.updateView();
      }}
    ></mwc-icon-button-toggle>`;
  }

  render(): TemplateResult {
    return html` <div id="listContainer">
        ${this.renderPublisherFCDAs()} ${this.renderExtRefs()}
      </div>
      ${this.renderswitchView()}`;
  }

  static styles = css`
    :host {
      width: 100vw;
      display: flex;

      --scrollbarBG: var(--mdc-theme-background, #cfcfcf00);
      --thumbBG: var(--mdc-button-disabled-ink-color, #996cd8cc);
    }

    @media (min-width: 700px) {
      #listContainer.subscriber-view {
        flex: auto;
      }

      #listContainer.subscriber-view .column.extref {
        resize: horizontal;
        width: 65%;
        flex: none;
      }

      #listContainer.subscriber-view .column.fcda {
        width: auto;
      }
    }

    h1,
    h2,
    h3 {
      color: var(--mdc-theme-on-surface);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px;
      line-height: 48px;
      padding-left: 0.3em;
    }

    h3 {
      margin: 4px 8px 16px;
    }

    .column {
      flex: 50%;
      margin: 0px 6px 0px;
      min-width: 300px;
      height: 100%;
      overflow-y: clip;
      overflow-x: auto;
    }

    .fcda,
    .extref {
      padding-left: var(--mdc-list-side-padding, 16px);
    }

    #filterFcdaIcon,
    #filterExtRefIcon,
    #settingsExtRefIcon,
    #filterExtRefPublisherIcon {
      float: right;
    }

    #filterFcdaIcon.filter-off,
    #filterExtRefIcon.filter-off {
      color: var(--mdc-theme-secondary, #018786);
      background-color: var(--mdc-theme-background);
    }

    /* Filtering rules for control blocks end up implementing logic to allow
    very fast CSS response. The following rules appear to be minimal but can be
    hard to understand intuitively for the multiple conditions. If modifying,
    it is suggested to create a truth-table to check for side-effects */

    /* remove all control blocks if no filters */
    #fcdaList:not(.show-subscribed, .show-not-subscribed) mwc-list-item {
      display: none;
    }

    /* remove control blocks taking care to respect multiple conditions */
    #fcdaList.show-not-subscribed:not(.show-subscribed)
      mwc-list-item.control.show-subscribed:not(.show-not-subscribed) {
      display: none;
    }

    #fcdaList.show-subscribed:not(.show-not-subscribed)
      mwc-list-item.control.show-not-subscribed:not(.show-subscribed) {
      display: none;
    }

    /* remove fcdas if not part of filter */
    #fcdaList:not(.show-not-subscribed) mwc-list-item.fcda.show-not-subscribed {
      display: none;
    }

    #fcdaList:not(.show-subscribed) mwc-list-item.fcda.show-subscribed {
      display: none;
    }

    /* hide disabled items for subscriber view */
    #fcdaList:not(.show-disabled) mwc-list-item.fcda[disabled] {
      display: none;
    }

    /* hide disabled items for publisher view available extrefs */
    #publisherExtRefList:not(.show-disabled) mwc-list-item.extref[disabled] {
      display: none;
    }

    .invalid-mapping {
      color: var(--mdc-theme-error, red);
    }

    /* TODO: OpenSCD currently doesn't have "warning" or "invalid" colours 
    outside of logging but these may be generally useful to plugin authors */
    .missing-mapping {
      color: var(--mdc-theme-error, orange);
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
      position: relative;
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    section {
      position: relative;
      max-height: 100%;
      background-color: var(--mdc-theme-surface);
    }

    /* TODO: Can we do better than a hard-code max-height */
    .styled-scrollbars {
      max-height: 78vh;
      overflow: auto;
    }

    .styled-scrollbars {
      scrollbar-width: thin;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    }

    .styled-scrollbars::-webkit-scrollbar {
      width: 6px;
    }

    .styled-scrollbars::-webkit-scrollbar-track {
      background: var(--scrollbarBG);
    }

    .styled-scrollbars::-webkit-scrollbar-thumb {
      background: var(--thumbBG);
      border-radius: 6px;
    }

    mwc-list-item.ied,
    mwc-list-item.control {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

    #switchView {
      z-index: 1;
      position: absolute;
      bottom: 16px;
      right: 16px;
    }

    #switchControlType,
    #switchView {
      --mdc-icon-size: 32px;
    }

    .left-inline-arrow {
      position: relative;
      top: 5px;
    }
  `;
}
