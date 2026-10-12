import { expect } from '@open-wc/testing';
import { find } from '@openscd/scl-lib';

import { loadFixture } from '../testing/fixtures.js';
import { mustQuery } from '../testing/scl.js';
import { SubscriptionModel } from './model.js';
import {
  buildFcdaRows,
  buildPublisherExtRefRows,
  buildSubscriberRows,
  isExtRefViewable,
  nextExtRefToSubscribe
} from './rows.js';
import type {
  FcdaRow,
  PublisherExtRefRow,
  SubscriberExtRefRow
} from './rows.js';
import { defaultSettings } from './settings.js';
import { getSearchRegex } from './search.js';

const settings = defaultSettings;

const extRefById = (doc: XMLDocument, id: string): Element =>
  find(doc, 'ExtRef', id) as Element;

const fcdaRows = (rows: ReturnType<typeof buildFcdaRows>): FcdaRow[] =>
  rows.filter((row): row is FcdaRow => row.type === 'fcda');

const extRefRows = (
  rows: ReturnType<typeof buildPublisherExtRefRows>
): PublisherExtRefRow[] =>
  rows.filter((row): row is PublisherExtRefRow => row.type === 'extref');

describe('rows', () => {
  describe('of control blocks and FCDAs', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    it('lists each control block followed by its FCDAs', () => {
      const rows = buildFcdaRows(model, settings, undefined);
      expect(rows.map(row => row.type)).to.deep.equal([
        'control',
        'fcda',
        'fcda',
        'control',
        'fcda',
        'fcda',
        'control',
        'fcda',
        'fcda',
        'control',
        'fcda',
        'fcda'
      ]);
    });

    it('describes a control block', () => {
      const rows = buildFcdaRows(model, settings, undefined);
      expect(rows.filter(row => row.type === 'control')).to.have.length(4);
      const control = rows[0];
      expect(control.type === 'control' && control.title).to.equal(
        'GOOSE_Publisher > GOOSE2'
      );
      expect(control.type === 'control' && control.subtitle).to.equal(
        'QB2_Disconnector / LLN0'
      );
    });

    it('adds the description of a control block to its subtitle', () => {
      const rows = buildFcdaRows(model, settings, undefined);
      const control = rows.find(
        row => row.type === 'control' && row.title === 'GOOSE_Publisher2 > GOOSE2'
      );
      expect(control?.type === 'control' && control.subtitle).to.equal(
        'QB2_Disconnector / LLN0 - Botany1'
      );
    });

    it('describes an FCDA with its data, count and type', () => {
      const [first] = fcdaRows(buildFcdaRows(model, settings, undefined));
      expect(first.title.replace(/\s+/g, ' ')).to.equal(
        'QB2_Disconnector / CSWI 1 Pos.stVal'
      );
      expect(first.subtitle).to.equal('Animalia > Arthropoda > SpiderLegs');
      expect(first.count).to.equal(3);
      expect(first.disabled).to.equal(false);
      expect(first.tooltip).to.equal('CDC: DPC\nBasic Type: Dbpos');
    });

    it('gives each row a unique key', () => {
      const keys = buildFcdaRows(model, settings, undefined).map(row => row.key);
      expect(new Set(keys).size).to.equal(keys.length);
    });

    it('counts subscriptions for each FCDA', () => {
      expect(
        fcdaRows(buildFcdaRows(model, settings, undefined)).map(row => row.count)
      ).to.deep.equal([3, 2, 1, 0, 1, 0, 0, 0]);
    });

    describe('filters', () => {
      it('leaves out subscribed FCDAs', () => {
        const rows = buildFcdaRows(
          model,
          { ...settings, filterOutSubscribed: true },
          undefined
        );
        expect(fcdaRows(rows).every(row => row.count === 0)).to.equal(true);
        expect(fcdaRows(rows)).to.have.length(4);
      });

      it('leaves out FCDAs which are not subscribed', () => {
        const rows = buildFcdaRows(
          model,
          { ...settings, filterOutNotSubscribed: true },
          undefined
        );
        expect(fcdaRows(rows).every(row => row.count > 0)).to.equal(true);
        expect(fcdaRows(rows)).to.have.length(4);
      });

      it('lists nothing when subscribed and not subscribed are both left out', () => {
        expect(
          buildFcdaRows(
            model,
            { ...settings, filterOutSubscribed: true, filterOutNotSubscribed: true },
            undefined
          )
        ).to.deep.equal([]);
      });

      it('leaves out quality attributes', () => {
        const rows = fcdaRows(
          buildFcdaRows(model, { ...settings, filterOutQuality: true }, undefined)
        );
        expect(rows).to.have.length(4);
        expect(rows.some(row => row.title.endsWith('.q'))).to.equal(false);
      });

      it('leaves out a control block when none of its FCDAs remain', () => {
        const rows = buildFcdaRows(
          model,
          { ...settings, filterOutSubscribed: true },
          undefined
        );
        const titles = rows
          .filter(row => row.type === 'control')
          .map(row => row.type === 'control' && row.title);
        expect(titles).to.not.include('GOOSE_Publisher > GOOSE2');
        expect(titles).to.include('GOOSE_Publisher2 > GOOSE1');
      });
    });

    describe('search', () => {
      it('lists only FCDAs which match', () => {
        const rows = fcdaRows(
          buildFcdaRows(model, settings, undefined, getSearchRegex('Birch'))
        );
        expect(rows).to.have.length(2);
        expect(rows.every(row => row.subtitle.includes('Birch'))).to.equal(true);
      });

      it('lists only the control blocks of FCDAs which match', () => {
        const rows = buildFcdaRows(
          model,
          settings,
          undefined,
          getSearchRegex('Birch')
        );
        expect(rows.filter(row => row.type === 'control')).to.have.length(1);
      });

      it('lists nothing when nothing matches', () => {
        expect(
          buildFcdaRows(model, settings, undefined, getSearchRegex('zzzz'))
        ).to.deep.equal([]);
      });

      it('matches the control block name and description for all of its FCDAs', () => {
        const rows = fcdaRows(
          buildFcdaRows(model, settings, undefined, getSearchRegex('Botany1'))
        );
        expect(rows).to.have.length(2);
        expect(rows.every(row => row.controlId.includes('Publisher2'))).to.equal(
          true
        );
      });
    });
  });

  describe('of control blocks and FCDAs in the subscriber view', () => {
    it('leaves out control blocks of the IED being subscribed', async () => {
      const doc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const own = mustQuery(
        doc,
        'IED[name="GOOSE_Publisher"] ExtRef[intAddr="Pos;CILO1/Pos/stVal"]'
      );
      const subscriberSettings = { ...settings, subscriberView: true };

      const withOwn = buildFcdaRows(model, subscriberSettings, undefined);
      const without = buildFcdaRows(model, subscriberSettings, own);
      expect(withOwn.some(row => row.control.closest('IED') === own.closest('IED'))).to.equal(true);
      expect(without.some(row => row.control.closest('IED') === own.closest('IED'))).to.equal(false);
    });

    it('does not leave out any control block in the publisher view', async () => {
      const doc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const own = mustQuery(
        doc,
        'IED[name="GOOSE_Publisher"] ExtRef[intAddr="Pos;CILO1/Pos/stVal"]'
      );
      expect(
        buildFcdaRows(model, settings, own).some(
          row => row.control.closest('IED') === own.closest('IED')
        )
      ).to.equal(true);
    });
  });

  describe('of data objects', () => {
    it('lists them as disabled, and leaves them out when filtered', async () => {
      const doc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const all = fcdaRows(buildFcdaRows(model, settings, undefined));
      const dataObjects = all.filter(row => !row.fcda.getAttribute('daName'));
      expect(dataObjects.length).to.be.greaterThan(0);
      expect(dataObjects.every(row => row.disabled)).to.equal(true);

      const filtered = fcdaRows(
        buildFcdaRows(model, { ...settings, filterOutDataObjects: true }, undefined)
      );
      expect(filtered).to.have.length(all.length - dataObjects.length);
      expect(filtered.every(row => !row.disabled)).to.equal(true);
    });

    it('leaves out a control block which has only data objects', async () => {
      const doc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const titles = (filterOutDataObjects: boolean) =>
        buildFcdaRows(model, { ...settings, filterOutDataObjects }, undefined)
          .filter(row => row.type === 'control')
          .map(row => row.type === 'control' && row.title);
      expect(titles(false).some(t => `${t}`.includes('OnlyDODataset'))).to.equal(true);
      expect(titles(true).some(t => `${t}`.includes('OnlyDODataset'))).to.equal(false);
    });
  });

  describe('of FCDAs an ExtRef is preconfigured for', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    const restricted = () =>
      extRefById(doc, 'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]');
    const subscriberSettings = { ...settings, subscriberView: true };

    it('disables FCDAs which do not match', () => {
      const rows = fcdaRows(buildFcdaRows(model, subscriberSettings, restricted()));
      const enabled = rows.filter(row => !row.disabled);
      expect(enabled.length).to.be.greaterThan(0);
      expect(
        enabled.every(row => row.fcda.getAttribute('lnClass') === 'CSWI')
      ).to.equal(true);
      expect(rows.length).to.be.greaterThan(enabled.length);
    });

    it('leaves out FCDAs which do not match when filtered', () => {
      const rows = fcdaRows(
        buildFcdaRows(
          model,
          { ...subscriberSettings, filterOutPreconfiguredUnmatched: true },
          restricted()
        )
      );
      expect(rows.length).to.be.greaterThan(0);
      expect(rows.every(row => !row.disabled)).to.equal(true);
    });

    it('disables nothing in the publisher view', () => {
      const rows = fcdaRows(buildFcdaRows(model, settings, restricted()));
      expect(rows.some(row => row.disabled)).to.equal(false);
    });

    it('disables nothing when no ExtRef is selected', () => {
      const rows = fcdaRows(buildFcdaRows(model, subscriberSettings, undefined));
      expect(rows.some(row => row.disabled)).to.equal(false);
    });
  });

  describe('sorting FCDAs', () => {
    it('sorts within each control block and leaves the control blocks in place', async () => {
      const doc = await loadFixture('GOOSE-2007B4-LGOS-sorting.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const titles = (sortFcda: number) =>
        buildFcdaRows(model, { ...settings, sortFcda }, undefined)
          .filter(row => row.type === 'control')
          .map(row => row.type === 'control' && row.title);
      expect(titles(1)).to.deep.equal(titles(0));

      const dataModel = fcdaRows(buildFcdaRows(model, settings, undefined)).map(
        row => row.title
      );
      const byPath = fcdaRows(
        buildFcdaRows(model, { ...settings, sortFcda: 1 }, undefined)
      ).map(row => row.title);
      expect(byPath).to.not.deep.equal(dataModel);
      expect([...byPath].sort()).to.have.length(dataModel.length);
    });
  });

  describe('of ExtRefs for an FCDA', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;
    let control: Element;
    let fcda: Element;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
      [control] = model.controls;
      [fcda] = model.fcdasOf(control);
    });

    it('has a heading and a group for subscribed and available ExtRefs', () => {
      const rows = buildPublisherExtRefRows(model, settings, control, fcda);
      expect(
        rows.filter(row => row.type === 'heading').map(row => row.type === 'heading' && row.text)
      ).to.deep.equal(['Subscribed', 'Available to subscribe']);
    });

    it('lists the ExtRefs subscribed to the FCDA', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      expect(rows.filter(row => row.subscribed).map(row => row.extRefId)).to.have.members([
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]',
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]',
        'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]'
      ]);
    });

    it('lists ExtRefs which could be subscribed, but not those of the publishing IED', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const available = rows.filter(row => !row.subscribed);
      expect(available.length).to.be.greaterThan(0);
      expect(available.some(row => row.extRefId.startsWith('GOOSE_Publisher>'))).to.equal(false);
    });

    it('describes a subscribed ExtRef with its supervision', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const supervised = rows.find(row =>
        row.extRefId.startsWith('GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal')
      )!;
      expect(supervised.title).to.equal(
        'GOOSE_Subscriber1 > Earth_Switch / CSWI 1: Pos;CSWI1/Pos/stVal'
      );
      // the identity of a logical node without a prefix has two spaces
      expect(supervised.subtitle).to.equal(
        'Interlocking.Input2 (GOOSE_supervision >  LGOS 1)'
      );
      expect(supervised.supervisionId).to.contain('LGOS 1');
    });

    it('does not mention a supervision for a subscription without one', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const unsupervised = rows.find(row =>
        row.extRefId.startsWith('GOOSE_Subscriber>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal')
      )!;
      expect(unsupervised.subtitle).to.equal('Interlocking.Input2');
      expect(unsupervised.supervisionId).to.equal(undefined);
    });

    it('flags an ExtRef with a missing or invalid mapping', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      expect(rows.find(row => row.subtitle === 'Missing IED')?.missingMapping).to.equal(true);
      expect(rows.find(row => row.subtitle === 'Missing attributes')?.invalidMapping).to.equal(true);
    });

    it('gives the supervision and the problems with a mapping in the tooltip of the row', () => {
      // the row is hovered, not the icons on it, so the tooltip says it all
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const supervised = rows.find(row => row.supervisionId)!;
      expect(supervised.tooltip).to.contain(`Supervision: ${supervised.supervisionId}`);
      expect(rows.find(row => row.invalidMapping)!.tooltip).to.contain('Invalid Mapping');
      expect(rows.find(row => row.missingMapping)!.tooltip).to.contain(
        'The subscription is valid but the element is not present'
      );
      expect(rows.find(row => !row.supervisionId && row.subscribed)!.tooltip)
        .to.not.contain('Supervision');
    });

    it('does not flag a mapping as missing or invalid for a subscribed ExtRef', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const subscribed = rows.filter(row => row.subscribed);
      expect(subscribed.every(row => !row.missingMapping && !row.invalidMapping)).to.equal(true);
    });

    it('leaves out ExtRefs for another service type', () => {
      const rows = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      expect(rows.some(row => row.extRefId.includes('someWeirdAnalogue'))).to.equal(false);
    });

    it('leaves out ExtRefs without a service type when strict', () => {
      const lenient = extRefRows(buildPublisherExtRefRows(model, settings, control, fcda));
      const strict = extRefRows(
        buildPublisherExtRefRows(
          model,
          { ...settings, strictServiceTypes: true },
          control,
          fcda
        )
      );
      expect(strict.length).to.be.lessThan(lenient.length);
    });

    it('shows messages when there is nothing in a group', () => {
      const rows = buildPublisherExtRefRows(
        model,
        settings,
        control,
        fcda,
        getSearchRegex('nothing like this')
      );
      expect(
        rows.filter(row => row.type === 'placeholder').map(row => row.type === 'placeholder' && row.text)
      ).to.deep.equal(['No subscribed inputs', 'No available inputs to subscribe']);
    });

    it('searches both groups', () => {
      const rows = extRefRows(
        buildPublisherExtRefRows(model, settings, control, fcda, getSearchRegex('Subscriber3'))
      );
      expect(rows.map(row => row.extRefId)).to.deep.equal([
        'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]'
      ]);
    });

    it('searches by supervision', () => {
      const rows = extRefRows(
        buildPublisherExtRefRows(model, settings, control, fcda, getSearchRegex('LGOS 1'))
      );
      expect(rows.map(row => row.extRefId)).to.have.members([
        'GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal[0]',
        'GOOSE_Subscriber3>>Earth_Switch> CILO 1>ESW_Thing[0]'
      ]);
    });

    it('sorts by internal address', () => {
      const rows = extRefRows(
        buildPublisherExtRefRows(model, { ...settings, sortExtRefPublisher: 1 }, control, fcda)
      ).filter(row => !row.subscribed);
      const addresses = rows.map(row => row.extRef.getAttribute('intAddr') ?? '');
      expect(addresses).to.deep.equal(
        [...addresses].sort((a, b) => a.localeCompare(b))
      );
    });

    it('gives each row a unique key', () => {
      const keys = buildPublisherExtRefRows(model, settings, control, fcda).map(r => r.key);
      expect(new Set(keys).size).to.equal(keys.length);
    });

    describe('preconfigured for other data', () => {
      it('disables those ExtRefs and leaves them out when filtered', async () => {
        const other = await loadFixture('GOOSE-2007B4-LGOS-different-preconfigured-CDCs.scd');
        const otherModel = new SubscriptionModel(other, 'GSEControl');
        const otherControl = otherModel.controls[0];
        const op = otherModel
          .fcdasOf(otherControl)
          .find(f => f.getAttribute('doName') === 'Op')!;

        const rows = extRefRows(
          buildPublisherExtRefRows(otherModel, settings, otherControl, op)
        );
        const restricted = rows.filter(row => /Restricted/.test(row.subtitle));
        expect(restricted.length).to.be.greaterThan(0);
        expect(restricted.every(row => row.disabled)).to.equal(true);

        const filtered = extRefRows(
          buildPublisherExtRefRows(
            otherModel,
            { ...settings, filterOutPreconfiguredUnmatched: true },
            otherControl,
            op
          )
        );
        expect(filtered.some(row => /Restricted/.test(row.subtitle))).to.equal(false);
      });
    });
  });

  describe('of IEDs and ExtRefs', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    const extRefsOf = (rows: ReturnType<typeof buildSubscriberRows>) =>
      rows.filter((row): row is SubscriberExtRefRow => row.type === 'extref');

    it('lists IEDs with inputs, in name order, each followed by its ExtRefs', () => {
      const rows = buildSubscriberRows(model, settings);
      expect(
        rows.filter(row => row.type === 'ied').map(row => row.type === 'ied' && row.name)
      ).to.deep.equal(['GOOSE_Subscriber', 'GOOSE_Subscriber1', 'GOOSE_Subscriber3']);
      expect(rows[0].type).to.equal('ied');
      expect(extRefsOf(rows)).to.have.length(13);
    });

    it('describes an IED', async () => {
      const sortingDoc = await loadFixture('GOOSE-2007B4-LGOS-sorting.scd');
      const rows = buildSubscriberRows(
        new SubscriptionModel(sortingDoc, 'GSEControl'),
        settings
      );
      const ied = rows.find(row => row.type === 'ied' && row.name === 'GOOSE_Subscriber1');
      expect(ied?.type === 'ied' && ied.info).to.equal(
        'GOOSE subscriber - Dummy - Taxonomist'
      );
    });

    it('describes a subscribed ExtRef', () => {
      const row = extRefsOf(buildSubscriberRows(model, settings)).find(r =>
        r.extRefId.startsWith('GOOSE_Subscriber1>>Earth_Switch> CSWI 1>Pos;CSWI1/Pos/stVal')
      )!;
      expect(row.title).to.equal('Earth_Switch / CSWI 1: Pos;CSWI1/Pos/stVal');
      expect(row.mapping.replace(/\s+/g, ' ')).to.equal(
        'GOOSE_Publisher > QB2_Disconnector / CSWI 1 Pos.stVal'
      );
      expect(row.description).to.equal('Interlocking.Input2');
      expect(row.dataDescription).to.contain('SpiderLegs');
      expect(row.source).to.equal(
        'QB2_Disconnector / LLN0 GOOSE2, GOOSE_supervision >  LGOS 1'
      );
      expect(row.subscribed).to.equal(true);
      expect(row.supervised).to.equal(true);
      expect(row.bound).to.equal(true);
    });

    it('describes an ExtRef which is not subscribed', () => {
      const row = extRefsOf(buildSubscriberRows(model, settings)).find(r =>
        r.extRefId.startsWith('GOOSE_Subscriber1>>Earth_Switch> CILO 1>Pos;CSWI1/Pos/stVal')
      )!;
      expect(row.mapping).to.equal('');
      expect(row.source).to.equal('');
      expect(row.subscribed).to.equal(false);
      expect(row.bound).to.equal(false);
    });

    it('describes ExtRefs with a missing and an invalid mapping', () => {
      const rows = extRefsOf(buildSubscriberRows(model, settings));
      const missing = rows.find(r => r.description === 'Missing IED')!;
      expect(missing.missingMapping).to.equal(true);
      expect(missing.mapping).to.contain('SomethingNotPresent');
      const invalid = rows.find(r => r.description === 'Missing attributes')!;
      expect(invalid.invalidMapping).to.equal(true);
      expect(invalid.mapping).to.equal('Invalid Mapping');
      expect(invalid.bound).to.equal(true);
    });

    it('gives the supervision and the problems with a mapping in the tooltip', () => {
      const rows = extRefsOf(buildSubscriberRows(model, settings));
      const supervised = rows.find(row => row.supervisionPath)!;
      expect(supervised.tooltip).to.contain('Supervision: ');
      expect(rows.find(row => row.invalidMapping)!.tooltip).to.contain('Invalid Mapping');
      expect(rows.find(row => row.missingMapping)!.tooltip).to.contain(
        'The subscription is valid but the element is not present'
      );
    });

    it('describes the types of a preconfigured ExtRef', () => {
      const row = extRefsOf(buildSubscriberRows(model, settings)).find(r =>
        r.extRefId.endsWith('someRestrictedExtRef[0]')
      )!;
      expect(row.tooltip).to.contain('ExtRef: CDC: DPC, Basic Type: Dbpos');
    });

    it('leaves out ExtRefs which are not for the control block type', () => {
      expect(
        extRefsOf(buildSubscriberRows(model, settings)).some(r =>
          r.extRefId.includes('someWeirdAnalogue')
        )
      ).to.equal(false);
    });

    it('leaves out bound ExtRefs and the IEDs left with none', async () => {
      const filterDoc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const filterModel = new SubscriptionModel(filterDoc, 'GSEControl');
      const rows = buildSubscriberRows(filterModel, { ...settings, filterOutBound: true });
      expect(extRefsOf(rows).every(r => !r.bound)).to.equal(true);
      expect(
        rows.filter(r => r.type === 'ied').map(r => r.type === 'ied' && r.name)
      ).to.not.include('Has_Only_Subscribed_ExtRefs');
    });

    it('leaves out ExtRefs which are not bound and the IEDs left with none', async () => {
      const filterDoc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const filterModel = new SubscriptionModel(filterDoc, 'GSEControl');
      const rows = buildSubscriberRows(filterModel, { ...settings, filterOutNotBound: true });
      expect(extRefsOf(rows).every(r => r.bound)).to.equal(true);
      expect(
        rows.filter(r => r.type === 'ied').map(r => r.type === 'ied' && r.name)
      ).to.not.include('Has_Only_Unsubscribed_ExtRefs');
    });

    it('lists nothing when bound and not bound are both left out', () => {
      expect(
        buildSubscriberRows(model, { ...settings, filterOutBound: true, filterOutNotBound: true })
      ).to.deep.equal([]);
    });

    it('leaves out ExtRefs preconfigured for quality and time attributes', async () => {
      const filterDoc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const filterModel = new SubscriptionModel(filterDoc, 'GSEControl');
      const names = (changes: Partial<typeof settings>) =>
        buildSubscriberRows(filterModel, { ...settings, ...changes })
          .filter(r => r.type === 'ied')
          .map(r => r.type === 'ied' && r.name);
      expect(names({})).to.include.members([
        'Has_Only_Preconfigured_pDAq',
        'Has_Only_Preconfigured_pDAt'
      ]);
      expect(names({ filterOutpDAq: true })).to.not.include('Has_Only_Preconfigured_pDAq');
      expect(names({ filterOutpDAq: true })).to.include('Has_Only_Preconfigured_pDAt');
      expect(names({ filterOutpDAt: true })).to.not.include('Has_Only_Preconfigured_pDAt');
    });

    it('leaves out ExtRefs without a service type when strict', async () => {
      const filterDoc = await loadFixture('GOOSE-2007B4-filter-test.scd');
      const filterModel = new SubscriptionModel(filterDoc, 'GSEControl');
      const names = (strictServiceTypes: boolean) =>
        buildSubscriberRows(filterModel, { ...settings, strictServiceTypes })
          .filter(r => r.type === 'ied')
          .map(r => r.type === 'ied' && r.name);
      expect(names(false)).to.include('Has_Only_Unsubscribed_ExtRefs_with_No_Service_Type');
      expect(names(true)).to.not.include('Has_Only_Unsubscribed_ExtRefs_with_No_Service_Type');
    });

    it('searches ExtRefs by what the list shows', () => {
      const names = (text: string) =>
        extRefsOf(buildSubscriberRows(model, settings, getSearchRegex(text))).map(
          r => r.description
        );
      expect(names('"Place to Bind 3"')).to.deep.equal(['A Place to Bind 3']);
      expect(names('Subscriber3 Thing2')).to.deep.equal(['A Place to Bind 2']);
      expect(names('SpiderLegs')).to.have.length(5);
    });

    it('lists nothing when nothing matches', () => {
      expect(
        buildSubscriberRows(model, settings, getSearchRegex('zzzz'))
      ).to.deep.equal([]);
    });

    it('sorts the ExtRefs of each IED', () => {
      const rows = buildSubscriberRows(model, { ...settings, sortExtRefSubscriber: 1 });
      let current: string[] = [];
      const groups: string[][] = [];
      rows.forEach((row) => {
        if (row.type === 'ied') {
          current = [];
          groups.push(current);
        } else {
          current.push(row.extRef.getAttribute('intAddr') ?? '');
        }
      });
      groups.forEach(group =>
        expect(group).to.deep.equal([...group].sort((a, b) => a.localeCompare(b)))
      );
    });

    it('has no rows without a document', () => {
      expect(
        buildSubscriberRows(new SubscriptionModel(undefined, 'GSEControl'), settings)
      ).to.deep.equal([]);
    });

    it('gives each row a unique key', () => {
      const keys = buildSubscriberRows(model, settings).map(r => r.key);
      expect(new Set(keys).size).to.equal(keys.length);
    });
  });

  describe('nextExtRefToSubscribe', () => {
    let doc: XMLDocument;
    let model: SubscriptionModel;

    beforeEach(async () => {
      doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      model = new SubscriptionModel(doc, 'GSEControl');
    });

    const id = (suffix: string) =>
      extRefById(doc, `GOOSE_Subscriber1>>Earth_Switch> CILO 1>${suffix}[0]`);

    it('is the next ExtRef when it is not bound', () => {
      const rows = buildSubscriberRows(model, settings);
      expect(nextExtRefToSubscribe(rows, id('Pos;CSWI1/Pos/stVal'))).to.equal(
        id('Pos;CSWI1/Pos/q')
      );
    });

    it('is nothing when the next ExtRef is bound', () => {
      const rows = buildSubscriberRows(model, settings);
      expect(nextExtRefToSubscribe(rows, id('Pos;CSWI1/Pos/q'))).to.equal(undefined);
    });

    it('moves on to the next IED', () => {
      const rows = buildSubscriberRows(model, settings);
      const last = extRefById(
        doc,
        'GOOSE_Subscriber>>Earth_Switch> CSWI 1>someRestrictedExtRef[0]'
      );
      expect(nextExtRefToSubscribe(rows, last)?.closest('IED')?.getAttribute('name')).to.equal(
        'GOOSE_Subscriber1'
      );
    });

    it('is nothing at the end of the list', () => {
      const rows = buildSubscriberRows(model, settings);
      const last = rows.filter(r => r.type === 'extref').pop()!;
      expect(last.type === 'extref' && nextExtRefToSubscribe(rows, last.extRef)).to.equal(
        undefined
      );
    });

    it('is nothing for an ExtRef which is not listed', () => {
      expect(
        nextExtRefToSubscribe(buildSubscriberRows(model, settings), doc.createElement('ExtRef'))
      ).to.equal(undefined);
    });
  });

  describe('isExtRefViewable', () => {
    it('requires an internal address', async () => {
      const doc = await loadFixture('GOOSE-2007B4-LGOS.scd');
      const model = new SubscriptionModel(doc, 'GSEControl');
      const early = mustQuery(doc, 'IED[name="GOOSE_Subscriber"] LN0 ExtRef');
      expect(isExtRefViewable(early, model, false)).to.equal(false);
    });
  });
});
