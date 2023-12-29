/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { sendMouse, resetMouse } from '@web/test-runner-commands';

import { fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';

import {
  getExtRefItem,
  getFcdaItem,
  midEl,
  resetMouseState,
  setViewPort
} from './test-support.js';
import type SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(14000 * factor);
const standardWait = 350;

function testName(test: any): string {
  return test.test!.fullTitle();
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
          pt: 'Associação Tardia de Assinante'
        },
        icon: 'link',
        active: true,
        requireDoc: true,
        src: '/dist/oscd-subscriber-later-binding.js'
      }
    ]
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

  await document.fonts.ready;
});

afterEach(() => {
  editor.remove();
  plugin.remove();
  script.remove();
});

let doc: XMLDocument;

describe('smv', () => {
  describe('publisher view', () => {
    beforeEach(async function () {
      localStorage.clear();
      await setViewPort();
      resetMouse();

      doc = await fetch('/test/fixtures/SMV-2007B4-LSVS.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'SMV-2007B4-LSVS.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;

      await timeout(600); // plugin loading and initial render?

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!)
      });
      await plugin.updateComplete;

      await timeout(standardWait); // button selection
    });

    afterEach(async () => {
      localStorage.clear();
    });

    it('shows subscriptions for an FCDA including LSVS', async function () {
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'SMV_Publisher>>CurrentTransformer>currrentOnly',
        'SMV_Publisher>>CurrentTransformer>currrentOnlysDataSet>CurrentTransformer/L1 TCTR 1.AmpSv instMag.i (MX)'
      );
      fcda?.scrollIntoView();
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!)
      });
      await fcda!.updateComplete;
      await fcdaListElement.updateComplete;
      await plugin.updateComplete;

      await timeout(standardWait); // selection
      await visualDiff(plugin, testName(this));
    });

    describe('can change subscriptions by', () => {
      it('subscribing to an FCDA without supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'SMV_Publisher>>CurrentTransformer>fullSmv',
          'SMV_Publisher>>CurrentTransformer>fullSmvsDataSet>CurrentTransformer/L3 TCTR 3.AmpSv instMag.i (MX)'
        );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        fcda?.scrollIntoView();

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        let extRef;
        extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber3>>Overcurrent> PTRC 1>VolSv;TVTR1/VolSv/instMag.i[0]'
        );
        extRef?.scrollIntoView();
        await extRef?.updateComplete;
        await extRefListElement?.updateComplete;
        await plugin.updateComplete;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRef!)
        });
        await extRef!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // updating

        extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber3>>Overcurrent> PTRC 1>VolSv;TVTR1/VolSv/instMag.i[0]'
        );
        extRef?.scrollIntoView();

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA without supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'SMV_Publisher>>CurrentTransformer>currrentOnly',
          'SMV_Publisher>>CurrentTransformer>currrentOnlysDataSet>CurrentTransformer/L1 TCTR 1.AmpSv instMag.i (MX)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber7>>Overvoltage> PTRC 1>AmpSv;TCTR1/AmpSv/instMag.i[0]'
        );
        extRef?.scrollIntoView;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRef!)
        });
        await extRef!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA with supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'SMV_Publisher>>CurrentTransformer>fullSmv',
          'SMV_Publisher>>CurrentTransformer>fullSmvsDataSet>CurrentTransformer/L3 TCTR 3.AmpSv instMag.i (MX)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        let extRef;
        extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber>>Overvoltage> PTRC 1>AmpSv;TCTR1/AmpSv/instMag.i[0]'
        );
        extRef?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRef!)
        });
        await extRef!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // updating

        extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber>>Overvoltage> PTRC 1>AmpSv;TCTR1/AmpSv/instMag.i[0]'
        );
        extRef?.scrollIntoView();

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'SMV_Publisher>>CurrentTransformer>currrentOnly',
          'SMV_Publisher>>CurrentTransformer>currrentOnlysDataSet>CurrentTransformer/L1 TCTR 1.AmpSv instMag.i (MX)'
        );
        fcda?.scrollIntoView();
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extRef = getExtRefItem(
          extRefListElement!,
          'SMV_Subscriber2>>Overvoltage> PTRC 1>AmpSv;TCTR1/AmpSv/instMag.i[0]'
        );
        extRef?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRef!)
        });
        await extRef!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });
    });

    it('changes to subscriber view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!)
      });
      await plugin.updateComplete;

      await resetMouseState();
      await timeout(standardWait); // button selection
      await visualDiff(plugin, testName(this));
    });

    it('changes to GOOSE view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!)
      });
      await plugin.updateComplete;

      await resetMouseState();
      await timeout(standardWait); // button selection
      await visualDiff(plugin, testName(this));
    });
  });
});
