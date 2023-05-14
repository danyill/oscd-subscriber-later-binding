/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { setViewport, sendMouse, resetMouse } from '@web/test-runner-commands';

import { fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';
// import { OscdFilteredList } from '@openscd/oscd-filtered-list';
import { getExtRefItem, getFcdaItem, midEl } from './test-support.js';
// import { OscdFilteredList } from '@openscd/oscd-filtered-list';
import type SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

const factor = window.process && process.env.CI ? 4 : 2;
const ciWaitFactor = 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

function testName(test: any): string {
  return test.test!.fullTitle();
}

async function tryViewportSet(): Promise<void> {
  // target 1920x1080 screen-resolution, giving typical browser size of...
  await setViewport({ width: 1745, height: 845 });
}

type OpenSCD = LitElement & {
  editor: string;
  docName: string;
  docs: Record<string, XMLDocument>;
};

let editor: OpenSCD;
let plugin: SubscriberLaterBinding;
let script: HTMLScriptElement;

beforeEach(async function () {
  const plugins = {
    editor: [
      {
        name: 'Subscriber Later Binding',
        translations: {
          de: 'Späte Bindung des Abonnenten',
          pt: 'Associação Tardia de Assinante',
        },
        icon: 'link',
        active: true,
        requireDoc: false,
        src: '/dist/oscd-subscriber-later-binding.js',
      },
    ],
  };

  script = document.createElement('script');
  script.type = 'module';

  script.textContent = `
    const _customElementsDefine = window.customElements.define;
    window.customElements.define = (name, cl, conf) => {
      if (!customElements.get(name)) {
        try {
          _customElementsDefine.call(
            window.customElements,
            name,
            cl,
            conf
          );
        } catch (e) {
          console.warn(e);
        }
      }
    };
  `;
  document.head.appendChild(script);

  const ed = await fixture(
    html`<open-scd
      language="en"
      plugins="${JSON.stringify(plugins)}"
    ></open-scd>`
  );
  document.body.prepend(ed);

  editor = document.querySelector<OpenSCD>('open-scd')!;
  plugin = document
    .querySelector('open-scd')!
    .shadowRoot!.querySelector<SubscriberLaterBinding>(editor.editor)!;
});

afterEach(() => {
  editor.remove();
  plugin.remove();
  script.remove();
});

let doc: XMLDocument;

describe('goose', () => {
  describe('publisher view', () => {
    beforeEach(async function () {
      localStorage.clear();
      await tryViewportSet();
      resetMouse();

      doc = await fetch('/test/fixtures/GOOSE-2007B4.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;
      // font loading seems to be time consuming
      await timeout(500 * ciWaitFactor); // page rendering
    });

    afterEach(async () => {
      localStorage.clear();
    });

    it('initially has no FCDA selected', async function () {
      await visualDiff(plugin, testName(this));
    });

    it('shows subscriptions for an FCDA', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!),
      });
      await plugin.updateComplete;

      await timeout(200 * ciWaitFactor); // animation or re-render on ripple?
      await visualDiff(plugin, testName(this));
    });

    // LGOS icon looks a bit different...
    it('shows subscriptions for an FCDA with an LGOS supervision', async function () {
      doc = await fetch('/test/fixtures/GOOSE-2007B4-LGOS.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4-LGOS.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;
      await timeout(150 * ciWaitFactor); // page rendering

      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!),
      });
      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor); // render
      await visualDiff(plugin, testName(this));
    });

    it('shows FCDA filter options defaulting to on', async function () {
      const button = plugin.filterMenuFcdaButtonUI;

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(button!),
      });
      await plugin.updateComplete;

      await timeout(250 * ciWaitFactor);
      await visualDiff(plugin, testName(this));
    });

    it('filters only subscribed FCDAs', async function () {
      const button = plugin.filterMenuFcdaButtonUI;

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(button!),
      });
      await plugin.updateComplete;
      await timeout(150 * ciWaitFactor); // rendering

      const filterNotSubscribed = plugin.filterMenuFcdaUI.querySelector(
        '.filter-not-subscribed'
      );

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(filterNotSubscribed!),
      });
      await plugin.updateComplete;

      await timeout(400 * ciWaitFactor); // rendering
      await visualDiff(plugin, testName(this));
    });

    it('filters only not subscribed FCDAs', async function () {
      const button = plugin.filterMenuFcdaButtonUI;

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(button!),
      });

      await timeout(150 * ciWaitFactor); // rendering

      const filterSubscribed =
        plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(filterSubscribed!),
      });
      await plugin.updateComplete;

      await timeout(400 * ciWaitFactor); // rendering
      await visualDiff(plugin, testName(this));
    });

    it('shows ExtRef filter options defaulting to on', async function () {
      const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(extRefFilterMenu!),
      });

      await timeout(150 * ciWaitFactor); // rendering
      await visualDiff(plugin, testName(this));
    });

    it('filters disabled items with pXX attributes', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!),
      });
      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor); // animation or re-render on ripple?

      const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(extRefFilterMenu!),
      });

      await timeout(150 * ciWaitFactor); // rendering

      const filterDisabled =
        plugin.filterMenuExtRefPublisherUI.querySelector('.filter-disabled');

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(filterDisabled!),
      });
      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor); // rendering
      await visualDiff(plugin, testName(this));
    });

    // it('can select an FCDA and see subscriptions present and available', async function () {
    //   const fcdaListElement = plugin.fcdaListUI;

    //   const item = getFcdaItem(
    //     fcdaListElement,
    //     'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
    //     'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
    //   );
    //   await sendMouse({
    //     type: 'click',
    //     button: 'left',
    //     position: midEl(item!),
    //   });

    //   await timeout(100*ciWaitFactor);
    //   await visualDiff(plugin, testName(this, pluginName));
    // });

    it('can subscribe an FCDA and update counts', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!),
      });
      await plugin.updateComplete;

      const extRefListElement = plugin.extRefListPublisherUI;
      const extref = getExtRefItem(
        extRefListElement!,
        'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
      );

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(extref!),
      });

      await plugin.updateComplete;

      await timeout(300 * ciWaitFactor); // render
      await visualDiff(plugin, testName(this));
    });

    it('can unsubscribe an FCDA and update counts', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!),
      });
      await plugin.updateComplete;

      const extRefListElement = plugin.extRefListPublisherUI;
      const extref = getExtRefItem(
        extRefListElement!,
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
      );

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(extref!),
      });

      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor); // render
      await visualDiff(plugin, testName(this));
    });

    it('changes to subscriber view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor);
      await visualDiff(plugin, testName(this));
    });

    it('changes to sampled values view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!),
      });
      await plugin.updateComplete;

      await timeout(150 * ciWaitFactor);
      await visualDiff(plugin, testName(this));
    });

    // it('when subscribing an available ExtRef then the lists are changed', async () => {
    //   const fcdaListElement = plugin.fcdaListUI;

    //   const controlId = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE1';
    //   const fcdaId =
    //     'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos q (ST)';

    //   getFcdaItem(fcdaListElement, controlId, fcdaId)?.click();
    //   await plugin.updateComplete;

    //   expect(plugin.getSubscribedExtRefElements().length).to.be.equal(0);
    //   // expect(getFcdaItemCount(fcdaListElement, controlId, fcdaId)).to.be
    //   //   .undefined;
    //   expect(plugin.getAvailableExtRefElements().length).to.be.equal(3);

    //   const extRefListElement = plugin.extRefListPublisherUI!;
    //   const extRefId =
    //     'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';
    //   getExtRefItem(extRefListElement, extRefId)?.click();

    //   await plugin.updateComplete;

    //   // expect(plugin.getSubscribedExtRefElements().length).to.be.equal(1);
    //   //   expect(getSelectedSubItemValue(fcdaListElement)).to.have.text('1');
    //   //   expect(
    //   //     extRefListElement['getAvailableExtRefElements']().length
    //   //   ).to.be.equal(4);
    // });
  });
});
