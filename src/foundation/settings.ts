import { isControlTag } from './control-tag.js';
import type { ControlTag } from './control-tag.js';
import { ExtRefSortOrder, FcdaSortOrder } from './sort.js';

/** Where the settings are kept, a single JSON value for this plugin. */
export const settingsStorageKey = 'oscd-editor-subscriber-later-binding';

/**
 * Settings which are kept between sessions. The names are the names of the
 * properties of the plugin, which external plugins and specs rely on.
 */
export interface SubscriberSettings {
  subscriberView: boolean;
  controlTag: ControlTag;

  filterOutSubscribed: boolean;
  filterOutNotSubscribed: boolean;
  filterOutDataObjects: boolean;
  filterOutQuality: boolean;
  filterOutPreconfiguredUnmatched: boolean;

  filterOutBound: boolean;
  filterOutNotBound: boolean;
  strictServiceTypes: boolean;
  filterOutpDAq: boolean;
  filterOutpDAt: boolean;

  autoIncrement: boolean;
  ignoreSupervision: boolean;
  allowExternalPlugins: boolean;
  checkOnlyPreferredBasicType: boolean;
  readOnlyView: boolean;

  sortFcda: FcdaSortOrder;
  sortExtRefPublisher: ExtRefSortOrder;
  sortExtRefSubscriber: ExtRefSortOrder;
}

export const defaultSettings: Readonly<SubscriberSettings> = {
  subscriberView: false,
  controlTag: 'GSEControl',

  filterOutSubscribed: false,
  filterOutNotSubscribed: false,
  filterOutDataObjects: false,
  filterOutQuality: false,
  filterOutPreconfiguredUnmatched: false,

  filterOutBound: false,
  filterOutNotBound: false,
  strictServiceTypes: false,
  filterOutpDAq: false,
  filterOutpDAt: false,

  autoIncrement: true,
  ignoreSupervision: false,
  allowExternalPlugins: true,
  checkOnlyPreferredBasicType: false,
  readOnlyView: false,

  sortFcda: FcdaSortOrder.DataModel,
  sortExtRefPublisher: ExtRefSortOrder.DataModel,
  sortExtRefSubscriber: ExtRefSortOrder.DataModel
};

export const settingsKeys = Object.keys(
  defaultSettings
) as (keyof SubscriberSettings)[];

/** Number of values of each sort order enumeration, for validating input. */
const sortOrderCounts: Partial<Record<keyof SubscriberSettings, number>> = {
  sortFcda: Object.keys(FcdaSortOrder).length / 2,
  sortExtRefPublisher: Object.keys(ExtRefSortOrder).length / 2,
  sortExtRefSubscriber: Object.keys(ExtRefSortOrder).length / 2
};

function isValidSetting(key: keyof SubscriberSettings, value: unknown): boolean {
  if (key === 'controlTag') {
    return isControlTag(value);
  }
  const sortOrderCount = sortOrderCounts[key];
  if (sortOrderCount !== undefined) {
    return Number.isInteger(value) && (value as number) >= 0
      ? (value as number) < sortOrderCount
      : false;
  }
  return typeof value === typeof defaultSettings[key];
}

/**
 * Reads settings from their stored text. Anything missing, unknown or of the
 * wrong type is replaced by its default, including when the text is not JSON,
 * so that stored settings can never stop the plugin from loading.
 * @param stored - the stored text, or null when nothing is stored.
 * @returns a complete set of settings.
 */
export function parseSettings(stored: string | null): SubscriberSettings {
  const settings: SubscriberSettings = { ...defaultSettings };
  if (stored === null) {
    return settings;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return settings;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return settings;
  }

  const values = parsed as Record<string, unknown>;
  const writable = settings as unknown as Record<string, unknown>;
  settingsKeys.forEach((key) => {
    if (isValidSetting(key, values[key])) {
      writable[key] = values[key];
    }
  });
  return settings;
}

/** The text to store for the given settings. */
export function serializeSettings(settings: SubscriberSettings): string {
  return JSON.stringify(
    Object.fromEntries(settingsKeys.map(key => [key, settings[key]]))
  );
}
