export function doesExtRefpDAIncludeQ(extRef: Element): boolean {
  return (
    extRef.hasAttribute('pDA') &&
    extRef.getAttribute('pDA')?.split('.').pop() === 'q'
  );
}

export function doesExtRefpDAIncludeT(extRef: Element): boolean {
  return (
    extRef.hasAttribute('pDA') &&
    extRef.getAttribute('pDA')?.split('.').pop() === 't'
  );
}

/*
 * IMPORTANT: This function  is an exact copy of the same function in
 * scl-lib.
 *
 * TODO: Add tests to scl-lib and export
 */
export function isBasicTypeEqual(
  bTypeFcda: string | undefined,
  bTypeExtRef: string | undefined
): boolean {
  // Basic types not the same
  return (
     
    bTypeFcda === bTypeExtRef ||
    // Enum to INT32 mappings specifically allowed, Ed 1 to Ed 2 compatibility
    (bTypeFcda === 'INT32' && bTypeExtRef === 'Enum') ||
    (bTypeFcda === 'Enum' && bTypeExtRef === 'INT32')
  );
}
