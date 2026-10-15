import { css, html, LitElement } from 'lit';
import type { TemplateResult } from 'lit';
import { query } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

import { OscdDialog } from '@omicronenergy/oscd-ui/dialog/OscdDialog.js';
import { OscdFilledButton } from '@omicronenergy/oscd-ui/button/OscdFilledButton.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';

/**
 * A question mark button which opens a dialog explaining how to subscribe and
 * how to search.
 */
export class HelpButton extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-dialog': OscdDialog,
    'oscd-filled-button': OscdFilledButton,
    'oscd-icon': OscdIcon,
    'oscd-icon-button': OscdIconButton
  };

  @query('oscd-dialog')
  private dialog!: HTMLElement & { show(): void; close(): void; open: boolean };

  private open(): void {
    this.dialog.show();
  }

  private close(): void {
    this.dialog.close();
  }

  render(): TemplateResult {
    return html`
      <oscd-icon-button
        id="help"
        title=${msg('Help')}
        aria-label=${msg('Help')}
        @click=${() => this.open()}
      >
        <oscd-icon>help</oscd-icon>
      </oscd-icon-button>
      <oscd-dialog>
        <div slot="headline">${msg('Subscribing and searching')}</div>
        <div slot="content" class="help">
          <h2>${msg('Publisher view')}</h2>
          <p>
            ${msg(
              'Choose a data attribute (FCDA) on the left. On the right, the inputs (ExtRefs) which subscribe to it are listed first, then those which could.'
            )}
          </p>
          <ul>
            <li>${msg('Click an available input to subscribe it to the data.')}</li>
            <li>${msg('Click a subscribed input to unsubscribe it.')}</li>
          </ul>

          <h2>${msg('Subscriber view')}</h2>
          <p>
            ${msg(
              'Choose an input (ExtRef) on the left, then click the data attribute (FCDA) on the right which it should subscribe to.'
            )}
          </p>
          <ul>
            <li>
              ${msg(
                'Choosing an input which is already subscribed removes its subscription so it can be subscribed again.'
              )}
            </li>
            <li>
              ${msg(
                'With Auto-increment on in the settings, the next input is chosen after each subscription.'
              )}
            </li>
          </ul>

          <h2>${msg('Searching')}</h2>
          <p>
            ${msg(
              'Each list has a search field. Search is not case sensitive and only items which match every term are listed.'
            )}
          </p>
          <ul>
            <li>${msg('Separate terms with a space: "pos stval" needs both.')}</li>
            <li>${msg('Use * for any text and ? for any one character.')}</li>
            <li>${msg('Use quotes to search for a phrase: "Earth Switch".')}</li>
          </ul>

          <h2>${msg('Lists')}</h2>
          <ul>
            <li>
              ${msg(
                'The buttons above each list copy it as Markdown, filter it, sort it, and (on the inputs) change settings.'
              )}
            </li>
            <li>
              ${msg(
                'A filter or sort which differs from the default is shown in colour on its button.'
              )}
            </li>
            <li>
              ${msg(
                'With Read-only view on in the settings, nothing is changed and the selection is shown in another colour.'
              )}
            </li>
          </ul>
        </div>
        <div slot="actions">
          <oscd-filled-button @click=${() => this.close()}>
            ${msg('Close')}
          </oscd-filled-button>
        </div>
      </oscd-dialog>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    oscd-icon-button {
      color: var(--md-sys-color-on-surface);
    }

    oscd-dialog {
      max-inline-size: min(40rem, calc(100vw - 48px));
    }

    .help h2 {
      margin: 16px 0 4px;
      font-size: 1rem;
      font-weight: 500;
    }

    .help h2:first-child {
      margin-top: 0;
    }

    .help p,
    .help ul {
      margin: 4px 0;
    }

    .help ul {
      padding-inline-start: 20px;
    }
  `;
}
