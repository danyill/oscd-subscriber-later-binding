import { css, html, LitElement, TemplateResult } from 'lit';

import '@material/mwc-textfield';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item.js';
import { property, query } from 'lit/decorators.js';
import type { TextField } from '@material/mwc-textfield';

const fcdas: Record<string, string[]> = {};

Array(100)
  .fill(0)
  .forEach((_, j) => {
    fcdas[`CB${j}`] = Array(100)
      .fill(0)
      .map((_, i) => `fcda${j}:${i}`);
  });

const extRefs = {
  ied1: ['extRef11', 'extRef12', 'extRef13', 'extRef14'],
  ied2: ['extRef21', 'extRef22', 'extRef23', 'extRef24'],
};

export default class OscdTwoLists extends LitElement {
  @query('#fcdaSection > mwc-textfield')
  fcdaFilterUI?: TextField;

  @property({ type: String, reflect: true })
  get fcdaFilter(): string {
    return this.fcdaFilterUI?.value ?? '';
  }

  @query('#extRefSection > mwc-textfield')
  extRefFilterUI?: TextField;

  @property({ type: String, reflect: true })
  get extRefFilter(): string {
    return this.extRefFilterUI?.value ?? '';
  }

  render(): TemplateResult {
    return html`
      <main>
        <div id="fcdaSection">
          <mwc-textfield @change=${() => this.requestUpdate()}></mwc-textfield>
          ${Object.entries(fcdas)
            .filter(([_, cbFcdas]) =>
              cbFcdas.some(fcda => fcda.includes(this.fcdaFilter))
            )
            .map(
              ([cb, cbFcdas]) =>
                html`<h2>${cb}</h2>
                  <mwc-list>
                    ${cbFcdas
                      .filter(fcda => fcda.includes(this.fcdaFilter))
                      .map(
                        fcda => html`<mwc-list-item>${fcda}</mwc-list-item>`
                      )}
                  </mwc-list> `
            )}
        </div>
        <div id="extRefSection">
          <mwc-textfield @change=${() => this.requestUpdate()}></mwc-textfield>
          ${Object.entries(extRefs)
            .filter(([_, cbFcdas]) =>
              cbFcdas.some(extRef => extRef.includes(this.extRefFilter))
            )
            .map(
              ([cb, cbFcdas]) =>
                html`<h2>${cb}</h2>
                  <mwc-list>
                    ${cbFcdas
                      .filter(extRef => extRef.includes(this.extRefFilter))
                      .map(
                        extRef => html`<mwc-list-item>${extRef}</mwc-list-item>`
                      )}
                  </mwc-list>`
            )}
        </div>
      </main>
    `;
  }

  static styles = css`
    main {
      display: flex;
      flex-direction: row;
    }

    h2 {
      font-family: Roboto;
      font-weight: 400;
    }
  `;
}
