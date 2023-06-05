/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { sendMouse, resetMouse, sendKeys } from '@web/test-runner-commands';

import { fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';

import type { CheckListItem } from '@material/mwc-list/mwc-check-list-item.js';

import {
  getExtRefItem,
  getFcdaItem,
  midEl,
  resetMouseState,
  setViewPort,
} from './test-support.js';

import type SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(14000 * factor);

const standardWait = 400;

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
      requireDoc: true,
      src: '/dist/oscd-subscriber-later-binding.js',
    },
  ],
};

beforeEach(async function () {
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

describe('goose', () => {
  describe('subscriber view', () => {
    beforeEach(async function () {
      localStorage.clear();
      await setViewPort();
      resetMouse();

      doc = await fetch('/test/fixtures/GOOSE-2007B4-LGOS.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4-LGOS.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;

      await timeout(1200); // plugin loading and initial render?

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(standardWait); // button selection
    });

    afterEach(async () => {
      localStorage.clear();
    });

    it('initially has no ExtRef selected', async function () {
      // carrying out a mouse move causes a content refresh somehow??
      await sendMouse({
        type: 'move',
        position: midEl(plugin!),
      });

      await resetMouseState();
      await timeout(200);
      await visualDiff(plugin, testName(this));
    });

    it('shows no available or subscribed inputs messages', async function () {
      doc = await fetch('/test/fixtures/GOOSE-no-inputs-or-subscriptions.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-no-inputs-or-subscriptions.scd';
      editor.docs[editor.docName] = doc;
      await editor.updateComplete;
      await plugin.updateComplete;
      await timeout(500); // plugin loading and initial render?

      await resetMouseState();
      await timeout(standardWait); // selection
      await visualDiff(plugin, testName(this));
    });

    describe('can change subscriptions by', () => {
      it('removing a missing ExtRef mapping', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('removing an invalid ExtRef mapping', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/q[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA without supervisions', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA even if previously selected', async function () {
        let fcdaListElement = plugin.fcdaListUI!;

        let fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        fcdaListElement = plugin.fcdaListUI!;

        fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing and unsubscribing an FCDA without supervisions', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        const fcdaListElement = plugin.fcdaListUI!;
        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA with supervisions', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
        )!;
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an ExtRef with supervisions', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with one supervision', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
        );
        extref?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA does not change supervisions if unset', async function () {
        // first unsubscribe (we already have a supervision)
        const extRefListElement = plugin.extRefListSubscriberUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
        );
        extref?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        // turn off supervision modification
        const button = plugin.settingsMenuExtRefSubscriberButtonUI;

        // now set to not doing supervisions
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // menu must show

        const settingsNoSupervisions = <CheckListItem>(
          plugin.settingsMenuExtRefSubscriberUI.querySelector(
            '.no-supervisions'
          )
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(settingsNoSupervisions!),
        });
        await timeout(standardWait);
        await settingsNoSupervisions!.updateComplete;
        await plugin.settingsMenuExtRefSubscriberUI.updateComplete;
        await plugin.updateComplete;

        // now do subscription which would normally result in supervision instantiation
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        fcda?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
        });

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      describe('auto-incrementing', () => {
        it('increments after a subscription', async function () {
          const extRefListElement = plugin.extRefListSubscriberUI!;
          const extref = getExtRefItem(
            extRefListElement,
            'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
          )!;
          extref.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extref!),
          });
          await extref.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          fcda?.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!),
          });

          await fcda!.updateComplete;
          await fcdaListElement.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // unsure why this is required for Firefox
          // perhaps because auto-incrementing triggers additional update cycle?
          await timeout(standardWait); // selection
          await visualDiff(plugin, testName(this));
        });

        it('does not increment if auto-increment is off', async function () {
          // turn off autoincrement
          const button = plugin.settingsMenuExtRefSubscriberButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!),
          });
          await timeout(standardWait); // menu must show

          const autoIncrement = <CheckListItem>(
            plugin.settingsMenuExtRefSubscriberUI.querySelector(
              '.auto-increment'
            )
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(autoIncrement!),
          });
          await timeout(standardWait);
          await autoIncrement!.updateComplete;
          await plugin.settingsMenuExtRefSubscriberUI.updateComplete;
          await plugin.updateComplete;

          // do subscription
          const extRefListElement = plugin.extRefListSubscriberUI!;
          const extref = getExtRefItem(
            extRefListElement,
            'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
          )!;
          extref.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extref!),
          });
          await extref.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          const fcdaListElement = plugin.fcdaListUI!;

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

          await fcda!.updateComplete;
          await fcdaListElement.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // unsure why this is required for Firefox
          await timeout(standardWait); // selection
          await visualDiff(plugin, testName(this));
        });

        it('jumps over IEDs', async function () {
          const extRefListElement = plugin.extRefListSubscriberUI!;
          const extref = getExtRefItem(
            extRefListElement,
            'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
          )!;
          extref.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extref!),
          });
          await extref.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          fcda?.scrollIntoView;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!),
          });

          await fcda!.updateComplete;
          await fcdaListElement.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // unsure why this is required for Firefox
          // perhaps because auto-incrementing triggers additional update cycle?
          await timeout(standardWait); // selection
          await visualDiff(plugin, testName(this));
        });

        it('stops when it reaches a bound ExtRef', async function () {
          const extRefListElement = plugin.extRefListSubscriberUI!;
          const extref = getExtRefItem(
            extRefListElement,
            'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/q[0]'
          )!;
          extref.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extref!),
          });
          await extref.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE1',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos q (ST)'
          );
          fcda?.scrollIntoView();

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!),
          });

          await fcda!.updateComplete;
          await fcdaListElement.updateComplete;
          await extRefListElement.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // selection
          await visualDiff(plugin, testName(this));
        });
      });
    });

    describe('has filters', () => {
      beforeEach(async function () {
        localStorage.clear();
        await setViewPort();
        resetMouse();

        doc = await fetch('/test/fixtures/GOOSE-2007B4-filter-test.scd')
          .then(response => response.text())
          .then(str => new DOMParser().parseFromString(str, 'application/xml'));

        editor.docName = 'GOOSE-2007B4-filter-test.scd';
        editor.docs[editor.docName] = doc;

        await editor.updateComplete;
        await plugin.updateComplete;

        await timeout(500); // plugin loading and initial render?
      });

      afterEach(async () => {
        localStorage.clear();
      });

      it('it shows FCDA filter options defaulting to on', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await plugin.filterMenuFcdaUI.updateComplete;

        await timeout(standardWait); // opening dialog
        await visualDiff(plugin, testName(this));
      });

      it('filters only subscribed FCDAs', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // opening dialog

        const filterNotSubscribed = plugin.filterMenuFcdaUI.querySelector(
          '.filter-not-subscribed'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterNotSubscribed!),
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('filters only not subscribed FCDAs', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!),
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('and can filter out data objects', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!),
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // opening dialog

        const filterDataObjects = plugin.filterMenuFcdaUI.querySelector(
          '.filter-data-objects'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterDataObjects!),
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('and can filter out non-matching pre-configured', async function () {
        const extRefListElement = plugin.extRefListSubscriberUI!;
        const extref = getExtRefItem(
          extRefListElement,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
        )!;
        extref.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!),
        });
        await extref.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(standardWait); // opening dialog

        const filterSubscribed = plugin.filterMenuFcdaUI.querySelector(
          '.filter-preconfigured'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!),
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('shows ExtRef filter options defaulting to on', async function () {
        const extRefFilterMenu = plugin.filterMenuExtRefSubscriberButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });

        await timeout(standardWait); // opening dialog
        await visualDiff(plugin, testName(this));
      });

      it('and filters out subscribed items', async function () {
        const extRefFilterMenu = plugin.filterMenuExtRefSubscriberButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });
        await timeout(standardWait); // opening dialog

        const filterBound =
          plugin.filterMenuExtRefSubscriberUI.querySelector('.show-bound');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterBound!),
        });
        await plugin.filterMenuExtRefSubscriberUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('and filters out not-subscribed items', async function () {
        const extRefFilterMenu = plugin.filterMenuExtRefSubscriberButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });
        await timeout(standardWait); // opening dialog

        const filterNotBound =
          plugin.filterMenuExtRefSubscriberUI.querySelector('.show-not-bound');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterNotBound!),
        });
        await plugin.filterMenuExtRefSubscriberUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('and filters out unspecified service types', async function () {
        const extRefFilterMenu = plugin.filterMenuExtRefSubscriberButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });
        await timeout(standardWait); // opening dialog

        const filterUnspecifiedServiceTypes =
          plugin.filterMenuExtRefSubscriberUI.querySelector(
            '.show-unspecified-service-types'
          );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterUnspecifiedServiceTypes!),
        });
        await plugin.filterMenuExtRefSubscriberUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // rendering ?
        await visualDiff(plugin, testName(this));
      });
    });

    describe('can search', () => {
      // we don't repeat all the FCDA tests for the publisher view
      // as this is the same code
      it('in FCDAs with a string', async function () {
        const fcdaTextInput = plugin.filterFcdaInputUI!;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcdaTextInput!),
        });
        sendKeys({ type: 'QB1' });
        await plugin.fcdaListUI!.updateComplete;
        await plugin.updateComplete;
        fcdaTextInput.scrollIntoView();

        await resetMouseState();
        await timeout(standardWait);
        await visualDiff(plugin, testName(this));
      });

      describe('in Extrefs', async function () {
        it('for an IED name', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'GOOSE_Subscriber1' });

          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an IED manufacturer', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Dummy' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an IED type', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Taxonomist' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a logical device', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Earth_Switch' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a logical node', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'CILO' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an internal address', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'someRestrictedExtRef' });
          await timeout(100); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an ExtRef description', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Restricted' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an ExtRef description', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Restricted' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscriber supervision node', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'LGOS' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscriber control block', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'GOOSE2' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDA IED', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'GOOSE_Publisher2' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDA logical device', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'QB1_Disconnector' });
          await timeout(100); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDA logical device', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'QB1_Disconnector' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDA logical node', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'GOOSE_Subscriber3 CSWI' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDAs logical device description', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Animalia' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a subscribed FCDAs logical node description', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'Arthropoda' });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for multiple terms', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({
            type: 'GOOSE_Subscriber Dummy Earth_Switch Arthropoda LGOS',
          });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a double quoted term', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({
            type: 'GOOSE_Subscriber Dummy Earth_Switch Arthropoda LGOS',
          });
          await timeout(70); // takes a little longer with more text
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a double quoted term', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: '"LGOS 1"' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a single quoted term', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: "'LGOS 1'" });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a wildcard with question mark', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'An??alia' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a wildcard with an asterisk', async function () {
          const extRefTextInput = plugin.filterExtRefSubscriberInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!),
          });
          sendKeys({ type: 'A*poda' });
          await plugin.extRefListSubscriberUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });
      });
    });

    it('deselects an ExtRef when a new document is opened', async function () {
      const extRefListElement = plugin.extRefListSubscriberUI!;
      const extref = getExtRefItem(
        extRefListElement,
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      )!;
      extref.scrollIntoView();

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(extref!),
      });
      await extref.updateComplete;
      await extRefListElement.updateComplete;
      await plugin.updateComplete;

      // open new document
      doc = await fetch('/test/fixtures/GOOSE-2007B4-filter-test.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4-filter-test.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;

      await timeout(500); // plugin loading and initial render?

      await resetMouseState();
      await timeout(standardWait);
      await visualDiff(plugin, testName(this));
    });

    it('changes to publisher view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await resetMouseState();
      await timeout(standardWait); // button selection
      await visualDiff(plugin, testName(this));
    });

    it('changes to sampled values view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!),
      });
      await plugin.updateComplete;

      await resetMouseState();
      await timeout(standardWait); // button selection
      await visualDiff(plugin, testName(this));
    });
  });

  // TODO: Test undo and redo once core is updated
});
