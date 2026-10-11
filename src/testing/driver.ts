import { waitUntil } from '@open-wc/testing';

import { getSearchRegex } from '../foundation/search.js';
import type { MountedPlugin } from './plugin.js';

export type ListedItem = {
  /** The element's identity: `data-fcda`, `data-control` or `data-extref`. */
  id: string;
  /** Visible text of the main line, whitespace collapsed. */
  label: string;
  /** Visible text of the secondary line, whitespace collapsed. */
  secondary: string;
  /** Visible text including icon names, whitespace collapsed. */
  text: string;
  /** The tooltip. */
  title: string;
  /** Text shown at the end of the item, e.g. a subscription count. */
  meta: string;
  disabled: boolean;
  /** The underlying list item, for interacting with it. */
  element: HTMLElement;
};

export type SearchField = 'fcda' | 'publisherExtRef' | 'subscriberExtRef';

const searchInputs: Record<SearchField, string> = {
  fcda: '#filterFcdaInput',
  publisherExtRef: '#filterExtRefPublisherInput',
  subscriberExtRef: '#filterExtRefSubscriberInput'
};

const searchRegexes: Record<SearchField, string> = {
  fcda: 'searchFcdaRegex',
  publisherExtRef: 'searchExtRefPublisherRegex',
  subscriberExtRef: 'searchExtRefSubscriberRegex'
};

const normalize = (text: string | null | undefined): string =>
  (text ?? '').replace(/\s+/g, ' ').trim();

/**
 * The only place which knows how the plugin's DOM is built. Specs interact
 * with the plugin through this driver so that replacing the UI components only
 * requires changes here, not in the specs.
 */
export class PluginDriver {
  constructor(private readonly mounted: MountedPlugin) {}

  private get root(): ShadowRoot {
    return this.mounted.plugin.shadowRoot!;
  }

  private query(selector: string): HTMLElement | null {
    return this.root.querySelector<HTMLElement>(selector);
  }

  private items(selector: string, idAttribute: string): ListedItem[] {
    return Array.from(this.root.querySelectorAll<HTMLElement>(selector)).map(
      element => ({
        id: element.getAttribute(idAttribute) ?? '',
        label: normalize(element.querySelector('span:not([slot])')?.textContent),
        secondary: normalize(
          element.querySelector('span[slot="secondary"]')?.textContent
        ),
        text: normalize(element.textContent),
        title: element.getAttribute('title') ?? '',
        meta: normalize(element.querySelector('[slot="meta"]')?.textContent),
        disabled: element.hasAttribute('disabled'),
        element
      })
    );
  }

  /** Control block headings in the publisher list. */
  controls(): ListedItem[] {
    return this.items('#fcdaList mwc-list-item.control', 'data-control');
  }

  /** FCDAs in the data attribute list, in displayed order. */
  fcdas(): ListedItem[] {
    return this.items('#fcdaList mwc-list-item.fcda', 'data-fcda');
  }

  /** Control block headings in the publisher list as displayed. */
  controlTitles(): string[] {
    return this.controls().map(item => item.label);
  }

  fcda(controlId: string, fcdaId: string): ListedItem | undefined {
    return this.fcdas().find(
      item =>
        item.element.getAttribute('data-control') === controlId &&
        item.id === fcdaId
    );
  }

  /** ExtRefs in the publisher view, subscribed and available. */
  publisherExtRefs(): ListedItem[] {
    return this.items('#publisherExtRefList mwc-list-item.extref', 'data-extref');
  }

  /** ExtRefs already subscribed to the selected FCDA in the publisher view. */
  publisherSubscribedExtRefs(): ListedItem[] {
    return this.publisherExtRefs().filter(
      item => this.graphicIcon(item) === 'link'
    );
  }

  /** ExtRefs which can be subscribed to the selected FCDA. */
  publisherAvailableExtRefs(): ListedItem[] {
    return this.publisherExtRefs().filter(
      item => this.graphicIcon(item) === 'link_off'
    );
  }

  private graphicIcon(item: ListedItem): string {
    return normalize(
      item.element.querySelector('mwc-icon[slot="graphic"]')?.textContent
    );
  }

  /** IED headings in the subscriber view. */
  ieds(): ListedItem[] {
    return this.items('#subscriberExtRefList mwc-list-item.ied', 'data-extref');
  }

  /** ExtRefs in the subscriber view, in displayed order. */
  subscriberExtRefs(): ListedItem[] {
    return this.items(
      '#subscriberExtRefList mwc-list-item.extref',
      'data-extref'
    );
  }

  /** Messages such as "No inputs", shown instead of a list. */
  headings(): string[] {
    return Array.from(this.root.querySelectorAll('h1, h3')).map(h =>
      normalize(h.textContent)
    );
  }

  /** Text of all non-interactive list items, e.g. "No subscribed inputs". */
  placeholders(): string[] {
    return Array.from(
      this.root.querySelectorAll('mwc-list-item[noninteractive]')
    )
      .map(item => normalize(item.textContent))
      .filter(text => text !== '');
  }

  /** Whether the read-only lock icon is displayed. */
  get showsReadOnlyIcon(): boolean {
    return this.query('.read-only-icon') !== null;
  }

  async click(item: ListedItem | undefined): Promise<void> {
    if (item === undefined) {
      throw new Error('Cannot click an item which is not displayed');
    }
    item.element.click();
    await this.mounted.settle();
  }

  async selectFcda(controlId: string, fcdaId: string): Promise<void> {
    await this.click(this.fcda(controlId, fcdaId));
  }

  async selectExtRef(extRefId: string, view: 'publisher' | 'subscriber') {
    const items =
      view === 'publisher' ? this.publisherExtRefs() : this.subscriberExtRefs();
    await this.click(items.find(item => item.id === extRefId));
  }

  /** Toggles between the publisher and subscriber views. */
  async switchView(): Promise<void> {
    this.query('#switchView')!.click();
    await this.mounted.settle();
  }

  /** Toggles between GOOSE and sampled value control blocks. */
  async switchControlType(): Promise<void> {
    this.query('#switchControlType')!.click();
    await this.mounted.settle();
  }

  /**
   * Types into a search field.
   * @param field - which search field.
   * @param text - the search expression.
   */
  async search(field: SearchField, text: string): Promise<void> {
    const input = this.query(searchInputs[field]) as HTMLInputElement | null;
    if (input === null) {
      throw new Error(`Search field ${field} is not displayed`);
    }
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    const expected = getSearchRegex(text).source;
    await waitUntil(
      () =>
        (this.mounted.plugin as unknown as Record<string, RegExp>)[
          searchRegexes[field]
        ].source === expected,
      `search for "${text}" was not applied`
    );
    await this.mounted.settle();
  }

  /**
   * Chooses menu options as a user would: opening the menu, setting which
   * check items are selected and closing it, which applies the choice.
   * @param menuId - id of the menu element.
   * @param selected - positions of the items which should be selected.
   */
  async chooseMenuItems(menuId: string, selected: number[]): Promise<void> {
    const menu = this.query(`#${menuId}`) as HTMLElement & {
      items: HTMLElement[];
      show: () => void;
      close: () => void;
      updateComplete: Promise<unknown>;
    };
    menu.show();
    await menu.updateComplete;
    menu.items.forEach((item, index) => {
      if (item.hasAttribute('selected') !== selected.includes(index)) {
        item.click();
      }
    });
    await menu.updateComplete;
    menu.close();
    await this.mounted.settle();
  }

  /**
   * Chooses a single menu option, e.g. a sort order.
   * @param menuId - id of the menu element.
   * @param index - position of the item to choose.
   */
  async chooseMenuItem(menuId: string, index: number): Promise<void> {
    const menu = this.query(`#${menuId}`) as HTMLElement & {
      items: HTMLElement[];
      show: () => void;
      updateComplete: Promise<unknown>;
    };
    menu.show();
    await menu.updateComplete;
    menu.items[index].click();
    await this.mounted.settle();
  }
}
