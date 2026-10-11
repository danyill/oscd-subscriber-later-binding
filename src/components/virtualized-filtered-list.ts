import { css, html, LitElement } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';

import { OscdDivider } from '@omicronenergy/oscd-ui/divider/OscdDivider.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';
import { OscdList } from '@omicronenergy/oscd-ui/list/OscdList.js';
import { OscdListItem } from '@omicronenergy/oscd-ui/list/OscdListItem.js';
import { OscdOutlinedTextField } from '@omicronenergy/oscd-ui/textfield/OscdOutlinedTextField.js';

import { getSearchRegex } from '../foundation/search.js';

export interface SearchChangeDetail {
  value: string;
  regex: RegExp;
}

/**
 * A search field above a list which only renders the rows in view.
 *
 * Rows are chosen by the caller. The list reports what is typed with a
 * `search-change` event so that the caller can leave out rows which do not
 * match, which lets it also leave out headings of groups with no match.
 * If `matchItem` is set the list leaves out rows itself instead.
 *
 * Rows are drawn inside this component, so the tags and styles of the rows
 * belong here.
 */
export class VirtualizedFilteredList extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-divider': OscdDivider,
    'oscd-icon': OscdIcon,
    'oscd-icon-button': OscdIconButton,
    'oscd-list': OscdList,
    'oscd-list-item': OscdListItem,
    'oscd-outlined-text-field': OscdOutlinedTextField
  };

  @property({ attribute: false })
  items: unknown[] = [];

  @property({ attribute: false })
  renderItem: (item: unknown) => TemplateResult = () => html``;

  @property({ attribute: false })
  keyFunction: (item: unknown) => string = item => String(item);

  /** When set, the list leaves out items which do not match the search. */
  @property({ attribute: false })
  matchItem?: (item: unknown, regex: RegExp) => boolean;

  @property()
  placeholder = msg('search');

  /** What is typed in the search field. */
  @property()
  searchValue = '';

  @query('oscd-outlined-text-field')
  private searchField?: HTMLElement & { value: string };

  protected updated(changed: PropertyValues): void {
    if (changed.has('searchValue') && changed.get('searchValue') !== undefined) {
      this.announceSearch();
    }
  }

  private announceSearch(): void {
    this.dispatchEvent(
      new CustomEvent<SearchChangeDetail>('search-change', {
        detail: {
          value: this.searchValue,
          regex: getSearchRegex(this.searchValue)
        }
      })
    );
  }

  private onInput(): void {
    if (this.searchField) {
      this.searchValue = this.searchField.value;
    }
  }

  private clearSearch(): void {
    this.searchValue = '';
    this.searchField?.focus();
  }

  private get shownItems(): unknown[] {
    const { matchItem } = this;
    if (!matchItem) {
      return this.items;
    }
    const regex = getSearchRegex(this.searchValue);
    return this.items.filter(item => matchItem(item, regex));
  }

  render(): TemplateResult {
    return html`
      <div class="filter-container">
        <oscd-outlined-text-field
          .value=${this.searchValue}
          placeholder=${this.placeholder}
          @input=${() => this.onInput()}
        >
          <oscd-icon slot="leading-icon">search</oscd-icon>
          ${this.searchValue
            ? html`<oscd-icon-button
                slot="trailing-icon"
                @click=${() => this.clearSearch()}
                aria-label=${msg('Clear search')}
                title=${msg('Clear search')}
              >
                <oscd-icon>close</oscd-icon>
              </oscd-icon-button>`
            : html``}
        </oscd-outlined-text-field>
        <oscd-list class="virtualized-list">
          ${virtualize({
            items: this.shownItems,
            keyFunction: (item: unknown) => this.keyFunction(item),
            renderItem: (item: unknown) => this.renderItem(item),
            scroller: true
          })}
        </oscd-list>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }

    .filter-container {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }

    oscd-outlined-text-field {
      margin: 8px;
    }

    .virtualized-list {
      flex: 1 1 auto;
      min-height: 0;
    }

    oscd-list-item {
      inline-size: 100%;
    }

    oscd-list-item.selected {
      --md-sys-color-on-surface: var(--oscd-base3);
      --md-sys-color-on-surface-variant: var(--oscd-base2);
      background-color: var(--oscd-primary);
    }

    oscd-list-item.control > div[slot='headline'],
    oscd-list-item.ied > div[slot='headline'],
    oscd-list-item.heading > div[slot='headline'] {
      font-weight: 500;
    }

    oscd-list-item.placeholder {
      --md-sys-color-on-surface: var(--md-sys-color-on-surface-variant, #5f6368);
    }

    oscd-icon.arrow {
      --md-icon-size: 18px;
      vertical-align: middle;
    }

    oscd-icon.warning {
      color: #f9a825;
    }

    oscd-icon.error {
      color: #d32f2f;
    }

    .count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: 40px;
      block-size: 40px;
      padding: 0 8px;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
      text-align: center;
    }
  `;
}
