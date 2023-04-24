/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { setViewport, sendMouse, resetMouse } from '@web/test-runner-commands';

import { expect, fixture, html } from '@open-wc/testing';
// eslint-disable-next-line import/no-relative-packages

import '@openscd/open-scd-core';

// import { test, expect } from '@playwright/test';

// import type { OpenSCD } from '@openscd/open-scd-core';

import SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

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
  // await setViewport({ width: 1745, height: 845 });
}

const pluginName = 'oscd-subscriber-later-binding';

describe(pluginName, () => {
  let editor: any;

  beforeEach(async function () {
    const plugins = {
      // menu: [
      //   {
      //     name: 'Open File',
      //     translations: { de: 'Datei öffnen' },
      //     icon: 'folder_open',
      //     active: true,
      //     src: 'https://openscd.github.io/oscd-open/oscd-open.js',
      //   },
      //   {
      //     name: 'Save File',
      //     translations: { de: 'Datei speichern' },
      //     icon: 'save',
      //     active: true,
      //     src: 'https://openscd.github.io/oscd-save/oscd-save.js',
      //   },
      // ],
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
          src: 'data:text/javascript;charset=utf-8,export%20default%20class%20TestEditorPlugin%20extends%20HTMLElement%20%7B%0D%0A%20%20constructor%20%28%29%20%7B%20super%28%29%3B%20this.innerHTML%20%3D%20%60%3Cp%3ETest%20Editor%20Plugin%3C%2Fp%3E%60%3B%20%7D%0D%0A%7D',
          // '../../dist/oscd-subscriber-later-binding.js',
        },
      ],
    };

    const ed = await fixture(`<open-scd
    plugins='{
    "menu": 
    [
      {"name": "Open File", "translations": {"de": "Datei öffnen"}, "icon": "folder_open", "active": true, "src": "https://openscd.github.io/oscd-open/oscd-open.js"}, 
      {"name": "Save File", "translations": {"de": "Datei speichern"}, "icon": "save", "active": true, "src": "https://openscd.github.io/oscd-save/oscd-save.js"}
    ],
    "editor": 
    [
      {"name": "Subscriber Later Binding", "translations": {"de": "Späte Bindung des Abonnenten", "pt": "Associação Tardia de Assinante"}, "icon": "link", "active": true, "requireDoc": true, "src": "data:text/javascript;charset=utf-8,export%20default%20class%20TestEditorPlugin%20extends%20HTMLElement%20%7B%0D%0A%20%20constructor%20%28%29%20%7B%20super%28%29%3B%20this.innerHTML%20%3D%20%60%3Cp%3ETest%20Editor%20Plugin%3C%2Fp%3E%60%3B%20%7D%0D%0A%7D"}
    ]
  }'
  ></open-scd><script type="module">
    import '@openscd/open-scd-core/open-scd.js';
  
    const editor = document.querySelector('open-scd');
    const params = new URL(document.location).searchParams;
    for (const [name, value] of params) {
      editor.setAttribute(name, value);
    }
  </script>`);

    document.body.prepend(ed);

    // editor = document.createElement('open-scd');
    // document.body.prepend(editor);
    editor = document.querySelector('open-scd');
    await editor.updateComplete;
    // editor.plugins = plugins;

    await editor.updateComplete;
    await timeout(500);
  });

  afterEach(() => {
    editor.remove();
  });

  // if (customElements.get('oscd-plugin') === undefined)
  //   customElements.define('oscd-plugin', Editing(SubscriberLaterBinding));

  let plugin: SubscriberLaterBinding;
  let doc: XMLDocument;

  describe('goose', () => {
    describe('publisher view', () => {
      beforeEach(async function () {
        // localStorage.clear();
        // await tryViewportSet();
        // resetMouse();

        doc = await fetch('/test/fixtures/GOOSE-2007B4.scd')
          .then(response => response.text())
          .then(str => new DOMParser().parseFromString(str, 'application/xml'));

        editor.doc = doc;
        await timeout(300);
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
