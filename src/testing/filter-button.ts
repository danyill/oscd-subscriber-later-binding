import { waitUntil } from '@open-wc/testing';

/** The parts of an `oscd-filter-button` which specs interact with. */
export type FilterButton = HTMLElement & {
  items: { headline: string; selected: boolean }[];
  updateComplete: Promise<unknown>;
};

function dialogOf(button: FilterButton) {
  return button.shadowRoot!.querySelector('oscd-dialog') as HTMLElement & {
    open: boolean;
  };
}

/**
 * Opens the dialog of a filter button by clicking its button, as a user does.
 * @param button - the filter button.
 */
export async function openFilterButton(button: FilterButton): Promise<void> {
  button.shadowRoot!.querySelector<HTMLElement>('oscd-icon-button')!.click();
  await waitUntil(() => dialogOf(button).open, 'the menu did not open');
  await button.updateComplete;
}

/**
 * Clicks an item of an open dialog, as a user does to tick or untick it.
 * @param button - the filter button.
 * @param index - position of the item.
 */
export async function clickFilterButtonItem(
  button: FilterButton,
  index: number
): Promise<void> {
  const items = button.shadowRoot!.querySelectorAll<HTMLElement>(
    '.listitems oscd-list-item'
  );
  items[index].click();
  await button.updateComplete;
}

/**
 * Closes an open dialog with one of its buttons and waits for it to close.
 * @param button - the filter button.
 * @param action - which button to press.
 */
export async function closeFilterButton(
  button: FilterButton,
  action: 'apply' | 'cancel'
): Promise<void> {
  const closed = new Promise<void>((resolve) => {
    button.addEventListener('filter-button-dialog-close', () => resolve(), {
      once: true
    });
  });
  const tag = action === 'apply' ? 'oscd-filled-button' : 'oscd-outlined-button';
  button.shadowRoot!.querySelector<HTMLElement>(tag)!.click();
  await closed;
}
