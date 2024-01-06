export type SclEdition = '2003' | '2007B' | '2007B4';
export declare function getSclSchemaVersion(doc: Document): SclEdition;
export declare const serviceTypes: Partial<Record<string, string>>;
/**
 * Extract the 'name' attribute from the given XML element.
 * @param element - The element to extract name from.
 * @returns the name, or undefined if there is no name.
 */
export declare function getNameAttribute(element: Element): string | undefined;
/**
 * Extract the 'desc' attribute from the given XML element.
 * @param element - The element to extract description from.
 * @returns the name, or undefined if there is no description.
 */
export declare function getDescriptionAttribute(element: Element): string | undefined;
/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
export declare function compareNames(a: Element | string, b: Element | string): number;
export declare function findFCDAs(extRef: Element): Element[];
