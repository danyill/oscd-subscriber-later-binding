import { identity, find } from '@openenergytools/scl-lib';

export function updateElementReference(
  newDoc: XMLDocument,
  oldElement: Element
): Element | null {
  if (!oldElement || !oldElement.closest('SCL')) return null;

  const id = identity(oldElement);
  const newElement = find(newDoc, oldElement.tagName, id);

  return newElement;
}

export function isPublic(element: Element): boolean {
  return !element.closest('Private');
}
