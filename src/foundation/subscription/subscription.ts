import {
  matchDataAttributes,
  matchSrcAttributes
} from '@openscd/scl-lib';
import { compareNames } from '../foundation.js';
import { fcdaDesc } from '../tDataSet/getFcdaInstDesc.js';

export type fcdaData = {
  spec: { cdc: string; bType?: string } | undefined;
  desc: fcdaDesc;
};

export function getFcdaOrExtRefTitle(fcdaElement: Element): string {
  return `${fcdaElement.getAttribute('ldInst')} ${
    fcdaElement.hasAttribute('ldInst') ? `/` : ''
  }${
    fcdaElement.getAttribute('prefix')
      ? ` ${fcdaElement.getAttribute('prefix')}`
      : ''
  } ${fcdaElement.getAttribute('lnClass') ?? ''} ${
    fcdaElement.getAttribute('lnInst') ?? ''
  } ${fcdaElement.getAttribute('doName') ?? ''}${
    fcdaElement.hasAttribute('doName') && fcdaElement.hasAttribute('daName')
      ? `.`
      : ``
  }${fcdaElement.getAttribute('daName') ?? ''}`;
}

export function getExtRefElements(
  rootElement: Element,
  fcdaElement: Element | undefined,
  includeLaterBinding: boolean
): Element[] {
  return Array.from(rootElement.querySelectorAll('ExtRef'))
    .filter(
      element =>
        (includeLaterBinding && element.hasAttribute('intAddr')) ||
        (!includeLaterBinding && !element.hasAttribute('intAddr'))
    )
    .filter(element => element.closest('IED') !== fcdaElement?.closest('IED'));
}

/**
 * Check if specific attributes from the ExtRef Element are the same as the ones from the FCDA Element
 * and also if the IED Name is the same. If that is the case this ExtRef subscribes to the selected FCDA
 * Element.
 *
 * @param control - The Control Element to check against.
 * @param fcda    - The FCDA Element to check against.
 * @param extRef  - The Ext Ref Element to check.
 */
export function isSubscribedTo(
  control: Element | undefined,
  fcda: Element | undefined,
  extRef: Element
): boolean {
  if (!control || !fcda) {
    return false;
  }
  return (
    extRef.getAttribute('iedName') ===
      fcda?.closest('IED')?.getAttribute('name') &&
    matchDataAttributes(extRef, fcda) &&
    matchSrcAttributes(extRef, control!)
  );
}

export function getSubscribedExtRefElements(
  rootElement: Element,
  fcdaElement: Element | undefined,
  controlElement: Element | undefined,
  includeLaterBinding: boolean
): Element[] {
  return getExtRefElements(
    rootElement,
    fcdaElement,
    includeLaterBinding
  ).filter(extRefElement =>
    isSubscribedTo(controlElement, fcdaElement, extRefElement)
  );
}

// TODO: scl-lib export
export function getCbReference(extRef: Element): string {
  const extRefValues = ['iedName', 'srcPrefix', 'srcCBName'];
  const [srcIedName, srcPrefix, srcCBName] = extRefValues.map(
    attr => extRef.getAttribute(attr) ?? ''
  );

  const srcLDInst =
    extRef.getAttribute('srcLDInst') ?? extRef.getAttribute('ldInst');
  const srcLNClass = extRef.getAttribute('srcLNClass') ?? 'LLN0';

  return `${srcIedName}${srcPrefix}${srcLDInst}/${srcLNClass}.${srcCBName}`;
}

/**
 * Check if the ExtRef is already subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
export function isSubscribed(extRefElement: Element): boolean {
  return (
    extRefElement.hasAttribute('iedName') &&
    extRefElement.hasAttribute('ldInst') &&
    extRefElement.hasAttribute('lnClass') &&
    extRefElement.hasAttribute('lnInst') &&
    extRefElement.hasAttribute('doName')
  );
}

/**
 * Check if the ExtRef is already partially subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
export function isPartiallyConfigured(extRefElement: Element): boolean {
  const partialConfigElements = [
    'iedName',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'doName',
    'daName',
    'srcLDInst',
    'srcPrefix',
    'srcLNClass',
    'srcLNInst',
    'srcCBName'
  ];

  return (
    partialConfigElements.some(
      attr => extRefElement.getAttribute(attr) !== null
    ) && !isSubscribed(extRefElement)
  );
}

export function getOrderedIeds(doc: XMLDocument): Element[] {
  return doc
    ? Array.from(doc.querySelectorAll(':root > IED')).sort((a, b) =>
      compareNames(a, b)
    )
    : [];
}

/**
 * Returns the used supervision LN instances for a given service type.
 *
 * @param doc - SCL document.
 * @param serviceType - either GOOSE or SMV.
 * @returns - array of Elements of supervision LN instances.
 */
export function getUsedSupervisionInstances(
  doc: Document,
  serviceType: string
): Element[] {
  if (!doc) {
    return [];
  }
  const supervisionType = serviceType === 'GOOSE' ? 'LGOS' : 'LSVS';
  const refSelector =
    supervisionType === 'LGOS' ? 'DOI[name="GoCBRef"]' : 'DOI[name="SvCBRef"]';

  const supervisionInstances = Array.from(
    doc!.querySelectorAll(
      `:root > IED > AccessPoint > Server > LDevice > LN[lnClass="${supervisionType}"]>${refSelector}>DAI[name="setSrcRef"]>Val`
    )
  )
    .filter(val => val.textContent !== '')
    .map(val => val.closest('LN')!);

  return supervisionInstances;
}

export function getExtRefControlBlockPath(extRefElement: Element): string {
  const [srcPrefix, srcLDInst, srcLNClass, srcCBName] = [
    'srcPrefix',
    'srcLDInst',
    'srcLNClass',
    'srcCBName'
  ].map(name => extRefElement.getAttribute(name) ?? '');

  return `${
    srcPrefix ? `${srcPrefix} ` : ''
  }${srcLDInst} / ${srcLNClass} ${srcCBName}`;
}

export function getFcdaElements(controlElement: Element): Element[] {
  const lnElement = controlElement.parentElement;
  if (lnElement) {
    return Array.from(
      lnElement.querySelectorAll(
        `:scope > DataSet[name=${controlElement.getAttribute('datSet')}] > FCDA`
      )
    );
  }
  return [];
}

