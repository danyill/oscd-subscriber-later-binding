import { fixture, html, waitUntil } from '@open-wc/testing';
import type { LitElement } from 'lit';

import { deepQueryAll, slotText } from './dom.js';
import { useViewport } from './plugin.js';

/** The virtualized lists below an element, with their items and rows. */
function virtualLists(element: Element): (Element & { items: unknown[] })[] {
  return deepQueryAll(
    element.shadowRoot!,
    'virtualized-filtered-list'
  ) as unknown as (Element & { items: unknown[] })[];
}

/**
 * Waits until the virtualized lists in a component have drawn every row.
 * @param element - the component.
 */
export async function rowsDrawn(element: LitElement): Promise<void> {
  await element.updateComplete;
  await waitUntil(
    () =>
      virtualLists(element).every(
        list =>
          list.shadowRoot!.querySelectorAll('oscd-list-item').length ===
          list.items.length
      ),
    'the list did not draw all of its rows',
    { interval: 5, timeout: 3000 }
  );
}

/**
 * Mounts a list component, which must already be defined, in a container tall
 * enough for all of its rows.
 * @param tag - the tag of the component.
 * @param properties - properties to set on it.
 * @returns the component, once its rows are drawn.
 */
export async function mountList<T extends LitElement>(
  tag: string,
  properties: Record<string, unknown>
): Promise<T> {
  await useViewport('tall');
  const container = await fixture<HTMLDivElement>(
    html`<div style="height: 11000px; width: 640px;"></div>`
  );
  const list = document.createElement(tag) as T;
  list.style.display = 'block';
  list.style.height = '100%';
  Object.assign(list, properties);
  container.appendChild(list);
  await rowsDrawn(list);
  return list;
}

export type RowInfo = {
  element: HTMLElement;
  label: string;
  secondary: string;
  meta: string;
  disabled: boolean;
  selected: boolean;
};

/**
 * The rows of a list component with the text they show.
 * @param list - the component.
 * @param selector - which rows, e.g. `oscd-list-item.fcda`.
 * @returns the rows.
 */
export function rowsOf(list: LitElement, selector: string): RowInfo[] {
  return deepQueryAll(list.shadowRoot!, selector).map(element => ({
    element,
    label: slotText(element, 'headline'),
    secondary: slotText(element, 'supporting-text'),
    meta: slotText(element, 'end'),
    disabled: element.hasAttribute('disabled'),
    selected: element.classList.contains('selected')
  }));
}

/**
 * Types in the search field of a list component.
 * @param list - the component.
 * @param text - what to search for.
 */
export async function typeSearch(list: LitElement, text: string): Promise<void> {
  const field = deepQueryAll(list.shadowRoot!, 'oscd-outlined-text-field')[0] as unknown as HTMLInputElement;
  field.value = text;
  field.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  // the inner list reports the search once it has updated, and then the
  // component draws the rows again
  const inner = virtualLists(list) as unknown as { updateComplete: Promise<unknown> }[];
  await Promise.all(inner.map(item => item.updateComplete));
  await list.updateComplete;
  await rowsDrawn(list);
}

/**
 * Records the events of one type sent by an element.
 * @param element - what to listen to.
 * @param type - the event type.
 * @returns the details of each event, in order.
 */
export function recordEvents<T>(element: Element, type: string): T[] {
  const details: T[] = [];
  element.addEventListener(type, (event) => {
    details.push((event as CustomEvent<T>).detail);
  });
  return details;
}
