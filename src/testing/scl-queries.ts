import { find } from '@openscd/scl-lib';

/**
 * Finds an ExtRef by the identity used in the plugin's list items.
 * @param doc - SCL document.
 * @param id - ExtRef identity.
 * @returns the ExtRef.
 */
export function extRefById(doc: XMLDocument, id: string): Element {
  const extRef = find(doc, 'ExtRef', id);
  if (extRef === null) {
    throw new Error(`No ExtRef with identity ${id}`);
  }
  return extRef as Element;
}

/**
 * The data and control block attributes of an ExtRef which make up a
 * subscription, so that specs can compare them in one assertion.
 * @param extRef - an ExtRef.
 * @returns attribute name to value, omitting attributes which are absent.
 */
export function subscriptionAttributes(extRef: Element): Record<string, string> {
  return Object.fromEntries(
    [
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
    ]
      .filter(name => extRef.hasAttribute(name))
      .map(name => [name, extRef.getAttribute(name)!])
  );
}

/**
 * Control block references held by supervision logical nodes of an IED.
 * @param doc - SCL document.
 * @param iedName - IED to inspect.
 * @param lnClass - `LGOS` for GOOSE or `LSVS` for sampled values.
 * @returns the non-empty references, sorted.
 */
export function supervisionReferences(
  doc: XMLDocument,
  iedName: string,
  lnClass: 'LGOS' | 'LSVS' = 'LGOS'
): string[] {
  const doName = lnClass === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
  return Array.from(
    doc.querySelectorAll(
      `IED[name="${iedName}"] LN[lnClass="${lnClass}"] > DOI[name="${doName}"] > DAI[name="setSrcRef"] > Val`
    )
  )
    .map(val => val.textContent ?? '')
    .filter(text => text !== '')
    .sort();
}
