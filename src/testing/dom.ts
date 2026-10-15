/** Text with whitespace collapsed, as it is read on screen. */
export const normalize = (text: string | null | undefined): string =>
  (text ?? '').replace(/\s+/g, ' ').trim();

/**
 * Finds all elements below `root`, including those in shadow roots.
 * @param root - where to look.
 * @param selector - CSS selector.
 * @returns the elements found.
 */
export function deepQueryAll(root: ParentNode, selector: string): HTMLElement[] {
  const found: HTMLElement[] = [];
  const visit = (node: ParentNode): void => {
    node.querySelectorAll<HTMLElement>(selector).forEach(el => found.push(el));
    node.querySelectorAll<HTMLElement>('*').forEach((el) => {
      if (el.shadowRoot) {
        visit(el.shadowRoot);
      }
    });
  };
  visit(root);
  return found;
}

/**
 * The text of the children of an element in the named slot.
 * @param element - the element with slotted children.
 * @param slot - the name of the slot.
 * @returns their text.
 */
export const slotText = (element: Element, slot: string): string =>
  normalize(
    Array.from(element.querySelectorAll(`:scope > [slot="${slot}"]`))
      .map(child => child.textContent)
      .join(' ')
  );
