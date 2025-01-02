/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import { sendMouse, resetMouse, sendKeys } from '@web/test-runner-commands';

import { expect, fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';

import type { CheckListItem } from '@material/mwc-list/mwc-check-list-item.js';

import * as sinon from 'sinon';

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

  const ed: OpenSCD = await fixture(
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
  describe('publisher view', () => {
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

      await timeout(600); // plugin loading and initial render?
    });

    afterEach(async () => {
      localStorage.clear();
    });

    it('initially has no FCDA selected', async function () {
      // carrying out an action causes a content refresh somehow??
      await sendMouse({
        type: 'move',
        position: midEl(plugin!)
      });

      // TODO: Does ca-d have any ideas about this?
      // webkit is especially fussy and appears to slowly change the layout?
      await timeout(500);
      await resetMouseState();
      await visualDiff(plugin, testName(this));
    });

    it('shows subscriptions for an FCDA including LGOS', async function () {
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
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

    it('shows no available or subscribed inputs messages', async function () {
      doc = await fetch('/test/fixtures/GOOSE-no-inputs-or-subscriptions.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-no-inputs-or-subscriptions.scd';
      editor.docs[editor.docName] = doc;
      await editor.updateComplete;
      await plugin.updateComplete;
      await timeout(500); // plugin loading and initial render?

      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );

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

    it('shows subscription counts correctly for multiple control blocks with the same dataset', async function () {
      doc = await fetch('/test/fixtures/GOOSE-2007B4-LGOS-two-cbs.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4-LGOS-two-cbs.scd';
      editor.docs[editor.docName] = doc;
      await editor.updateComplete;
      await plugin.updateComplete;
      await timeout(500); // plugin loading and initial render?

      await timeout(standardWait); // selection
      await visualDiff(plugin, testName(this));
    });

    describe('can change subscriptions by', () => {
      it('subscribing to an FCDA without supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA without supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
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
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/q[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        expect(plugin).does.not.have.attribute('ignoresupervision');
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        expect(plugin).does.not.have.attribute('ignoresupervision');
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with one supervision', async function () {
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
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI!;
        const extRefChosen = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
        );
        extRefChosen?.scrollIntoView();

        //  unsubscribe
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefChosen!)
        });
        await extRefChosen!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        // increased for webkit
        await resetMouseState();
        await timeout(300); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA does not change supervisions if unset', async function () {
        // turn off supervision modification
        const button = plugin.settingsMenuExtRefPublisherButtonUI;
        const fcdaListElement = plugin.fcdaListUI!;

        // first unsubscribe (we already have a supervision)
        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        let extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
        );
        extref?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait);

        // now set to not doing supervisions
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await timeout(standardWait); // menu must show

        const settingsNoSupervisions = <CheckListItem>(
          plugin.settingsMenuExtRefPublisherUI.querySelector('.no-supervisions')
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(settingsNoSupervisions!)
        });
        await timeout(standardWait);
        await settingsNoSupervisions!.updateComplete;
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;
        await plugin.updateComplete;

        // now do subscription which would normally result in supervision instantiation
        extRefListElement = plugin.extRefListPublisherUI;
        const extref2 = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
        );
        extref2?.scrollIntoView();

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref2!)
        });
        await extref2!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait);
        expect(plugin).does.have.attribute('ignoresupervision');
        await visualDiff(plugin, testName(this));
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
          position: midEl(button!)
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
          position: midEl(button!)
        });
        await timeout(standardWait); // opening dialog

        const filterNotSubscribed = plugin.filterMenuFcdaUI.querySelector(
          '.filter-not-subscribed'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterNotSubscribed!)
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
          position: midEl(button!)
        });
        await timeout(standardWait); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!)
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(standardWait); // rendering ?
        await resetMouseState();
        await visualDiff(plugin, testName(this));
      });

      it('and can filter out data objects', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await timeout(standardWait); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!)
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await timeout(standardWait); // opening dialog

        const filterDataObjects = plugin.filterMenuFcdaUI.querySelector(
          '.filter-data-objects'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterDataObjects!)
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(standardWait); // rendering ?
        await resetMouseState();
        await visualDiff(plugin, testName(this));
      });

      it('and can filter out quality attributes', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await timeout(standardWait); // opening dialog

        const filterQuality =
          plugin.filterMenuFcdaUI.querySelector('.filter-quality');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterQuality!)
        });
        await timeout(standardWait); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(standardWait); // rendering ?
        await resetMouseState();
        await visualDiff(plugin, testName(this));
      });

      it('shows ExtRef filter options defaulting to on', async function () {
        const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!)
        });

        await timeout(standardWait); // opening dialog
        await visualDiff(plugin, testName(this));
      });

      it('and filters preconfigured items with non-matching pXX attributes', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda?.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // selection

        const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!)
        });
        await timeout(standardWait); // opening dialog

        const filterPreconfigured =
          plugin.filterMenuExtRefPublisherUI.querySelector(
            '.filter-preconfigured'
          );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterPreconfigured!)
        });
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait);
        await visualDiff(plugin, testName(this));
      });
    });

    describe('can sort', () => {
      beforeEach(async function () {
        localStorage.clear();
        await setViewPort();
        resetMouse();

        doc = await fetch('/test/fixtures/GOOSE-2007B4-LGOS-sorting.scd')
          .then(response => response.text())
          .then(str => new DOMParser().parseFromString(str, 'application/xml'));

        editor.docName = 'GOOSE-2007B4-LGOS-sorting.scd';
        editor.docs[editor.docName] = doc;

        await editor.updateComplete;
        await plugin.updateComplete;

        await timeout(500); // plugin loading and initial render?
      });

      afterEach(async () => {
        localStorage.clear();
      });

      describe('with FCDAs', async function () {
        it('shows sort options defaulting to data model', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await plugin.sortMenuFcdaButtonUI.updateComplete;

          await timeout(standardWait); // opening dialog
          await visualDiff(plugin, testName(this));
        });

        it('by data model as default', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortObjectReference = plugin.sortMenuFcdaUI.querySelector(
            'mwc-list-item:nth-child(1)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortObjectReference!)
          });
          await timeout(standardWait); // selection
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // rendering ?
          await visualDiff(plugin, testName(this));
        });

        it('by object reference', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortObjectReference = plugin.sortMenuFcdaUI.querySelector(
            'mwc-list-item:nth-child(2)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortObjectReference!)
          });
          await timeout(standardWait); // selection
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // rendering ?
          await visualDiff(plugin, testName(this));
        });

        it('by full description', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortObjectReference = plugin.sortMenuFcdaUI.querySelector(
            'mwc-list-item:nth-child(3)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortObjectReference!)
          });
          await timeout(standardWait); // selection
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // rendering ?
          await visualDiff(plugin, testName(this));
        });

        it('by data object and attribute description', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortObjectReference = plugin.sortMenuFcdaUI.querySelector(
            'mwc-list-item:nth-child(4)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortObjectReference!)
          });
          await timeout(standardWait); // selection
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait * 1.5); // rendering ?
          await visualDiff(plugin, testName(this));
        });

        it('by data attribute description', async function () {
          const button = plugin.sortMenuFcdaButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortObjectReference = plugin.sortMenuFcdaUI.querySelector(
            'mwc-list-item:nth-child(5)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortObjectReference!)
          });
          await timeout(standardWait); // selection
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait); // rendering ?
          await visualDiff(plugin, testName(this));
        });
      });

      describe('with ExtRefs', async function () {
        it('shows sort options defaulting to data model', async function () {
          const button = plugin.sortMenuExtRefPublisherButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });

          await timeout(standardWait); // opening dialog
          await visualDiff(plugin, testName(this));
        });

        it('sorts by data model by default', async function () {
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await fcda?.updateComplete;
          await fcdaListElement.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // selection

          const button = plugin.sortMenuExtRefPublisherButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortItem = plugin.sortMenuExtRefPublisherUI.querySelector(
            'mwc-list-item:nth-child(1)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortItem!)
          });
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('sorts by internal address', async function () {
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await fcda?.updateComplete;
          await fcdaListElement.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // selection

          const button = plugin.sortMenuExtRefPublisherButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortItem = plugin.sortMenuExtRefPublisherUI.querySelector(
            'mwc-list-item:nth-child(1)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortItem!)
          });
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('sorts by description', async function () {
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await fcda?.updateComplete;
          await fcdaListElement.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // selection

          const button = plugin.sortMenuExtRefPublisherButtonUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(button!)
          });
          await timeout(standardWait); // opening dialog

          const sortItem = plugin.sortMenuExtRefPublisherUI.querySelector(
            'mwc-list-item:nth-child(3)'
          );

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(sortItem!)
          });
          await plugin.sortMenuFcdaUI.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });
      });
    });

    describe('can search', () => {
      describe('in FCDAs', () => {
        it('even when a string is removed', async function () {
          // mostly to ensure code coverage of edge case
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'G' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait);

          await sendKeys({ press: 'Backspace' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait);

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('when there is no match', async function () {
          // mostly to ensure code coverage of edge case
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Xyzzy' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait);

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an IED name', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'GOOSE_Publisher2' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a control block name', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'GOOSE2' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an IED and control block name', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'GOOSE_Publisher GOOSE2' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a control block description', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Botany1' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an LDevice name', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'QB2_Disconnector' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          const fcdaListElement = plugin.fcdaListUI!;
          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1',
            'GOOSE_Publisher2>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          fcda?.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for an LDevice description', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Animalia' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a Data Object', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'CSWI' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a LN description', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Birch' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a Data Object description', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'SpiderLegs' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a data object description using DAI d', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Triangles' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a Data Attribute', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'stVal' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a combination of items', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Botany GOOSE1 stVal' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('With a wildcard question mark', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'QB?_Dis' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('With a wildcard asterisk', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: 'Anim*al' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('With double quoted text', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: '"CSWI 1"' });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('With single quoted text', async function () {
          const fcdaTextInput = plugin.filterFcdaInputUI!;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcdaTextInput!)
          });
          await sendKeys({ type: "'CSWI 1'" });
          await plugin.fcdaListUI!.updateComplete;
          await plugin.updateComplete;

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });
      });

      describe('in ExtRefs', async function () {
        it('for an intAddr', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'Thing' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a description', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'Bind' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for a supervision node', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'LGOS' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for double quoted text', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: '"A Place To Bind"' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for single quoted text', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: "'A Place To Bind'" });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for single quoted text', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: "'A Place To Bind'" });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('with multiple terms', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'LGOS 1 Input' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for wildcard asterisks', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'Miss*e' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });

        it('for wildcard question mark', async function () {
          // select fcda
          const fcdaListElement = plugin.fcdaListUI!;

          const fcda = getFcdaItem(
            fcdaListElement,
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
            'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
          );
          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(fcda!)
          });
          await plugin.extRefListPublisherUI!.updateComplete;
          await plugin.updateComplete;
          await timeout(standardWait); // rendering

          // search ExtRefs
          const extRefTextInput = plugin.filterExtRefPublisherInputUI;

          await sendMouse({
            type: 'click',
            button: 'left',
            position: midEl(extRefTextInput!)
          });
          await sendKeys({ type: 'Missing ?tt' });

          await plugin.extRefListPublisherUI?.updateComplete;
          await plugin.updateComplete;
          extRefTextInput!.scrollIntoView();

          await resetMouseState();
          await timeout(standardWait);
          await visualDiff(plugin, testName(this));
        });
      });
    });

    it('for an FCDA shows a tooltip with cdc and basic type', async function () {
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await plugin.updateComplete;

      // Doesn't seem to be testable by a visual test -- unsure why
      const tooltip = fcda?.getAttribute('title');

      expect(tooltip).to.be.equal('CDC: DPC\nBasic Type: Dbpos');
    });

    it('for an ExtRef with pXX attrs shows a tooltip with cdc and basic type', async function () {
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!)
      });
      await plugin.fcdaListUI!.updateComplete;
      await plugin.updateComplete;
      await timeout(standardWait); // selection

      const extRefListElement = plugin.extRefListPublisherUI;
      const extref = getExtRefItem(
        extRefListElement!,
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      );

      // Doesn't seem to be testable by a visual test -- unsure why
      const tooltip = extref?.getAttribute('title');

      expect(tooltip).to.be.equal(`CDC: DPC\nBasic Type: Dbpos`);
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

    it('changes to subscriber view and deselects any FCDAs', async function () {
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      )!;
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda)
      });
      await fcda.updateComplete;
      await plugin.fcdaListUI!.updateComplete;
      await plugin.updateComplete;
      await timeout(standardWait); // selection

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!)
      });
      await plugin.updateComplete;

      await timeout(standardWait); // button selection
      await resetMouseState();
      await visualDiff(plugin, testName(this));
    });

    it('changes to sampled values view', async function () {
      // check also that it deselects a selected FCDA as part of changing view
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda!)
      });
      await plugin.fcdaListUI!.updateComplete;
      await plugin.updateComplete;
      await timeout(standardWait); // selection

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

    it('provides a copy to markdown export for FCDAs', async function () {
      const clipboardStub = sinon
        .stub(navigator.clipboard, 'writeText')
        .callsFake(() => Promise.resolve());

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.savePublisherToMarkdownButton!)
      });
      await plugin.updateComplete;

      // Copy and paste and replace \n with \\n in VS Code
      expect(clipboardStub).to.have.been.calledWith(
        '* GOOSE_Publisher > GOOSE2\n  \n  QB2_Disconnector / LLN0 \n\n    * QB2_Disconnector / CSWI 1 Pos.stVal\n\n      Animalia > Arthropoda > SpiderLegs (3 subscriptions)\n\n      (DPC, Dbpos)\n\n    * QB2_Disconnector / CSWI 1 Pos.q\n\n      Animalia > Arthropoda > SpiderLegs (2 subscriptions)\n\n      (DPC, Quality)\n\n\n* GOOSE_Publisher > GOOSE1\n  \n  QB2_Disconnector / LLN0 \n\n    * QB1_Disconnector / CSWI 1 Pos.stVal\n\n      Triangles (1 subscription)\n\n      (DPC, Dbpos)\n\n    * QB1_Disconnector / CSWI 1 Pos.q\n\n      Triangles \n\n      (DPC, Quality)\n\n\n* GOOSE_Publisher2 > GOOSE2\n  \n  QB2_Disconnector / LLN0  - Botany1\n\n    * QB2_Disconnector / CSWI 1 Pos.stVal\n\n       (1 subscription)\n\n      (DPC, Dbpos)\n\n    * QB2_Disconnector / CSWI 1 Pos.q\n\n       \n\n      (DPC, Quality)\n\n\n* GOOSE_Publisher2 > GOOSE1\n  \n  QB2_Disconnector / LLN0  - Botany2\n\n    * QB1_Disconnector / CSWI 1 Pos.stVal\n\n      Tree > Birch \n\n      (DPC, Dbpos)\n\n    * QB1_Disconnector / CSWI 1 Pos.q\n\n      Tree > Birch \n\n      (DPC, Quality)\n\n'
      );
      sinon.restore();
    });

    it('resets selection when a new document is opened', async function () {
      // make selection
      const fcdaListElement = plugin.fcdaListUI!;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      )!;
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda)
      });
      await fcda.updateComplete;
      await plugin.fcdaListUI!.updateComplete;
      await plugin.updateComplete;
      await timeout(standardWait); // selection

      // now load new document
      doc = await fetch('/test/fixtures/GOOSE-no-inputs-or-subscriptions.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-no-inputs-or-subscriptions.scd';
      editor.docs[editor.docName] = doc;
      await editor.updateComplete;
      await plugin.updateComplete;
      await timeout(500); // plugin loading and initial render?
    });

    describe('has settings', () => {
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

        await timeout(500); // plugin loading and initial render?
      });

      it('it shows an ExtRef settings menu', async function () {
        const button = plugin.settingsMenuExtRefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;

        await timeout(standardWait); // opening dialog
        await visualDiff(plugin, testName(this));
      });

      it('which allows external plugins by default', async function () {
        expect(plugin.allowExternalPlugins).to.be.true;
        expect(plugin).has.attribute('allowexternalplugins');
      });

      it('which is not read-only by default', async function () {
        expect(plugin.readOnlyView).to.be.false;
      });

      it('can disable external plugins', async function () {
        const button = plugin.settingsMenuExtRefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;
        await timeout(standardWait); // selection

        const allowExternalPluginsSettings =
          plugin.settingsMenuExtRefPublisherUI.querySelector(
            '.allow-external-plugins'
          );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(allowExternalPluginsSettings!)
        });
        await plugin.updateComplete;
        await timeout(standardWait); // selection

        expect(plugin).does.not.have.attribute('allowexternalplugins');
      });

      it('does subscribe correctly when bypassing of service type and basic types', async function () {
        localStorage.clear();
        await setViewPort();
        resetMouse();

        doc = await fetch(
          '/test/fixtures/GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd'
        )
          .then(response => response.text())
          .then(str => new DOMParser().parseFromString(str, 'application/xml'));

        editor.docName = 'GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd';
        editor.docs[editor.docName] = doc;

        await editor.updateComplete;
        await plugin.updateComplete;

        await timeout(500); // plugin loading and initial render?

        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ PTOC 1.Op general (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await plugin.fcdaListUI!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // selection

        const extRefTextInput = plugin.filterExtRefPublisherInputUI!;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefTextInput!)
        });
        await sendKeys({ type: 'SPS' });
        await plugin.fcdaListUI!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait);

        expect(plugin.checkOnlyPreferredBasicType).to.be.false;
        expect(plugin).does.not.have.attribute('checkonlypreferredbasictype');
        // await visualDiff(plugin, `${testName(this)}-before-menu-open`);
        // TODO: It is quite tedious to visualDiff multiple screenshots in a test.
        // How do I allow errors to be ignored on first run?

        const button = plugin.settingsMenuExtRefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;

        await timeout(standardWait); // opening dialog
        await visualDiff(plugin, `${testName(this)}-after-menu-open`);

        const checkOnlyPreferred =
          plugin.settingsMenuExtRefPublisherUI.querySelector(
            '.check-only-preferred-basic-service-type'
          );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(checkOnlyPreferred!)
        });

        await plugin.settingsMenuExtRefPublisherUI!.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI!;
        await extRefListElement.updateComplete;
        await resetMouseState();
        await timeout(standardWait);

        await visualDiff(plugin, `${testName(this)}-after-enable-option`);
        expect(plugin).does.have.attribute('checkonlypreferredbasictype');

        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRefSPS[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });

        await extref!.updateComplete;
        await fcdaListElement.updateComplete;
        await extRefListElement.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, `${testName(this)}-after-subscribe`);
      });
    });

    describe('has a read-only view setting', () => {
      beforeEach(async function () {
        const button = plugin.settingsMenuExtRefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;
        await timeout(standardWait); // selection

        const readOnlyViewPluginSettings =
          plugin.settingsMenuExtRefPublisherUI.querySelector('.read-only-view');
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(readOnlyViewPluginSettings!)
        });
        await plugin.settingsMenuExtRefPublisherUI!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // selection
      });

      it('uses the secondary colours after enabling the setting', async function () {
        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('uses the primary colours after disabling the setting', async function () {
        const button = plugin.settingsMenuExtRefPublisherUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!)
        });
        await plugin.settingsMenuExtRefPublisherUI.updateComplete;
        await timeout(standardWait); // selection

        const readOnlyViewPluginSettings =
          plugin.settingsMenuExtRefPublisherUI.querySelector('.read-only-view');
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(readOnlyViewPluginSettings!)
        });
        await plugin.settingsMenuExtRefPublisherUI!.updateComplete;
        await plugin.updateComplete;
        await timeout(standardWait); // selection
      });

      it('and does not subscribe to an FCDA', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });

        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });

      it('and does not unsubscribe an ExtRef', async function () {
        const fcdaListElement = plugin.fcdaListUI!;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!)
        });
        await fcda!.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;

        const extRefListElement = plugin.extRefListPublisherUI;
        const extref = getExtRefItem(
          extRefListElement!,
          'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extref!)
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await resetMouseState();
        await timeout(standardWait); // selection
        await visualDiff(plugin, testName(this));
      });
    });
  });

  // TODO: Test undo and redo once core is updated
});
