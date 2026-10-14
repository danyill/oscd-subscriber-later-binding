import { css, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { property, query, queryAssignedNodes } from 'lit/decorators.js';

import { OscdSelectionList } from '@omicronenergy/oscd-ui/selection-list/OscdSelectionList.js';
import { OscdDialog } from '@omicronenergy/oscd-ui/dialog/OscdDialog.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdFilledButton } from '@omicronenergy/oscd-ui/button/OscdFilledButton.js';
import { OscdOutlinedButton } from '@omicronenergy/oscd-ui/button/OscdOutlinedButton.js';
import { OscdTextButton } from '@omicronenergy/oscd-ui/button/OscdTextButton.js';
import { OscdBadge } from '@omicronenergy/oscd-ui/labs/badge/OscdBadge.js';

import type { OptionItem } from './menu-button.js';

/**
 * A button which opens a dialog of options, like `oscd-filter-button`, with a
 * Reset action as its leftmost button and a place to explain each option.
 *
 * `oscd-filter-button` has Cancel and Apply only, so this is a small local
 * version of it built on the same `oscd-selection-list`. Reset returns every
 * option to its default within the open dialog, then Apply commits it, as for
 * any other change of the options.
 */
export class FilterButton extends OscdSelectionList {
  static scopedElements = {
    ...OscdSelectionList.scopedElements,
    'oscd-dialog': OscdDialog,
    'oscd-icon-button': OscdIconButton,
    'oscd-icon': OscdIcon,
    'oscd-filled-button': OscdFilledButton,
    'oscd-outlined-button': OscdOutlinedButton,
    'oscd-text-button': OscdTextButton,
    'oscd-badge': OscdBadge
  };

  @property() header = 'Filter';

  @property() closeButtonLabel = 'Apply';

  @property() cancelButtonLabel = 'Cancel';

  @property() resetButtonLabel = 'Reset';

  @property({ type: Boolean }) disabled = false;

  /** A count shown on the button, or none if not set. */
  @property({ attribute: false }) badge?: string;

  /** The tooltip of the count, which explains it. */
  @property({ attribute: false }) badgeTitle?: string;

  @query('oscd-dialog') private dialog!: OscdDialog;

  @queryAssignedNodes({ slot: 'icon' }) private iconNodes?: Node[];

  /** Returns every option to the selection it has by default. */
  private reset(): void {
    this.items = (this.items as OptionItem[]).map(item => ({
      ...item,
      selected: item.defaultSelected
    }));
  }

  private onClose(): void {
    this.dispatchEvent(
      new CustomEvent('filter-button-dialog-close', {
        bubbles: true,
        composed: true,
        detail: { selectedElements: this.selectedElements }
      })
    );
  }

  render(): TemplateResult {
    return html`
      <oscd-icon-button
        @click="${() => this.dialog.show()}"
        ?disabled="${this.disabled}"
      >
        <slot
          name="icon"
          class="filter-button-icon-slot"
          @slotchange=${() => this.requestUpdate()}
        ></slot>
        ${!this.iconNodes || this.iconNodes.length === 0
          ? html`<oscd-icon class="default-icon">filter_list</oscd-icon>`
          : nothing}
      </oscd-icon-button>
      ${this.badge === undefined
        ? nothing
        : html`<oscd-badge
            class="badge"
            .value=${this.badge}
            title=${this.badgeTitle ?? ''}
            aria-label=${this.badgeTitle ?? this.badge}
            @click=${() => this.dialog.show()}
          ></oscd-badge>`}
      <oscd-dialog @close="${() => this.onClose()}">
        <div slot="headline">${this.header}</div>
        <form slot="content" id="form-id" method="dialog">
          ${super.render()}
        </form>
        <div slot="actions">
          <oscd-text-button @click="${() => this.reset()}"
            >${this.resetButtonLabel}</oscd-text-button
          >
          <oscd-outlined-button value="cancel" form="form-id"
            >${this.cancelButtonLabel}</oscd-outlined-button
          >
          <oscd-filled-button value="apply" form="form-id"
            >${this.closeButtonLabel}</oscd-filled-button
          >
        </div>
      </oscd-dialog>
    `;
  }

  static styles = css`
    ${OscdSelectionList.styles}
    :host {
      position: relative;
    }

    /* A Material badge places itself from the centre of the top edge of its
       box, so its box is the top centre of the icon, which puts it over the
       icon's top corner inside the button. The count is information, so it is
       not in the error colour Material badges have by default. */
    .badge {
      position: absolute;
      top: calc(50% - var(--md-icon-size, 24px) / 2);
      inset-inline-start: 50%;
      cursor: pointer;
      --md-badge-color: var(--md-sys-color-secondary);
      --md-badge-large-color: var(--md-sys-color-secondary);
      --md-badge-large-label-text-color: var(--md-sys-color-on-secondary);
    }

    oscd-dialog {
      max-height: calc(100vh - 150px);
    }
  `;
}
