import { expect } from '@open-wc/testing';

import { PluginDriver } from './testing/driver.js';
import { mountPlugin } from './testing/plugin.js';
import type { MountedPlugin } from './testing/plugin.js';
import { extRefById } from './testing/scl-queries.js';

const GOOSE2 = 'GOOSE_Publisher>>QB2_Disconnector>GOOSE2';
const GOOSE2_STVAL =
  'GOOSE_Publisher>>QB2_Disconnector>GOOSE2sDataSet>QB2_Disconnector/ CSWI 1.Pos stVal (ST)';

const SUB_BOUND = 'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]';
const SUB_MISSING_IED = 'GOOSE_Subscriber>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal[0]';
const SUB3_SUPERVISED = 'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]';

/** Edits made by other plugins keep the plugin's cached values correct. */
describe('edits made by other plugins', () => {
  let mounted: MountedPlugin;
  let driver: PluginDriver;

  beforeEach(async () => {
    mounted = await mountPlugin({ fixture: 'GOOSE-2007B4-LGOS.scd' });
    driver = new PluginDriver(mounted);
  });

  afterEach(() => {
    mounted.unmount();
  });

  const count = () => driver.fcda(GOOSE2, GOOSE2_STVAL)!.meta;

  describe('to ExtRefs', () => {
    it('shows an initial count', () => {
      expect(count()).to.equal('3');
    });

    it('increases the count when an ExtRef is subscribed', async () => {
      const extRef = extRefById(mounted.doc, SUB_MISSING_IED);
      await mounted.applyEdit({
        element: extRef,
        attributes: { iedName: 'GOOSE_Publisher' }
      });
      expect(count()).to.equal('4');
    });

    it('decreases the count when a subscribed ExtRef is unsubscribed', async () => {
      const extRef = extRefById(mounted.doc, SUB_BOUND);
      await mounted.applyEdit({
        element: extRef,
        attributes: { iedName: null }
      });
      expect(count()).to.equal('2');
    });

    it('decreases the count when a subscribed ExtRef is removed', async () => {
      const extRef = extRefById(mounted.doc, SUB_BOUND);
      await mounted.applyEdit({ node: extRef });
      expect(count()).to.equal('2');
    });

    it('increases the count when a subscribed ExtRef is added', async () => {
      const extRef = extRefById(mounted.doc, SUB_BOUND);
      const copy = extRef.cloneNode(true) as Element;
      copy.setAttribute('intAddr', 'Another');
      await mounted.applyEdit({
        parent: extRef.parentElement!,
        node: copy,
        reference: null
      });
      expect(count()).to.equal('4');
    });

    it('lists a newly added ExtRef in the publisher view', async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      const before = driver.publisherSubscribedExtRefs().length;
      const extRef = extRefById(mounted.doc, SUB_MISSING_IED);
      await mounted.applyEdit({
        element: extRef,
        attributes: { iedName: 'GOOSE_Publisher' }
      });
      expect(driver.publisherSubscribedExtRefs()).to.have.length(before + 1);
    });

    it('applies several edits in one event', async () => {
      const bound = extRefById(mounted.doc, SUB_BOUND);
      const missing = extRefById(mounted.doc, SUB_MISSING_IED);
      await mounted.applyEdit([
        { element: bound, attributes: { iedName: null } },
        { element: missing, attributes: { iedName: 'GOOSE_Publisher' } }
      ]);
      expect(count()).to.equal('3');
    });
  });

  describe('to supervisions', () => {
    const supervisionOf = (id: string) =>
      driver.subscriberExtRefs().find(e => e.id === id)!;

    beforeEach(async () => {
      await driver.switchView();
    });

    it('shows the supervision of a subscription', () => {
      expect(supervisionOf(SUB3_SUPERVISED).secondary).to.contain(
        'GOOSE_supervision > LGOS 1'
      );
    });

    it('stops showing a supervision when it is removed', async () => {
      const ln = mounted.doc.querySelector(
        'IED[name="GOOSE_Subscriber3"] LN[lnClass="LGOS"][inst="1"]'
      )!;
      await mounted.applyEdit({ node: ln });
      expect(supervisionOf(SUB3_SUPERVISED).secondary).to.not.contain('LGOS');
    });

    it('stops showing a supervision when its reference text is removed', async () => {
      const val = mounted.doc.querySelector(
        'IED[name="GOOSE_Subscriber3"] LN[lnClass="LGOS"][inst="1"] Val'
      )!;
      await mounted.applyEdit({ node: val.firstChild! });
      expect(supervisionOf(SUB3_SUPERVISED).secondary).to.not.contain('LGOS');
    });

    it('shows a supervision when its reference text is added back', async () => {
      const val = mounted.doc.querySelector(
        'IED[name="GOOSE_Subscriber3"] LN[lnClass="LGOS"][inst="1"] Val'
      )!;
      const text = val.firstChild!;
      await mounted.applyEdit({ node: text });
      await mounted.applyEdit({ parent: val, node: text, reference: null });
      expect(supervisionOf(SUB3_SUPERVISED).secondary).to.contain(
        'GOOSE_supervision > LGOS 1'
      );
    });

    it('shows a supervision which is added', async () => {
      const extRef = SUB_BOUND;
      expect(supervisionOf(extRef).secondary).to.not.contain('LGOS');
      const lDevice = mounted.doc.querySelector(
        'IED[name="GOOSE_Subscriber"] LDevice'
      )!;
      const ln = new DOMParser().parseFromString(
        `<LN xmlns="http://www.iec.ch/61850/2003/SCL" lnClass="LGOS" inst="9">
           <DOI name="GoCBRef"><DAI name="setSrcRef">
             <Val>GOOSE_PublisherQB2_Disconnector/LLN0.GOOSE2</Val>
           </DAI></DOI>
         </LN>`,
        'application/xml'
      ).documentElement;
      await mounted.applyEdit({
        parent: lDevice,
        node: mounted.doc.importNode(ln, true),
        reference: null
      });
      expect(supervisionOf(extRef).secondary).to.contain('LGOS 9');
    });

    it('is not confused by edits to elements which are not supervisions', async () => {
      const ln = mounted.doc.querySelector(
        'IED[name="GOOSE_Subscriber3"] LN[lnClass="CILO"]'
      )!;
      await mounted.applyEdit({ element: ln, attributes: { desc: 'changed' } });
      expect(supervisionOf(SUB3_SUPERVISED).secondary).to.contain(
        'GOOSE_supervision > LGOS 1'
      );
    });
  });

  describe('when a new document is opened', () => {
    it('shows counts for the new document', async () => {
      const other = new DOMParser().parseFromString(
        mounted.doc.documentElement.outerHTML,
        'application/xml'
      );
      const extRef = other.querySelector(
        'IED[name="GOOSE_Subscriber"] ExtRef[intAddr="Pos;CSWI1/Pos/stVal"][iedName="GOOSE_Publisher"]'
      )!;
      extRef.remove();
      await mounted.openDocument(other, 'other.scd');
      expect(count()).to.equal('2');
    });

    it('clears the selection', async () => {
      await driver.selectFcda(GOOSE2, GOOSE2_STVAL);
      expect(mounted.plugin.selectedFCDA).to.not.equal(undefined);
      const other = new DOMParser().parseFromString(
        mounted.doc.documentElement.outerHTML,
        'application/xml'
      );
      await mounted.openDocument(other, 'other.scd');
      expect(mounted.plugin.selectedFCDA).to.equal(undefined);
      expect(mounted.plugin.selectedControl).to.equal(undefined);
      expect(driver.headings()).to.include('No published item selected');
    });

    it('clears search text', async () => {
      await driver.search('fcda', 'Birch');
      expect(driver.fcdas()).to.have.length(2);
      const other = new DOMParser().parseFromString(
        mounted.doc.documentElement.outerHTML,
        'application/xml'
      );
      await mounted.openDocument(other, 'other.scd');
      expect(driver.fcdas()).to.have.length(8);
    });
  });
});
