import type { SubscriptionModel } from './model.js';
import { getFcdaOrExtRefTitle } from './subscription/subscription.js';

export enum FcdaSortOrder {
  DataModel,
  Path,
  FullDescription,
  DODescription,
  DADescription
}

export enum ExtRefSortOrder {
  DataModel,
  InternalAddress,
  Description,
  MappedReference
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
export function sortExtRefItems(
  sortSetting: ExtRefSortOrder,
  aExtRef: Element,
  bExtRef: Element
): number {
  if (sortSetting === ExtRefSortOrder.InternalAddress) {
    return (aExtRef.getAttribute('intAddr') ?? '').localeCompare(
      bExtRef.getAttribute('intAddr') ?? ''
    );
  }

  if (sortSetting === ExtRefSortOrder.Description) {
    const hasDescFirstnotSecond = (a: Element, b: Element) =>
      (!b.hasAttribute('desc') || b.getAttribute('desc') === '') &&
      a.hasAttribute('desc') &&
      a.getAttribute('desc') !== '';

    // descriptions always come first
    if (hasDescFirstnotSecond(aExtRef, bExtRef)) {
      return -1;
    }
    if (hasDescFirstnotSecond(bExtRef, aExtRef)) {
      return 1;
    }

    return (aExtRef.getAttribute('desc') ?? '').localeCompare(
      bExtRef.getAttribute('desc') ?? ''
    );
  }

  const getFcdaName = (ext: Element) =>
    `${ext.getAttribute('iedName') ?? 'Unknown'} > ${getFcdaOrExtRefTitle(
      ext
    )}`;

  if (sortSetting === ExtRefSortOrder.MappedReference) {
    return getFcdaName(aExtRef).localeCompare(getFcdaName(bExtRef));
  }

  // data model order
  return 0;
}

const describedFirst = (a: string, b: string): number => {
  // items with a description always come before those without one
  if (a !== '' && b === '') {
    return -1;
  }
  if (a === '' && b !== '') {
    return 1;
  }
  return a.localeCompare(b);
};

/**
 * Compares two FCDAs of a data set for sorting.
 * @param order - how to sort.
 * @param a - the first FCDA.
 * @param b - the second FCDA.
 * @param model - the model of the document, to find descriptions.
 * @returns a number for use with a sort function.
 */
export function compareFcdas(
  order: FcdaSortOrder,
  a: Element,
  b: Element,
  model: SubscriptionModel
): number {
  if (order === FcdaSortOrder.Path) {
    return getFcdaOrExtRefTitle(a).localeCompare(getFcdaOrExtRefTitle(b));
  }

  if (order === FcdaSortOrder.FullDescription) {
    const full = (fcda: Element) =>
      Object.values(model.fcdaInfo(fcda).desc)
        .flat(Infinity as 1)
        .join('>');
    return describedFirst(full(a), full(b));
  }

  if (order === FcdaSortOrder.DODescription) {
    const dataObject = (fcda: Element) => {
      const { DOI, SDI, DAI } = model.fcdaInfo(fcda).desc;
      return [DOI, SDI, DAI]
        .flat(Infinity as 1)
        .filter(item => !!item)
        .join('>');
    };
    return describedFirst(dataObject(a), dataObject(b));
  }

  if (order === FcdaSortOrder.DADescription) {
    return describedFirst(
      model.fcdaInfo(a).desc.DAI ?? '',
      model.fcdaInfo(b).desc.DAI ?? ''
    );
  }

  // data model order
  return 0;
}
