import { expect, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import { deepQueryAll } from '../testing/dom.js';
import { useViewport } from '../testing/plugin.js';
import { VirtualizedFilteredList } from './virtualized-filtered-list.js';
import type { SearchChangeDetail } from './virtualized-filtered-list.js';

customElements.define('virtualized-filtered-list', VirtualizedFilteredList);

const row = (item: unknown): TemplateResult =>
  html`<oscd-list-item><div slot="headline">${item}</div></oscd-list-item>`;

async function mount(
  items: unknown[],
  setup: (list: VirtualizedFilteredList) => void = () => {}
): Promise<VirtualizedFilteredList> {
  const host = await fixture<HTMLDivElement>(
    html`<div style="height: 400px; display: flex;">
      <virtualized-filtered-list></virtualized-filtered-list>
    </div>`
  );
  const list = host.querySelector('virtualized-filtered-list') as VirtualizedFilteredList;
  list.items = items;
  list.renderItem = row;
  setup(list);
  await list.updateComplete;
  return list;
}

const rows = (list: VirtualizedFilteredList): string[] =>
  deepQueryAll(list.shadowRoot!, 'oscd-list-item').map(
    item => item.textContent?.trim() ?? ''
  );

const type = async (list: VirtualizedFilteredList, text: string) => {
  const field = list.shadowRoot!.querySelector(
    'oscd-outlined-text-field'
  ) as unknown as HTMLInputElement;
  field.value = text;
  field.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await list.updateComplete;
};

const waitForRows = async (list: VirtualizedFilteredList, count: number) => {
  for (let i = 0; i < 60 && rows(list).length !== count; i += 1) {
     
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  }
};

describe('VirtualizedFilteredList', () => {
  before(async () => {
    // lists draw the rows inside the window, so make sure all of a few are
    await useViewport('tall');
  });

  it('draws a row for each item', async () => {
    const list = await mount(['one', 'two', 'three']);
    await waitForRows(list, 3);
    expect(rows(list)).to.deep.equal(['one', 'two', 'three']);
  });

  it('draws only the rows in view for a long list', async () => {
    await useViewport('fit');
    const items = Array.from({ length: 2000 }, (_, i) => `item ${i}`);
    const list = await mount(items);
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    const drawn = rows(list).length;
    expect(drawn).to.be.greaterThan(0);
    expect(drawn).to.be.lessThan(100);
    await useViewport('tall');
  });

  it('draws nothing when there are no items', async () => {
    const list = await mount([]);
    expect(rows(list)).to.deep.equal([]);
  });

  it('draws each item with the function it is given', async () => {
    const list = await mount(['a'], (l) => {
      l.renderItem = item =>
        html`<oscd-list-item><div slot="headline">row ${item}</div></oscd-list-item>`;
    });
    await waitForRows(list, 1);
    expect(rows(list)).to.deep.equal(['row a']);
  });

  it('shows the placeholder in the search field', async () => {
    const list = await mount([], (l) => {
      l.placeholder = 'find something';
    });
    expect(
      list.shadowRoot!.querySelector('oscd-outlined-text-field')!.getAttribute('placeholder')
    ).to.equal('find something');
  });

  describe('search', () => {
    it('reports what is typed with an expression for it', async () => {
      const list = await mount(['one']);
      const detail: SearchChangeDetail[] = [];
      list.addEventListener('search-change', (event) => {
        detail.push((event as CustomEvent<SearchChangeDetail>).detail);
      });
      await type(list, 'two th*');
      expect(detail).to.have.length(1);
      expect(detail[0].value).to.equal('two th*');
      expect(detail[0].regex.test('three two')).to.equal(true);
      expect(detail[0].regex.test('two')).to.equal(false);
    });

    it('does not report anything at first', async () => {
      const list = await mount(['one']);
      let reported = 0;
      list.addEventListener('search-change', () => {
        reported += 1;
      });
      await list.updateComplete;
      expect(reported).to.equal(0);
    });

    it('reports a search which is set from outside, so a reset is seen', async () => {
      const list = await mount(['one']);
      await type(list, 'abc');
      const detail: string[] = [];
      list.addEventListener('search-change', (event) => {
        detail.push((event as CustomEvent<SearchChangeDetail>).detail.value);
      });
      list.searchValue = '';
      await list.updateComplete;
      expect(detail).to.deep.equal(['']);
    });

    it('leaves the filtering to the caller by default', async () => {
      const list = await mount(['one', 'two']);
      await type(list, 'one');
      await waitForRows(list, 2);
      expect(rows(list)).to.deep.equal(['one', 'two']);
    });

    it('leaves out items which do not match when it is given a function to match', async () => {
      const list = await mount(['one', 'two', 'three'], (l) => {
        l.matchItem = (item, regex) => regex.test(String(item));
      });
      await type(list, 'o');
      await waitForRows(list, 2);
      expect(rows(list)).to.deep.equal(['one', 'two']);
    });

    it('shows a button to clear the search once something is typed', async () => {
      const list = await mount(['one']);
      expect(list.shadowRoot!.querySelector('oscd-icon-button')).to.equal(null);
      await type(list, 'o');
      expect(list.shadowRoot!.querySelector('oscd-icon-button')).to.not.equal(null);
    });

    it('clears the search with that button', async () => {
      const list = await mount(['one']);
      await type(list, 'abc');
      const values: string[] = [];
      list.addEventListener('search-change', (event) => {
        values.push((event as CustomEvent<SearchChangeDetail>).detail.value);
      });
      list.shadowRoot!.querySelector<HTMLElement>('oscd-icon-button')!.click();
      await list.updateComplete;
      expect(list.searchValue).to.equal('');
      expect(values).to.deep.equal(['']);
    });
  });
});
