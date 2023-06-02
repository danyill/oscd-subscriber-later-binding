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
import '@material/mwc-textfield';

import { Edit, Insert, newEditEvent } from '@openscd/open-scd-core';

import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { List, SingleSelectedEvent } from '@material/mwc-list';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { ListItemBase } from '@material/mwc-list/mwc-list-item-base.js';
import type { Menu } from '@material/mwc-menu';
import type { TextField } from '@material/mwc-textfield';

import { identity } from './foundation/identities/identity.js';
import {
  canRemoveSubscriptionSupervision,
  checkEditionSpecificRequirements,
  fcdaSpecification,
  findControlBlock,
  findFCDA,
  getCbReference,
  getExistingSupervision,
  getExtRefElements,
  getFcdaElements,
  getExtRefControlBlockPath,
  getFcdaOrExtRefSubtitleValue,
  getFcdaOrExtRefTitleValue,
  getOrderedIeds,
  getSubscribedExtRefElements,
  getUsedSupervisionInstances,
  inputRestriction,
  instantiateSubscriptionSupervision,
  isPartiallyConfigured,
  isSubscribed,
  removeSubscriptionSupervision,
  updateExtRefElement,
} from './foundation/subscription/subscription.js';
import {
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

type fcdaInfo = {
  spec: {
    cdc: string | null;
    bType: string | null;
  };
  desc: string[];
};

type extRefInfo = {
  spec: {
    cdc: string | null;
    bType: string | null;
  };
};

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
  hideDataObjects: boolean;
  hidePreconfiguredNotMatching: boolean;
  notAutoIncrement: boolean;
  notChangeSupervisionLNs: boolean;
  hideBound: boolean;
  hideNotBound: boolean;
  strictServiceTypes: boolean;
};

const storedProperties: string[] = [
  'subscriberView',
  'controlTag',
  'hideSubscribed',
  'hideNotSubscribed',
  'hideDataObjects',
  'hidePreconfiguredNotMatching',
  'notAutoIncrement',
  'notChangeSupervisionLNs',
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

function getFilterRegex(searchText: string): RegExp {
  if (searchText === '') {
    return /.*/i;
  }
  const terms: string[] =
    searchText
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .trim()
      .match(/(?:[^\s"']+|['"][^'"]*["'])+/g) ?? [];

  const expandedTerms = terms.map(term =>
    term.replace(/\*/g, '.*').replace(/\?/g, '.{1}').replace(/"|'/g, '')
  );

  const regexString = expandedTerms.map(term => `(?=.*${term})`);

  return new RegExp(`${regexString.join('')}.*`, 'i');
}

function debounce(callback: any, delay = 250) {
  let timeout: any;

  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property() docName!: string;

  @property() editCount!: number;

  @property({ type: Boolean })
  controlTag!: controlTagType;

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
  hideDataObjects!: boolean;

  @property({ type: Boolean })
  hidePreconfiguredNotMatching!: boolean;

  @property({ type: Boolean })
  notAutoIncrement!: boolean;

  @property({ type: Boolean })
  notChangeSupervisionLNs!: boolean;

  @property({ type: Boolean })
  hideBound!: boolean;

  @property({ type: Boolean })
  hideNotBound!: boolean;

  @property({ type: Boolean })
  strictServiceTypes!: boolean;

  @property({ type: String })
  filterFcdaRegex: RegExp = /.*/i;

  @property({ type: String })
  filterExtRefPublisherRegex: RegExp = /.*/i;

  @property({ type: String })
  filterExtRefSubscriberRegex: RegExp = /.*/i;

  @query('#switchView')
  switchViewUI?: IconButtonToggle;

  @query('#switchControlType')
  switchControlTypeUI?: IconButtonToggle;

  @query('#filterFcdaMenu')
  filterMenuFcdaUI!: Menu;

  @query('#filterFcdaIcon')
  filterMenuFcdaButtonUI!: Icon;

  @query('#filterFcdaInput')
  filterFcdaInputUI!: TextField;

  @query('#filterExtRefPublisherInput')
  filterExtRefPublisherInputUI!: TextField;

  @query('#filterExtRefSubscriberInput')
  filterExtRefSubscriberInputUI!: TextField;

  @query('#filterExtRefMenuSubscriber')
  filterMenuExtRefSubscriberUI!: Menu;

  @query('#filterExtRefMenuPublisher')
  filterMenuExtRefPublisherUI!: Menu;

  @query('#filterExtRefSubscriberIcon')
  filterMenuExtRefSubscriberButtonUI!: Icon;

  @query('#filterExtRefPublisherIcon')
  filterMenuExtrefPublisherButtonUI!: Icon;

  @query('#listContainer')
  listContainerUI!: HTMLDivElement;

  @query('#settingsExtRefSubscriberMenu')
  settingsMenuExtRefSubscriberUI!: Menu;

  @query('#settingsExtRefPublisherMenu')
  settingsMenuExtRefPublisherUI!: Menu;

  @query('#settingsExtRefSubscriberIcon')
  settingsMenuExtRefSubscriberButtonUI!: Icon;

  @query('#settingsExtRefPublisherIcon')
  settingsMenuExtRefPublisherButtonUI!: Icon;

  @query('#fcdaList')
  fcdaListUI!: List;

  @query('#publisherExtRefList')
  extRefListPublisherUI?: List;

  @query('#publisherExtRefSection')
  publisherExtRefSectionUI?: HTMLElement;

  @query('#subscriberExtRefList')
  extRefListSubscriberUI?: List;

  @query('#subscriberExtRefList mwc-list-item[selected]')
  extRefListSubscriberSelectedUI?: ListItem;

  @query('#fcdaList mwc-list-item[selected]')
  fcdaListSelectedUI?: ListItem;

  @state()
  currentSelectedControlElement: Element | undefined;

  @state()
  currentSelectedFcdaElement: Element | undefined;

  @state()
  currentIedElement: Element | undefined;

  @state()
  currentSelectedExtRefElement: Element | undefined;

  private controlBlockFcdaInfo = new Map<string, number>();

  private fcdaInfo = new Map<string, fcdaInfo>();

  private extRefInfo = new Map<string, extRefInfo>();

  private supervisionData = new Map();

  protected storeSettings(): void {
    const storedConfiguration = {
      subscriberView: this.switchViewUI!.on,
      controlTag: this.switchControlTypeUI!.on
        ? 'GSEControl'
        : 'SampledValueControl',
      hideSubscribed: this.hideSubscribed,
      hideNotSubscribed: this.hideNotSubscribed,
      hideDataObjects: this.hideDataObjects,
      hidePreconfiguredNotMatching: this.hidePreconfiguredNotMatching,
      notAutoIncrement: this.notAutoIncrement,
      notChangeSupervisionLNs: this.notChangeSupervisionLNs,
      hideBound: this.hideBound,
      hideNotBound: this.hideNotBound,
      strictServiceTypes: this.strictServiceTypes,
    };

    localStorage.setItem(
      'oscd-subscriber-later-binding',
      JSON.stringify(storedConfiguration)
    );
  }

  protected restoreSettings(): void {
    const storedSettings = localStorage.getItem(
      'oscd-subscriber-later-binding'
    );
    const storedConfiguration: StoredConfiguration = storedSettings
      ? JSON.parse(storedSettings)
      : undefined;

    this.subscriberView = storedConfiguration?.subscriberView ?? false;
    this.controlTag = storedConfiguration?.controlTag ?? 'GSEControl';

    this.hideSubscribed = storedConfiguration?.hideSubscribed || false;
    this.hideNotSubscribed = storedConfiguration?.hideNotSubscribed || false;

    this.hideDataObjects = storedConfiguration?.hideDataObjects || false;
    this.hidePreconfiguredNotMatching =
      storedConfiguration?.hidePreconfiguredNotMatching || false;

    this.notAutoIncrement = storedConfiguration?.notAutoIncrement ?? false;
    this.notChangeSupervisionLNs =
      storedConfiguration?.notChangeSupervisionLNs ?? false;

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
    if (!this.controlBlockFcdaInfo.has(controlBlockFcdaId)) {
      const extRefCount = getSubscribedExtRefElements(
        <Element>this.doc.getRootNode(),
        this.controlTag,
        fcdaElement,
        controlElement!,
        true // TODO: do we need this?
      ).length;
      this.controlBlockFcdaInfo.set(controlBlockFcdaId, extRefCount);
    }
    return this.controlBlockFcdaInfo.get(controlBlockFcdaId)!;
  }

  // This does the initial build of the ExtRef count is and is targeting
  // high performance on large files
  private buildExtRefCount(): void {
    if (!this.doc) return;

    const dsToCb = new Map();
    // get only the FCDAs relevant to the current view
    const fcdaData = new Map();
    const fcdaCompare = new Map();
    Array.from(this.doc.querySelectorAll(`LN0 > ${this.controlTag}`)).forEach(
      cb => {
        const isReferencedDs = cb.parentElement?.querySelector(
          `DataSet[name="${cb.getAttribute('datSet')}"]`
        );

        if (isReferencedDs) {
          dsToCb.set(identity(isReferencedDs), cb);
        }
      }
    );

    this.doc
      .querySelectorAll(
        ':root > IED > AccessPoint > Server > LDevice > LN > DataSet, :root > IED > AccessPoint > Server > LDevice > LN0 > DataSet'
      )
      .forEach(dataSet => {
        if (dsToCb.has(identity(dataSet))) {
          const thisCb = dsToCb.get(identity(dataSet));
          dataSet.querySelectorAll('FCDA').forEach(fcda => {
            const key = `${identity(thisCb)} ${identity(fcda)}`;
            fcdaData.set(fcda, {
              key,
              cb: dsToCb.get(identity(dataSet)),
            });
            this.controlBlockFcdaInfo.set(key, 0);
            const iedName = fcda.closest('IED')?.getAttribute('name');
            const fcdaMatcher = `${iedName} ${[
              'ldInst',
              'prefix',
              'lnClass',
              'lnInst',
              'doName',
              'daName',
            ]
              .map(attr => fcda.getAttribute(attr))
              .join(' ')}`;
            fcdaCompare.set(fcdaMatcher, fcda);
          });
        }
      });

    // get all document extrefs
    const extRefs = Array.from(
      this.doc.querySelectorAll(
        ':root > IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef'
      )
    ).filter(extRef => isSubscribed(extRef) && extRef.hasAttribute('intAddr'));

    // match the extrefs
    extRefs.forEach(extRef => {
      const extRefMatcher = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
      ]
        .map(attr => extRef.getAttribute(attr))
        .join(' ');
      if (fcdaCompare.has(extRefMatcher)) {
        const fcda = fcdaCompare.get(extRefMatcher);
        const { key, cb } = fcdaData.get(fcda);
        if (checkEditionSpecificRequirements(this.controlTag, cb, extRef)) {
          const currentCountValue = this.controlBlockFcdaInfo.get(key) ?? 0;
          this.controlBlockFcdaInfo.set(key, currentCountValue + 1);
        }
      }
    });
  }

  private getFcdaInfo(fcdaElement: Element): fcdaInfo {
    const id = `${identity(fcdaElement)}`;
    if (!this.fcdaInfo.has(id)) {
      const spec = fcdaSpecification(fcdaElement);
      const desc = getFcdaInstDesc(fcdaElement, true);
      this.fcdaInfo.set(id, { spec, desc });
    }
    return this.fcdaInfo.get(id)!;
  }

  private getExtRefInfo(extRefElement: Element): extRefInfo {
    const id = `${identity(extRefElement)}`;
    if (!this.extRefInfo.has(id)) {
      const spec = inputRestriction(extRefElement);
      this.extRefInfo.set(id, { spec });
    }
    return this.extRefInfo.get(id)!;
  }

  private getExtRefSubscriberSearchString(extRef: Element): string {
    const ied = extRef.closest('IED')!;
    const subscribed = isSubscribed(extRef);

    const [iedDesc, iedType, iedMfg] = ['desc', 'type', 'manufacturer'].map(
      attr => ied.getAttribute(attr)
    );
    const iedInfo = [iedDesc, iedMfg, iedType].filter(val => !!val).join(' - ');

    let subscriberFCDA;
    let extRefPathValue;
    let fcdaDesc;

    if (subscribed) {
      subscriberFCDA = findFCDAs(extRef).find(x => x !== undefined);
      extRefPathValue = `${extRef.getAttribute(
        'iedName'
      )} ${getFcdaOrExtRefSubtitleValue(extRef)} ${getFcdaOrExtRefTitleValue(
        extRef
      )}`;
      fcdaDesc = subscriberFCDA
        ? this.getFcdaInfo(subscriberFCDA).desc.join('>')
        : null;
    }

    const extRefCBPath = getExtRefControlBlockPath(extRef);

    return `${iedInfo} ${identity(extRef)} ${identity(
      this.getCachedSupervision(extRef) ?? null
    )} ${getDescriptionAttribute(extRef)} ${identity(
      subscriberFCDA ?? null
    )} ${fcdaDesc} ${extRefPathValue} ${extRefCBPath}`;
  }

  private getFcdaSearchString(control: Element, fcda: Element): string {
    return `${identity(control)} ${getDescriptionAttribute(control)} ${identity(
      fcda
    )} ${getFcdaOrExtRefTitleValue(fcda)} ${getFcdaOrExtRefSubtitleValue(
      fcda
    )} ${this.getFcdaInfo(fcda).desc.join(' ')}`;
  }

  protected resetCaching(): void {
    // reset caching
    this.controlBlockFcdaInfo = new Map();
    this.fcdaInfo = new Map();
    this.extRefInfo = new Map();

    // reset supervision cache
    this.reCreateSupervisionCache();
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When a new document is loaded or we do a subscription/we will reset the Map to clear old entries.
    // TODO: Be able to detect the same document loaded twice, currently lack a way to check for this
    // https://github.com/openscd/open-scd-core/issues/92
    if (_changedProperties.has('docName')) {
      this.currentSelectedControlElement = undefined;
      this.currentSelectedFcdaElement = undefined;
      this.currentSelectedExtRefElement = undefined;

      this.resetCaching();

      // deselect in UI
      if (this.extRefListSubscriberSelectedUI) {
        this.extRefListSubscriberSelectedUI.selected = false;
        this.extRefListSubscriberSelectedUI.activated = false;
      }

      if (this.fcdaListSelectedUI) {
        this.fcdaListSelectedUI.selected = false;
        this.fcdaListSelectedUI.activated = false;
      }
    }

    if (_changedProperties.has('subscriberView')) {
      // re-attach anchors
      this.updateView();
    }

    const settingsUpdateRequired = Array.from(_changedProperties.keys()).some(
      r => storedProperties.includes(r.toString())
    );
    if (settingsUpdateRequired) this.storeSettings();
  }

  /**
   * Unsubscribing means removing a list of attributes from the ExtRef Element.
   *
   * @param extRef - The Ext Ref Element to clean from attributes.
   */
  private unsubscribe(extRef: Element): void {
    const editActions: Edit[] = [];

    editActions.push({
      element: extRef,
      attributes: {
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
      },
    });

    const subscriberIed = extRef.closest('IED')!;

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

    if (
      !this.notChangeSupervisionLNs &&
      canRemoveSubscriptionSupervision(extRef)
    )
      editActions.push(
        ...removeSubscriptionSupervision(controlBlockElement, subscriberIed)
      );

    if (controlBlockElement && fcdaElement) {
      const controlBlockFcdaId = `${identity(controlBlockElement!)} ${identity(
        fcdaElement
      )}`;
      this.controlBlockFcdaInfo.delete(controlBlockFcdaId);
    }

    this.dispatchEvent(newEditEvent(editActions));

    if (!this.notChangeSupervisionLNs) this.reCreateSupervisionCache();
  }

  /**
   * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
   *
   * @param extRef - The ExtRef Element to add the attributes to.
   */
  private subscribe(
    extRef: Element,
    controlElement: Element,
    fcdaElement: Element
  ): void {
    const updateEdit = updateExtRefElement(extRef, controlElement, fcdaElement);

    const subscriberIed = extRef.closest('IED')!;

    let supervisionActions: Insert[] = [];

    if (!this.notChangeSupervisionLNs)
      supervisionActions = instantiateSubscriptionSupervision(
        controlElement,
        subscriberIed
      );

    this.dispatchEvent(newEditEvent([updateEdit, ...supervisionActions]));

    const controlBlockFcdaId = `${identity(controlElement)} ${identity(
      fcdaElement
    )}`;
    this.controlBlockFcdaInfo.delete(controlBlockFcdaId);

    if (!this.notChangeSupervisionLNs) this.reCreateSupervisionCache();
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
        (!isSubscribed(extRefElement) ||
          !findFCDAs(extRefElement).find(x => x !== undefined)) &&
        this.isExtRefViewable(extRefElement)
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
      const iedName = supervisionLN.closest('IED')!.getAttribute('name');
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
    const iedName = extRefElement.closest('IED')!.getAttribute('name');
    const cbRefKey = getCbReference(extRefElement);
    return this.supervisionData.get(`${iedName} ${cbRefKey}`);
  }

  private updateView(): void {
    if (this.subscriberView) {
      this.filterMenuExtRefSubscriberUI.anchor = <HTMLElement>(
        this.filterMenuExtRefSubscriberButtonUI
      );

      this.filterMenuExtRefSubscriberUI.addEventListener('closed', () => {
        this.hideBound = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(0);
        this.hideNotBound = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(1);
        this.strictServiceTypes = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(2);
      });

      this.settingsMenuExtRefSubscriberUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefSubscriberButtonUI
      );

      this.settingsMenuExtRefSubscriberUI.addEventListener('closed', () => {
        this.notAutoIncrement = !(<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(0);
        this.notChangeSupervisionLNs = !(<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(1);
      });
    } else {
      this.filterMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.filterMenuExtrefPublisherButtonUI
      );

      this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.strictServiceTypes = !(<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(0);
        this.hidePreconfiguredNotMatching = !(<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(1);
      });

      this.settingsMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefPublisherButtonUI
      );

      this.settingsMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.notChangeSupervisionLNs = !(<Set<number>>(
          this.settingsMenuExtRefPublisherUI.index
        )).has(0);
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.restoreSettings();
  }

  protected async firstUpdated(): Promise<void> {
    this.filterMenuFcdaUI.anchor = <HTMLElement>this.filterMenuFcdaButtonUI;

    this.filterMenuFcdaUI.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.filterMenuFcdaUI.index).has(
        1
      );
      this.hideDataObjects = !(<Set<number>>this.filterMenuFcdaUI.index).has(2);
      if (this.subscriberView)
        this.hidePreconfiguredNotMatching = !(<Set<number>>(
          this.filterMenuFcdaUI.index
        )).has(3);
    });

    this.updateView();
  }

  // eslint-disable-next-line class-methods-use-this
  private renderSubscribedExtRefElement(
    extRefElement: Element
  ): TemplateResult {
    const supervisionNode = getExistingSupervision(extRefElement);
    const { spec } = this.getExtRefInfo(extRefElement);
    const desc = getDescriptionAttribute(extRefElement);
    const iedName = extRefElement.closest('IED')?.getAttribute('name');

    return html` <mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      ?twoline=${desc || supervisionNode}
      class="extref"
      data-extref="${identity(extRefElement)}"
      title="${spec.cdc && spec.bType
        ? `CDC: ${spec.cdc ?? '?'}\nBasic Type: ${spec.bType ?? '?'}`
        : ''}"
    >
      <span
        >${iedName} > ${extRefPath(extRefElement)}:
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

  /**
   * Check data consistency of source `FCDA` and sink `ExtRef` based on
   * `ExtRef`'s `pLN`, `pDO`, `pDA` and `pServT` attributes.
   * Consistent means `CDC` and `bType` of both ExtRef and FCDA is equal.
   * In case
   *  - `pLN`, `pDO`, `pDA` or `pServT` attributes are not present, allow subscribing
   *  - no CDC or bType can be extracted, do not allow subscribing
   *
   * @param extRef - The `ExtRef` Element to check against
   * @param fcdaElement - The SCL `FCDA` element within the DataSet
   * @param controlElement - The control element associated with the `FCDA` `DataSet`
   */
  nonMatchingExtRefElement(
    extRef: Element | undefined,
    fcdaElement: Element | undefined,
    controlElement: Element | undefined
  ): boolean {
    if (!extRef) return false;
    // Vendor does not provide data for the check
    if (
      !extRef.hasAttribute('pLN') ||
      !extRef.hasAttribute('pDO') ||
      !extRef.hasAttribute('pDA') ||
      !extRef.hasAttribute('pServT')
    )
      return false;

    // Not ready for any kind of subscription
    if (!fcdaElement) return true;

    const fcda = this.getFcdaInfo(fcdaElement).spec;
    const input = this.getExtRefInfo(extRef).spec;

    if (fcda.cdc === null && input.cdc === null) return true;
    if (fcda.bType === null && input.bType === null) return true;
    if (
      serviceTypeLookup[
        <'GSEControl' | 'SampledValueControl'>controlElement!.tagName
      ] !== extRef.getAttribute('pServT')
    )
      return true;

    return fcda.cdc !== input.cdc || fcda.bType !== input.bType;
  }

  private isFcdaDisabled(
    fcdaElement: Element,
    controlElement: Element,
    withFilter: boolean = false
  ): boolean {
    // If daName is missing, we have an FCDO which is not currently supported
    // TODO: Remove this and actually support FCDOs
    const isFcdo = !fcdaElement.getAttribute('daName');
    const isPreconfiguredNotMatching =
      this.subscriberView &&
      this.nonMatchingExtRefElement(
        this.currentSelectedExtRefElement,
        fcdaElement,
        controlElement
      );

    const disabledFcdo =
      (isFcdo && !withFilter) || (withFilter && isFcdo && this.hideDataObjects);

    const disablePreconfigured =
      (isPreconfiguredNotMatching && !withFilter) ||
      (withFilter &&
        isPreconfiguredNotMatching &&
        this.hidePreconfiguredNotMatching);

    return disabledFcdo || disablePreconfigured;
  }

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    const isDisabled = this.isFcdaDisabled(fcdaElement, controlElement);

    const filterClasses = {
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
      'show-data-objects': !fcdaElement.getAttribute('daName'),
      'show-pxx-mismatch':
        this.subscriberView &&
        this.nonMatchingExtRefElement(
          this.currentSelectedExtRefElement,
          fcdaElement,
          controlElement
        ),
    };

    const { spec, desc } = this.getFcdaInfo(fcdaElement);
    const fcdaDesc = desc.join(' > ');

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${isDisabled}
      ?twoline=${fcdaDesc !== ''}
      class="fcda ${classMap(filterClasses)}"
      data-control="${identity(controlElement)}"
      data-fcda="${identity(fcdaElement)}"
      title="CDC: ${spec.cdc ?? '?'}
Basic Type: ${spec.bType}"
    >
      <span
        >${getFcdaOrExtRefSubtitleValue(fcdaElement)}
        ${getFcdaOrExtRefTitleValue(fcdaElement)}
      </span>
      <span slot="secondary"> ${fcdaDesc}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  renderFCDAListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off':
        this.hideSubscribed ||
        this.hideNotSubscribed ||
        this.hideDataObjects ||
        (this.hidePreconfiguredNotMatching && this.subscriberView),
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
          <mwc-check-list-item
            class="filter-data-objects"
            left
            ?selected=${!this.hideDataObjects}
          >
            <span>${msg('Show Data Objects')}</span>
          </mwc-check-list-item>
          ${this.subscriberView
            ? html`<mwc-check-list-item
                class="filter-preconfigured"
                left
                ?selected=${!this.hidePreconfiguredNotMatching}
              >
                <span
                  >${msg('Show Non-Matching Preconfigured')}</span
                ></mwc-check-list-item
              >`
            : nothing}
        </mwc-menu>
      </h1>
    `;
  }

  renderControlList(controlElements: Element[]): TemplateResult {
    const filteredListClasses = {
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
      'show-pxx-mismatch': !this.hidePreconfiguredNotMatching,
      'show-data-objects': !this.hideDataObjects,
    };

    return html`<div class="searchField">
        <abbr title="${msg('Search')}"
          ><mwc-textfield
            id="filterFcdaInput"
            iconTrailing="search"
            outlined
            @input=${debounce(() => {
              this.filterFcdaRegex = getFilterRegex(
                this.filterFcdaInputUI.value
              );
            })}
          ></mwc-textfield
        ></abbr>
      </div>
      <mwc-list
        id="fcdaList"
        ?activatable=${!this.subscriberView}
        class="styled-scrollbars ${classMap(filteredListClasses)}"
        @selected="${async (ev: SingleSelectedEvent) => {
          const selectedListItem = (<ListItemBase>(
            (<unknown>(<List>ev.target).selected)
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

          // only continue if conditions for subscription met
          if (
            !(
              this.subscriberView &&
              this.currentSelectedControlElement &&
              this.currentSelectedFcdaElement &&
              this.currentSelectedExtRefElement
            )
          ) {
            // in the subscriber view if an FCDA is selected, deactivate it
            // so that when it is re-selected it will trigger an event
            if (this.subscriberView) {
              selectedListItem.selected = false;
              selectedListItem.activated = false;
            }

            // conditions for a subscription have not been met
            return;
          }

          this.subscribe(
            this.currentSelectedExtRefElement,
            this.currentSelectedControlElement,
            this.currentSelectedFcdaElement
          );

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
                this.doc.querySelector(
                  selector('ExtRef', extref ?? 'Unknown')
                ) ?? undefined;
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
        }}"
      >
        ${controlElements
          .filter(controlElement => {
            const fcdaElements = getFcdaElements(controlElement);
            // if disabled (non-matching pXX or DOs) are filtered
            // then don't show them
            const onlyHasDisabledItems = fcdaElements.every(fcda =>
              this.isFcdaDisabled(fcda, controlElement, true)
            );
            const isWithinSearch =
              this.filterFcdaRegex &&
              fcdaElements.some(
                fcda =>
                  !this.filterFcdaRegex ||
                  this.filterFcdaRegex.test(
                    `${this.getFcdaSearchString(controlElement, fcda)}`
                  )
              );
            return (
              isWithinSearch && fcdaElements.length && !onlyHasDisabledItems
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
              ${fcdaElements
                .filter(
                  fcda =>
                    !this.filterFcdaRegex ||
                    this.filterFcdaRegex.test(
                      `${this.getFcdaSearchString(controlElement, fcda)}`
                    )
                )
                .map(fcdaElement =>
                  this.renderFCDA(controlElement, fcdaElement)
                )}
            `;
          })}
      </mwc-list>`;
  }

  private renderPublisherViewSubscribedExtRefs(): TemplateResult {
    const subscribedExtRefs = this.getSubscribedExtRefElements().filter(
      extRef =>
        this.filterExtRefPublisherRegex.test(
          `${identity(extRef)} ${getDescriptionAttribute(extRef)}`
        )
    );
    return html`
      <mwc-list-item noninteractive>
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
    const availableExtRefs = this.getAvailableExtRefElements().filter(extRef =>
      this.filterExtRefPublisherRegex.test(
        `${identity(extRef)} ${getDescriptionAttribute(extRef)}`
      )
    );
    return html`
      <mwc-list-item noninteractive>
        <span> ${msg('Available to subscribe')} </span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${availableExtRefs.length > 0
        ? html`${availableExtRefs.map(extRefElement => {
            const hasMissingMapping =
              isSubscribed(extRefElement) &&
              !findFCDAs(extRefElement).find(x => x !== undefined);
            const { spec } = this.getExtRefInfo(extRefElement);
            const desc = getDescriptionAttribute(extRefElement);
            const disabledExtRef = this.nonMatchingExtRefElement(
              extRefElement,
              this.currentSelectedFcdaElement,
              this.currentSelectedControlElement
            );
            const iedName = extRefElement.closest('IED')?.getAttribute('name');

            return html`<mwc-list-item
              graphic="large"
              ?disabled=${disabledExtRef}
              ?hasMeta=${isPartiallyConfigured(extRefElement) ||
              hasMissingMapping}
              ?twoline=${!!desc}
              class="extref ${disabledExtRef ? 'show-pxx-mismatch' : ''}"
              data-extref="${identity(extRefElement)}"
              title="${spec.cdc && spec.bType
                ? `CDC: ${spec.cdc ?? '?'}\nBasic Type: ${spec.bType ?? '?'}`
                : ''}"
            >
              <span>
                ${iedName} > ${extRefPath(extRefElement)}:
                ${extRefElement.getAttribute('intAddr')}
              </span>
              <span slot="secondary">${desc}</span>
              <mwc-icon slot="graphic">link_off</mwc-icon>
              ${isPartiallyConfigured(extRefElement)
                ? html`<mwc-icon
                    slot="meta"
                    class="invalid-mapping"
                    title="${msg('Invalid Mapping')}"
                    >error</mwc-icon
                  >`
                : nothing}
              ${hasMissingMapping
                ? html`<mwc-icon
                    class="missing-mapping"
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
    const menuClasses = {
      'filter-off':
        this.strictServiceTypes || this.hidePreconfiguredNotMatching,
    };

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
          class="show-unspecified-service-types"
          left
          ?selected=${!this.strictServiceTypes}
        >
          <span>${msg('Unspecified Service Types')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-preconfigured"
          left
          ?selected=${!this.hidePreconfiguredNotMatching}
        >
          <span>${msg('Show Non-Matching Preconfigured')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="filterExtRefPublisherIcon"
        class="${classMap(menuClasses)}"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuExtRefPublisherUI.open)
            this.filterMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
      <mwc-icon-button
        id="settingsExtRefPublisherIcon"
        title="${msg('Settings')}"
        icon="settings"
        @click=${() => {
          if (!this.settingsMenuExtRefPublisherUI.open)
            this.settingsMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="settingsExtRefPublisherMenu"
        multi
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="no-supervisions"
          left
          ?selected=${!this.notChangeSupervisionLNs}
        >
          <span>${msg('Change Supervision LNs')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
  }

  private renderSubscriberViewExtRefListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off':
        this.hideBound || this.hideNotBound || this.strictServiceTypes,
    };
    return html`<h1 class="subscriber-title">
      ${msg('Subscriber Inputs')}
      <mwc-icon-button
        id="filterExtRefSubscriberIcon"
        class="${classMap(menuClasses)}"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuExtRefSubscriberUI.open)
            this.filterMenuExtRefSubscriberUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="filterExtRefMenuSubscriber"
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
          class="show-unspecified-service-types"
          left
          ?selected=${!this.strictServiceTypes}
        >
          <span>${msg('Unspecified Service Types')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="settingsExtRefSubscriberIcon"
        title="${msg('Settings')}"
        icon="settings"
        @click=${() => {
          if (!this.settingsMenuExtRefSubscriberUI.open)
            this.settingsMenuExtRefSubscriberUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="settingsExtRefSubscriberMenu"
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
        <mwc-check-list-item
          class="no-supervisions"
          left
          ?selected=${!this.notChangeSupervisionLNs}
        >
          <span>${msg('Change Supervision LNs')}</span>
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
      controlBlockDescription = getExtRefControlBlockPath(extRefElement);
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

    const specExtRef = this.getExtRefInfo(extRefElement).spec;
    const specFcda = subscriberFCDA
      ? this.getFcdaInfo(subscriberFCDA).spec
      : null;

    // this fcda name is taken from the ExtRef so even if an FCDA
    // cannot be located we can "show" the subscription
    const fcdaName =
      subscribed || hasMissingMapping
        ? `${
            extRefElement.getAttribute('iedName') ?? 'Unknown'
          } > ${getFcdaOrExtRefSubtitleValue(
            extRefElement
          )} ${getFcdaOrExtRefTitleValue(extRefElement)} `
        : '';
    const fcdaDesc = subscriberFCDA
      ? this.getFcdaInfo(subscriberFCDA).desc.join('>')
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
      ?hasMeta=${supervisionNode !== undefined ||
      hasInvalidMapping ||
      hasMissingMapping}
      data-extref="${identity(extRefElement)}"
      title="${[specExtRefText, specFcdaText].join('\n')}"
    >
      <span class="extref-firstline">
        ${extRefPath(extRefElement)}: ${extRefElement.getAttribute('intAddr')}
        ${subscribed || hasInvalidMapping
          ? html`<mwc-icon class="left-inline-arrow">arrow_back</mwc-icon>
              ${subscribed ? `${fcdaName}` : ''}
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
    const ieds = getOrderedIeds(this.doc).filter(ied => {
      const extRefs = Array.from(this.getExtRefElementsByIED(ied));
      return extRefs.some(extRef =>
        this.filterExtRefSubscriberRegex.test(
          this.getExtRefSubscriberSearchString(extRef)
        )
      );
    });

    return html`${repeat(
      ieds,
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

        const iedInfo = [iedDesc, iedMfg, iedType]
          .filter(val => !!val)
          .join(' - ');

        return html`
          <mwc-list-item
            class="ied ${classMap(filterClasses)}"
            ?twoline=${iedDesc || iedType || iedMfg}
            noninteractive
            graphic="icon"
          >
            <span>${getNameAttribute(ied)}</span>
            <span slot="secondary">${iedInfo}</span>
            <mwc-icon slot="graphic">developer_board</mwc-icon>
          </mwc-list-item>
          ${repeat(
            Array.from(
              this.getExtRefElementsByIED(ied).filter(extRef =>
                this.filterExtRefSubscriberRegex.test(
                  this.getExtRefSubscriberSearchString(extRef)
                )
              )
            ),
            exId => `${identity(exId)} ${this.controlTag}`,
            extRef => this.renderSubscriberViewExtRef(extRef)
          )}
        `;
      }
    )}`;
  }

  renderExtRefs(): TemplateResult {
    if (!this.subscriberView) {
      return html`<section class="column">
        ${this.renderPublisherViewExtRefListTitle()}
        ${this.currentSelectedControlElement && this.currentSelectedFcdaElement
          ? html`<div class="searchField">
                <abbr title="${msg('Search')}"
                  ><mwc-textfield
                    id="filterExtRefPublisherInput"
                    iconTrailing="search"
                    outlined
                    @input=${debounce(() => {
                      this.filterExtRefPublisherRegex = getFilterRegex(
                        this.filterExtRefPublisherInputUI.value
                      );
                    })}
                  ></mwc-textfield
                ></abbr>
              </div>
              <mwc-list
                id="publisherExtRefList"
                class="styled-scrollbars ${!this.hidePreconfiguredNotMatching
                  ? 'show-pxx-mismatch'
                  : ''}"
                @selected=${(ev: SingleSelectedEvent) => {
                  const selectedListItem = (<ListItemBase>(
                    (<unknown>(<List>ev.target).selected)
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
                    this.subscribe(
                      selectedExtRefElement,
                      this.currentSelectedControlElement!,
                      this.currentSelectedFcdaElement!
                    );
                  } else {
                    this.unsubscribe(selectedExtRefElement);
                  }
                  // without this statement, neither the ExtRef list or the FCDA list
                  // (with the count) update correctly. It is unclear why.
                  this.requestUpdate();
                  selectedListItem.selected = false;
                }}
              >
                ${this.renderPublisherViewSubscribedExtRefs()}
                ${this.renderPublisherViewAvailableExtRefs()}
              </mwc-list>`
          : html`<h3>${msg('No published item selected')}</h3>`}
      </section>`;
    }

    const filteredListClasses = {
      'show-bound': !this.hideBound,
      'show-not-bound': !this.hideNotBound,
    };

    const hasExtRefs = this.doc?.querySelector(
      'IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, IED > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef'
    );

    return html`<section class="column extref">
      ${this.renderSubscriberViewExtRefListTitle()}
      ${!hasExtRefs
        ? html`<h3>${msg('No inputs')}</h3>`
        : html`<div class="searchField">
              <abbr title="${msg('Search')}"
                ><mwc-textfield
                  id="filterExtRefSubscriberInput"
                  iconTrailing="search"
                  outlined
                  @input=${debounce(() => {
                    this.filterExtRefSubscriberRegex = getFilterRegex(
                      this.filterExtRefSubscriberInputUI.value
                    );
                  })}
                ></mwc-textfield
              ></abbr>
            </div>
            <mwc-list
              id="subscriberExtRefList"
              class="styled-scrollbars ${classMap(filteredListClasses)}"
              activatable
              @selected=${(ev: SingleSelectedEvent) => {
                const selectedListItem = (<ListItemBase>(
                  (<unknown>(<List>ev.target).selected)
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
                  // list item is left selected to allow further subscription
                  this.currentSelectedFcdaElement = undefined;
                  this.currentSelectedControlElement = undefined;
                }

                this.currentSelectedExtRefElement = selectedExtRefElement;
              }}
              >${this.renderSubscriberViewExtRefs()}
            </mwc-list>`}
    </section>`;
  }

  renderControlTypeSelector(): TemplateResult {
    return html`
      <mwc-icon-button-toggle
        id="switchControlType"
        ?on=${this.controlTag === 'GSEControl'}
        title="${msg('Change between GOOSE and Sampled Value publishers')}"
        @click=${() => {
          if (this.controlTag === 'GSEControl') {
            this.controlTag = 'SampledValueControl';
          } else {
            this.controlTag = 'GSEControl';
          }
          this.resetCaching();
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
      ${controlElements.length !== 0
        ? this.renderControlList(controlElements)
        : html`<h3>
            ${this.subscriberView
              ? msg('No input selected')
              : msg('No published items')}
          </h3>`}
    </section>`;
  }

  renderSwitchView(): TemplateResult {
    return html`<mwc-icon-button-toggle
      id="switchView"
      ?on=${this.subscriberView}
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
    // initial information caching
    if (this.controlBlockFcdaInfo.size === 0) this.buildExtRefCount();

    const classList = { 'subscriber-view': this.subscriberView ?? false };
    const result = html`<div id="listContainer" class="${classMap(classList)}">
        ${this.renderPublisherFCDAs()} ${this.renderExtRefs()}
      </div>
      ${this.renderSwitchView()}`;
    return result;
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
    #filterExtRefSubscriberIcon,
    #settingsExtRefSubscriberIcon,
    #settingsExtRefPublisherIcon,
    #filterExtRefPublisherIcon {
      float: right;
    }

    #filterFcdaIcon.filter-off,
    #filterExtRefSubscriberIcon.filter-off,
    #filterExtRefPublisherIcon.filter-off {
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

    /* hide data objects if filter enabled */
    #fcdaList:not(.show-data-objects) mwc-list-item.fcda.show-data-objects {
      display: none;
    }

    /* hide preferred items mismatch if filter enabled */
    #fcdaList:not(.show-pxx-mismatch) mwc-list-item.fcda.show-pxx-mismatch {
      display: none;
    }

    /* hide mismatch preferred items for publisher view available extrefs */
    #publisherExtRefList:not(.show-pxx-mismatch)
      mwc-list-item.extref.show-pxx-mismatch {
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

    /* TODO: Can we do better than a hard-coded max-height */
    .styled-scrollbars {
      max-height: 78vh;
      overflow: auto;
    }

    .styled-scrollbars {
      scrollbar-width: auto;
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

    .searchField {
      display: flex;
      flex: auto;
    }

    .searchField abbr {
      display: flex;
      flex: auto;
      margin: 8px;
      text-decoration: none;
      border-bottom: none;
    }

    .searchField mwc-textfield {
      width: 100%;
      --mdc-shape-small: 28px;
    }
  `;
}
