import {
  css,
  html,
  LitElement,
  nothing,
  PropertyValues,
  SVGTemplateResult,
  TemplateResult
} from 'lit';

import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  extRefTypeRestrictions,
  fcdaBaseTypes,
  find,
  identity,
  subscribe,
  unsubscribe
} from '@openenergytools/scl-lib';

// not exported: removeSubscriptionSupervision

import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-icon-button-toggle';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-list/mwc-radio-list-item';
import '@material/mwc-menu';
import '@material/mwc-textfield';

import {
  Edit,
  EditEvent,
  isInsert,
  isRemove,
  isUpdate,
  newEditEvent
} from '@openscd/open-scd-core';

import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { List, SingleSelectedEvent } from '@material/mwc-list';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { ListItemBase } from '@material/mwc-list/mwc-list-item-base.js';
import type { Menu } from '@material/mwc-menu';
import type { TextField } from '@material/mwc-textfield';

import {
  findControlBlock,
  findFCDA,
  getCbReference,
  getExistingSupervision,
  getExtRefElements,
  getFcdaElements,
  getExtRefControlBlockPath,
  getFcdaOrExtRefTitle,
  getOrderedIeds,
  getSubscribedExtRefElements,
  getUsedSupervisionInstances,
  isPartiallyConfigured,
  isSubscribed
} from './foundation/subscription/subscription.js';
import {
  findFCDAs,
  getDescriptionAttribute,
  getNameAttribute
} from './foundation/foundation.js';
import {
  gooseIcon,
  smvIcon,
  gooseActionIcon,
  smvActionIcon
} from './foundation/icons.js';

import { getFcdaInstDesc } from './foundation/tDataSet/getFcdaInstDesc.js';

import type { fcdaDesc } from './foundation/tDataSet/getFcdaInstDesc.js';
import type { fcdaData } from './foundation/subscription/subscription.js';

type controlTagType = 'SampledValueControl' | 'GSEControl';

type iconLookup = Record<controlTagType, SVGTemplateResult>;

type fcdaInfo = {
  spec:
    | {
        cdc: string;
        bType?: string | undefined;
      }
    | undefined;
  desc: fcdaDesc;
};

type extRefInfo = {
  spec:
    | {
        cdc: string;
        bType?: string | undefined;
      }
    | undefined;
};

const iconControlLookup: iconLookup = {
  SampledValueControl: smvIcon,
  GSEControl: gooseIcon
};

interface ServiceTypeLookup {
  [key: string]: 'GOOSE' | 'SMV';
}
const serviceTypeLookup: ServiceTypeLookup = {
  GSEControl: 'GOOSE',
  SampledValueControl: 'SMV'
};

enum FcdaSortOrder {
  DataModel,
  Path,
  FullDescription,
  DODescription,
  DADescription
}

enum ExtRefSortOrder {
  DataModel,
  InternalAddress,
  Description,
  MappedReference
}

type StoredConfiguration = {
  subscriberView: boolean;
  controlTag: controlTagType;
  filterOutSubscribed: boolean;
  filterOutUnsubscribed: boolean;
  filterOutDataObjects: boolean;
  filterOutQuality: boolean;
  filterOutPreconfiguredNotMatching: boolean;
  autoIncrement: boolean;
  ignoreSupervision: boolean;
  allowExternalPlugins: boolean;
  checkOnlyPreferredBasicType: boolean;
  filterOutBound: boolean;
  filterOutNotBound: boolean;
  strictServiceTypes: boolean;
  filterOutpDAq: boolean;
  sortExtRefPublisher: ExtRefSortOrder;
  sortExtRefSubscriber: ExtRefSortOrder;
  sortFcda: FcdaSortOrder;
};

type DoesFcdaMeetExtRefRestrictionsOptions = {
  /** The control block type to check against `pServT` */
  controlBlockType?: 'GOOSE' | 'Report' | 'SMV' | 'Poll';
  /** Whether to only check against basic type. Skips check against pDO and pLN */
  checkOnlyBType?: boolean;
};

// This array must match the names of the above types as it used to
// check if settings should be written to local storage.
// There is no easy way to go from types to to an array of keys
// see: https://github.com/Microsoft/TypeScript/issues/14419 for
// requests for a custom transformer to achieve this
const storedProperties: string[] = [
  'subscriberView',
  'controlTag',
  'filterOutSubscribed',
  'filterOutUnsubscribed',
  'filterOutDataObjects',
  'filterOutQuality',
  'filterOutPreconfiguredNotMatching',
  'autoIncrement',
  'ignoreSupervision',
  'allowExternalPlugins',
  'checkOnlyPreferredBasicType',
  'filterOutBound',
  'filterOutNotBound',
  'strictServiceTypes',
  'filterOutpDAq',
  'sortExtRefPublisher',
  'sortExtRefSubscriber',
  'sortFcda'
];

/**
 * Given an identity string prefixed with an IED name, remove the IED
 * name and make more human readable by adding spaces around carets.
 * @param idString
 * @returns - an identity string without the iedName.
 */
function trimIdentityParent(idString: string): string {
  return idString
    .split('>')
    .filter(s => s !== '')
    .slice(1)
    .join(' > ');
}

/**
 * Sort ExtRefs according to an enumerated value allowing:
 * data model, internal address, description or mapped refernece.
 * Intended to be used with a sort function.
 * @param sortSetting - An enumeration for the above.
 * @param aExtRef - An SCL ExtRef element.
 * @param bExtRef - An SCL ExtRef element.
 * @returns a number.
 */
function sortExtRefItems(
  sortSetting: ExtRefSortOrder,
  aExtRef: Element,
  bExtRef: Element
): number {
  if (sortSetting === ExtRefSortOrder.InternalAddress)
    return (aExtRef.getAttribute('intAddr') ?? '').localeCompare(
      bExtRef.getAttribute('intAddr') ?? ''
    );

  if (sortSetting === ExtRefSortOrder.Description) {
    const hasDescFirstnotSecond = (a: Element, b: Element) =>
      (!b.hasAttribute('desc') || b.getAttribute('desc') === '') &&
      a.hasAttribute('desc') &&
      a.getAttribute('desc') !== '';

    // descriptions always come first
    if (hasDescFirstnotSecond(aExtRef, bExtRef)) return -1;
    if (hasDescFirstnotSecond(bExtRef, aExtRef)) return 1;

    return (aExtRef.getAttribute('desc') ?? '').localeCompare(
      bExtRef.getAttribute('desc') ?? ''
    );
  }

  const getFcdaName = (ext: Element) =>
    `${ext.getAttribute('iedName') ?? 'Unknown'} > ${getFcdaOrExtRefTitle(
      ext
    )}`;

  if (sortSetting === ExtRefSortOrder.MappedReference)
    return getFcdaName(aExtRef).localeCompare(getFcdaName(bExtRef));

  // data model order
  return 0;
}

/**
 * Given an SCL element, returns an object reference up to the
 * Logical Device.
 * @param sclElement - an SCL  element.
 * @returns a string.
 */
function objectReferenceInIed(sclElement: Element): string {
  const lN = sclElement.closest('LN') ?? sclElement.closest('LN0');
  const lDevice = lN!.closest('LDevice')!;

  const ldInst = lDevice.getAttribute('inst');
  const lnPrefix = lN!.getAttribute('prefix') ?? '';
  const lnClass = lN!.getAttribute('lnClass');
  const lnInst = lN!.getAttribute('inst');

  return [ldInst, '/', lnPrefix, lnClass, lnInst].filter(a => !!a).join(' ');
}

function doesExtRefpDAIncludeQ(extRef: Element): boolean {
  return (
    extRef.hasAttribute('pDA') &&
    extRef.getAttribute('pDA')?.split('.').pop() === 'q'
  );
}

/**
 * Creates a regular expression to allow case-insensitive searching of list
 * items.
 *
 * * Supports globbing with * and
 * * Supports quoting using both ' and " and is an AND-ing search which
 *   narrows as further search text is added.
 *
 * @param searchExpression
 * @returns a regular expression
 */
function getSearchRegex(searchExpression: string): RegExp {
  if (searchExpression === '') {
    return /.*/i;
  }
  const terms: string[] =
    searchExpression
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .trim()
      .match(/(?:[^\s"']+|['"][^'"]*["'])+/g) ?? [];

  const expandedTerms = terms.map(term =>
    term.replace(/\*/g, '.*').replace(/\?/g, '.{1}').replace(/"|'/g, '')
  );

  const regexString = expandedTerms.map(term => `(?=.*${term})`);

  return new RegExp(`${regexString.join('')}.*`, 'i');
}

function debounce(callback: any, delay = 100) {
  let timeout: any;

  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/**
 * A plugin to allow subscriptions of GOOSE and SV using the
 * later binding method as described in IEC 61850-6 Ed 2.1 providing
 * both a publisher and subscriber-oriented view.
 */
export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property() docName!: string;

  @property() editCount!: number;

  @property({ type: String, reflect: true })
  identity = 'danyill.oscd-subscriber-later-binding';

  @property({ type: Boolean, reflect: true })
  allowExternalPlugins = true;

  @property({ type: Boolean, reflect: true })
  checkOnlyPreferredBasicType!: boolean;

  @property({ type: Boolean })
  controlTag!: controlTagType;

  @property({ type: Boolean })
  subscriberView!: boolean;

  @property({ type: Boolean })
  filterOutSubscribed!: boolean;

  @property({ type: Boolean })
  filterOutNotSubscribed!: boolean;

  @property({ type: Boolean })
  filterOutDataObjects!: boolean;

  @property({ type: Boolean })
  filterOutQuality!: boolean;

  @property({ type: Boolean })
  filterOutPreconfiguredUnmatched!: boolean;

  @property({ type: Boolean })
  autoIncrement!: boolean;

  @property({ type: Boolean, reflect: true })
  ignoreSupervision!: boolean;

  @property({ type: Boolean })
  filterOutBound!: boolean;

  @property({ type: Boolean })
  filterOutNotBound!: boolean;

  @property({ type: Boolean })
  strictServiceTypes!: boolean;

  @property({ type: Boolean })
  filterOutpDAq!: boolean;

  @property({ type: String })
  sortExtRefPublisher!: ExtRefSortOrder;

  @property({ type: String })
  sortExtRefSubscriber!: ExtRefSortOrder;

  @property({ type: String })
  sortFcda!: FcdaSortOrder;

  @property({ type: String })
  searchFcdaRegex: RegExp = /.*/i;

  @property({ type: String })
  searchExtRefPublisherRegex: RegExp = /.*/i;

  @property({ type: String })
  searchExtRefSubscriberRegex: RegExp = /.*/i;

  @state()
  selectedControl: Element | undefined;

  @state()
  selectedFCDA: Element | undefined;

  @state()
  selectedIED: Element | undefined;

  @state()
  selectedExtRef: Element | undefined;

  private controlBlockFcdaInfo = new Map<string, number>();

  private fcdaInfo = new Map<string, fcdaData>();

  private extRefInfo = new Map<string, extRefInfo>();

  private supervisionData = new Map();

  @query('#switchView')
  switchViewUI?: IconButtonToggle;

  @query('#switchControlType')
  switchControlTypeUI?: IconButtonToggle;

  @query('#filterFcdaMenu')
  filterMenuFcdaUI!: Menu;

  @query('#filterFcdaIcon')
  filterMenuFcdaButtonUI!: Icon;

  @query('#filterFcdaInput')
  filterFcdaInputUI?: TextField;

  @query('#filterExtRefPublisherInput')
  filterExtRefPublisherInputUI?: TextField;

  @query('#filterExtRefSubscriberInput')
  filterExtRefSubscriberInputUI?: TextField;

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

  @query('#sortExtRefPublisherIcon')
  sortMenuExtRefPublisherButtonUI!: Icon;

  @query('#sortExtRefPublisherMenu')
  sortMenuExtRefPublisherUI!: Menu;

  @query('#sortExtRefSubscriberIcon')
  sortMenuExtRefSubscriberButtonUI!: Icon;

  @query('#sortExtRefSubscriberMenu')
  sortMenuExtRefSubscriberUI!: Menu;

  @query('#sortFcdaIcon')
  sortMenuFcdaButtonUI!: Menu;

  @query('#sortFcdaMenu')
  sortMenuFcdaUI!: Menu;

  @query('#fcdaList')
  fcdaListUI?: List;

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

  @query('#saveSubscriberExtRefToMarkdown')
  subscriberExtRefMarkdownSaveButton?: Icon;

  constructor() {
    super();

    // edits are processed to allow updating of cached values from
    // menu plugins which provide manufacturer-specific functionality
    // allowing e.g. .stVal and .q to be single-click mapped.

    // before edit occurs
    window.addEventListener(
      'oscd-edit',
      event => this.updateCaching(event as EditEvent, 'before'),
      { capture: true }
    );

    // after edit occurs
    window.addEventListener('oscd-edit', event =>
      this.updateCaching(event as EditEvent, 'after')
    );
  }

  /**
   * Updates caching of control blocks, used FCDAs and supervision LNs.
   * Done through even listening to all menu plugins to use events and be able
   * to expect caching to be updated.
   * @param event - `oscd-edit` event.
   * @param when - 'before' or 'after' the event occurs.
   */
  protected updateCaching(event: EditEvent, when: 'before' | 'after'): void {
    // Infinity as 1 due to error type instantiation error
    // https://github.com/microsoft/TypeScript/issues/49280
    const flatEdits = [event.detail].flat(Infinity as 1);

    // ExtRef information will be regenerated as required, just remove it
    const handleExtRef = (extRef: Element) => {
      if (!isSubscribed(extRef)) return;
      this.extRefInfo.delete(`${identity(extRef)}`);

      const controlElement = findControlBlock(extRef);
      let fcdaElement;
      if (controlElement) fcdaElement = findFCDA(extRef, controlElement);
      if (controlElement && fcdaElement) {
        const controlBlockFcdaId = `${identity(controlElement)} ${identity(
          fcdaElement
        )}`;
        this.controlBlockFcdaInfo.delete(controlBlockFcdaId);
      }
    };

    // FCDA information will be regenerated as required, just remove it
    const handleFCDA = (fcda: Element) => {
      this.fcdaInfo.delete(`${identity(fcda)}`);
    };

    const isSupervision = (element: Element) => {
      if (['LN', 'DOI', 'DAI', 'Val'].includes(element.tagName)) {
        return (
          (element.tagName === 'LN' &&
            ['LGOS', 'LSVS'].includes(element.getAttribute('lnClass') ?? '')) ||
          ['LGOS', 'LSVS'].includes(
            element.closest('LN')?.getAttribute('lnClass') ?? ''
          )
        );
      }
      return false;
    };

    const handleSupervision = (
      supElement: Element,
      remove: boolean = false
    ) => {
      let supLn: Element | null;
      if (supElement.tagName === 'LN') {
        supLn = supElement;
      } else {
        supLn = supElement.closest('LN');
      }
      if (supLn) {
        if (!remove) this.updateSupervisionCache(supLn);
        if (remove) this.updateSupervisionCache(supLn, true);
      }
    };

    flatEdits.forEach(edit => {
      let element: Element | undefined;
      if (isUpdate(edit)) {
        element = edit.element;
      } else if (
        (isRemove(edit) || isInsert(edit)) &&
        edit.node.nodeType === Node.ELEMENT_NODE
      ) {
        element = edit.node as Element;
      }

      if (element) {
        if (element.tagName === 'ExtRef') handleExtRef(element);

        if (element.tagName === 'FCDA') handleFCDA(element);

        // need to track before and after to ensure that appropriate values
        // can be extracted
        if (isSupervision(element) && when === 'before' && isRemove(edit))
          handleSupervision(element, true);
        if (isSupervision(element) && when === 'after' && !isRemove(edit))
          handleSupervision(element);
      }
    });
  }

  /**
   * Settings are stored in a single JSON value tagged against this plugin
   * for simplicity.
   */
  protected storeSettings(): void {
    const storedConfiguration = {
      subscriberView: this.subscriberView,
      controlTag: this.switchControlTypeUI!.on
        ? 'GSEControl'
        : 'SampledValueControl',
      filterOutSubscribed: this.filterOutSubscribed,
      filterOutNotSubscribed: this.filterOutNotSubscribed,
      filterOutDataObjects: this.filterOutDataObjects,
      filterOutQuality: this.filterOutQuality,
      filterOutPreconfiguredUnmatched: this.filterOutPreconfiguredUnmatched,
      autoIncrement: this.autoIncrement,
      ignoreSupervision: this.ignoreSupervision,
      allowExternalPlugins: this.allowExternalPlugins,
      checkOnlyPreferredBasicType: this.checkOnlyPreferredBasicType,
      filterOutBound: this.filterOutBound,
      filterOutNotBound: this.filterOutNotBound,
      strictServiceTypes: this.strictServiceTypes,
      filterOutpDAq: this.filterOutpDAq,
      sortExtRefPublisher: this.sortExtRefPublisher,
      sortExtRefSubscriber: this.sortExtRefSubscriber,
      sortFcda: this.sortFcda
    };

    localStorage.setItem(
      'oscd-subscriber-later-binding',
      JSON.stringify(storedConfiguration)
    );
  }

  /**
   * Restore settings from local storage, applying appropriate defaults
   * if not set.
   */
  protected restoreSettings(): void {
    const storedSettings = localStorage.getItem(
      'oscd-subscriber-later-binding'
    );
    const storedConfiguration: StoredConfiguration = storedSettings
      ? JSON.parse(storedSettings)
      : undefined;

    this.subscriberView = storedConfiguration?.subscriberView ?? false;
    this.controlTag = storedConfiguration?.controlTag ?? 'GSEControl';

    this.filterOutSubscribed =
      storedConfiguration?.filterOutSubscribed || false;
    this.filterOutNotSubscribed =
      storedConfiguration?.filterOutUnsubscribed || false;

    this.filterOutDataObjects =
      storedConfiguration?.filterOutDataObjects || false;

    this.filterOutQuality = storedConfiguration?.filterOutQuality || false;

    this.filterOutPreconfiguredUnmatched =
      storedConfiguration?.filterOutPreconfiguredNotMatching || false;

    this.autoIncrement = storedConfiguration?.autoIncrement ?? true;
    this.ignoreSupervision = storedConfiguration?.ignoreSupervision ?? false;
    this.allowExternalPlugins =
      storedConfiguration?.allowExternalPlugins ?? true;
    this.checkOnlyPreferredBasicType =
      storedConfiguration?.checkOnlyPreferredBasicType || false;

    this.filterOutBound = storedConfiguration?.filterOutBound ?? false;
    this.filterOutNotBound = storedConfiguration?.filterOutNotBound ?? false;
    this.strictServiceTypes = storedConfiguration?.strictServiceTypes ?? false;
    this.filterOutpDAq = storedConfiguration?.filterOutpDAq ?? false;

    this.sortExtRefPublisher =
      storedConfiguration?.sortExtRefPublisher ?? ExtRefSortOrder.DataModel;
    this.sortExtRefSubscriber =
      storedConfiguration?.sortExtRefSubscriber ?? ExtRefSortOrder.DataModel;
    this.sortFcda = storedConfiguration?.sortFcda ?? FcdaSortOrder.DataModel;
  }

  /**
   * Retrieve matching control blocks in the SCL document to allow UI display
   * In the subscriber view show all control blocks, in the publisher view
   * only for "other IEDs".
   * @param controlTag - The SCL control block element tagName string.
   * @returns An array of control block elements for processing.
   */
  private getControlElements(controlTag: controlTagType): Element[] {
    if (this.doc) {
      return Array.from(
        this.doc.querySelectorAll(`LN0 > ${controlTag}`)
      ).filter(
        control =>
          !this.subscriberView ||
          !this.selectedExtRef ||
          control.closest('IED') !== this.selectedExtRef?.closest('IED')
      );
    }
    return [];
  }

  /**
   * Count the number of times an FCDA is used in an ExtRef to report
   * subscription count in the UI.
   * @param fcda - SCL FCDA element.
   * @param control - SCL control block, `GSEControl` or `SampledValueControl`.
   * @returns
   */
  private getExtRefCount(fcda: Element, control: Element): number {
    const controlBlockFcdaId = `${identity(control)} ${identity(fcda)}`;
    if (!this.controlBlockFcdaInfo.has(controlBlockFcdaId)) {
      const extRefCount = getSubscribedExtRefElements(
        <Element>this.doc.getRootNode(),
        this.controlTag,
        fcda,
        control!,
        true // TODO: do we need this?
      ).length;
      this.controlBlockFcdaInfo.set(controlBlockFcdaId, extRefCount);
    }
    return this.controlBlockFcdaInfo.get(controlBlockFcdaId)!;
  }

  /**
   * Store information about each FCDA, its specification (CDC and basic type)
   * and also how many times it is used in an ExtRef.
   * @param fcda - SCL FCDA element.
   * @returns nothing - cached on the class variable `fcdaInfo`.
   */
  private getFcdaInfo(fcda: Element): fcdaInfo {
    const id = `${identity(fcda)}`;
    if (!this.fcdaInfo.has(id)) {
      const spec = fcdaBaseTypes(fcda);
      const desc = getFcdaInstDesc(fcda);
      this.fcdaInfo.set(id, { spec, desc });
    }
    return this.fcdaInfo.get(id)!;
  }

  /**
   * Store information about each ExtRef, CDC and basic type.
   * @param extRef - SCL ExtREf element.
   * @returns nothing - stored against class variable `extRefInfo`.
   */
  private getExtRefInfo(extRef: Element): extRefInfo {
    const id = `${identity(extRef)}`;
    if (!this.extRefInfo.has(id)) {
      const spec = extRefTypeRestrictions(extRef);
      this.extRefInfo.set(id, { spec });
    }
    return this.extRefInfo.get(id)!;
  }

  /**
   * Generates a searchable string for the list search for a given ExtRef element
   * Intended to allow an "if you can see it, you can search it" approach.
   *
   * @param extRef - SCL ExtRef element.
   * @returns a string concatenating key searchable field values.
   */
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
    let fcdaSpec;

    if (subscribed) {
      subscriberFCDA = findFCDAs(extRef).find(x => x !== undefined);
      extRefPathValue = `${extRef.getAttribute(
        'iedName'
      )} ${getFcdaOrExtRefTitle(extRef)}`;

      if (subscriberFCDA) {
        const fcdaInfo = this.getFcdaInfo(subscriberFCDA);
        fcdaDesc = subscriberFCDA
          ? Object.values(fcdaInfo.desc)
              .flat(Infinity as 1)
              .join('>')
          : null;
        fcdaSpec = `${fcdaInfo.spec?.cdc ?? ''} ${fcdaInfo.spec?.bType ?? ''}`;
      }
    }

    const extRefCBPath = getExtRefControlBlockPath(extRef);

    return `${iedInfo} ${identity(extRef)} ${identity(
      this.getCachedSupervision(extRef) ?? null
    )} ${getDescriptionAttribute(extRef)} ${identity(subscriberFCDA ?? null)} ${
      fcdaDesc ?? ''
    } ${fcdaSpec ?? ''} ${extRefPathValue} ${extRefCBPath}`;
  }

  /**
   * Generates a searchable string for the list search for a given FCDA with
   * a control block.
   * Intended to allow an "if you can see it, you can search it" approach.
   *
   * @param control - SCL control block element.
   * @param fcda - SCL FCDA element.
   * @returns a string concatenating key searchable field values.
   */
  private getFcdaSearchString(control: Element, fcda: Element): string {
    const fcdaInfo = this.getFcdaInfo(fcda);
    return `${identity(control)} ${getDescriptionAttribute(control)} ${identity(
      fcda
    )} ${fcdaInfo.spec?.bType ?? ''} ${
      fcdaInfo.spec?.cdc ?? ''
    } ${getFcdaOrExtRefTitle(fcda)} ${Object.values(fcdaInfo.desc)
      .flat(Infinity as 1)
      .join(' ')}`;
  }

  /**
   * Reset all caching for a UI change or a new document
   */
  protected resetCaching(): void {
    // reset caching
    this.controlBlockFcdaInfo = new Map();
    this.fcdaInfo = new Map();
    this.extRefInfo = new Map();

    // reset supervision cache
    this.reCreateSupervisionCache();
  }

  /**
   * Reset search fields for a UI change
   */
  resetSearchFields(): void {
    if (this.filterExtRefPublisherInputUI) {
      this.filterExtRefPublisherInputUI.value = '';
      this.searchExtRefPublisherRegex = /.*/i;
    }

    if (this.filterExtRefSubscriberInputUI) {
      this.filterExtRefSubscriberInputUI.value = '';
      this.searchExtRefSubscriberRegex = /.*/i;
    }

    if (this.filterFcdaInputUI) this.filterFcdaInputUI.value = '';
    this.searchFcdaRegex = /.*/i;
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    // When a new document is loaded or we do a subscription/we will reset the Map to clear old entries.
    // TODO: Be able to detect the same document loaded twice, currently lack a way to check for this
    // https://github.com/openscd/open-scd-core/issues/92
    if (changedProperties.has('docName')) {
      this.resetSearchFields();

      this.selectedControl = undefined;
      this.selectedFCDA = undefined;
      this.selectedExtRef = undefined;

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

    if (changedProperties.has('subscriberView')) {
      // re-attach anchors
      this.updateView();
    }

    // update local storage for stored plugin settings
    const settingsUpdateRequired = Array.from(changedProperties.keys()).some(
      r => storedProperties.includes(r.toString())
    );
    if (settingsUpdateRequired) this.storeSettings();
  }

  /**
   * Unsubscribing means removing a list of attributes from the ExtRef Element.
   * Supervisions are handled independently as this is a setting option.
   *
   * @param extRef - The Ext Ref Element to clean from attributes.
   */
  private unsubscribeExtRef(extRef: Element): void {
    const editActions: Edit[] = [];

    editActions.push(
      ...unsubscribe([extRef], { ignoreSupervision: this.ignoreSupervision })
    );

    this.dispatchEvent(newEditEvent(editActions));
  }

  /**
   * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
   *
   * @param extRef - The ExtRef Element to add the attributes to.
   */
  private subscribe(
    extRef: Element,
    controlBlock: Element,
    fcda: Element
  ): void {
    // need to remove invalid existing subscription
    if (isSubscribed(extRef) || isPartiallyConfigured(extRef))
      this.dispatchEvent(
        newEditEvent(
          unsubscribe([extRef], { ignoreSupervision: this.ignoreSupervision })
        )
      );

    const subscribeEdits: Edit[] = subscribe(
      { sink: extRef, source: { fcda, controlBlock } },
      {
        force: this.checkOnlyPreferredBasicType,
        ignoreSupervision: this.ignoreSupervision
      }
    );
    this.dispatchEvent(newEditEvent(subscribeEdits));
  }

  public getSubscribedExtRefElements(): Element[] {
    return getSubscribedExtRefElements(
      <Element>this.doc.getRootNode(),
      this.controlTag,
      this.selectedFCDA,
      this.selectedControl,
      true
    );
  }

  /**
   * Retrieve ExtRefs which match current control block type settings in
   * UI for display purposes.
   * @param extRef - SCL ExtRef element
   * @returns whether or not an ExtRef is viewable in the UI
   */
  private isExtRefViewable(extRef: Element): boolean {
    return (
      extRef.hasAttribute('intAddr') &&
      ((!this.strictServiceTypes &&
        !extRef.hasAttribute('serviceType') &&
        !extRef.hasAttribute('pServT')) ||
        extRef.getAttribute('serviceType') ===
          serviceTypeLookup[this.controlTag] ||
        extRef.getAttribute('pServT') === serviceTypeLookup[this.controlTag])
    );
  }

  /**
   * Get document ExtRef elements available for subscription.
   *
   * @returns An Array of ExtRef SCL elements.
   */
  public getAvailableExtRefElements(): Element[] {
    return getExtRefElements(
      <Element>this.doc.getRootNode(),
      this.selectedFCDA,
      true
    ).filter(
      extRefElement =>
        (!isSubscribed(extRefElement) ||
          !findFCDAs(extRefElement).find(x => x !== undefined)) &&
        this.isExtRefViewable(extRefElement)
    );
  }

  /**
   * For a given supervision node, updates cache information.
   * @param supLn - an SCL LN used for supervision, LGOS or LSVS.
   * @param remove - whether a supervision is being removed.
   * @returns - nothing. Updates cache values.
   */
  private updateSupervisionCache(supLn: Element, remove: boolean = false) {
    // supervision could be removed leaving no information in the document
    // if via an event
    if (!supLn.closest('IED')) return;

    const supervisionType =
      serviceTypeLookup[this.controlTag] === 'GOOSE' ? 'LGOS' : 'LSVS';
    const refSelector =
      supervisionType === 'LGOS'
        ? 'DOI[name="GoCBRef"]'
        : 'DOI[name="SvCBRef"]';

    const cbRef = supLn!.querySelector(
      `${refSelector}>DAI[name="setSrcRef"]>Val`
    );

    const iedName = supLn.closest('IED')!.getAttribute('name');
    if (cbRef && !remove)
      this.supervisionData.set(`${iedName} ${cbRef.textContent}`, supLn);
    if (cbRef && remove)
      this.supervisionData.delete(`${iedName} ${cbRef.textContent}`);
  }

  private reCreateSupervisionCache() {
    this.supervisionData = new Map();

    getUsedSupervisionInstances(
      this.doc,
      serviceTypeLookup[this.controlTag]
    ).forEach(supervisionLN => this.updateSupervisionCache(supervisionLN));
  }

  /**
   * Returns viewable ExtRefs for UI functions.
   * @param ied - an SCL IED element.
   * @returns - an Array of SCL ExtRefs.
   */
  private getExtRefElementsByIED(ied: Element): Element[] {
    return Array.from(
      ied.querySelectorAll(
        `:scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef,
         :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
      )
    ).filter(extRef => this.isExtRefViewable(extRef));
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
        this.filterOutBound = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(0);
        this.filterOutNotBound = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(1);
        this.strictServiceTypes = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(2);
        this.filterOutpDAq = !(<Set<number>>(
          this.filterMenuExtRefSubscriberUI.index
        )).has(3);
      });

      this.settingsMenuExtRefSubscriberUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefSubscriberButtonUI
      );

      this.settingsMenuExtRefSubscriberUI.addEventListener('closed', () => {
        this.autoIncrement = (<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(0);
        this.ignoreSupervision = !(<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(1);
        this.allowExternalPlugins = (<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(2);
        this.checkOnlyPreferredBasicType = (<Set<number>>(
          this.settingsMenuExtRefSubscriberUI.index
        )).has(3);
        // required for checkOnlyPreferredBasic type to refresh
        this.requestUpdate();
      });

      this.sortMenuExtRefSubscriberUI.anchor = <HTMLElement>(
        this.sortMenuExtRefSubscriberButtonUI
      );

      this.sortMenuExtRefSubscriberUI.addEventListener('closed', () => {
        this.sortExtRefSubscriber =
          <number>this.sortMenuExtRefSubscriberUI.index === -1
            ? ExtRefSortOrder.DataModel
            : <number>this.sortMenuExtRefSubscriberUI.index;
      });
    } else {
      this.filterMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.filterMenuExtrefPublisherButtonUI
      );

      this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.strictServiceTypes = !(<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(0);
        this.filterOutPreconfiguredUnmatched = !(<Set<number>>(
          this.filterMenuExtRefPublisherUI.index
        )).has(1);
      });

      this.sortMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.sortMenuExtRefPublisherButtonUI
      );

      this.sortMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.sortExtRefPublisher =
          <number>this.sortMenuExtRefPublisherUI.index === -1
            ? ExtRefSortOrder.DataModel
            : <number>this.sortMenuExtRefPublisherUI.index;
      });

      this.settingsMenuExtRefPublisherUI.anchor = <HTMLElement>(
        this.settingsMenuExtRefPublisherButtonUI
      );

      this.settingsMenuExtRefPublisherUI.addEventListener('closed', () => {
        this.ignoreSupervision = !(<Set<number>>(
          this.settingsMenuExtRefPublisherUI.index
        )).has(0);
        this.allowExternalPlugins = (<Set<number>>(
          this.settingsMenuExtRefPublisherUI.index
        )).has(1);
        this.checkOnlyPreferredBasicType = (<Set<number>>(
          this.settingsMenuExtRefPublisherUI.index
        )).has(2);
        // required for checkOnlyPreferredBasic type to refresh
        this.requestUpdate();
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    // restore settings from local storage on plugin loading
    this.restoreSettings();
  }

  protected async firstUpdated(): Promise<void> {
    this.filterMenuFcdaUI.anchor = <HTMLElement>this.filterMenuFcdaButtonUI;

    this.filterMenuFcdaUI.addEventListener('closed', () => {
      this.filterOutSubscribed = !(<Set<number>>(
        this.filterMenuFcdaUI.index
      )).has(0);
      this.filterOutNotSubscribed = !(<Set<number>>(
        this.filterMenuFcdaUI.index
      )).has(1);
      this.filterOutDataObjects = !(<Set<number>>(
        this.filterMenuFcdaUI.index
      )).has(2);
      this.filterOutQuality = !(<Set<number>>this.filterMenuFcdaUI.index).has(
        3
      );
      if (this.subscriberView)
        this.filterOutPreconfiguredUnmatched = !(<Set<number>>(
          this.filterMenuFcdaUI.index
        )).has(4);
    });

    this.sortMenuFcdaUI.anchor = <HTMLElement>this.sortMenuFcdaButtonUI;

    this.sortMenuFcdaUI.addEventListener('closed', () => {
      this.sortFcda =
        <number>this.sortMenuFcdaUI.index === -1
          ? FcdaSortOrder.DataModel
          : <number>this.sortMenuFcdaUI.index;
    });

    this.updateView();
  }

  /**
   * This function checks if restrictions of an `ExtRef` element given by
   * `pDO` and optionally by `pDA`, `pLN` and `pServT` are met by the FCDA/FCD
   * @param extRef - The `ExtRef` element to be checked against
   * @param data - The `FCDA` element to be checked
   * @param controlBlockType - The control block type to check back with `pServT`
   * @returns Whether the FCDA basic types meet the restrictions of the
   * ExtRef element
   *
   * IMPORTANT: This function  is an _almost_ exact copy of the same function in
   * scl-lib and is different only in that it uses cached values for performance,
   * uses the UI option for the control block type and short circuits at the top
   * for missing elements
   *
   */
  doesFcdaMeetExtRefRestrictions(
    extRef: Element,
    fcda: Element,
    options: DoesFcdaMeetExtRefRestrictionsOptions = { checkOnlyBType: false }
  ): boolean {
    if (!extRef || !fcda) return true;

    // Vendor does not provide data for the check so any FCDA meets restriction
    if (!extRef.hasAttribute('pDO')) return true;

    const fcdaTypes = this.getFcdaInfo(fcda).spec;
    const extRefSpec = this.getExtRefInfo(extRef).spec;

    // Check cannot be performed assume restriction check to fail
    if (!extRefSpec || !fcdaTypes) return false;

    if (
      extRef.getAttribute('pServT') &&
      options.controlBlockType &&
      options.controlBlockType !== extRef.getAttribute('pServT')
    )
      return false;

    // Some vendors allow subscribing of e.g. ACT to SPS, both bType BOOLEAN
    if (options.checkOnlyBType) return fcdaTypes.bType === extRefSpec.bType;

    if (
      extRef.getAttribute('pLN') &&
      extRef.getAttribute('pLN') !== fcda.getAttribute('lnClass')
    )
      return false;

    if (fcdaTypes.cdc !== extRefSpec.cdc) return false;

    if (extRef.getAttribute('pDA') && fcdaTypes.bType !== extRefSpec.bType)
      return false;

    return true;
  }

  /**
   * Check whether an FCDA should be shown as disabled in the UI. FCDAs are
   * disabled if they are DO references, if they don't match preconfigured
   * attributes.
   *
   * @param fcda - an SCL FCDA element.
   * @param control - an SCL control block element.
   * @param withFilter - whether to include current filter settings in assessment.
   * @returns whether an FCDA should be shown as disabled.
   */
  private isFcdaDisabled(
    fcda: Element,
    control: Element,
    withFilter: boolean = false
  ): boolean {
    // If daName is missing, we have an FCDO which is not currently supported
    // TODO: Remove this and actually support FCDOs
    const isFcdo = !fcda.getAttribute('daName');
    const isPreconfiguredNotMatching =
      this.subscriberView &&
      this.selectedExtRef !== undefined &&
      !this.doesFcdaMeetExtRefRestrictions(this.selectedExtRef, fcda, {
        checkOnlyBType: this.checkOnlyPreferredBasicType
      });

    const disabledFcdo =
      (isFcdo && !withFilter) ||
      (withFilter && isFcdo && this.filterOutDataObjects);

    const disabledPreconfigured =
      (isPreconfiguredNotMatching && !withFilter) ||
      (withFilter &&
        isPreconfiguredNotMatching &&
        this.filterOutPreconfiguredUnmatched);

    return disabledFcdo || disabledPreconfigured;
  }

  /**
   * Render a subscribed ExtRef element for the publisher view.
   * @param extRef - an SCL ExtRef element.
   * @returns - A Lit template result for rendering.
   */
  private renderSubscribedExtRefElement(extRef: Element): TemplateResult {
    const supervisionNode = getExistingSupervision(extRef);
    const { spec } = this.getExtRefInfo(extRef);
    const desc = getDescriptionAttribute(extRef);
    const iedName = extRef.closest('IED')!.getAttribute('name');

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      ?twoline=${!!desc || supervisionNode !== null}
      class="extref"
      data-extref="${identity(extRef)}"
      title="${spec && spec.cdc && spec.bType
        ? `CDC: ${spec.cdc ?? '?'}\nBasic Type: ${spec.bType ?? '?'}`
        : ''}"
    >
      <span
        >${iedName} > ${objectReferenceInIed(extRef)}:
        ${extRef.getAttribute('intAddr')}
      </span>
      <span slot="secondary"
        >${desc}${supervisionNode !== null
          ? ` (${trimIdentityParent(`${identity(supervisionNode)}`)})`
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
   * Render an FCDA element associated with a control block.
   * @param control - an SCL control block GSEControl or SampledValueControl.
   * @param fcda - an SCL FCDA element within a dataset.
   * @returns A Lit template result for rendering.
   */
  renderFCDA(control: Element, fcda: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcda, control);

    const isDisabled = this.isFcdaDisabled(fcda, control);

    const filterClasses = {
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
      'show-data-objects': !fcda.getAttribute('daName'),
      'show-quality': fcda.getAttribute('daName')?.split('.').pop() === 'q',
      'show-pxx-mismatch':
        this.subscriberView &&
        !!this.selectedExtRef &&
        !this.doesFcdaMeetExtRefRestrictions(this.selectedExtRef!, fcda)
    };

    const { spec, desc } = this.getFcdaInfo(fcda);
    const fcdaDesc = Object.values(desc)
      .flat(Infinity as 1)
      .join(' > ');

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${isDisabled}
      ?twoline=${fcdaDesc !== ''}
      class="fcda ${classMap(filterClasses)}"
      data-control="${identity(control)}"
      data-fcda="${identity(fcda)}"
      title="CDC: ${spec?.cdc ?? '?'}
Basic Type: ${spec?.bType ?? '?'}"
    >
      <span>${getFcdaOrExtRefTitle(fcda)} </span>
      <span slot="secondary"> ${fcdaDesc}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  renderFCDAListTitle(): TemplateResult {
    const menuClasses = {
      'title-element': true,
      'filter-off':
        this.filterOutSubscribed ||
        this.filterOutNotSubscribed ||
        this.filterOutDataObjects ||
        this.filterOutQuality ||
        (this.filterOutPreconfiguredUnmatched && this.subscriberView)
    };
    const selectedFcdaTitle =
      this.selectedControl && this.selectedFCDA && !this.subscriberView
        ? `${getNameAttribute(
            this.selectedFCDA.closest('IED')!
          )} > ${getNameAttribute(
            this.selectedControl
          )} : ${getFcdaOrExtRefTitle(this.selectedFCDA)}`
        : '';

    return html`
      <h1 class="fcda-title">
        ${this.renderControlTypeSelector()}
        ${this.selectedControl && this.selectedFCDA && !this.subscriberView
          ? html`<span
              class="selected title-element text"
              title="${selectedFcdaTitle}"
              >${selectedFcdaTitle}</span
            >`
          : html`<span class="title-element text"
              >${this.controlTag === 'SampledValueControl'
                ? 'Select SV Publisher'
                : 'Select GOOSE Publisher'}</span
            >`}
        <mwc-icon-button
          id="filterFcdaIcon"
          class="${classMap(menuClasses)}"
          title="Filter"
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
            ?selected=${!this.filterOutSubscribed}
          >
            <span>Subscribed</span>
          </mwc-check-list-item>
          <mwc-check-list-item
            class="filter-not-subscribed"
            left
            ?selected=${!this.filterOutNotSubscribed}
          >
            <span>Not Subscribed</span>
          </mwc-check-list-item>
          <mwc-check-list-item
            class="filter-data-objects"
            left
            ?selected=${!this.filterOutDataObjects}
          >
            <span>Data Objects</span>
          </mwc-check-list-item>
          <mwc-check-list-item
            class="filter-quality"
            left
            ?selected=${!this.filterOutQuality}
          >
            <span>Quality</span>
          </mwc-check-list-item>
          ${this.subscriberView
            ? html`<mwc-check-list-item
                class="filter-preconfigured"
                left
                ?selected=${!this.filterOutPreconfiguredUnmatched}
              >
                <span>Non-Matching Preconfigured</span></mwc-check-list-item
              >`
            : nothing}
        </mwc-menu>
        <mwc-icon-button
          id="sortFcdaIcon"
          title="Sort')}"
          icon="sort"
          @click=${() => {
            if (!this.sortMenuFcdaUI.open) this.sortMenuFcdaUI.show();
          }}
        ></mwc-icon-button>
        <mwc-menu
          id="sortFcdaMenu"
          class="sort-menu"
          corner="BOTTOM_RIGHT"
          menuCorner="END"
        >
          <mwc-list-item
            graphic="icon"
            right
            ?selected=${this.sortFcda === FcdaSortOrder.DataModel}
          >
            <span>Data Model</span>
            <mwc-icon slot="graphic">check</mwc-icon>
          </mwc-list-item>
          <mwc-list-item
            graphic="icon"
            right
            ?selected=${this.sortFcda === FcdaSortOrder.Path}
          >
            <span>Object Reference</span>
            <mwc-icon slot="graphic">check</mwc-icon>
          </mwc-list-item>
          <mwc-list-item
            graphic="icon"
            right
            ?selected=${this.sortFcda === FcdaSortOrder.FullDescription}
          >
            <span>Full Description</span>
            <mwc-icon slot="graphic">check</mwc-icon>
          </mwc-list-item>
          <mwc-list-item
            graphic="icon"
            right
            ?selected=${this.sortFcda === FcdaSortOrder.DODescription}
          >
            <span>Data Object and Attribute Description</span>
            <mwc-icon slot="graphic">check</mwc-icon>
          </mwc-list-item>
          <mwc-list-item
            graphic="icon"
            right
            ?selected=${this.sortFcda === FcdaSortOrder.DADescription}
          >
            <span>Data Attribute Description</span>
            <mwc-icon slot="graphic">check</mwc-icon>
          </mwc-list-item>
        </mwc-menu>
      </h1>
    `;
  }

  private sortFcdaSubscriberItems(aFcda: Element, bFcda: Element): number {
    if (this.sortFcda === FcdaSortOrder.Path)
      return getFcdaOrExtRefTitle(aFcda).localeCompare(
        getFcdaOrExtRefTitle(bFcda)
      );

    if (this.sortFcda === FcdaSortOrder.FullDescription) {
      const aFcdaDesc = Object.values(this.getFcdaInfo(aFcda).desc)
        .flat(Infinity as 1)
        .join('>');
      const bFcdaDesc = Object.values(this.getFcdaInfo(bFcda).desc)
        .flat(Infinity as 1)
        .join('>');

      // descriptions always come first
      if (aFcdaDesc !== '' && bFcdaDesc === '') return -1;
      if (bFcdaDesc !== '' && aFcdaDesc === '') return 1;

      return aFcdaDesc.localeCompare(bFcdaDesc);
    }

    if (this.sortFcda === FcdaSortOrder.DODescription) {
      const getDODesc = (fcda: Element) =>
        [
          this.getFcdaInfo(fcda).desc.DOI,
          this.getFcdaInfo(fcda).desc.SDI,
          this.getFcdaInfo(fcda).desc.DAI
        ]
          .flat(Infinity as 1)
          .filter(item => !!item)
          .join('>');

      const aInfo = getDODesc(aFcda);
      const bInfo = getDODesc(bFcda);

      // descriptions always come first
      if (aInfo !== '' && bInfo === '') return -1;
      if (aInfo === '' && bInfo !== '') return 1;

      return aInfo.localeCompare(bInfo);
    }

    if (this.sortFcda === FcdaSortOrder.DADescription) {
      const aFcdaDesc = this.getFcdaInfo(aFcda).desc.DAI ?? '';
      const bFcdaDesc = this.getFcdaInfo(bFcda).desc.DAI ?? '';

      // descriptions always come first
      if (aFcdaDesc !== '' && bFcdaDesc === '') return -1;
      if (bFcdaDesc !== '' && aFcdaDesc === '') return 1;

      return aFcdaDesc.localeCompare(bFcdaDesc);
    }
    // data model order
    return 0;
  }

  /**
   * Render control blocks and their FCDAs.
   * @param controls - an array of GSEControl or SampledValueControl elements.
   * @returns - a Lit TemplateResult.
   */
  renderControlList(controls: Element[]): TemplateResult {
    const filteredListClasses = {
      'show-subscribed': !this.filterOutSubscribed,
      'show-not-subscribed': !this.filterOutNotSubscribed,
      'show-pxx-mismatch': !this.filterOutPreconfiguredUnmatched,
      'show-data-objects': !this.filterOutDataObjects,
      'show-quality': !this.filterOutQuality
    };

    return html`<div class="searchField">
        <abbr title="Search"
          ><mwc-textfield
            id="filterFcdaInput"
            iconTrailing="search"
            outlined
            @input=${debounce(() => {
              this.searchFcdaRegex = getSearchRegex(
                this.filterFcdaInputUI!.value
              );
            })}
          ></mwc-textfield
        ></abbr>
      </div>
      <mwc-list
        id="fcdaList"
        ?activatable=${!this.subscriberView}
        class="main-list ${classMap(filteredListClasses)}"
        @selected="${async (ev: SingleSelectedEvent) => {
          const selectedListItem = (<ListItemBase>(
            (<unknown>(<List>ev.target).selected)
          ))!;
          if (!selectedListItem) return;

          const { control, fcda } = (<ListItem>selectedListItem).dataset;
          this.selectedControl = find(this.doc, this.controlTag, control!)!;
          this.selectedFCDA = find(this.doc, 'FCDA', fcda!)!;

          // only continue if conditions for subscription met
          if (
            !(
              this.subscriberView &&
              this.selectedControl &&
              this.selectedFCDA &&
              this.selectedExtRef
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
            this.selectedExtRef,
            this.selectedControl,
            this.selectedFCDA
          );

          this.selectedExtRef = undefined;

          // if incrementing, click on next ExtRef list item if not subscribed
          if (this.extRefListSubscriberSelectedUI && this.autoIncrement) {
            const nextActivatableItem = <ListItem>(
              this.extRefListSubscriberUI!.querySelector(
                'mwc-list-item[activated].extref ~ mwc-list-item.extref'
              )
            );

            if (nextActivatableItem) {
              const { extref } = (<ListItem>nextActivatableItem).dataset;
              const nextExtRef =
                find(this.doc, 'ExtRef', extref ?? 'Unknown') ?? undefined;
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
          if (this.extRefListSubscriberSelectedUI && !this.autoIncrement) {
            this.extRefListSubscriberSelectedUI.selected = false;
            this.extRefListSubscriberSelectedUI.activated = false;
          }

          // deselect FCDA
          selectedListItem!.selected = false;
          selectedListItem!.activated = false;

          // reset state
          this.selectedControl = undefined;
          this.selectedFCDA = undefined;
        }}"
      >
        ${repeat(
          controls.filter(controlCandidate => {
            const fcdaCandidates = getFcdaElements(controlCandidate);
            // if disabled (non-matching pXX or DOs) are filtered
            // then don't show them
            const onlyHasDisabledItems = fcdaCandidates.every(fcda =>
              this.isFcdaDisabled(fcda, controlCandidate, true)
            );
            const isWithinSearch =
              this.searchFcdaRegex &&
              fcdaCandidates.some(fcda =>
                this.searchFcdaRegex.test(
                  `${this.getFcdaSearchString(controlCandidate, fcda)}`
                )
              );
            return (
              isWithinSearch && fcdaCandidates.length && !onlyHasDisabledItems
            );
          }),
          i => identity(i),
          control => {
            const fcdas = getFcdaElements(control)
              .filter(fcdaCandidate =>
                this.searchFcdaRegex.test(
                  `${this.getFcdaSearchString(control, fcdaCandidate)}`
                )
              )
              .sort((a, b) => this.sortFcdaSubscriberItems(a, b));

            const someSubscribed = fcdas.some(
              fcda => this.getExtRefCount(fcda, control) !== 0
            );
            const someNotSubscribed = fcdas.some(
              fcda => this.getExtRefCount(fcda, control) === 0
            );

            const filterClasses = {
              'show-subscribed': someSubscribed,
              'show-not-subscribed': someNotSubscribed
            };

            const iedName = control.closest('IED')!.getAttribute('name');

            // TODO: Restore wizard editing functionality
            return html`<mwc-list-item
                noninteractive
                class="control ${classMap(filterClasses)}"
                graphic="icon"
                twoline
                hasMeta
              >
                <span>${iedName} > ${getNameAttribute(control)} </span>
                <span slot="secondary"
                  >${objectReferenceInIed(control)}
                  ${getDescriptionAttribute(control)
                    ? html` - ${getDescriptionAttribute(control)}`
                    : nothing}</span
                >
                <mwc-icon slot="graphic"
                  >${iconControlLookup[this.controlTag]}</mwc-icon
                >
              </mwc-list-item>
              ${repeat(
                fcdas,
                i => `${identity(control)} ${identity(i)}`,
                fcda => this.renderFCDA(control, fcda)
              )}`;
          }
        )}
      </mwc-list>`;
  }

  /**
   * Render ExtRefs for publisher view which already have subscriptions.
   * @returns - a Lit TemplateResult.
   */
  private renderPublisherViewSubscribedExtRefs(): TemplateResult {
    const subscribedExtRefs = this.getSubscribedExtRefElements()
      .filter(extRefCandidate => {
        const supervisionNode = getExistingSupervision(extRefCandidate);
        return this.searchExtRefPublisherRegex.test(
          `${identity(extRefCandidate)} ${getDescriptionAttribute(
            extRefCandidate
          )} ${identity(supervisionNode)}`
        );
      })
      .sort((a, b) => sortExtRefItems(this.sortExtRefPublisher, a, b));
    return html`
      <mwc-list-item noninteractive>
        <span>Subscribed</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${subscribedExtRefs.length > 0
        ? html`${subscribedExtRefs.map(extRefElement =>
            this.renderSubscribedExtRefElement(extRefElement)
          )}`
        : html`<mwc-list-item graphic="large" noninteractive>
            No subscribed inputs
          </mwc-list-item>`}
    `;
  }

  /**
   * Render ExtRefs for publisher view which already have subscriptions.
   * @returns - a Lit TemplateResult.
   */
  private renderPublisherViewAvailableExtRefs(): TemplateResult {
    const availableExtRefs = this.getAvailableExtRefElements()
      .filter(extRefCandidate =>
        this.searchExtRefPublisherRegex.test(
          `${identity(extRefCandidate)} ${getDescriptionAttribute(
            extRefCandidate
          )}`
        )
      )
      .sort((a, b) => sortExtRefItems(this.sortExtRefPublisher, a, b));
    return html`
      <mwc-list-item noninteractive>
        <span>Available to subscribe</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${availableExtRefs.length > 0
        ? html`${availableExtRefs.map(extRef => {
            const hasMissingMapping =
              isSubscribed(extRef) &&
              !findFCDAs(extRef).find(x => x !== undefined);
            const { spec } = this.getExtRefInfo(extRef);
            const desc = getDescriptionAttribute(extRef);
            const disabledExtRef =
              this.selectedFCDA &&
              !this.doesFcdaMeetExtRefRestrictions(extRef, this.selectedFCDA, {
                checkOnlyBType: this.checkOnlyPreferredBasicType
              });

            const iedName = extRef.closest('IED')!.getAttribute('name');

            return html`<mwc-list-item
              graphic="large"
              ?disabled=${disabledExtRef}
              ?hasMeta=${isPartiallyConfigured(extRef) || hasMissingMapping}
              ?twoline=${!!desc}
              class="extref ${disabledExtRef ? 'show-pxx-mismatch' : ''}"
              data-extref="${identity(extRef)}"
              title="${spec && spec.cdc && spec.bType
                ? `CDC: ${spec.cdc ?? '?'}\nBasic Type: ${spec.bType ?? '?'}`
                : ''}"
            >
              <span>
                ${iedName} > ${objectReferenceInIed(extRef)}:
                ${extRef.getAttribute('intAddr')}
              </span>
              <span slot="secondary">${desc}</span>
              <mwc-icon slot="graphic">link_off</mwc-icon>
              ${isPartiallyConfigured(extRef)
                ? html`<mwc-icon
                    slot="meta"
                    class="invalid-mapping"
                    title="Invalid Mapping"
                    >error</mwc-icon
                  >`
                : nothing}
              ${hasMissingMapping
                ? html`<mwc-icon
                    class="missing-mapping"
                    title="The subscription is valid but the element is not present -- check that IED, control block and dataset are correct."
                    slot="meta"
                    >warning</mwc-icon
                  >`
                : nothing}
            </mwc-list-item>`;
          })}`
        : html`<mwc-list-item graphic="large" noninteractive
            >No available inputs to subscribe</mwc-list-item
          >`}
    `;
  }

  /**
   * In the publisher view renders the title and filter/settings icons
   * for ExtRefs
   * @returns - a Lit TemplateResult.
   */
  private renderPublisherViewExtRefListTitle(): TemplateResult {
    const filterMenuClasses = {
      'filter-off':
        this.strictServiceTypes || this.filterOutPreconfiguredUnmatched,
      'title-element': true
    };

    return html`<h1 class="fcda-title">
      <span class="title-element text">Select Subscriber Input</span>
      <mwc-icon-button
        id="filterExtRefPublisherIcon"
        class="${classMap(filterMenuClasses)}"
        title="Filter"
        icon="filter_list"
        @click=${() => {
          if (!this.filterMenuExtRefPublisherUI.open)
            this.filterMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
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
          <span>Unspecified Service Types</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-preconfigured"
          left
          ?selected=${!this.filterOutPreconfiguredUnmatched}
        >
          <span>Non-Matching Preconfigured</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="sortExtRefPublisherIcon"
        class="title-element"
        title="Sort"
        icon="sort"
        @click=${() => {
          if (!this.sortMenuExtRefPublisherUI.open)
            this.sortMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="sortExtRefPublisherMenu"
        class="sort-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefPublisher === ExtRefSortOrder.DataModel}
        >
          <span>Data Model</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefPublisher ===
          ExtRefSortOrder.InternalAddress}
        >
          <span>Internal Address</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefPublisher === ExtRefSortOrder.Description}
        >
          <span>Description</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="settingsExtRefPublisherIcon"
        class="title-element"
        title="Settings"
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
          ?selected=${!this.ignoreSupervision}
        >
          <span>Change Supervision LNs</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="allow-external-plugins"
          left
          ?selected=${this.allowExternalPlugins}
        >
          <span>Allow External Plugins</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="check-only-preferred-basic-service-type"
          left
          ?selected=${this.checkOnlyPreferredBasicType}
        >
          <span>Check Only Preconfigured Service and Basic Types</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
  }

  /**
   * In the subscriber view renders the title and filter/settings icons
   * for ExtRefs
   * @returns - a Lit TemplateResult.
   */
  private renderSubscriberViewExtRefListTitle(): TemplateResult {
    const menuClasses = {
      'filter-off':
        this.filterOutBound ||
        this.filterOutNotBound ||
        this.strictServiceTypes ||
        this.filterOutpDAq
    };

    const selectedExtRefTitle = this.selectedExtRef
      ? `${getNameAttribute(
          this.selectedExtRef?.closest('IED')!
        )} > ${objectReferenceInIed(
          this.selectedExtRef
        )}: ${this.selectedExtRef.getAttribute('intAddr')}`
      : '';

    return html`<h1 class="subscriber-title">
      ${this.selectedExtRef
        ? html`<span
            class="selected title-element text"
            title="${selectedExtRefTitle}"
            >${selectedExtRefTitle}</span
          >`
        : html`<span class="title-element text">Select Subscriber Input</span>`}
      <mwc-icon-button
        id="saveSubscriberExtRefToMarkdown"
        title="Copy to Clipboard as Markdown"
        icon="content_copy"
        @click=${() => {
          this.copySubscriberExtRefInfoToMarkdown();
        }}
      ></mwc-icon-button>
      <mwc-icon-button
        id="filterExtRefSubscriberIcon"
        class="${classMap(menuClasses)}"
        title="Filter"
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
          ?selected=${!this.filterOutBound}
        >
          <span>Subscribed</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-not-bound"
          left
          ?selected=${!this.filterOutNotBound}
        >
          <span>Not Subscribed</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-unspecified-service-types"
          left
          ?selected=${!this.strictServiceTypes}
        >
          <span>Unspecified Service Types</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-pDAq"
          left
          ?selected=${!this.filterOutpDAq}
        >
          <span>Preconfigured Quality Attribute</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="sortExtRefSubscriberIcon"
        title="Sort"
        icon="sort"
        @click=${() => {
          if (!this.sortMenuExtRefSubscriberUI.open)
            this.sortMenuExtRefSubscriberUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="sortExtRefSubscriberMenu"
        class="sort-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefSubscriber === ExtRefSortOrder.DataModel}
        >
          <span>Data Model</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefSubscriber ===
          ExtRefSortOrder.InternalAddress}
        >
          <span>Internal Address</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefSubscriber === ExtRefSortOrder.Description}
        >
          <span>Description</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
        <mwc-list-item
          graphic="icon"
          ?selected=${this.sortExtRefSubscriber ===
          ExtRefSortOrder.MappedReference}
        >
          <span>Mapped Reference</span>
          <mwc-icon slot="graphic">check</mwc-icon>
        </mwc-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="settingsExtRefSubscriberIcon"
        title="Settings"
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
          ?selected=${this.autoIncrement}
        >
          <span>Auto-increment</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="no-supervisions"
          left
          ?selected=${!this.ignoreSupervision}
        >
          <span>Change Supervision LNs</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="allow-external-plugins"
          left
          ?selected=${this.allowExternalPlugins}
        >
          <span>Allow External Plugins</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="check-only-preferred-basic-service-type"
          left
          ?selected=${this.checkOnlyPreferredBasicType}
        >
          <span>Check Only Preconfigured Service and Basic Types</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
  }

  copySubscriberExtRefInfoToMarkdown() {
    const markdown = this.renderSubscriberViewExtRefsMarkdown();
    navigator.clipboard.writeText(markdown);
  }

  /**
   * Render an ExtRef element in the subscriber view.
   * @param extRef - an SCL ExtREf element for later binding.
   * @returns - a Lit TemplateResult.
   */
  private renderSubscriberViewExtRef(extRef: Element): TemplateResult {
    let subscriberFCDA: Element | undefined;
    let supervisionNode: Element | undefined;
    let controlBlockDescription: string | undefined;
    let supervisionDescription: string | undefined;

    const subscribed = isSubscribed(extRef);

    if (subscribed) {
      subscriberFCDA = findFCDAs(extRef).find(element => element !== undefined);
      supervisionNode = this.getCachedSupervision(extRef);
      controlBlockDescription = getExtRefControlBlockPath(extRef);
    }

    if (supervisionNode) {
      supervisionDescription = trimIdentityParent(
        `${identity(supervisionNode)}`
      );
    }

    const extRefDescription = getDescriptionAttribute(extRef);

    const supAndctrlDescription =
      supervisionDescription || controlBlockDescription
        ? `${[controlBlockDescription, supervisionDescription]
            .filter(desc => desc !== undefined)
            .join(', ')}`
        : nothing;

    const hasInvalidMapping = isPartiallyConfigured(extRef);
    const hasMissingMapping = subscribed && !subscriberFCDA;

    const bound = subscribed || hasInvalidMapping;

    const specExtRef = this.getExtRefInfo(extRef).spec;
    const specFcda = subscriberFCDA
      ? this.getFcdaInfo(subscriberFCDA).spec
      : null;

    // this FCDA name is taken from the ExtRef so even if an FCDA
    // cannot be located we can "show" the subscription
    const fcdaName =
      subscribed || hasMissingMapping
        ? `${
            extRef.getAttribute('iedName') ?? 'Unknown'
          } > ${getFcdaOrExtRefTitle(extRef)}`
        : '';
    const fcdaDesc = subscriberFCDA
      ? Object.values(this.getFcdaInfo(subscriberFCDA).desc).join(' > ')
      : null;

    const specExtRefText =
      specExtRef?.cdc || specExtRef?.bType
        ? `ExtRef: CDC: ${specExtRef.cdc ?? '?'}, Basic Type: ${
            specExtRef.bType ?? '?'
          }`
        : '';
    const specFcdaText =
      specFcda?.cdc || specFcda?.bType
        ? `FCDA: CDC: ${specFcda.cdc ?? '?'}, Basic Type: ${
            specFcda.bType ?? '?'
          }`
        : '';

    const filterClasses = {
      'show-bound': bound,
      'show-not-bound': !bound
    };

    return html`<mwc-list-item
      twoline
      class="extref ${classMap(filterClasses)}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined ||
      hasInvalidMapping ||
      hasMissingMapping}
      data-extref="${identity(extRef)}"
      title="${[specExtRefText, specFcdaText].join('\n')}"
    >
      <span class="extref-firstline">
        ${objectReferenceInIed(extRef)}: ${extRef.getAttribute('intAddr')}
        ${subscribed || hasInvalidMapping
          ? html`<mwc-icon id="leftArrow">arrow_back</mwc-icon>
              ${subscribed ? `${fcdaName}` : ''}
              ${hasInvalidMapping ? 'Invalid Mapping' : ''} `
          : nothing}
      </span>
      <span slot="secondary"
        >${extRefDescription ? html`${extRefDescription}` : nothing}
        ${extRefDescription && fcdaDesc && fcdaDesc !== ''
          ? html`<mwc-icon id="leftArrowSmall">arrow_left</mwc-icon>${fcdaDesc}`
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
            class="invalid-mapping"
            title="Invalid Mapping"
            slot="meta"
            >error</mwc-icon
          >`
        : nothing}
      ${hasMissingMapping
        ? html`<mwc-icon
            class="missing-mapping"
            title="The subscription is valid but the element is not present -- check that IED, control block and dataset are correct."
            slot="meta"
            >warning</mwc-icon
          >`
        : nothing}
    </mwc-list-item>`;
  }

  /**
   * Render ExtRef elements in the subscriber view to a Markdown text string.
   * @returns - a Markdown string.
   */
  private renderSubscriberViewExtRefsMarkdown(): string {
    if (this.supervisionData.size === 0) this.reCreateSupervisionCache();
    const ieds = getOrderedIeds(this.doc).filter(ied => {
      const extRefs = Array.from(this.getExtRefElementsByIED(ied));
      return (
        extRefs.some(extRef =>
          this.searchExtRefSubscriberRegex.test(
            this.getExtRefSubscriberSearchString(extRef)
          )
        ) &&
        (!this.filterOutpDAq ||
          (this.filterOutpDAq &&
            extRefs.some(
              candidateExtRef => !doesExtRefpDAIncludeQ(candidateExtRef)
            )))
      );
    });

    return `${ieds
      .map(ied => {
        const extRefs = Array.from(
          this.getExtRefElementsByIED(ied)
            .filter(
              extRef =>
                this.searchExtRefSubscriberRegex.test(
                  this.getExtRefSubscriberSearchString(extRef)
                ) &&
                (!this.filterOutpDAq ||
                  (this.filterOutpDAq && !doesExtRefpDAIncludeQ(extRef)))
            )
            .sort((a, b) => sortExtRefItems(this.sortExtRefSubscriber, a, b))
        );

        const hasBoundToBeHidden =
          this.filterOutBound && extRefs.every(extRef => isSubscribed(extRef));
        const hasNotBoundToBeHidden =
          this.filterOutNotBound &&
          extRefs.every(
            extRef => !isSubscribed(extRef) && !isPartiallyConfigured(extRef)
          );

        if (!extRefs.length) return ``;

        const [iedDesc, iedType, iedMfg] = ['desc', 'type', 'manufacturer'].map(
          attr => ied.getAttribute(attr)
        );

        const iedInfo = [iedDesc, iedMfg, iedType]
          .filter(val => !!val)
          .join(' - ');

        if (
          hasBoundToBeHidden ||
          hasNotBoundToBeHidden ||
          (this.filterOutBound && this.filterOutNotBound)
        )
          return ``;

        return `* 📦 ${getNameAttribute(ied)}\n  ${iedInfo}\n\n${extRefs
          .map(extRef => this.renderSubscriberViewExtRefMarkdown(extRef))
          .join('')}`;
      })
      .join('\n')}`;
  }

  /**
   * Render an ExtRef element in Markdown
   * @param extRef - an SCL ExtRef element for later binding.
   * @returns - a string
   */
  private renderSubscriberViewExtRefMarkdown(extRef: Element): string {
    let subscriberFCDA: Element | undefined;
    let supervisionNode: Element | undefined;
    let controlBlockDescription: string | undefined;
    let supervisionDescription: string | undefined;

    const subscribed = isSubscribed(extRef);

    if (subscribed) {
      subscriberFCDA = findFCDAs(extRef).find(element => element !== undefined);
      supervisionNode = this.getCachedSupervision(extRef);
      controlBlockDescription = getExtRefControlBlockPath(extRef);
    }

    if (supervisionNode) {
      supervisionDescription = trimIdentityParent(
        `${identity(supervisionNode)}`
      );
    }

    const extRefDescription = getDescriptionAttribute(extRef);

    const hasInvalidMapping = isPartiallyConfigured(extRef);
    const hasMissingMapping = subscribed && !subscriberFCDA;

    const supAndctrlDescription =
      supervisionDescription || controlBlockDescription
        ? `${[
            controlBlockDescription,

            subscribed &&
            supervisionNode !== undefined &&
            !hasInvalidMapping &&
            !hasMissingMapping
              ? `💓 ${supervisionDescription}`
              : undefined
          ]
            .filter(desc => desc !== undefined)
            .join(', ')}`
        : ``;

    // this FCDA name is taken from the ExtRef so even if an FCDA
    // cannot be located we can "show" the subscription
    const fcdaName =
      subscribed || hasMissingMapping
        ? `${
            extRef.getAttribute('iedName') ?? 'Unknown'
          } > ${getFcdaOrExtRefTitle(extRef)}`
        : '';
    const fcdaDesc = subscriberFCDA
      ? Object.values(this.getFcdaInfo(subscriberFCDA).desc).join(' > ')
      : null;

    const hasBoundToBeHidden = this.filterOutBound && isSubscribed(extRef);
    const hasNotBoundToBeHidden =
      this.filterOutNotBound && !isSubscribed(extRef) && !hasInvalidMapping;

    const notVisible =
      hasBoundToBeHidden ||
      hasNotBoundToBeHidden ||
      (this.filterOutBound && this.filterOutNotBound);

    if (notVisible) return ``;

    return `  * ${subscribed ? '🔗 ' : ''}${objectReferenceInIed(
      extRef
    )}: ${extRef.getAttribute('intAddr')}${
      subscribed || hasInvalidMapping
        ? ` ⬅ ${subscribed ? `${fcdaName}` : ''} ${
            hasInvalidMapping ? 'Invalid Mapping' : ''
          } `
        : ``
    }\n    ${extRefDescription ? `${extRefDescription}` : ``}${
      extRefDescription && fcdaDesc && fcdaDesc !== '' ? ` ⬅ ${fcdaDesc}` : ``
    }${
      extRefDescription && supAndctrlDescription !== ``
        ? ` (${supAndctrlDescription})`
        : supAndctrlDescription
    }${hasInvalidMapping ? ` (❌ Invalid)` : ``}${
      hasMissingMapping ? ` (⚠️ Missing Mapping)` : ``
    }\n\n`;
  }

  /**
   * Render ExtRef elements in the subscriber view.
   * @returns - a Lit TemplateResult.
   */
  private renderSubscriberViewExtRefs(): TemplateResult {
    if (this.supervisionData.size === 0) this.reCreateSupervisionCache();
    const ieds = getOrderedIeds(this.doc).filter(ied => {
      const extRefs = Array.from(this.getExtRefElementsByIED(ied));
      return (
        extRefs.some(extRef =>
          this.searchExtRefSubscriberRegex.test(
            this.getExtRefSubscriberSearchString(extRef)
          )
        ) &&
        (!this.filterOutpDAq ||
          (this.filterOutpDAq &&
            extRefs.some(
              candidateExtRef => !doesExtRefpDAIncludeQ(candidateExtRef)
            )))
      );
    });

    return html`${repeat(
      ieds,
      i => `${identity(i)} ${this.controlTag}`,
      ied => {
        const extRefs = Array.from(
          this.getExtRefElementsByIED(ied)
            .filter(
              extRef =>
                this.searchExtRefSubscriberRegex.test(
                  this.getExtRefSubscriberSearchString(extRef)
                ) &&
                (!this.filterOutpDAq ||
                  (this.filterOutpDAq && !doesExtRefpDAIncludeQ(extRef)))
            )
            .sort((a, b) => sortExtRefItems(this.sortExtRefSubscriber, a, b))
        );
        const someBound = extRefs.some(extRef => isSubscribed(extRef));
        const someNotBound = extRefs.some(extRef => !isSubscribed(extRef));

        if (!extRefs.length) return html``;

        const filterClasses = {
          control: true,
          'show-bound': someBound,
          'show-not-bound': someNotBound
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
            ?twoline=${!!iedDesc || !!iedType || !!iedMfg}
            noninteractive
            graphic="icon"
          >
            <span>${getNameAttribute(ied)}</span>
            <span slot="secondary">${iedInfo}</span>
            <mwc-icon slot="graphic">developer_board</mwc-icon>
          </mwc-list-item>
          ${repeat(
            extRefs,
            exId => `${identity(exId)} ${this.controlTag}`,
            extRef => this.renderSubscriberViewExtRef(extRef)
          )}
        `;
      }
    )}`;
  }

  /**
   * Render ExtRef elements in either the publisher or subscriber view.
   * @returns - a Lit TemplateResult.
   */
  renderExtRefs(): TemplateResult {
    if (!this.subscriberView) {
      return html`<section class="column">
        ${this.renderPublisherViewExtRefListTitle()}
        ${this.selectedControl && this.selectedFCDA
          ? html`<div class="searchField">
                <abbr title="Search"
                  ><mwc-textfield
                    id="filterExtRefPublisherInput"
                    iconTrailing="search"
                    outlined
                    @input=${debounce(() => {
                      this.searchExtRefPublisherRegex = getSearchRegex(
                        this.filterExtRefPublisherInputUI!.value
                      );
                    })}
                  ></mwc-textfield
                ></abbr>
              </div>
              <mwc-list
                id="publisherExtRefList"
                class="main-list ${!this.filterOutPreconfiguredUnmatched
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
                  const selectedExtRefElement = find(
                    this.doc,
                    'ExtRef',
                    extref!
                  )!;

                  if (
                    !isSubscribed(selectedExtRefElement) ||
                    !findFCDAs(selectedExtRefElement).find(x => x !== undefined)
                  ) {
                    this.subscribe(
                      selectedExtRefElement,
                      this.selectedControl!,
                      this.selectedFCDA!
                    );
                  } else {
                    this.unsubscribeExtRef(selectedExtRefElement);
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
          : html`<h3>No published item selected</h3>`}
      </section>`;
    }

    const filteredListClasses = {
      'show-bound': !this.filterOutBound,
      'show-not-bound': !this.filterOutNotBound
    };

    const hasExtRefs = this.doc?.querySelector(
      `:root > IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, 
       :root > IED > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
    );

    return html`<section class="column extref">
      ${this.renderSubscriberViewExtRefListTitle()}
      ${!hasExtRefs
        ? html`<h3>No inputs</h3>`
        : html`<div class="searchField">
              <abbr title="Search"
                ><mwc-textfield
                  id="filterExtRefSubscriberInput"
                  iconTrailing="search"
                  outlined
                  @input=${debounce(() => {
                    this.searchExtRefSubscriberRegex = getSearchRegex(
                      this.filterExtRefSubscriberInputUI!.value
                    );
                  })}
                ></mwc-textfield
              ></abbr>
            </div>
            <mwc-list
              id="subscriberExtRefList"
              class="main-list ${classMap(filteredListClasses)}"
              activatable
              @selected=${(ev: SingleSelectedEvent) => {
                const selectedListItem = (<ListItemBase>(
                  (<unknown>(<List>ev.target).selected)
                ))!;

                if (!selectedListItem) return;

                const { extref } = selectedListItem.dataset;
                const selectedExtRef = find(this.doc, 'ExtRef', extref!);

                if (!selectedExtRef) return;

                if (
                  isSubscribed(selectedExtRef) ||
                  isPartiallyConfigured(selectedExtRef)
                ) {
                  this.unsubscribeExtRef(selectedExtRef);

                  // deselect in UI
                  // list item is left selected to allow further subscription
                  this.selectedFCDA = undefined;
                  this.selectedControl = undefined;
                }

                this.selectedExtRef = selectedExtRef;
              }}
              >${this.renderSubscriberViewExtRefs()}
            </mwc-list>`}
    </section>`;
  }

  /**
   * Render UI button for switching between GSEControls and
   * SampledValueControls.
   * @returns - a Lit TemplateResult.
   */
  renderControlTypeSelector(): TemplateResult {
    return html`
      <mwc-icon-button-toggle
        id="switchControlType"
        class="title-element"
        ?on=${this.controlTag === 'GSEControl'}
        title="Change between GOOSE and Sampled Value publishers"
        @click=${() => {
          if (this.controlTag === 'GSEControl') {
            this.controlTag = 'SampledValueControl';
          } else {
            this.controlTag = 'GSEControl';
          }

          // deselect in UI
          if (this.fcdaListSelectedUI) {
            this.fcdaListSelectedUI.selected = false;
            this.fcdaListSelectedUI.activated = false;
          }

          // reset state
          this.selectedControl = undefined;
          this.selectedFCDA = undefined;
          this.selectedExtRef = undefined;

          this.resetSearchFields();
          this.resetCaching();
        }}
      >
        ${gooseActionIcon} ${smvActionIcon}
      </mwc-icon-button-toggle>
    `;
  }

  /**
   * Render FCDAs for publisher view.
   * @returns - a Lit TemplateResult.
   */
  renderPublisherFCDAs(): TemplateResult {
    const controlElements = this.getControlElements(this.controlTag);
    return html`<section class="column fcda">
      ${this.renderFCDAListTitle()}
      ${controlElements.length !== 0
        ? this.renderControlList(controlElements)
        : html`<h3>
            ${this.subscriberView ? 'No input selected' : 'No published items'}
          </h3>`}
    </section>`;
  }

  /**
   * Render UI button for switching between publisher/subscriber.
   * @returns - a Lit TemplateResult.
   */
  renderSwitchView(): TemplateResult {
    return html` <mwc-fab
      mini
      id="switchView"
      icon="swap_horiz"
      ?on=${this.subscriberView}
      title="Switch between Publisher and Subscriber view"
      @click=${async () => {
        this.subscriberView = !this.subscriberView;

        // deselect in UI
        if (this.fcdaListSelectedUI) {
          this.fcdaListSelectedUI.selected = false;
          this.fcdaListSelectedUI.activated = false;
        }

        // reset state
        this.selectedControl = undefined;
        this.selectedFCDA = undefined;
        this.selectedExtRef = undefined;

        this.resetSearchFields();

        await this.updateComplete;

        // await for regeneration of UI and then attach anchors
        this.updateView();
      }}
    >
    </mwc-fab>`;
  }

  render(): TemplateResult {
    const classList = { 'subscriber-view': this.subscriberView };
    const result = html`<div id="listContainer" class="${classMap(classList)}">
        ${this.renderPublisherFCDAs()} ${this.renderExtRefs()}
      </div>
      ${this.renderSwitchView()}`;
    return result;
  }

  static styles = css`
    :host {
      display: flex;

      --secondaryThemeFallback: #018786;
      --scrollbarBG: var(--mdc-theme-background, #cfcfcf00);
      --thumbBG: var(--mdc-button-disabled-ink-color, #996cd8cc);
    }

    @media (min-width: 700px) {
      #listContainer {
        height: calc(100vh - 110px);
      }

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

      .main-list {
        height: calc(100vh - 240px);
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

    h1 {
      font-size: 20px;
    }

    h1.fcda-title,
    h1.subscriber-title {
      display: flex;
    }

    h1 .title-element.text {
      flex: 1 1 auto;
      min-width: 0px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    h1 .selected {
      font-weight: 400;
      color: var(--mdc-theme-primary, #6200ee);
    }

    h3 {
      margin: 4px 8px 16px;
    }

    .column {
      flex: 50%;
      min-width: 300px;
      overflow-y: clip;
      overflow-x: auto;
    }

    .fcda,
    .extref {
      padding-left: var(--mdc-list-side-padding, 6px);
    }

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

    /* hide quality attributes if filter enabled */
    #fcdaList:not(.show-quality) mwc-list-item.fcda.show-quality {
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
      color: var(--oscd-theme-state-error, red);
    }

    .missing-mapping {
      color: var(--oscd-theme-state-warning, orange);
    }

    #listContainer {
      width: 100%;
      display: flex;
      height: calc(100vh - 118px);
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

    #leftArrow {
      position: relative;
      top: 5px;
    }

    #leftArrowSmall {
      position: relative;
      top: 7px;
      width: 20px;
      left: -3px;
    }

    .main-list {
      height: calc(100vh - 232px);
      overflow: auto;
    }

    .main-list {
      scrollbar-width: auto;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    }

    .main-list::-webkit-scrollbar {
      width: 6px;
    }

    .main-list::-webkit-scrollbar-track {
      background: var(--scrollbarBG);
    }

    .main-list::-webkit-scrollbar-thumb {
      background: var(--thumbBG);
      border-radius: 6px;
    }

    mwc-list-item.ied,
    mwc-list-item.control {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
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

    section {
      position: relative;
      max-height: 100%;
      background-color: var(--mdc-theme-surface, #fafafa);
      padding: 3px;
    }

    /* Hide the icon of unselected menu items that are in a group */
    .sort-menu > [mwc-list-item]:not([selected]) [slot='graphic'] {
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

    #switchView {
      position: absolute;
      bottom: 20px;
      right: 28px;
    }

    #switchControlType {
      --mdc-icon-size: 32px;
    }

    #switchControlType > svg {
      border-radius: 24px;
      background-color: var(--mdc-theme-secondary, #018786);
      color: var(--mdc-theme-on-secondary, white);
    }
  `;
}
