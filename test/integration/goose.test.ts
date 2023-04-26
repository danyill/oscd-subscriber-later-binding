/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { setViewport, sendMouse, resetMouse } from '@web/test-runner-commands';

import { fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

// import { test, expect } from '@playwright/test';

import { getExtRefItem, getFcdaItem, midEl } from './test-support.js';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(12000 * factor);

function testName(test: any, prefix: string): string {
  return test.test!.fullTitle().slice(prefix.length);
}

async function tryViewportSet(): Promise<void> {
  // target 1920x1080 screen-resolution, giving typical browser size of...
  await setViewport({ width: 1745, height: 845 });
}

const pluginName = 'oscd-subscriber-later-binding';

describe(pluginName, () => {
  let editor: any;
  let plugin: any;

  beforeEach(async function () {
    const plugins = {
      menu: [
        {
          name: 'Open File',
          translations: { de: 'Datei öffnen' },
          icon: 'folder_open',
          active: true,
          src: 'https://openscd.github.io/oscd-open/oscd-open.js',
        },
        {
          name: 'Save File',
          translations: { de: 'Datei speichern' },
          icon: 'save',
          active: true,
          src: 'https://openscd.github.io/oscd-save/oscd-save.js',
        },
      ],
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

    const ed = await fixture(
      html`<open-scd
        language="en"
        plugins="${JSON.stringify(plugins)}"
      ></open-scd>`
    );
    document.body.prepend(ed);
    // TODO remove once OpenSCD is exported as a Lit Element and updateComplete is available
    await timeout(1000);
    editor = document.querySelector('open-scd');
    plugin = document
      .querySelector('open-scd')!
      .shadowRoot!.querySelector(editor.editor);
  });

  afterEach(() => {
    editor.remove();
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
        // TODO remove once OpenSCD is exported as a Lit Element and updateComplete is available
        await timeout(500);
        await editor.updateComplete;
      });

      // afterEach(() => plugin.remove());

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

      //   await timeout(100);
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
          type: 'move',
          position: midEl(extref!),
        });

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });

        // await plugin.updateComplete;

        plugin.requestUpdate();
        await plugin.updateComplete;

        await timeout(1000);
        await visualDiff(plugin, testName(this, pluginName));
      });

      // it('changes to subscriber view', async function () {
      //   await sendMouse({
      //     type: 'click',
      //     button: 'left',
      //     position: midEl(plugin.switchViewUI!),
      //   });

      //   await plugin.updateComplete;
      //   await timeout(100);
      //   await visualDiff(plugin, testName(this, pluginName));
      // });

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
});
