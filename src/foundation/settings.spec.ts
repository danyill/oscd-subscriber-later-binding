import { expect } from '@open-wc/testing';

import {
  defaultSettings,
  parseSettings,
  serializeSettings,
  settingsKeys
} from './settings.js';
import type { SubscriberSettings } from './settings.js';

describe('settings', () => {
  describe('defaults', () => {
    it('start in the publisher view with GOOSE', () => {
      expect(defaultSettings.subscriberView).to.equal(false);
      expect(defaultSettings.controlTag).to.equal('GSEControl');
    });

    it('show everything', () => {
      const filters: (keyof SubscriberSettings)[] = [
        'filterOutSubscribed',
        'filterOutNotSubscribed',
        'filterOutDataObjects',
        'filterOutQuality',
        'filterOutPreconfiguredUnmatched',
        'filterOutBound',
        'filterOutNotBound',
        'strictServiceTypes',
        'filterOutpDAq',
        'filterOutpDAt'
      ];
      expect(filters.map(key => defaultSettings[key])).to.deep.equal(
        new Array(filters.length).fill(false)
      );
    });

    it('auto-increment, change supervisions and allow external plugins', () => {
      expect(defaultSettings.autoIncrement).to.equal(true);
      expect(defaultSettings.ignoreSupervision).to.equal(false);
      expect(defaultSettings.allowExternalPlugins).to.equal(true);
    });

    it('are not read-only and use data model order', () => {
      expect(defaultSettings.readOnlyView).to.equal(false);
      expect(defaultSettings.sortFcda).to.equal(0);
      expect(defaultSettings.sortExtRefPublisher).to.equal(0);
      expect(defaultSettings.sortExtRefSubscriber).to.equal(0);
    });

    it('lists every setting once', () => {
      expect(settingsKeys).to.have.length(new Set(settingsKeys).size);
      expect(settingsKeys).to.have.length(20);
    });
  });

  describe('parseSettings', () => {
    it('returns the defaults when nothing is stored', () => {
      expect(parseSettings(null)).to.deep.equal(defaultSettings);
    });

    it('returns a copy, not the defaults themselves', () => {
      expect(parseSettings(null)).to.not.equal(defaultSettings);
    });

    ['', '{not json', 'null', '42', '"text"', '[1,2]', 'true'].forEach((text) => {
      it(`returns the defaults for stored text ${JSON.stringify(text)}`, () => {
        expect(parseSettings(text)).to.deep.equal(defaultSettings);
      });
    });

    it('reads every stored value', () => {
      const stored: SubscriberSettings = {
        subscriberView: true,
        controlTag: 'SampledValueControl',
        filterOutSubscribed: true,
        filterOutNotSubscribed: true,
        filterOutDataObjects: true,
        filterOutQuality: true,
        filterOutPreconfiguredUnmatched: true,
        filterOutBound: true,
        filterOutNotBound: true,
        strictServiceTypes: true,
        filterOutpDAq: true,
        filterOutpDAt: true,
        autoIncrement: false,
        ignoreSupervision: true,
        allowExternalPlugins: false,
        checkOnlyPreferredBasicType: true,
        readOnlyView: true,
        sortFcda: 4,
        sortExtRefPublisher: 2,
        sortExtRefSubscriber: 3
      };
      expect(parseSettings(JSON.stringify(stored))).to.deep.equal(stored);
    });

    it('fills in settings which are missing', () => {
      expect(parseSettings('{"readOnlyView":true}')).to.deep.equal({
        ...defaultSettings,
        readOnlyView: true
      });
    });

    it('ignores unknown settings', () => {
      expect(parseSettings('{"somethingElse":true}')).to.deep.equal(
        defaultSettings
      );
    });

    it('ignores values of the wrong type', () => {
      expect(
        parseSettings(
          '{"autoIncrement":"no","readOnlyView":1,"sortFcda":"2","controlTag":true}'
        )
      ).to.deep.equal(defaultSettings);
    });

    it('ignores a control type which does not exist', () => {
      expect(parseSettings('{"controlTag":"ReportControl"}').controlTag).to.equal(
        'GSEControl'
      );
    });

    [
      ['sortFcda', 5],
      ['sortFcda', -1],
      ['sortFcda', 1.5],
      ['sortExtRefPublisher', 4],
      ['sortExtRefSubscriber', 99]
    ].forEach(([key, value]) => {
      it(`ignores ${key} of ${value}, which is not a sort order`, () => {
        expect(
          parseSettings(JSON.stringify({ [key]: value }))[
            key as keyof SubscriberSettings
          ]
        ).to.equal(0);
      });
    });

    it('reads the names used by the plugin properties for every filter', () => {
      // these were stored under one name and read under another before
      const settings = parseSettings(
        '{"filterOutNotSubscribed":true,"filterOutPreconfiguredUnmatched":true}'
      );
      expect(settings.filterOutNotSubscribed).to.equal(true);
      expect(settings.filterOutPreconfiguredUnmatched).to.equal(true);
    });
  });

  describe('serializeSettings', () => {
    it('round trips every setting', () => {
      const settings: SubscriberSettings = {
        ...defaultSettings,
        subscriberView: true,
        controlTag: 'SampledValueControl',
        filterOutNotSubscribed: true,
        filterOutPreconfiguredUnmatched: true,
        sortFcda: 3
      };
      expect(parseSettings(serializeSettings(settings))).to.deep.equal(settings);
    });

    it('stores only the settings', () => {
      const text = serializeSettings({
        ...defaultSettings,
        somethingElse: 1
      } as SubscriberSettings);
      expect(Object.keys(JSON.parse(text))).to.deep.equal([...settingsKeys]);
    });
  });
});
