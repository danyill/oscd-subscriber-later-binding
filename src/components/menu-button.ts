import { html } from 'lit';
import type { TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import type { OscdFilterButton } from '@omicronenergy/oscd-ui/filter-button/OscdFilterButton.js';
import type { SelectItem } from '@omicronenergy/oscd-ui/selection-list/OscdSelectionList.js';
import type { FilterButtonDialogCloseEvent } from '@omicronenergy/oscd-ui/filter-button/OscdFilterButton.js';

export type { SelectItem };

export interface OptionButton {
  /** The id of the button, which tests and styles refer to. */
  id: string;
  /** The title of the dialog. */
  header: string;
  /** The name of the icon on the button, and its tooltip. */
  icon: string;
  title: string;
  items: SelectItem[];
  /** Several items can be chosen, rather than one. */
  multiselect: boolean;
  /** The option differs from the default, which the button shows. */
  active?: boolean;
  /** Called with the items as chosen when the dialog is applied. */
  onApply: (items: SelectItem[]) => void;
  /**
   * The component which draws the button. The dialog changes the items as they
   * are chosen, so if it is cancelled the host draws them again as they were.
   */
  host: { requestUpdate: () => void };
}

/** Whether a dialog of an `oscd-filter-button` was closed with "Apply". */
function wasApplied(button: OscdFilterButton): boolean {
  const dialog = button.shadowRoot?.querySelector('oscd-dialog');
  return (dialog as unknown as { returnValue: string } | null)?.returnValue === 'apply';
}

/**
 * A button which opens a dialog to change filters, a sort order or settings.
 * The dialog lists the items and the choice is made when it is applied.
 * The host must register `oscd-filter-button` and `oscd-icon`.
 * @param option - what the button shows and does.
 * @returns the button.
 */
export function renderOptionButton(option: OptionButton): TemplateResult {
  const onClose = (event: FilterButtonDialogCloseEvent): void => {
    event.stopPropagation();
    const button = event.target as OscdFilterButton;
    if (wasApplied(button)) {
      option.onApply(button.items);
    } else {
      option.host.requestUpdate();
    }
  };

  return html`<oscd-filter-button
    id=${option.id}
    class=${classMap({ 'option-button': true, 'filter-off': !!option.active })}
    title=${option.title}
    header=${option.header}
    .items=${option.items}
    ?multiselect=${option.multiselect}
    @filter-button-dialog-close=${onClose}
  >
    <oscd-icon slot="icon">${option.icon}</oscd-icon>
  </oscd-filter-button>`;
}
