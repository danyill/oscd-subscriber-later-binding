import { identity } from './foundation/identities/identity.js';
import { selector } from './foundation/identities/selector.js';

export function updateElementReference(
  newDoc: XMLDocument,
  oldElement: Element
): Element | null {
  if (!oldElement || !oldElement.closest('SCL')) return null;

  const id = identity(oldElement);
  const newElement = newDoc.querySelector(selector(oldElement.tagName, id));

  return newElement;
}

export function isPublic(element: Element): boolean {
  return !element.closest('Private');
}
