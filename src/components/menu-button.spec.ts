import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import type { TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import * as sinon from 'sinon';

import { OscdFilterButton } from '@omicronenergy/oscd-ui/filter-button/OscdFilterButton.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';

import {
  clickFilterButtonItem,
  closeFilterButton,
  openFilterButton
} from '../testing/filter-button.js';
import type { FilterButton } from '../testing/filter-button.js';
import { renderOptionButton } from './menu-button.js';
import type { OptionButton } from './menu-button.js';

class ButtonHost extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-filter-button': OscdFilterButton,
    'oscd-icon': OscdIcon
  };

  @property({ attribute: false })
  option!: OptionButton;

  render(): TemplateResult {
    return this.option ? renderOptionButton(this.option) : html``;
  }
}

customElements.define('button-host', ButtonHost);

describe('renderOptionButton', () => {
  let host: ButtonHost;
  let onApply: sinon.SinonSpy;
  let requestUpdate: sinon.SinonSpy;

  async function mount(changes: Partial<OptionButton> = {}): Promise<FilterButton> {
    onApply = sinon.spy();
    requestUpdate = sinon.spy();
    host = await fixture<ButtonHost>(html`<button-host></button-host>`);
    host.option = {
      id: 'myButton',
      header: 'My header',
      icon: 'tune',
      title: 'My title',
      items: [
        { headline: 'First', selected: true },
        { headline: 'Second', selected: false }
      ],
      multiselect: true,
      onApply,
      host: { requestUpdate },
      ...changes
    };
    await host.updateComplete;
    return host.shadowRoot!.querySelector('#myButton') as FilterButton;
  }

  it('is a button with the given id, title and header', async () => {
    const button = await mount();
    expect(button.getAttribute('title')).to.equal('My title');
    expect(button.getAttribute('header')).to.equal('My header');
  });

  it('lists the items', async () => {
    const button = await mount();
    expect(button.items.map(item => item.headline)).to.deep.equal(['First', 'Second']);
  });

  it('shows the icon it is given', async () => {
    const button = await mount();
    expect(button.querySelector('oscd-icon')!.textContent).to.equal('tune');
  });

  it('is not marked as filtering by default', async () => {
    const button = await mount();
    expect(button.classList.contains('filter-off')).to.equal(false);
  });

  it('is marked when it is active', async () => {
    const button = await mount({ active: true });
    expect(button.classList.contains('filter-off')).to.equal(true);
  });

  it('gives the items as chosen when applied', async () => {
    const button = await mount();
    await openFilterButton(button);
    await clickFilterButtonItem(button, 1);
    await clickFilterButtonItem(button, 0);
    await closeFilterButton(button, 'apply');
    expect(onApply.callCount).to.equal(1);
    expect(
      (onApply.firstCall.args[0] as { selected: boolean }[]).map(item => item.selected)
    ).to.deep.equal([false, true]);
    expect(requestUpdate.callCount).to.equal(0);
  });

  it('applies a single choice when only one item can be chosen', async () => {
    const button = await mount({ multiselect: false });
    await openFilterButton(button);
    await clickFilterButtonItem(button, 1);
    await closeFilterButton(button, 'apply');
    expect(
      (onApply.firstCall.args[0] as { selected: boolean }[]).map(item => item.selected)
    ).to.deep.equal([false, true]);
  });

  it('applies nothing and has the host draw the items again when cancelled', async () => {
    const button = await mount();
    await openFilterButton(button);
    await clickFilterButtonItem(button, 1);
    await closeFilterButton(button, 'cancel');
    expect(onApply.callCount).to.equal(0);
    expect(requestUpdate.callCount).to.equal(1);
  });

  it('does not let the closing of its dialog reach other components', async () => {
    const button = await mount();
    const seen = sinon.spy();
    host.addEventListener('filter-button-dialog-close', seen);
    await openFilterButton(button);
    await closeFilterButton(button, 'apply');
    expect(seen.callCount).to.equal(0);
  });
});
