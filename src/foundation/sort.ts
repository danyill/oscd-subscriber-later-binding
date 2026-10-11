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
