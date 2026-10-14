import { expect } from '@open-wc/testing';
import { subscribe } from '@openscd/scl-lib';

import {
  companionRequestEventName,
  newCompanionAnnounceEvent,
  newCompanionWithdrawEvent,
  subscriptionChangeEventName
} from './foundation/companion-protocol.js';
import type {
  SubscriptionChangeDetail,
  SubscriptionChangeEvent
} from './foundation/companion-protocol.js';
import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import { mustQuery } from './testing/scl.js';
import { extRefById, subscriptionAttributes } from './testing/scl-queries.js';

const GOOSE1 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE1';
const GOOSE1_QB1_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE1sDataSet>QB1_Disconnector/ CSWI 1.Pos stVal (ST)';

const SUB = 'GOOSE_Subscriber>>Earth_Switch>';
const SUB1 = 'GOOSE_Subscriber1>>Earth_Switch>';
const BOUND = `${SUB} CSWI 1>Pos;CSWI1/Pos/stVal[0]`;
const SUB1_CILO_STVAL = `${SUB1} CILO 1>Pos;CSWI1/Pos/stVal[0]`;
const SUB1_CILO_Q = `${SUB1} CILO 1>Pos;CSWI1/Pos/q[0]`;

/** What a companion was told, without the `apply` function. */
type Seen = Omit<SubscriptionChangeDetail, 'apply'>;

describe('companion plugins', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;
  let seen: Seen[];
  let respond: ((detail: SubscriptionChangeDetail) => void) | undefined;

  const listener = (event: SubscriptionChangeEvent): void => {
    const { apply, ...rest } = event.detail;
    seen.push(rest);
    respond?.(event.detail);
  };

  const undoDepth = (): number => mounted.editor.past.length;

  const publisherElement = (selector: string): Element =>
    mustQuery(mounted.doc, `IED[name="GOOSE_Publisher"] ${selector}`);

  /**
   * A companion which subscribes the quality input after the value input to
   * the quality of the same data, as a manufacturer plugin would.
   */
  function qualityCompanion(detail: SubscriptionChangeDetail): void {
    if (detail.action !== 'subscribe' || !detail.controlBlock) {
      return;
    }
    const quality = extRefById(mounted.doc, SUB1_CILO_Q);
    const fcda = publisherElement(
      'DataSet[name="GOOSE1sDataSet"] FCDA[daName="q"]'
    );
    detail.apply(
      subscribe({
        sink: quality,
        source: { fcda, controlBlock: detail.controlBlock }
      }),
      { title: 'Test subscribe' }
    );
  }

  beforeEach(async () => {
    seen = [];
    respond = undefined;
    window.addEventListener(subscriptionChangeEventName, listener);
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    driver = new PluginDriver(mounted);
    await driver.switchView();
  });

  afterEach(() => {
    window.removeEventListener(subscriptionChangeEventName, listener);
    mounted.unmount();
  });

  describe('changes', () => {
    it('are sent after a subscription with what was subscribed to', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);

      expect(seen).to.have.length(1);
      const [change] = seen;
      expect(change.version).to.equal(1);
      expect(change.action).to.equal('subscribe');
      expect(change.extRef).to.equal(extRefById(mounted.doc, SUB1_CILO_STVAL));
      expect(change.fcda?.getAttribute('daName')).to.equal('stVal');
      expect(change.controlBlock).to.equal(
        publisherElement('GSEControl[name="GOOSE1"]')
      );
      expect(change.settings).to.deep.equal({
        ignoreSupervision: false,
        checkOnlyPreferredBasicType: false
      });
    });

    it('are sent after the edit is applied', async () => {
      let subscribed: boolean | undefined;
      respond = (detail) => {
        subscribed = 'iedName' in subscriptionAttributes(detail.extRef);
      };
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(subscribed).to.equal(true);
    });

    it('are sent after an unsubscription with what it was subscribed to', async () => {
      await driver.selectExtRef(BOUND, 'subscriber');

      expect(seen.map(change => change.action)).to.deep.equal(['unsubscribe']);
      const [change] = seen;
      expect(change.extRef).to.equal(extRefById(mounted.doc, BOUND));
      expect(change.fcda?.getAttribute('daName')).to.equal('stVal');
      expect(change.controlBlock?.tagName).to.equal('GSEControl');
    });

    it('are not sent when external plugins are not allowed', async () => {
      mounted.plugin.allowExternalPlugins = false;
      await mounted.settle();
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(seen).to.deep.equal([]);
    });

    it('pass on the settings for supervisions and types', async () => {
      mounted.plugin.ignoreSupervision = true;
      mounted.plugin.checkOnlyPreferredBasicType = true;
      await mounted.settle();
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(seen[0].settings).to.deep.equal({
        ignoreSupervision: true,
        checkOnlyPreferredBasicType: true
      });
    });
  });

  describe('applied edits', () => {
    beforeEach(() => {
      respond = qualityCompanion;
    });

    it('change the document', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, SUB1_CILO_Q)).daName
      ).to.equal('q');
    });

    it('are part of the same undoable edit', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      const before = undoDepth();
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(undoDepth() - before).to.equal(1);

      mounted.editor.undo();
      expect(
        subscriptionAttributes(extRefById(mounted.doc, SUB1_CILO_STVAL))
      ).to.deep.equal({});
      expect(
        subscriptionAttributes(extRefById(mounted.doc, SUB1_CILO_Q))
      ).to.deep.equal({});
    });

    it('take the title given', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.editor.past.at(-1)?.title).to.equal('Test subscribe');
    });

    it('are not sent on to companions', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(seen).to.have.length(1);
    });

    it('dispatch nothing when there are none', async () => {
      respond = detail => detail.apply([]);
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      const edits = mounted.edits.length;
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.edits.length - edits).to.equal(1);
    });
  });

  describe('auto-incrementing', () => {
    it('stops at an ExtRef a companion subscribed, without unsubscribing it', async () => {
      respond = qualityCompanion;
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);

      expect(mounted.plugin.selectedExtRef).to.equal(undefined);
      expect(
        subscriptionAttributes(extRefById(mounted.doc, SUB1_CILO_Q)).daName
      ).to.equal('q');
      expect(seen.map(change => change.action)).to.deep.equal(['subscribe']);
    });

    it('still selects a free next ExtRef', async () => {
      await driver.selectExtRef(SUB1_CILO_STVAL, 'subscriber');
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(mounted.plugin.selectedExtRef).to.equal(
        extRefById(mounted.doc, SUB1_CILO_Q)
      );
    });
  });

  describe('discovery', () => {
    const announce = (identity: string, name: string, enabled = true): void => {
      window.dispatchEvent(newCompanionAnnounceEvent({ identity, name, enabled }));
    };

    const settingsMenu = 'settingsExtRefSubscriberMenu';

    const externalPluginsText = (): string =>
      driver.menuExplanations(settingsMenu)[2];

    const badge = (): string | undefined => driver.menuBadge(settingsMenu);

    it('asks companions to announce themselves when connected', async () => {
      let requests = 0;
      const count = (): void => {
        requests += 1;
      };
      mounted.unmount();
      window.addEventListener(companionRequestEventName, count);
      mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
      window.removeEventListener(companionRequestEventName, count);
      expect(requests).to.equal(1);
    });

    it('shows that there are no active companions', () => {
      expect(externalPluginsText()).to.equal('No active companion plugins');
      expect(badge()).to.equal(undefined);
    });

    it('lists and counts the enabled companions', async () => {
      announce('test.sel', 'SEL');
      announce('test.nr', 'NR Electric');
      announce('test.siemens', 'Siemens', false);
      await mounted.settle();
      expect(externalPluginsText()).to.equal('2 active: NR Electric, SEL');
      expect(badge()).to.equal('2');
    });

    it('follows a companion which is turned off', async () => {
      announce('test.sel', 'SEL');
      announce('test.sel', 'SEL', false);
      await mounted.settle();
      expect(externalPluginsText()).to.equal('No active companion plugins');
    });

    it('forgets a companion which is withdrawn', async () => {
      announce('test.sel', 'SEL');
      window.dispatchEvent(newCompanionWithdrawEvent({ identity: 'test.sel' }));
      await mounted.settle();
      expect(externalPluginsText()).to.equal('No active companion plugins');
    });

    it('shows no count when external plugins are not allowed', async () => {
      announce('test.sel', 'SEL');
      mounted.plugin.allowExternalPlugins = false;
      await mounted.settle();
      expect(badge()).to.equal(undefined);
    });

    it('shows the companions in the publisher view too', async () => {
      announce('test.sel', 'SEL');
      await driver.switchView();
      await driver.selectFcda(GOOSE1, GOOSE1_QB1_STVAL);
      expect(
        driver.menuExplanations('settingsExtRefPublisherMenu')[1]
      ).to.equal('1 active: SEL');
    });
  });
});
