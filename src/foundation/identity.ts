/**
 * Given an identity string prefixed with an IED name, remove the IED
 * name and make more human readable by adding spaces around carets.
 * @param idString
 * @returns - an identity string without the iedName.
 */
export function trimIdentityParent(idString: string): string {
  return idString
    .split('>')
    .filter(s => s !== '')
    .slice(1)
    .join(' > ');
}

/**
 * Given an SCL element, returns an object reference up to the
 * Logical Device.
 * @param sclElement - an SCL  element.
 * @returns a string.
 */
export function objectReferenceInIed(sclElement: Element): string {
  const lN = sclElement.closest('LN') ?? sclElement.closest('LN0');
  const lDevice = lN!.closest('LDevice')!;

  const ldInst = lDevice.getAttribute('inst');
  const lnPrefix = lN!.getAttribute('prefix') ?? '';
  const lnClass = lN!.getAttribute('lnClass');
  const lnInst = lN!.getAttribute('inst');

  return [ldInst, '/', lnPrefix, lnClass, lnInst].filter(a => !!a).join(' ');
}
