import * as sinon from 'sinon';

import {
  clickFilterButtonItem,
  closeFilterButton,
  openFilterButton,
  resetFilterButton
} from './filter-button.js';
import type { FilterButton } from './filter-button.js';
import { deepQueryAll, normalize, slotText } from './dom.js';
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
  /** Whether the item is shown to the user, i.e. not hidden by a filter. */
  visible: boolean;
  /** Whether the item is the one chosen. */
  selected: boolean;
  /** The underlying list item, for interacting with it. */
  element: HTMLElement;
};

export type SearchField = 'fcda' | 'publisherExtRef' | 'subscriberExtRef';

/** The list each search field is in. */
const searchLists: Record<SearchField, string> = {
  fcda: 'fcda-list',
  publisherExtRef: 'publisher-extref-list',
  subscriberExtRef: 'subscriber-extref-list'
};

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

  private all(selector: string, within: ParentNode = this.root): HTMLElement[] {
    return deepQueryAll(within, selector);
  }

  private first(selector: string): HTMLElement | null {
    return this.all(selector)[0] ?? null;
  }

  private list(tag: string): ParentNode {
    return this.first(tag)?.shadowRoot ?? document.createDocumentFragment();
  }

  private items(
    list: string | undefined,
    selector: string,
    idAttribute: string
  ): ListedItem[] {
    const within: ParentNode = list ? this.list(list) : this.root;
    return this.all(selector, within).map(element => ({
      id: element.getAttribute(idAttribute) ?? '',
      label: slotText(element, 'headline'),
      secondary: slotText(element, 'supporting-text'),
      text: normalize(element.textContent),
      title: element.getAttribute('title') ?? '',
      meta: slotText(element, 'end'),
      disabled: element.hasAttribute('disabled'),
      visible: element.checkVisibility(),
      selected: element.classList.contains('selected'),
      element
    }));
  }

  /** Control block headings in the publisher list. */
  controls(): ListedItem[] {
    return this.items('fcda-list', 'oscd-list-item.control', 'data-control');
  }

  /** FCDAs in the data attribute list, in displayed order. */
  fcdas(): ListedItem[] {
    return this.items('fcda-list', 'oscd-list-item.fcda', 'data-fcda');
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
    return this.items(
      'publisher-extref-list',
      'oscd-list-item.extref',
      'data-extref'
    );
  }

  /** ExtRefs already subscribed to the selected FCDA in the publisher view. */
  publisherSubscribedExtRefs(): ListedItem[] {
    return this.publisherExtRefs().filter(item =>
      item.element.classList.contains('subscribed')
    );
  }

  /** ExtRefs which can be subscribed to the selected FCDA. */
  publisherAvailableExtRefs(): ListedItem[] {
    return this.publisherExtRefs().filter(item =>
      item.element.classList.contains('available')
    );
  }

  /** IED headings in the subscriber view. */
  ieds(): ListedItem[] {
    return this.items('subscriber-extref-list', 'oscd-list-item.ied', 'data-ied');
  }

  /** ExtRefs in the subscriber view, in displayed order. */
  subscriberExtRefs(): ListedItem[] {
    return this.items(
      'subscriber-extref-list',
      'oscd-list-item.extref',
      'data-extref'
    );
  }

  /** Titles and messages shown instead of a list, e.g. "No inputs". */
  headings(): string[] {
    return [
      ...this.all('.list-title'),
      ...this.all('h3')
    ].map(heading => normalize(heading.textContent));
  }

  /** Messages in a list, e.g. "No subscribed inputs". */
  placeholders(): string[] {
    return this.items(undefined, 'oscd-list-item.placeholder', 'data-none')
      .map(item => item.label)
      .filter(text => text !== '');
  }

  /** Whether the read-only lock icon is displayed. */
  get showsReadOnlyIcon(): boolean {
    return this.first('.read-only-icon') !== null;
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

  /**
   * Clicks the button which copies the listed items to the clipboard as
   * Markdown.
   * @param view - which view's button to use.
   * @returns the text which was copied.
   */
  async copyMarkdown(view: 'publisher' | 'subscriber'): Promise<string> {
    const writeText = sinon.stub(navigator.clipboard, 'writeText').resolves();
    try {
      const id =
        view === 'publisher'
          ? '#savePublisherToMarkdown'
          : '#saveSubscriberExtRefToMarkdown';
      this.first(id)!.click();
      await this.mounted.settle();
      if (writeText.callCount !== 1) {
        throw new Error(
          `Expected one clipboard write, got ${writeText.callCount}`
        );
      }
      return writeText.firstCall.args[0];
    } finally {
      writeText.restore();
    }
  }

  private async choose(selector: string): Promise<void> {
    const segment = this.all(selector).find(
      candidate => !candidate.hasAttribute('selected')
    );
    if (segment === undefined) {
      throw new Error(`Nothing to switch to for ${selector}`);
    }
    segment.click();
    await this.mounted.settle();
  }

  /** Toggles between the publisher and subscriber views. */
  async switchView(): Promise<void> {
    await this.choose('#viewSwitch > oscd-outlined-segmented-button');
  }

  /** Toggles between GOOSE and sampled value control blocks. */
  async switchControlType(): Promise<void> {
    await this.choose('#controlSwitch > oscd-outlined-segmented-button');
  }

  /**
   * Types into a search field.
   * @param field - which search field.
   * @param text - the search expression.
   */
  async search(field: SearchField, text: string): Promise<void> {
    const input = this.all(
      'oscd-outlined-text-field',
      this.list(searchLists[field])
    )[0] as HTMLInputElement | undefined;
    if (input === undefined) {
      throw new Error(`Search field ${field} is not displayed`);
    }
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    // search is delayed until typing pauses, which specs do not wait for
    (this.all('virtualized-filtered-list', this.list(searchLists[field]))[0] as
      | (HTMLElement & { commitSearch(): void })
      | undefined
    )?.commitSearch();
    await this.mounted.settle();
  }

  private filterButton(menuId: string): FilterButton {
    const button = this.first(`#${menuId}`) as FilterButton | null;
    if (button === null) {
      throw new Error(`Menu ${menuId} is not displayed`);
    }
    return button;
  }

  /**
   * Chooses menu options as a user would: opening the menu, setting which
   * options are ticked and applying them.
   * @param menuId - id of the menu.
   * @param selected - positions of the items which should be selected.
   */
  async chooseMenuItems(menuId: string, selected: number[]): Promise<void> {
    const button = this.filterButton(menuId);
    await openFilterButton(button);
    const toggles = button.items
      .map((item, index) => (item.selected !== selected.includes(index) ? index : -1))
      .filter(index => index !== -1);
    for (const index of toggles) {
       
      await clickFilterButtonItem(button, index);
    }
    await closeFilterButton(button, 'apply');
    await this.mounted.settle();
  }

  /**
   * Chooses a single menu option, e.g. a sort order.
   * @param menuId - id of the menu.
   * @param index - position of the item to choose.
   */
  async chooseMenuItem(menuId: string, index: number): Promise<void> {
    const button = this.filterButton(menuId);
    await openFilterButton(button);
    await clickFilterButtonItem(button, index);
    await closeFilterButton(button, 'apply');
    await this.mounted.settle();
  }

  /**
   * Opens a menu, ticks or unticks an item and cancels, which changes nothing.
   * @param menuId - id of the menu.
   * @param index - position of the item to change.
   */
  async cancelMenuChange(menuId: string, index: number): Promise<void> {
    const button = this.filterButton(menuId);
    await openFilterButton(button);
    await clickFilterButtonItem(button, index);
    await closeFilterButton(button, 'cancel');
    await this.mounted.settle();
  }

  /**
   * Opens a menu and leaves it open, e.g. to take a screenshot of it.
   * @param menuId - id of the menu.
   */
  async showMenu(menuId: string): Promise<void> {
    await openFilterButton(this.filterButton(menuId), true);
    await this.mounted.settle();
  }

  /**
   * The positions of the selected items in a menu, as the user sees the
   * ticks, without opening it.
   * @param menuId - id of the menu.
   * @returns the selected positions.
   */
  menuSelection(menuId: string): number[] {
    return this.filterButton(menuId)
      .items.map((item, index) => (item.selected ? index : -1))
      .filter(index => index !== -1);
  }

  /** The labels of the items in a menu. */
  menuLabels(menuId: string): string[] {
    return this.filterButton(menuId).items.map(item => item.headline);
  }

  /** The explanations of the items in a menu. */
  menuExplanations(menuId: string): string[] {
    return this.filterButton(menuId).items.map(
      item => item.supportingText ?? ''
    );
  }

  /** The badge on the button of a menu, if any. */
  menuBadgeElement(menuId: string): Element | undefined {
    return this.filterButton(menuId).shadowRoot?.querySelector('oscd-badge') ?? undefined;
  }

  /** The tooltip of the button of a menu. */
  menuTitle(menuId: string): string {
    return this.filterButton(menuId).title;
  }

  /** The tooltip of the count shown on the button of a menu, if any. */
  menuBadgeTitle(menuId: string): string | undefined {
    return this.menuBadgeElement(menuId)?.getAttribute('title') ?? undefined;
  }

  /** The count shown on the button of a menu, if any. */
  menuBadge(menuId: string): string | undefined {
    const badge = this.menuBadgeElement(menuId);
    return badge ? (badge as Element & { value: string }).value : undefined;
  }

  /** Whether the button of a menu shows that its option differs from default. */
  menuActive(menuId: string): boolean {
    return this.filterButton(menuId).classList.contains('filter-off');
  }

  /**
   * Returns every option of a menu to its default, as a user does: open the
   * menu, press Reset and apply.
   * @param menuId - id of the menu.
   */
  async resetMenu(menuId: string): Promise<void> {
    const button = this.filterButton(menuId);
    await openFilterButton(button);
    await resetFilterButton(button);
    await closeFilterButton(button, 'apply');
    await this.mounted.settle();
  }
}
