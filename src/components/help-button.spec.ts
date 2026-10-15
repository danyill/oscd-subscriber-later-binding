import { expect, fixture, html, waitUntil } from '@open-wc/testing';

import { HelpButton } from './help-button.js';

customElements.define('help-button', HelpButton);

describe('HelpButton', () => {
  let help: HelpButton;
  let dialog: HTMLElement & { open: boolean };

  beforeEach(async () => {
    help = await fixture<HelpButton>(html`<help-button></help-button>`);
    dialog = help.shadowRoot!.querySelector('oscd-dialog') as typeof dialog;
  });

  const text = () => dialog.textContent!.replace(/\s+/g, ' ');

  it('has a button to open the help', () => {
    const button = help.shadowRoot!.querySelector('#help') as HTMLElement;
    expect(button.getAttribute('aria-label')).to.equal('Help');
    expect(button.textContent).to.contain('help');
    expect(dialog.open).to.equal(false);
  });

  it('opens a dialog about subscribing and searching', async () => {
    (help.shadowRoot!.querySelector('#help') as HTMLElement).click();
    await waitUntil(() => dialog.open, 'the help did not open');
    expect(text()).to.contain('Publisher view');
    expect(text()).to.contain('Subscriber view');
    expect(text()).to.contain('Searching');
    expect(text()).to.contain('Use * for any text');
  });

  it('closes with its button', async () => {
    (help.shadowRoot!.querySelector('#help') as HTMLElement).click();
    await waitUntil(() => dialog.open, 'the help did not open');
    (dialog.querySelector('oscd-filled-button') as HTMLElement).click();
    await waitUntil(() => !dialog.open, 'the help did not close');
  });
});
