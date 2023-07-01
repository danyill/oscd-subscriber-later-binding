import { Insert, Remove } from '@openscd/open-scd-core';
import { fcdaDesc } from '../tDataSet/getFcdaInstDesc.js';
export declare type fcdaData = {
    spec: {
        cdc: string;
        bType?: string;
    } | undefined;
    desc: fcdaDesc;
};
export declare const SCL_NAMESPACE = "http://www.iec.ch/61850/2003/SCL";
export declare function getFcdaOrExtRefTitle(fcdaElement: Element): string;
export declare function getExtRefElements(rootElement: Element, fcdaElement: Element | undefined, includeLaterBinding: boolean): Element[];
/**
 * If needed check version specific attributes against FCDA Element.
 *
 * @param controlTag     - Indicates which type of control element.
 * @param controlElement - The Control Element to check against.
 * @param extRefElement  - The Ext Ref Element to check.
 */
export declare function checkEditionSpecificRequirements(controlTag: 'SampledValueControl' | 'GSEControl', controlElement: Element | undefined, extRefElement: Element): boolean;
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
 * Returns an array with a single Insert Edit to create a new
 * supervision element for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if instantiation is not possible or an array with a single Create action
 */
export declare function instantiateSubscriptionSupervision(controlBlock: Element | undefined, subscriberIED: Element | undefined): (Insert | Remove)[];
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
export declare function getExtRefControlBlockPath(extRefElement: Element): string;
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
