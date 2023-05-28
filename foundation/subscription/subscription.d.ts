import { Insert, Remove, Update } from '@openscd/open-scd-core';
export declare const SCL_NAMESPACE = "http://www.iec.ch/61850/2003/SCL";
export declare function getFcdaOrExtRefTitleValue(fcdaElement: Element): string;
export declare function getFcdaOrExtRefSubtitleValue(fcdaElement: Element): string;
/**
 * Edition 2 and later SCL files allow to restrict subscription on
 * later binding type inputs (`ExtRef` elements) based on a `CDC` and
 * basic type `bType`.
 * @param extRef - A later binding type input in the sink IED
 * @returns data objects `CDC` and data attribute basic type `bType` or `null`
 */
export declare function inputRestriction(extRef: Element): {
    cdc: string | null;
    bType: string | null;
};
/**
 * @param fcda - Data attribute reference in a data set
 * @returns Data objects `CDC` and data attributes `bType`
 */
export declare function fcdaSpecification(fcda: Element): {
    cdc: string | null;
    bType: string | null;
};
export declare function getExtRefElements(rootElement: Element, fcdaElement: Element | undefined, includeLaterBinding: boolean): Element[];
/**
 * Simple function to check if the attribute of the Left Side has the same value as the attribute of the Right Element.
 *
 * @param leftElement        - The Left Element to check against.
 * @param leftAttributeName  - The name of the attribute (left) to check against.
 * @param rightElement       - The Right Element to check.
 * @param rightAttributeName - The name of the attribute (right) to check.
 */
export declare function sameAttributeValueDiffName(leftElement: Element | undefined, leftAttributeName: string, rightElement: Element | undefined, rightAttributeName: string): boolean;
export declare function getSubscribedExtRefElements(rootElement: Element, controlTag: 'SampledValueControl' | 'GSEControl', fcdaElement: Element | undefined, controlElement: Element | undefined, includeLaterBinding: boolean): Element[];
export declare function getCbReference(extRef: Element): string;
/** Returns the subscriber's supervision LN for a given control block and extRef element
 *
 * @param extRef - The extRef SCL element in the subscribing IED.
 * @returns The supervision LN instance or null if not found
 */
export declare function getExistingSupervision(extRef: Element | null): Element | null;
/**
 * Check if the ExtRef is already subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
export declare function isSubscribed(extRefElement: Element): boolean;
/**
 * Check if the ExtRef is already partially subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
export declare function isPartiallyConfigured(extRefElement: Element): boolean;
/**
 * Counts the max number of LN instances with supervision allowed for
 * the given control block's type of message.
 *
 * @param subscriberIED The subscriber IED
 * @param controlBlock The GOOSE or SMV message element
 * @returns The max number of LN instances with supervision allowed
 */
export declare function maxSupervisions(subscriberIED: Element, controlBlock: Element): number;
/** Returns an new or existing LN instance available for supervision instantiation
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns The LN instance or null if no LN instance could be found or created
 */
export declare function findOrCreateAvailableLNInst(controlBlock: Element, subscriberIED: Element, supervisionType: string): Element | null;
/**
 * Returns an array with a single Insert Edit to create a new
 * supervision element for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if instantiation is not possible or an array with a single Create action
 */
export declare function instantiateSubscriptionSupervision(controlBlock: Element | undefined, subscriberIED: Element | undefined): Insert[];
/**
 * Update the passed ExtRefElement and set the required attributes on the cloned element
 * depending on the Edition and type of Control Element.
 *
 * @param extRefElement  - The ExtRef Element to update.
 * @param controlElement - `ReportControl`, `GSEControl` or `SampledValueControl` source element
 * @param fcdaElement    - The source data attribute element.
 * @returns An Update Action for the ExtRefElement.
 */
export declare function updateExtRefElement(extRefElement: Element, controlElement: Element | undefined, fcdaElement: Element): Update;
export declare function canRemoveSubscriptionSupervision(subscribedExtRef: Element): boolean;
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
export declare function removeSubscriptionSupervision(controlBlock: Element | undefined, subscriberIED: Element | undefined): Remove[];
export declare function getOrderedIeds(doc: XMLDocument): Element[];
/**
 * Returns the used supervision LN instances for a given service type.
 *
 * @param doc - SCL document.
 * @param serviceType - either GOOSE or SMV.
 * @returns - array of Elements of supervision LN instances.
 */
export declare function getUsedSupervisionInstances(doc: Document, serviceType: string): Element[];
export declare function getFcdaSrcControlBlockDescription(extRefElement: Element): string;
export declare function findFCDAs(extRef: Element): Element[];
export declare function getFcdaElements(controlElement: Element): Element[];
/**
 * Locates the control block associated with an ExtRef.
 *
 * @param extRef - SCL ExtRef element
 * @returns - either a GSEControl or SampledValueControl block
 */
export declare function findControlBlock(extRef: Element): Element;
/**
 * Given an ExtRef SCL element, will locate the FCDA within the correct dataset the subscription comes from.
 * @param extRef  - SCL ExtRef Element.
 * @param controlBlock  - SCL GSEControl or SampledValueControl associated with the ExtRef.
 * @returns - SCL FCDA element
 */
export declare function findFCDA(extRef: Element, controlBlock: Element): Element | null;
