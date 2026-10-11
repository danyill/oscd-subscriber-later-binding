import { identity } from '@openscd/scl-lib';

import { doesExtRefpDAIncludeQ, doesExtRefpDAIncludeT } from './extref.js';
import {
  getDescriptionAttribute,
  getNameAttribute,
  findFCDAs
} from './foundation.js';
import { objectReferenceInIed, trimIdentityParent } from './identity.js';
import type { DataSpec, SubscriptionModel } from './model.js';
import { doesFcdaMeetExtRefRestrictions } from './restrictions.js';
import type { SubscriberSettings } from './settings.js';
import { compareFcdas, sortExtRefItems } from './sort.js';
import {
  getExtRefControlBlockPath,
  getExtRefElements,
  getFcdaOrExtRefTitle,
  getOrderedIeds,
  getSubscribedExtRefElements,
  isPartiallyConfigured,
  isSubscribed
} from './subscription/subscription.js';

/**
 * The rows each list shows, as plain data. Which rows there are, their order
 * and what they say is decided here, from the document and the settings, and
 * the lists only draw them. Every builder takes the search the user typed as a
 * regular expression so that headings of groups without a match are left out.
 */

/** Matches everything, for when there is no search. */
export const matchAll = /.*/i;

/** The description of an FCDA's data, e.g. `Animalia > Arthropoda`. */
function fcdaDescription(model: SubscriptionModel, fcda: Element): string {
  return Object.values(model.fcdaInfo(fcda).desc)
    .flat(Infinity as 1)
    .join(' > ');
}

/** The tooltip describing a data type, or an empty string without a type. */
function specTitle(
  spec: { cdc: string; bType?: string | undefined } | undefined,
  alwaysShow = false
): string {
  if (alwaysShow || (spec && spec.cdc && spec.bType)) {
    return `CDC: ${spec?.cdc ?? '?'}\nBasic Type: ${spec?.bType ?? '?'}`;
  }
  return '';
}

/** Whether an ExtRef is one this plugin lists for the type of control block. */
export function isExtRefViewable(
  extRef: Element,
  model: SubscriptionModel,
  strictServiceTypes: boolean
): boolean {
  return (
    extRef.hasAttribute('intAddr') &&
    ((!strictServiceTypes &&
      !extRef.hasAttribute('serviceType') &&
      !extRef.hasAttribute('pServT')) ||
      extRef.getAttribute('serviceType') === model.serviceType ||
      extRef.getAttribute('pServT') === model.serviceType)
  );
}

// ---------------------------------------------------------------------------
// Control blocks and FCDAs
// ---------------------------------------------------------------------------

export type FcdaRowSettings = Pick<
  SubscriberSettings,
  | 'subscriberView'
  | 'filterOutSubscribed'
  | 'filterOutNotSubscribed'
  | 'filterOutDataObjects'
  | 'filterOutQuality'
  | 'filterOutPreconfiguredUnmatched'
  | 'checkOnlyPreferredBasicType'
  | 'sortFcda'
>;

export interface ControlRow {
  type: 'control';
  key: string;
  control: Element;
  /** The identity of the control block. */
  id: string;
  /** `IED > control block name` */
  title: string;
  /** Where the control block is in the IED, e.g. `LD0 / LLN0`. */
  reference: string;
  description: string | undefined;
  /** The reference with the description, as listed. */
  subtitle: string;
  searchText: string;
}

export interface FcdaRow {
  type: 'fcda';
  key: string;
  control: Element;
  fcda: Element;
  controlId: string;
  fcdaId: string;
  title: string;
  /** The description of the data. */
  subtitle: string;
  /** How many ExtRefs subscribe to the FCDA. */
  count: number;
  /** Data objects, and data which the selected ExtRef is not preconfigured for. */
  disabled: boolean;
  spec: DataSpec;
  tooltip: string;
  searchText: string;
}

export type FcdaListRow = ControlRow | FcdaRow;

/** The text searched for an FCDA of a control block. */
export function fcdaSearchText(
  model: SubscriptionModel,
  control: Element,
  fcda: Element
): string {
  const info = model.fcdaInfo(fcda);
  return `${identity(control)} ${getDescriptionAttribute(control) ?? ''} ${identity(
    fcda
  )} ${info.spec?.bType ?? ''} ${info.spec?.cdc ?? ''} ${getFcdaOrExtRefTitle(
    fcda
  )} ${Object.values(info.desc)
    .flat(Infinity as 1)
    .join(' ')}`;
}

/**
 * The control blocks and FCDAs listed, in order. A control block is listed only
 * when at least one of its FCDAs is.
 * @param model - the model of the document.
 * @param settings - filters and sort order.
 * @param selectedExtRef - the ExtRef being subscribed in the subscriber view.
 * @param search - what the user searched for.
 * @returns control block rows, each followed by its FCDA rows.
 */
export function buildFcdaRows(
  model: SubscriptionModel,
  settings: FcdaRowSettings,
  selectedExtRef: Element | undefined,
  search: RegExp = matchAll
): FcdaListRow[] {
  const rows: FcdaListRow[] = [];

  // a control block cannot be subscribed by an input of its own IED
  const selectedIed = selectedExtRef?.closest('IED');
  const controls = model.controls.filter(
    control =>
      !settings.subscriberView ||
      !selectedExtRef ||
      control.closest('IED') !== selectedIed
  );

  controls.forEach((control) => {
    const controlId = `${identity(control)}`;
    const fcdaRows: FcdaRow[] = model
      .fcdasOf(control)
      .map((fcda) => {
        const count = model.extRefCount(fcda, control);
        const daName = fcda.getAttribute('daName');
        const isDataObject = !daName;
        const isMismatch =
          settings.subscriberView &&
          selectedExtRef !== undefined &&
          !doesFcdaMeetExtRefRestrictions(model, selectedExtRef, fcda, {
            checkOnlyBType: settings.checkOnlyPreferredBasicType
          });
        const info = model.fcdaInfo(fcda);
        const row: FcdaRow = {
          type: 'fcda',
          key: `fcda ${controlId} ${identity(fcda)}`,
          control,
          fcda,
          controlId,
          fcdaId: `${identity(fcda)}`,
          title: getFcdaOrExtRefTitle(fcda),
          subtitle: fcdaDescription(model, fcda),
          count,
          disabled: isDataObject || isMismatch,
          spec: info.spec,
          tooltip: specTitle(info.spec, true),
          searchText: fcdaSearchText(model, control, fcda)
        };
        const hidden =
          (settings.filterOutSubscribed && count !== 0) ||
          (settings.filterOutNotSubscribed && count === 0) ||
          (settings.filterOutDataObjects && isDataObject) ||
          (settings.filterOutQuality && daName?.split('.').pop() === 'q') ||
          (settings.filterOutPreconfiguredUnmatched && isMismatch);
        return hidden ? undefined : row;
      })
      .filter((row): row is FcdaRow => row !== undefined)
      .sort((a, b) => compareFcdas(settings.sortFcda, a.fcda, b.fcda, model))
      .filter(row => search.test(row.searchText));

    if (fcdaRows.length === 0) {
      return;
    }

    const description = getDescriptionAttribute(control);
    rows.push({
      type: 'control',
      key: `control ${controlId}`,
      control,
      id: controlId,
      title: `${control.closest('IED')!.getAttribute('name')} > ${getNameAttribute(control)}`,
      reference: objectReferenceInIed(control),
      description,
      subtitle: `${objectReferenceInIed(control)}${description ? ` - ${description}` : ''}`,
      searchText: fcdaRows.map(row => row.searchText).join(' ')
    });
    rows.push(...fcdaRows);
  });

  return rows;
}

// ---------------------------------------------------------------------------
// ExtRefs of the selected FCDA (publisher view)
// ---------------------------------------------------------------------------

export type PublisherRowSettings = Pick<
  SubscriberSettings,
  | 'strictServiceTypes'
  | 'filterOutPreconfiguredUnmatched'
  | 'checkOnlyPreferredBasicType'
  | 'sortExtRefPublisher'
>;

export interface HeadingRow {
  type: 'heading';
  key: string;
  text: string;
}

export interface PlaceholderRow {
  type: 'placeholder';
  key: string;
  text: string;
}

export interface PublisherExtRefRow {
  type: 'extref';
  key: string;
  extRef: Element;
  extRefId: string;
  /** Whether the ExtRef is subscribed to the selected FCDA. */
  subscribed: boolean;
  /** `IED > logical node: internal address` */
  title: string;
  /** The description, and the supervision of a subscribed ExtRef. */
  subtitle: string;
  /** The identity of the supervision logical node, if there is one. */
  supervisionId: string | undefined;
  /** The ExtRef has some but not all attributes of a subscription. */
  invalidMapping: boolean;
  /** The ExtRef is subscribed to data which cannot be found. */
  missingMapping: boolean;
  /** The ExtRef is preconfigured for other data than the selected FCDA. */
  disabled: boolean;
  tooltip: string;
  searchText: string;
}

export type PublisherListRow = HeadingRow | PlaceholderRow | PublisherExtRefRow;

/**
 * The ExtRefs listed for the FCDA selected in the publisher view: those
 * subscribed to it, then those which could be.
 * @param model - the model of the document.
 * @param settings - filters and sort order.
 * @param control - the selected control block.
 * @param fcda - the selected FCDA.
 * @param search - what the user searched for.
 * @returns headings, ExtRef rows and messages for empty groups.
 */
export function buildPublisherExtRefRows(
  model: SubscriptionModel,
  settings: PublisherRowSettings,
  control: Element,
  fcda: Element,
  search: RegExp = matchAll
): PublisherListRow[] {
  const root = model.doc!.getRootNode() as Element;
  const sort = (a: PublisherExtRefRow, b: PublisherExtRefRow) =>
    sortExtRefItems(settings.sortExtRefPublisher, a.extRef, b.extRef);

  const toRow = (extRef: Element, subscribed: boolean): PublisherExtRefRow => {
    const supervision = subscribed ? model.supervisionOf(extRef) : undefined;
    const supervisionId = supervision ? `${identity(supervision)}` : undefined;
    const description = getDescriptionAttribute(extRef);
    const iedName = extRef.closest('IED')!.getAttribute('name');
    const missingMapping =
      isSubscribed(extRef) && !findFCDAs(extRef).find(x => x !== undefined);
    return {
      type: 'extref',
      key: `${subscribed ? 'subscribed' : 'available'} ${identity(extRef)}`,
      extRef,
      extRefId: `${identity(extRef)}`,
      subscribed,
      title: `${iedName} > ${objectReferenceInIed(extRef)}: ${extRef.getAttribute('intAddr')}`,
      subtitle: `${description ?? ''}${
        supervision ? ` (${trimIdentityParent(supervisionId!)})` : ''
      }`,
      supervisionId,
      invalidMapping: !subscribed && isPartiallyConfigured(extRef),
      missingMapping: !subscribed && missingMapping,
      disabled:
        !subscribed &&
        !doesFcdaMeetExtRefRestrictions(model, extRef, fcda, {
          checkOnlyBType: settings.checkOnlyPreferredBasicType
        }),
      tooltip: specTitle(model.extRefInfo(extRef).spec),
      searchText: `${identity(extRef)} ${description ?? ''}${
        supervisionId ? ` ${supervisionId}` : ''
      }`
    };
  };

  const subscribed = getSubscribedExtRefElements(root, fcda, control, true)
    .map(extRef => toRow(extRef, true))
    .filter(row => search.test(row.searchText))
    .sort(sort);

  const available = getExtRefElements(root, fcda, true)
    .filter(
      extRef =>
        (!isSubscribed(extRef) ||
          !findFCDAs(extRef).find(x => x !== undefined)) &&
        isExtRefViewable(extRef, model, settings.strictServiceTypes)
    )
    .map(extRef => toRow(extRef, false))
    .filter(
      row =>
        search.test(row.searchText) &&
        !(settings.filterOutPreconfiguredUnmatched && row.disabled)
    )
    .sort(sort);

  return [
    { type: 'heading', key: 'heading subscribed', text: 'Subscribed' },
    ...(subscribed.length
      ? subscribed
      : [
        {
          type: 'placeholder' as const,
          key: 'none subscribed',
          text: 'No subscribed inputs'
        }
      ]),
    {
      type: 'heading',
      key: 'heading available',
      text: 'Available to subscribe'
    },
    ...(available.length
      ? available
      : [
        {
          type: 'placeholder' as const,
          key: 'none available',
          text: 'No available inputs to subscribe'
        }
      ])
  ];
}

// ---------------------------------------------------------------------------
// IEDs and their ExtRefs (subscriber view)
// ---------------------------------------------------------------------------

export type SubscriberRowSettings = Pick<
  SubscriberSettings,
  | 'strictServiceTypes'
  | 'filterOutBound'
  | 'filterOutNotBound'
  | 'filterOutpDAq'
  | 'filterOutpDAt'
  | 'sortExtRefSubscriber'
>;

export interface IedRow {
  type: 'ied';
  key: string;
  ied: Element;
  name: string;
  /** Description, manufacturer and type. */
  info: string;
}

export interface SubscriberExtRefRow {
  type: 'extref';
  key: string;
  extRef: Element;
  extRefId: string;
  /** `logical node: internal address` */
  title: string;
  /** The data subscribed to, or `Invalid Mapping`, shown after an arrow. */
  mapping: string;
  /** The description of the data subscribed to. */
  dataDescription: string;
  description: string;
  /** The control block the ExtRef subscribes to, e.g. `LD0 / LLN0 GOOSE1`. */
  controlPath: string | undefined;
  /** The supervision of the subscription, e.g. `LD0 > LGOS 1`. */
  supervisionPath: string | undefined;
  /** The control block and the supervision, as listed. */
  source: string;
  subscribed: boolean;
  invalidMapping: boolean;
  missingMapping: boolean;
  /** Whether a supervision logical node exists for the subscription. */
  supervised: boolean;
  /** Subscribed, or an attempt at it. */
  bound: boolean;
  tooltip: string;
  searchText: string;
}

export type SubscriberListRow = IedRow | SubscriberExtRefRow;

function iedInfo(ied: Element): string {
  const [desc, type, manufacturer] = ['desc', 'type', 'manufacturer'].map(
    attr => ied.getAttribute(attr)
  );
  return [desc, manufacturer, type].filter(value => !!value).join(' - ');
}

function toSubscriberRow(
  model: SubscriptionModel,
  extRef: Element
): SubscriberExtRefRow {
  const subscribed = isSubscribed(extRef);
  const invalidMapping = isPartiallyConfigured(extRef);
  const bound = subscribed || invalidMapping;

  const subscriberFcda = subscribed
    ? findFCDAs(extRef).find(element => element !== undefined)
    : undefined;
  const supervision = subscribed ? model.supervisionOf(extRef) : undefined;
  const controlPath = subscribed ? getExtRefControlBlockPath(extRef) : undefined;
  const supervisionPath = supervision
    ? trimIdentityParent(`${identity(supervision)}`)
    : undefined;
  const source = [controlPath, supervisionPath]
    .filter(part => part !== undefined)
    .join(', ');

  const missingMapping = subscribed && !subscriberFcda;
  const mappedName =
    subscribed || missingMapping
      ? `${extRef.getAttribute('iedName') ?? 'Unknown'} > ${getFcdaOrExtRefTitle(
        extRef
      )}`
      : '';

  const fcdaInfo = subscriberFcda ? model.fcdaInfo(subscriberFcda) : undefined;
  const dataDescription = fcdaInfo
    ? Object.values(fcdaInfo.desc).join(' > ')
    : '';

  const specExtRef = model.extRefInfo(extRef).spec;
  const specFcda = fcdaInfo?.spec;
  const specExtRefText =
    specExtRef?.cdc || specExtRef?.bType
      ? `ExtRef: CDC: ${specExtRef.cdc ?? '?'}, Basic Type: ${
        specExtRef.bType ?? '?'
      }`
      : '';
  const specFcdaText =
    specFcda?.cdc || specFcda?.bType
      ? `FCDA: CDC: ${specFcda.cdc ?? '?'}, Basic Type: ${specFcda.bType ?? '?'}`
      : '';

  const ied = extRef.closest('IED')!;
  const fcdaSearchDesc = fcdaInfo
    ? Object.values(fcdaInfo.desc)
      .flat(Infinity as 1)
      .join('>')
    : '';
  const fcdaSpec = fcdaInfo
    ? `${fcdaInfo.spec?.cdc ?? ''} ${fcdaInfo.spec?.bType ?? ''}`
    : '';

  return {
    type: 'extref',
    key: `${identity(extRef)} ${model.controlTag}`,
    extRef,
    extRefId: `${identity(extRef)}`,
    title: `${objectReferenceInIed(extRef)}: ${extRef.getAttribute('intAddr')}`,
    mapping: subscribed ? mappedName : invalidMapping ? 'Invalid Mapping' : '',
    dataDescription,
    description: getDescriptionAttribute(extRef) ?? '',
    controlPath,
    supervisionPath,
    source,
    subscribed,
    invalidMapping,
    missingMapping,
    supervised: supervision !== undefined,
    bound,
    tooltip: [specExtRefText, specFcdaText].join('\n'),
    searchText: `${iedInfo(ied)} ${identity(extRef)} ${
      supervision ? identity(supervision) : ''
    } ${getDescriptionAttribute(extRef)} ${
      subscriberFcda ? identity(subscriberFcda) : ''
    } ${fcdaSearchDesc} ${fcdaSpec} ${
      subscribed
        ? `${extRef.getAttribute('iedName')} ${getFcdaOrExtRefTitle(extRef)}`
        : ''
    } ${getExtRefControlBlockPath(extRef)}`
  };
}

/**
 * The IEDs with inputs and their ExtRefs, for the subscriber view. An IED is
 * listed only when at least one of its ExtRefs is.
 * @param model - the model of the document.
 * @param settings - filters and sort order.
 * @param search - what the user searched for.
 * @returns an IED row followed by the rows of its ExtRefs, for each IED.
 */
export function buildSubscriberRows(
  model: SubscriptionModel,
  settings: SubscriberRowSettings,
  search: RegExp = matchAll
): SubscriberListRow[] {
  if (!model.doc) {
    return [];
  }

  const rows: SubscriberListRow[] = [];

  getOrderedIeds(model.doc).forEach((ied) => {
    const extRefRows = Array.from(
      ied.querySelectorAll(
        `:scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef,
         :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
      )
    )
      .filter(extRef => isExtRefViewable(extRef, model, settings.strictServiceTypes))
      .filter(
        extRef =>
          !(settings.filterOutpDAq && doesExtRefpDAIncludeQ(extRef)) &&
          !(settings.filterOutpDAt && doesExtRefpDAIncludeT(extRef))
      )
      .map(extRef => toSubscriberRow(model, extRef))
      .filter(
        row =>
          search.test(row.searchText) &&
          !(settings.filterOutBound && row.bound) &&
          !(settings.filterOutNotBound && !row.bound)
      )
      .sort((a, b) =>
        sortExtRefItems(settings.sortExtRefSubscriber, a.extRef, b.extRef)
      );

    if (extRefRows.length === 0) {
      return;
    }

    rows.push({
      type: 'ied',
      key: `${identity(ied)} ${model.controlTag}`,
      ied,
      name: getNameAttribute(ied) ?? '',
      info: iedInfo(ied)
    });
    rows.push(...extRefRows);
  });

  return rows;
}

/**
 * The ExtRef to move on to after one is subscribed: the next one in the list
 * which is not already bound.
 * @param rows - the rows of the subscriber list as shown.
 * @param extRef - the ExtRef which was just subscribed.
 * @returns the next ExtRef, or undefined at the end or when the next is bound.
 */
export function nextExtRefToSubscribe(
  rows: SubscriberListRow[],
  extRef: Element
): Element | undefined {
  const extRefRows = rows.filter(
    (row): row is SubscriberExtRefRow => row.type === 'extref'
  );
  const index = extRefRows.findIndex(row => row.extRef === extRef);
  const next = index === -1 ? undefined : extRefRows[index + 1];
  return next && !isSubscribed(next.extRef) ? next.extRef : undefined;
}
