/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import { visualDiff } from '@web/test-runner-visual-regression';

import {
  setViewport,
  sendMouse,
  resetMouse,
  sendKeys,
} from '@web/test-runner-commands';

import { expect, fixture, html } from '@open-wc/testing';

import '@openscd/open-scd-core/open-scd.js';

import { LitElement } from 'lit';
import type { CheckListItem } from '@material/mwc-list/mwc-check-list-item.js';

import { getExtRefItem, getFcdaItem, midEl } from './test-support.js';
import type SubscriberLaterBinding from '../../oscd-subscriber-later-binding.js';

const factor = window.process && process.env.CI ? 4 : 2;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(14000 * factor);

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
        requireDoc: true,
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
      await tryViewportSet();
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

    afterEach(async () => {
      localStorage.clear();
    });

    it('initially has no FCDA selected', async function () {
      // carrying out an action causes a content refresh somehow??
      await sendMouse({
        type: 'move',
        position: midEl(plugin!),
      });

      // TODO: Does ca-d have any ideas about this?
      // webkit is especially fussy and appears to slowly change the layout?
      await timeout(300);
      await visualDiff(plugin, testName(this));
    });

    it('shows subscriptions for an FCDA including LGOS', async function () {
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
      await fcda!.updateComplete;
      await fcdaListElement.updateComplete;
      await plugin.updateComplete;

      await timeout(150); // selection
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
      await fcda!.updateComplete;
      await fcdaListElement.updateComplete;
      await plugin.updateComplete;

      await timeout(150); // selection
      await visualDiff(plugin, testName(this));
    });

    describe('can change subscriptions by', () => {
      it('subscribing to an FCDA without supervisions', async function () {
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
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA without supervisions', async function () {
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
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // selection
        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA with supervisions', async function () {
        const fcdaListElement = plugin.fcdaListUI;

        const fcda = getFcdaItem(
          fcdaListElement,
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE1',
          'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcda!),
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
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with supervisions', async function () {
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
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // selection
        await visualDiff(plugin, testName(this));
      });

      it('unsubscribing an FCDA with one supervision', async function () {
        const fcdaListElement = plugin.fcdaListUI;
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
          position: midEl(extRefChosen!),
        });
        await extRefChosen!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        // increased for webkit
        await timeout(300); // selection

        await visualDiff(plugin, testName(this));
      });

      it('subscribing to an FCDA does not change supervisions if unset', async function () {
        // turn off supervision modification
        const button = plugin.settingsMenuExtRefPublisherButtonUI;
        const fcdaListElement = plugin.fcdaListUI;

        // first unsubscribe (we already have a supervision)
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
          position: midEl(extref!),
        });
        await extref!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        // now set to not doing supervisions
        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(150); // menu must show

        const settingsNoSupervisions = <CheckListItem>(
          plugin.settingsMenuExtRefPublisherUI.querySelector('.no-supervisions')
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(settingsNoSupervisions!),
        });
        await timeout(150);
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
          position: midEl(extref2!),
        });
        await extref2!.updateComplete;
        await extRefListElement!.updateComplete;
        await plugin.updateComplete;

        // increased timeout for webkit
        await timeout(200); // selection
        await visualDiff(plugin, testName(this));
      });
    });

    describe('has filters', () => {
      beforeEach(async function () {
        localStorage.clear();
        await tryViewportSet();
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

        await timeout(150); // opening dialog
        await visualDiff(plugin, testName(this));
      });

      it('filters only subscribed FCDAs', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(150); // opening dialog

        const filterNotSubscribed = plugin.filterMenuFcdaUI.querySelector(
          '.filter-not-subscribed'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterNotSubscribed!),
        });
        await timeout(150); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('filters only not subscribed FCDAs', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(150); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!),
        });
        await timeout(150); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('and can filter out data objects', async function () {
        const button = plugin.filterMenuFcdaButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(150); // opening dialog

        const filterSubscribed =
          plugin.filterMenuFcdaUI.querySelector('.filter-subscribed');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterSubscribed!),
        });
        await timeout(150); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(button!),
        });
        await timeout(150); // opening dialog

        const filterDataObjects = plugin.filterMenuFcdaUI.querySelector(
          '.filter-data-objects'
        );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterDataObjects!),
        });
        await timeout(150); // selection
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(150); // rendering ?
        await visualDiff(plugin, testName(this));
      });

      it('shows ExtRef filter options defaulting to on', async function () {
        const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });
        await timeout(150); // opening dialog

        await visualDiff(plugin, testName(this));
      });

      it('and filters preconfigured items with non-matching pXX attributes', async function () {
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
        await fcda?.updateComplete;
        await fcdaListElement.updateComplete;
        await plugin.updateComplete;
        await timeout(150); // selection

        const extRefFilterMenu = plugin.filterMenuExtrefPublisherButtonUI;

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefFilterMenu!),
        });
        await timeout(150); // opening dialog

        const filterPreconfigured =
          plugin.filterMenuExtRefPublisherUI.querySelector(
            '.filter-preconfigured'
          );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(filterPreconfigured!),
        });
        await plugin.filterMenuFcdaUI.updateComplete;
        await plugin.updateComplete;

        await timeout(200); // rendering ?
        await visualDiff(plugin, testName(this));
      });
    });

    describe('can search', () => {
      it('in FCDAs with a string', async function () {
        const fcdaTextInput =
          plugin.fcdaListUI!.shadowRoot!.querySelector('mwc-textfield');

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(fcdaTextInput!),
        });
        sendKeys({ type: 'QB1' });
        await plugin.fcdaListUI.updateComplete;

        await visualDiff(plugin, testName(this));
      });

      it('in ExtRefs with a string', async function () {
        // select fcda
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
        await plugin.fcdaListUI.updateComplete;
        await plugin.updateComplete;

        // search ExtRefs
        const extRefTextInput =
          plugin.extRefListPublisherUI!.shadowRoot!.querySelector(
            'mwc-textfield'
          );

        await sendMouse({
          type: 'click',
          button: 'left',
          position: midEl(extRefTextInput!),
        });
        sendKeys({ type: 'Thing' });
        await plugin.extRefListPublisherUI?.updateComplete;

        await timeout(150); // de-selection
        await visualDiff(plugin, testName(this));
      });
    });

    it('for an FCDA shows a tooltip with cdc and basic type', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      );
      await plugin.updateComplete;

      // Doesn't seem to be testable by a visual test -- unsure why
      const tooltip = fcda?.getAttribute('title');

      expect(tooltip).to.be.equal('CDC: DPC\nBasic Type: Enum');
    });

    it('for an ExtRef with pXX attrs shows a tooltip with cdc and basic type', async function () {
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
      await plugin.fcdaListUI.updateComplete;
      await plugin.updateComplete;
      await timeout(150); // selection

      const extRefListElement = plugin.extRefListPublisherUI;
      const extref = getExtRefItem(
        extRefListElement!,
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      );

      // Doesn't seem to be testable by a visual test -- unsure why
      const tooltip = extref?.getAttribute('title');

      expect(tooltip).to.be.equal(`CDC: DPC\nBasic Type: Enum`);
    });

    it('changes to subscriber view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
      await visualDiff(plugin, testName(this));
    });

    it('changes to subscriber view and deselects any FCDAs', async function () {
      const fcdaListElement = plugin.fcdaListUI;

      const fcda = getFcdaItem(
        fcdaListElement,
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2',
        'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      )!;
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(fcda),
      });
      await fcda.updateComplete;
      await plugin.fcdaListUI.updateComplete;
      await plugin.updateComplete;
      await timeout(150); // selection

      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
      await visualDiff(plugin, testName(this));
    });

    it('changes to sampled values view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
      await visualDiff(plugin, testName(this));
    });
  });

  describe('subscriber view', () => {
    beforeEach(async function () {
      localStorage.clear();
      await tryViewportSet();
      resetMouse();

      doc = await fetch('/test/fixtures/GOOSE-2007B4-LGOS.scd')
        .then(response => response.text())
        .then(str => new DOMParser().parseFromString(str, 'application/xml'));

      editor.docName = 'GOOSE-2007B4-LGOS.scd';
      editor.docs[editor.docName] = doc;

      await editor.updateComplete;
      await plugin.updateComplete;

      await timeout(500); // plugin loading and initial render?

      // TODO: Why can't I do this?
      // plugin.setAttribute('subscriberview', '');
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
    });

    afterEach(async () => {
      localStorage.clear();
    });

    it('initially has no ExtRef selected', async function () {
      // carrying out an action causes a content refresh somehow??
      await sendMouse({
        type: 'move',
        position: midEl(plugin!),
      });

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

        await timeout(150); // selection
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

        await timeout(150); // selection
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

        const fcdaListElement = plugin.fcdaListUI;

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

        await timeout(150); // selection
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

        const fcdaListElement = plugin.fcdaListUI;
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

        await timeout(150); // selection
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

        const fcdaListElement = plugin.fcdaListUI;

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

        await timeout(150); // selection
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

        await timeout(150); // selection
        await visualDiff(plugin, testName(this));
      });

      // XXX

      // it('unsubscribing an FCDA with one supervision', async function () {
      //   const fcdaListElement = plugin.fcdaListUI;
      //   const fcda = getFcdaItem(
      //     fcdaListElement,
      //     'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2',
      //     'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      //   );
      //   fcda?.scrollIntoView();

      //   await sendMouse({
      //     type: 'click',
      //     button: 'left',
      //     position: midEl(fcda!),
      //   });
      //   await fcda!.updateComplete;
      //   await fcdaListElement.updateComplete;
      //   await plugin.updateComplete;

      //   const extRefListElement = plugin.extRefListPublisherUI!;
      //   const extRefChosen = getExtRefItem(
      //     extRefListElement!,
      //     'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
      //   );
      //   extRefChosen?.scrollIntoView();

      //   //  unsubscribe
      //   await sendMouse({
      //     type: 'click',
      //     button: 'left',
      //     position: midEl(extRefChosen!),
      //   });
      //   await extRefChosen!.updateComplete;
      //   await extRefListElement!.updateComplete;
      //   await plugin.updateComplete;

      //   // increased for webkit
      //   await timeout(300); // selection

      //   await visualDiff(plugin, testName(this));
      // });

      //     it('subscribing to an FCDA does not change supervisions if unset', async function () {
      //       // turn off supervision modification
      //       const button = plugin.settingsMenuExtRefPublisherButtonUI;
      //       const fcdaListElement = plugin.fcdaListUI;

      //       // first unsubscribe (we already have a supervision)
      //       const fcda = getFcdaItem(
      //         fcdaListElement,
      //         'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2',
      //         'GOOSE_Publisher2>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)'
      //       );
      //       await sendMouse({
      //         type: 'click',
      //         button: 'left',
      //         position: midEl(fcda!),
      //       });
      //       await fcda!.updateComplete;
      //       await fcdaListElement.updateComplete;
      //       await plugin.updateComplete;

      //       let extRefListElement = plugin.extRefListPublisherUI;
      //       const extref = getExtRefItem(
      //         extRefListElement!,
      //         'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
      //       );
      //       extref?.scrollIntoView();

      //       await sendMouse({
      //         type: 'click',
      //         button: 'left',
      //         position: midEl(extref!),
      //       });
      //       await extref!.updateComplete;
      //       await extRefListElement!.updateComplete;
      //       await plugin.updateComplete;

      //       // now set to not doing supervisions
      //       await sendMouse({
      //         type: 'click',
      //         button: 'left',
      //         position: midEl(button!),
      //       });
      //       await timeout(150); // menu must show

      //       const settingsNoSupervisions = <CheckListItem>(
      //         plugin.settingsMenuExtRefPublisherUI.querySelector('.no-supervisions')
      //       );

      //       await sendMouse({
      //         type: 'click',
      //         button: 'left',
      //         position: midEl(settingsNoSupervisions!),
      //       });
      //       await timeout(150);
      //       await settingsNoSupervisions!.updateComplete;
      //       await plugin.settingsMenuExtRefPublisherUI.updateComplete;
      //       await plugin.updateComplete;

      //       // now do subscription which would normally result in supervision instantiation
      //       extRefListElement = plugin.extRefListPublisherUI;
      //       const extref2 = getExtRefItem(
      //         extRefListElement!,
      //         'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing3[0]'
      //       );
      //       extref2?.scrollIntoView();

      //       await sendMouse({
      //         type: 'click',
      //         button: 'left',
      //         position: midEl(extref2!),
      //       });
      //       await extref2!.updateComplete;
      //       await extRefListElement!.updateComplete;
      //       await plugin.updateComplete;

      //       // increased timeout for webkit
      //       await timeout(200); // selection
      //       await visualDiff(plugin, testName(this));
      //     });
    });

    it('changes to publisher view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchViewUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
      await visualDiff(plugin, testName(this));
    });

    it('changes to sampled values view', async function () {
      await sendMouse({
        type: 'click',
        button: 'left',
        position: midEl(plugin.switchControlTypeUI!),
      });
      await plugin.updateComplete;

      await timeout(150); // button selection
      await visualDiff(plugin, testName(this));
    });
  });

  // invalid mappings can be removed
  // mappings with missing IEDs can be subscribed
});
