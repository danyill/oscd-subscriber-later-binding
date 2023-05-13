/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { setViewport, sendMouse, resetMouse } from '@web/test-runner-commands';

import { fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';
import { OscdFilteredList } from '@openscd/oscd-filtered-list';
import { getExtRefItem, getFcdaItem, midEl } from './test-support.js';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(120000 * factor);

function testName(test: any, prefix: string): string {
  return test.test!.fullTitle().slice(prefix.length);
}

async function tryViewportSet(): Promise<void> {
  // target 1920x1080 screen-resolution, giving typical browser size of...
  await setViewport({ width: 1745, height: 845 });
}

const pluginName = 'oscd-subscriber-later-binding';

type OpenSCD = LitElement & {
  editor: string;
  docName: string;
  docs: Record<string, XMLDocument>;
};

type Plugin = LitElement & {
  fcdaListUI: OscdFilteredList;
  extRefListPublisherUI?: OscdFilteredList;
};

describe(pluginName, () => {
  let editor: OpenSCD;
  let plugin: Plugin;
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
      html` <open-scd
        language="en"
        plugins="${JSON.stringify(plugins)}"
      ></open-scd>`
    );
    document.body.prepend(ed);

    editor = document.querySelector<OpenSCD>('open-scd')!;
    plugin = document
      .querySelector('open-scd')!
      .shadowRoot!.querySelector<Plugin>(editor.editor)!;
  });

  afterEach(() => {
    editor.remove();
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
        // timeout(2000);
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

        plugin.requestUpdate();
        await plugin.updateComplete;

        await timeout(150);
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
