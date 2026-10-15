import { isBasicTypeEqual } from './extref.js';
import type { DataSpec, SubscriptionModel } from './model.js';

export type RestrictionOptions = {
  /** Check only the basic type, not `pLN`, the CDC or `pDA`. */
  checkOnlyBType?: boolean;
};

/**
 * Whether two common data classes can be bound to each other. Edition 1 and
 * Edition 2 documents differ, and ENS and INS, and ENC and INC, are compatible.
 */
function isCdcCompatible(fcdaCdc: string, extRefCdc: string): boolean {
  const compatible: Record<string, string> = {
    ENS: 'INS',
    INS: 'ENS',
    ENC: 'INC',
    INC: 'ENC'
  };
  return fcdaCdc === extRefCdc || compatible[fcdaCdc] === extRefCdc;
}

/**
 * Checks the restrictions an ExtRef places on the data it can be bound to, given
 * the data types of both sides. The restrictions are `pLN`, `pDO` (as the CDC)
 * and `pDA` (as the basic type).
 * @param extRef - the `ExtRef` which may carry `pDO`, `pLN` and `pDA`.
 * @param extRefSpec - the type of the data the ExtRef is restricted to.
 * @param fcda - the `FCDA` to check.
 * @param fcdaSpec - the type of the data the FCDA refers to.
 * @param options - what to check.
 * @returns whether the FCDA meets the restrictions of the ExtRef.
 */
export function meetsRestrictions(
  extRef: Element,
  extRefSpec: DataSpec,
  fcda: Element,
  fcdaSpec: DataSpec,
  options: RestrictionOptions = {}
): boolean {
  // The vendor does not provide data for the check so any FCDA is allowed
  if (!extRef.hasAttribute('pDO')) {
    return true;
  }

  // The check cannot be done, so it is taken to have failed
  if (!extRefSpec || !fcdaSpec) {
    return false;
  }

  // Some vendors allow subscribing e.g. an ACT to an SPS, both BOOLEAN
  if (options.checkOnlyBType) {
    return isBasicTypeEqual(fcdaSpec.bType, extRefSpec.bType);
  }

  const pLN = extRef.getAttribute('pLN');
  if (pLN && pLN !== fcda.getAttribute('lnClass')) {
    return false;
  }

  if (!isCdcCompatible(fcdaSpec.cdc, extRefSpec.cdc)) {
    return false;
  }

  return !(
    extRef.getAttribute('pDA') &&
    !isBasicTypeEqual(fcdaSpec.bType, extRefSpec.bType)
  );
}

/**
 * Checks whether an FCDA meets the restrictions of an ExtRef, using the data
 * types found in the model.
 * @param model - the model of the document.
 * @param extRef - the `ExtRef` to check against, or nothing.
 * @param fcda - the `FCDA` to check, or nothing.
 * @param options - what to check.
 * @returns whether the FCDA meets the restrictions, which is true if either is missing.
 */
export function doesFcdaMeetExtRefRestrictions(
  model: SubscriptionModel,
  extRef: Element | undefined,
  fcda: Element | undefined,
  options: RestrictionOptions = {}
): boolean {
  if (!extRef || !fcda || !extRef.hasAttribute('pDO')) {
    return true;
  }
  return meetsRestrictions(
    extRef,
    model.extRefInfo(extRef).spec,
    fcda,
    model.fcdaInfo(fcda).spec,
    options
  );
}
