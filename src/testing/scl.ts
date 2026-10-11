const SCL_NS = 'http://www.iec.ch/61850/2003/SCL';

/**
 * Parses SCL content into a document. The content is wrapped in an `SCL` root
 * element so specs only need to describe the part they are interested in.
 * @param content - SCL child elements, e.g. one or more `IED` elements.
 * @returns the parsed SCL document.
 */
export function parseScl(content: string): XMLDocument {
  return new DOMParser().parseFromString(
    `<SCL xmlns="${SCL_NS}" version="2007" revision="B">${content}</SCL>`,
    'application/xml'
  );
}

/**
 * Finds the first element matching a selector, failing the spec early with a
 * useful message instead of a null dereference.
 * @param root - Element or document to search in.
 * @param selector - CSS selector.
 * @returns the element.
 */
export function mustQuery(root: ParentNode, selector: string): Element {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Test SCL has no element matching "${selector}"`);
  }
  return element;
}
