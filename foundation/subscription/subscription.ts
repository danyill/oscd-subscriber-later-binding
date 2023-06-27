import { Insert, Remove } from '@openscd/open-scd-core';

import {
  compareNames,
  getSclSchemaVersion,
  isPublic,
  minAvailableLogicalNodeInstance,
  serviceTypes,
} from '../foundation.js';
import { fcdaDesc } from '../tDataSet/getFcdaInstDesc.js';

export type fcdaData = {
  spec: { cdc: string; bType?: string } | undefined;
  desc: fcdaDesc;
};

export const SCL_NAMESPACE = 'http://www.iec.ch/61850/2003/SCL';

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
 * Simple function to check if the attribute of the Left Side has the same value as the attribute of the Right Element.
 *
 * @param leftElement   - The Left Element to check against.
 * @param rightElement  - The Right Element to check.
 * @param attributeName - The name of the attribute to check.
 */
function sameAttributeValue(
  leftElement: Element | undefined,
  rightElement: Element | undefined,
  attributeName: string
): boolean {
  return (
    (leftElement?.getAttribute(attributeName) ?? '') ===
    (rightElement?.getAttribute(attributeName) ?? '')
  );
}

/**
 * Simple function to check if the attribute of the Left Side has the same value as the attribute of the Right Element.
 *
 * @param leftElement        - The Left Element to check against.
 * @param leftAttributeName  - The name of the attribute (left) to check against.
 * @param rightElement       - The Right Element to check.
 * @param rightAttributeName - The name of the attribute (right) to check.
 */
function sameAttributeValueDiffName(
  leftElement: Element | undefined,
  leftAttributeName: string,
  rightElement: Element | undefined,
  rightAttributeName: string
): boolean {
  return (
    (leftElement?.getAttribute(leftAttributeName) ?? '') ===
    (rightElement?.getAttribute(rightAttributeName) ?? '')
  );
}

/**
 * If needed check version specific attributes against FCDA Element.
 *
 * @param controlTag     - Indicates which type of control element.
 * @param controlElement - The Control Element to check against.
 * @param extRefElement  - The Ext Ref Element to check.
 */
export function checkEditionSpecificRequirements(
  controlTag: 'SampledValueControl' | 'GSEControl',
  controlElement: Element | undefined,
  extRefElement: Element
): boolean {
  // For 2003 Edition no extra check needed.
  if (getSclSchemaVersion(extRefElement.ownerDocument) === '2003') {
    return true;
  }

  const lDeviceElement = controlElement?.closest('LDevice') ?? undefined;
  const lnElement = controlElement?.closest('LN0') ?? undefined;

  // For the 2007B and 2007B4 Edition we need to check some extra attributes.
  return (
    (extRefElement.getAttribute('serviceType') ?? '') ===
      serviceTypes[controlTag] &&
    sameAttributeValueDiffName(
      extRefElement,
      'srcLDInst',
      lDeviceElement,
      'inst'
    ) &&
    sameAttributeValueDiffName(
      extRefElement,
      'srcPrefix',
      lnElement,
      'prefix'
    ) &&
    sameAttributeValueDiffName(
      extRefElement,
      'srcLNClass',
      lnElement,
      'lnClass'
    ) &&
    sameAttributeValueDiffName(extRefElement, 'srcLNInst', lnElement, 'inst') &&
    sameAttributeValueDiffName(
      extRefElement,
      'srcCBName',
      controlElement,
      'name'
    )
  );
}

/**
 * Check if specific attributes from the ExtRef Element are the same as the ones from the FCDA Element
 * and also if the IED Name is the same. If that is the case this ExtRef subscribes to the selected FCDA
 * Element.
 *
 * @param controlTag     - Indicates which type of control element.
 * @param controlElement - The Control Element to check against.
 * @param fcdaElement    - The FCDA Element to check against.
 * @param extRefElement  - The Ext Ref Element to check.
 */
function isSubscribedTo(
  controlTag: 'SampledValueControl' | 'GSEControl',
  controlElement: Element | undefined,
  fcdaElement: Element | undefined,
  extRefElement: Element
): boolean {
  return (
    extRefElement.getAttribute('iedName') ===
      fcdaElement?.closest('IED')?.getAttribute('name') &&
    sameAttributeValue(fcdaElement, extRefElement, 'ldInst') &&
    sameAttributeValue(fcdaElement, extRefElement, 'prefix') &&
    sameAttributeValue(fcdaElement, extRefElement, 'lnClass') &&
    sameAttributeValue(fcdaElement, extRefElement, 'lnInst') &&
    sameAttributeValue(fcdaElement, extRefElement, 'doName') &&
    sameAttributeValue(fcdaElement, extRefElement, 'daName') &&
    checkEditionSpecificRequirements(controlTag, controlElement, extRefElement)
  );
}

export function getSubscribedExtRefElements(
  rootElement: Element,
  controlTag: 'SampledValueControl' | 'GSEControl',
  fcdaElement: Element | undefined,
  controlElement: Element | undefined,
  includeLaterBinding: boolean
): Element[] {
  return getExtRefElements(
    rootElement,
    fcdaElement,
    includeLaterBinding
  ).filter(extRefElement =>
    isSubscribedTo(controlTag, controlElement, fcdaElement, extRefElement)
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

/** Returns the subscriber's supervision LN for a given control block and extRef element
 *
 * @param extRef - The extRef SCL element in the subscribing IED.
 * @returns The supervision LN instance or null if not found
 */
export function getExistingSupervision(extRef: Element | null): Element | null {
  if (extRef === null) return null;

  // TODO: This seems inadequate. ServiceType may not be defined but we could search
  // both LGOS and LSVS instances.
  const supervisionType =
    extRef.getAttribute('serviceType') === 'GOOSE' ? 'LGOS' : 'LSVS';
  const refSelector =
    supervisionType === 'LGOS' ? 'DOI[name="GoCBRef"]' : 'DOI[name="SvCBRef"]';

  const iedName = extRef.closest('IED')?.getAttribute('name');

  const candidates = Array.from(
    extRef.ownerDocument
      .querySelector(`IED[name="${iedName}"]`)!
      .querySelectorAll(
        `:root > IED > AccessPoint > Server > LDevice > LN[lnClass="${supervisionType}"]>${refSelector}>DAI[name="setSrcRef"]>Val`
      )
  ).find(val => val.textContent === getCbReference(extRef));

  return candidates !== undefined ? candidates.closest('LN')! : null;
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
    'srcCBName',
  ];

  return (
    partialConfigElements.some(
      attr => extRefElement.getAttribute(attr) !== null
    ) && !isSubscribed(extRefElement)
  );
}

/**
 * Return Val elements within an LGOS/LSVS instance for a particular IED and control block type.
 * @param ied - IED SCL element.
 * @param cbTagName - Either GSEControl or (defaults to) SampledValueControl.
 * @returns an Element array of Val SCL elements within an LGOS/LSVS node.
 */
function getSupervisionCbRefs(ied: Element, cbTagName: string): Element[] {
  const supervisionType = cbTagName === 'GSEControl' ? 'LGOS' : 'LSVS';
  const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
  const selectorString = `LN[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val,LN0[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`;
  return Array.from(ied.querySelectorAll(selectorString));
}

// Internal API in scl-lib

/**
 * Creates a string pointer to the control block element.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @returns null if the control block is undefined or a string pointer to the control block element
 */
function controlBlockReference(
  controlBlock: Element | undefined
): string | null {
  if (!controlBlock) return null;
  const anyLn = controlBlock.closest('LN,LN0');
  const prefix = anyLn?.getAttribute('prefix') ?? '';
  const lnClass = anyLn?.getAttribute('lnClass');
  const lnInst = anyLn?.getAttribute('inst') ?? '';
  const ldInst = controlBlock.closest('LDevice')?.getAttribute('inst');
  const iedName = controlBlock.closest('IED')?.getAttribute('name');
  const cbName = controlBlock.getAttribute('name');
  if (!cbName && !iedName && !ldInst && !lnClass) return null;
  return `${iedName}${ldInst}/${prefix}${lnClass}${lnInst}.${cbName}`;
}

/**
 * Counts the number of LN instances with proper supervision for the given control block set up.
 *
 * @param subscriberIED - The subscriber IED.
 * @param controlBlock - The GOOSE or SMV message element.
 * @returns The number of LN instances with a supervision set up.
 */
function instantiatedSupervisionsCount(
  subscriberIED: Element,
  controlBlock: Element
): number {
  const instantiatedValues = getSupervisionCbRefs(
    subscriberIED,
    controlBlock.tagName
  ).filter(val => val.textContent !== '');
  return instantiatedValues.length;
}

/**
 * Counts the max number of LN instances with supervision allowed for
 * the given control block's type of message.
 *
 * @param subscriberIED The subscriber IED
 * @param controlBlock The GOOSE or SMV message element
 * @returns The max number of LN instances with supervision allowed
 */
function maxSupervisions(
  subscriberIED: Element,
  controlBlock: Element
): number {
  const maxAttr = controlBlock.tagName === 'GSEControl' ? 'maxGo' : 'maxSv';
  const maxValues = parseInt(
    subscriberIED
      .querySelector('Services>SupSubscription')
      ?.getAttribute(maxAttr) ?? '0',
    10
  );
  return Number.isNaN(maxValues) ? 0 : maxValues;
}

/**
 * Checks if the given combination of GOOSE/SMV message and subscriber IED
 * allows for subscription supervision.
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @param supervisionType LSVS or LGOS
 * @returns true if both controlBlock and subscriberIED meet the requirements for
 * setting up a supervision for the specified supervision type or false if they don't
 */
function isSupervisionAllowed(
  controlBlock: Element,
  subscriberIED: Element,
  supervisionType: string
): boolean {
  if (getSclSchemaVersion(subscriberIED.ownerDocument) === '2003') return false;
  if (subscriberIED.querySelector(`LN[lnClass="${supervisionType}"]`) === null)
    return false;
  if (
    getSupervisionCbRefs(subscriberIED, controlBlock.tagName).find(
      val => val.textContent === controlBlockReference(controlBlock)
    )
  )
    return false;
  if (
    maxSupervisions(subscriberIED, controlBlock) <=
    instantiatedSupervisionsCount(subscriberIED, controlBlock)
  )
    return false;

  return true;
}

/** Returns an new or existing LN instance available for supervision instantiation
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns The LN instance or null if no LN instance could be found or created
 */
function findOrCreateAvailableLNInst(
  controlBlock: Element,
  subscriberIED: Element,
  supervisionType: string
): Element | null {
  let availableLN = Array.from(
    subscriberIED.querySelectorAll(`LN[lnClass="${supervisionType}"]`)
  ).find(ln => {
    const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
    return (
      ln.querySelector(
        `DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`
      ) === null ||
      ln.querySelector(
        `DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`
      )?.textContent === ''
    );
  });
  if (!availableLN) {
    availableLN = subscriberIED.ownerDocument.createElementNS(
      SCL_NAMESPACE,
      'LN'
    );
    const openScdTag = subscriberIED.ownerDocument.createElementNS(
      SCL_NAMESPACE,
      'Private'
    );
    openScdTag.setAttribute('type', 'OpenSCD.create');
    availableLN.appendChild(openScdTag);
    availableLN.setAttribute('lnClass', supervisionType);
    const instantiatedSiblings = getSupervisionCbRefs(
      subscriberIED,
      controlBlock.tagName
    )[0]?.closest('LN');

    if (!instantiatedSiblings) return null;
    availableLN.setAttribute(
      'lnType',
      instantiatedSiblings?.getAttribute('lnType') ?? ''
    );
  }

  /* Before we return, we make sure that LN's inst is unique, non-empty
  and also the minimum inst as the minimum of all available in the IED */
  const inst = availableLN.getAttribute('inst') ?? '';
  if (inst === '') {
    const instNumber = minAvailableLogicalNodeInstance(
      Array.from(
        subscriberIED.querySelectorAll(`LN[lnClass="${supervisionType}"]`)
      )
    );
    if (!instNumber) return null;
    availableLN.setAttribute('inst', instNumber);
  }
  return availableLN;
}

/**
 * Searches for first instantiated LGOS/LSVS LN for presence of DOI>DAI[valKind=Conf/RO][valImport=true]
 * given a supervision type and if necessary then searches DataTypeTemplates for
 * DOType>DA[valKind=Conf/RO][valImport=true] to determine if modifications to supervision are allowed.
 * @param ied - SCL IED element.
 * @param supervisionType - either 'LGOS' or 'LSVS' supervision LN classes.
 * @returns boolean indicating if subscriptions are allowed.
 */
function isSupervisionModificationAllowed(
  ied: Element,
  supervisionType: string
): boolean {
  const firstSupervisionLN = ied.querySelector(
    `LN[lnClass="${supervisionType}"]`
  );

  // no supervision logical nodes => no new supervision possible
  if (firstSupervisionLN === null) return false;

  // check if allowed to modify based on first instance properties
  const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
  const instValKind = firstSupervisionLN!
    .querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`)
    ?.getAttribute('valKind');
  const instValImport = firstSupervisionLN!
    .querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`)
    ?.getAttribute('valImport');

  if (
    (instValKind === 'RO' || instValKind === 'Conf') &&
    instValImport === 'true'
  )
    return true;

  // check if allowed to modify based on DataTypeTemplates for first instance
  const rootNode = firstSupervisionLN?.ownerDocument;
  const lNodeType = firstSupervisionLN.getAttribute('lnType');
  const lnClass = firstSupervisionLN.getAttribute('lnClass');
  const dObj = rootNode.querySelector(
    `DataTypeTemplates > LNodeType[id="${lNodeType}"][lnClass="${lnClass}"] > DO[name="${
      lnClass === 'LGOS' ? 'GoCBRef' : 'SvCBRef'
    }"]`
  );
  if (dObj) {
    const dORef = dObj.getAttribute('type');
    const daObj = rootNode.querySelector(
      `DataTypeTemplates > DOType[id="${dORef}"] > DA[name="setSrcRef"]`
    );
    if (daObj) {
      return (
        (daObj.getAttribute('valKind') === 'Conf' ||
          daObj.getAttribute('valKind') === 'RO') &&
        daObj.getAttribute('valImport') === 'true'
      );
    }
  }
  // definition missing
  return false;
}

/**
 * Returns an array with a single Insert Edit to create a new
 * supervision element for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if instantiation is not possible or an array with a single Create action
 */
export function instantiateSubscriptionSupervision(
  controlBlock: Element | undefined,
  subscriberIED: Element | undefined
): (Insert | Remove)[] {
  const supervisionType =
    controlBlock?.tagName === 'GSEControl' ? 'LGOS' : 'LSVS';
  if (
    !controlBlock ||
    !subscriberIED ||
    !isSupervisionAllowed(controlBlock, subscriberIED, supervisionType)
  )
    return [];
  const availableLN = findOrCreateAvailableLNInst(
    controlBlock,
    subscriberIED,
    supervisionType
  );
  if (
    !availableLN ||
    !isSupervisionModificationAllowed(subscriberIED, supervisionType)
  )
    return [];

  const edits: (Insert | Remove)[] = [];
  // If creating new LN element
  if (!availableLN.parentElement) {
    const parent = subscriberIED.querySelector(
      `LN[lnClass="${supervisionType}"]`
    )?.parentElement;
    if (parent) {
      // use Insert edit for supervision LN
      edits.push({
        parent,
        node: availableLN,
        reference:
          parent!.querySelector(`LN[lnClass="${supervisionType}"]:last-child`)
            ?.nextElementSibling ?? null,
      });
    }
  }

  // Insert child elements
  const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';

  let doiElement = availableLN.querySelector(`DOI[name="${supervisionName}"]`);
  if (!doiElement) {
    doiElement = subscriberIED.ownerDocument.createElementNS(
      SCL_NAMESPACE,
      'DOI'
    );
    doiElement.setAttribute('name', supervisionName);
    edits.push({
      parent: availableLN!,
      reference: null,
      node: doiElement,
    });
  }

  let daiElement = doiElement.querySelector(`DAI[name="setSrcRef"]`);
  if (!daiElement) {
    daiElement = subscriberIED.ownerDocument.createElementNS(
      SCL_NAMESPACE,
      'DAI'
    );
    const srcValRef = subscriberIED.querySelector(
      `LN[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`
    );
    daiElement.setAttribute('name', 'setSrcRef');

    // transfer valKind and valImport from first supervision instance if present
    if (srcValRef?.hasAttribute('valKind'))
      daiElement.setAttribute('valKind', srcValRef.getAttribute('valKind')!);
    if (srcValRef?.hasAttribute('valImport'))
      daiElement.setAttribute(
        'valImport',
        srcValRef.getAttribute('valImport')!
      );
    edits.push({
      parent: doiElement!,
      reference: null,
      node: daiElement,
    });
  }

  const valTextContent = controlBlockReference(controlBlock);
  const valElement = daiElement.querySelector(`Val`);
  let newValElement: Element;

  if (valElement) {
    // remove old element
    edits.push({
      node: valElement,
    });
    newValElement = <Element>valElement.cloneNode(true);
  } else {
    newValElement = subscriberIED.ownerDocument.createElementNS(
      SCL_NAMESPACE,
      'Val'
    );
  }
  newValElement.textContent = valTextContent;

  // add new element
  edits.push({
    parent: daiElement!,
    reference: null,
    node: newValElement,
  });

  return edits;
}

export function canRemoveSubscriptionSupervision(
  subscribedExtRef: Element
): boolean {
  const [srcCBName, srcLDInst, srcLNClass, iedName, srcPrefix, srcLNInst] = [
    'srcCBName',
    'srcLDInst',
    'srcLNClass',
    'iedName',
    'srcPrefix',
    'srcLNInst',
  ].map(attr => subscribedExtRef.getAttribute(attr));
  return !Array.from(
    subscribedExtRef.closest('IED')?.getElementsByTagName('ExtRef') ?? []
  )
    .filter(isPublic)
    .some(
      extRef =>
        (extRef.getAttribute('srcCBName') ?? '') === (srcCBName ?? '') &&
        (extRef.getAttribute('srcLDInst') ?? '') === (srcLDInst ?? '') &&
        (extRef.getAttribute('srcLNClass') ?? '') === (srcLNClass ?? '') &&
        (extRef.getAttribute('iedName') ?? '') === (iedName ?? '') &&
        (extRef.getAttribute('srcPrefix') ?? '') === (srcPrefix ?? '') &&
        (extRef.getAttribute('srcLNInst') ?? '') === (srcLNInst ?? '') &&
        extRef !== subscribedExtRef
    );
}

/**
 * Return an array with a single Remove action to delete the supervision element
 * for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if removing the supervision is not possible or an array
 * with a single Delete action that removes the LN if it was created in OpenSCD
 * or only the supervision structure DOI/DAI/Val if it was created by the user.
 */
export function removeSubscriptionSupervision(
  controlBlock: Element | undefined,
  subscriberIED: Element | undefined
): Remove[] {
  if (!controlBlock || !subscriberIED) return [];
  const valElement = getSupervisionCbRefs(
    subscriberIED,
    controlBlock.tagName
  ).find(val => val.textContent === controlBlockReference(controlBlock));
  if (!valElement) return [];
  const lnElement = valElement.closest('LN0, LN');
  if (!lnElement || !lnElement.parentElement) return [];
  // Check if that one has been created by OpenSCD (private section exists)
  const isOpenScdCreated = lnElement.querySelector(
    'Private[type="OpenSCD.create"]'
  );
  return isOpenScdCreated
    ? [
        {
          node: lnElement,
        },
      ]
    : [
        {
          node: valElement.closest('DOI')!,
        },
      ];
}

export function getOrderedIeds(doc: XMLDocument): Element[] {
  return doc
    ? Array.from(doc.querySelectorAll(':root > IED')).sort((a, b) =>
        compareNames(a, b)
      )
    : [];
}

// export function getSupervisionCbRef(ln: Element): string | null {
//   const supervisionType = ln.getAttribute('lnClass');
//   const refSelector =
//     supervisionType === 'LGOS' ? 'DOI[name="GoCBRef"]' : 'DOI[name="SvCBRef"]';

//   const cbRef =
//     ln!.querySelector(`:scope > ${refSelector}>DAI[name="setSrcRef"]>Val`)
//       ?.textContent ?? null;
//   return cbRef;
// }

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
  if (!doc) return [];
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
    'srcCBName',
  ].map(name => extRefElement.getAttribute(name) ?? '');

  return `${
    srcPrefix ? `${srcPrefix} ` : ''
  }${srcLDInst} / ${srcLNClass} ${srcCBName}`;
}

function findFCDAs(extRef: Element): Element[] {
  if (extRef.tagName !== 'ExtRef' || extRef.closest('Private')) return [];

  const [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] = [
    'iedName',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'doName',
    'daName',
  ].map(name => extRef.getAttribute(name));
  const ied = Array.from(extRef.ownerDocument.getElementsByTagName('IED')).find(
    element =>
      element.getAttribute('name') === iedName && !element.closest('Private')
  );
  if (!ied) return [];

  return Array.from(ied.getElementsByTagName('FCDA'))
    .filter(item => !item.closest('Private'))
    .filter(
      fcda =>
        (fcda.getAttribute('ldInst') ?? '') === (ldInst ?? '') &&
        (fcda.getAttribute('prefix') ?? '') === (prefix ?? '') &&
        (fcda.getAttribute('lnClass') ?? '') === (lnClass ?? '') &&
        (fcda.getAttribute('lnInst') ?? '') === (lnInst ?? '') &&
        (fcda.getAttribute('doName') ?? '') === (doName ?? '') &&
        (fcda.getAttribute('daName') ?? '') === (daName ?? '')
    );
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

const serviceTypeControlBlockTags: Partial<Record<string, string[]>> = {
  GOOSE: ['GSEControl'],
  SMV: ['SampledValueControl'],
  Report: ['ReportControl'],
  NONE: ['LogControl', 'GSEControl', 'SampledValueControl', 'ReportControl'],
};

/**
 * Locates the control block associated with an ExtRef.
 *
 * @param extRef - SCL ExtRef element
 * @returns - either a GSEControl or SampledValueControl block
 */
export function findControlBlock(extRef: Element): Element {
  const fcdas = findFCDAs(extRef);
  const cbTags =
    serviceTypeControlBlockTags[extRef.getAttribute('serviceType') ?? 'NONE'] ??
    [];
  const controlBlocks = new Set(
    fcdas.flatMap(fcda => {
      const dataSet = fcda.parentElement!;
      const dsName = dataSet.getAttribute('name') ?? '';
      const anyLN = dataSet.parentElement!;
      return cbTags
        .flatMap(tag => Array.from(anyLN.getElementsByTagName(tag)))
        .filter(cb => {
          if (extRef.getAttribute('srcCBName')) {
            const ln = cb.closest('LN0')!;
            const lnClass = ln.getAttribute('lnClass');
            const lnPrefix = ln.getAttribute('prefix') ?? '';
            const lnInst = ln.getAttribute('inst');

            const ld = ln.closest('LDevice')!;
            const ldInst = ld.getAttribute('inst');
            const cbName = cb.getAttribute('name');

            return (
              extRef.getAttribute('srcCBName') === cbName &&
              (extRef.getAttribute('srcLNInst') ?? '') === lnInst &&
              (extRef.getAttribute('srcLNClass') ?? 'LLN0') === lnClass &&
              (extRef.getAttribute('srcPrefix') ?? '') === lnPrefix &&
              (extRef.getAttribute('srcLDInst') ??
                extRef.getAttribute('ldInst')) === ldInst
            );
          }
          return cb.getAttribute('datSet') === dsName;
        });
    })
  );
  return controlBlocks.values().next().value;
}

/**
 * Given an ExtRef SCL element, will locate the FCDA within the correct dataset the subscription comes from.
 * @param extRef  - SCL ExtRef Element.
 * @param controlBlock  - SCL GSEControl or SampledValueControl associated with the ExtRef.
 * @returns - SCL FCDA element
 */
export function findFCDA(
  extRef: Element,
  controlBlock: Element
): Element | null {
  if (extRef.tagName !== 'ExtRef' || extRef.closest('Private')) return null;

  const [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] = [
    'iedName',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'doName',
    'daName',
  ].map(name => extRef.getAttribute(name));
  const ied = Array.from(extRef.ownerDocument.getElementsByTagName('IED')).find(
    element =>
      element.getAttribute('name') === iedName && !element.closest('Private')
  );
  if (!ied) return null;

  const dataSetRef = controlBlock.getAttribute('datSet');

  const candidateFCDAs = Array.from(ied.getElementsByTagName('FCDA'))
    .filter(item => !item.closest('Private'))
    .filter(
      fcda =>
        (fcda.getAttribute('ldInst') ?? '') === (ldInst ?? '') &&
        (fcda.getAttribute('prefix') ?? '') === (prefix ?? '') &&
        (fcda.getAttribute('lnClass') ?? '') === (lnClass ?? '') &&
        (fcda.getAttribute('lnInst') ?? '') === (lnInst ?? '') &&
        (fcda.getAttribute('doName') ?? '') === (doName ?? '') &&
        (fcda.getAttribute('daName') ?? '') === (daName ?? '') &&
        fcda.parentElement?.getAttribute('name') === dataSetRef
    );

  return candidateFCDAs[0] ?? null;
}
