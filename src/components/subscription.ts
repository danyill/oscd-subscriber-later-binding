import { css } from 'lit';
import { msg, str } from '@lit/localize';

import type { CompanionEntry } from '../foundation/companions.js';
import type { SubscriberSettings } from '../foundation/settings.js';
import type { OptionItem, SelectItem } from './menu-button.js';

/** An FCDA, with its control block, was chosen in the list. */
export interface FcdaSelectDetail {
  control: Element;
  fcda: Element;
}
export type FcdaSelectEvent = CustomEvent<FcdaSelectDetail>;

export function newFcdaSelectEvent(
  control: Element,
  fcda: Element
): FcdaSelectEvent {
  return new CustomEvent('fcda-select', {
    bubbles: true,
    composed: true,
    detail: { control, fcda }
  });
}

/** An ExtRef was chosen in a list. */
export interface ExtRefSelectDetail {
  extRef: Element;
}
export type ExtRefSelectEvent = CustomEvent<ExtRefSelectDetail>;

export function newExtRefSelectEvent(extRef: Element): ExtRefSelectEvent {
  return new CustomEvent('extref-select', {
    bubbles: true,
    composed: true,
    detail: { extRef }
  });
}

/** The user changed some settings in a menu. */
export interface SettingsChangeDetail {
  changes: Partial<SubscriberSettings>;
}
export type SettingsChangeEvent = CustomEvent<SettingsChangeDetail>;

export function newSettingsChangeEvent(
  changes: Partial<SubscriberSettings>
): SettingsChangeEvent {
  return new CustomEvent('settings-change', {
    bubbles: true,
    composed: true,
    detail: { changes }
  });
}

declare global {
  interface ElementEventMap {
    'fcda-select': FcdaSelectEvent;
    'extref-select': ExtRefSelectEvent;
    'settings-change': SettingsChangeEvent;
  }
}

/** Styles shared by the lists: the title bar with its buttons, and messages. */
/**
 * Explains which companion plugins are active, shown under the setting which
 * allows external plugins.
 * @param names - the names of the active companion plugins.
 */
export function companionsText(names: string[]): string {
  if (names.length === 0) {
    return msg('No active companion plugins');
  }
  const list = names.join(', ');
  return msg(str`${names.length} active: ${list}`);
}

/**
 * The count of active companion plugins shown on the settings button, or
 * nothing if there are none.
 * @param names - the names of the active companion plugins.
 */
export function companionsBadge(names: string[]): string | undefined {
  return names.length > 0 ? `${names.length}` : undefined;
}

/**
 * The tooltip of the count of active companion plugins, which explains it.
 * @param names - the names of the active companion plugins.
 */
export function companionsBadgeTitle(names: string[]): string {
  const list = names.join(', ');
  return msg(
    str`Active companion plugins, which subscribe further inputs for some manufacturers: ${list}`
  );
}

/**
 * The settings items to turn each companion plugin on or off, which explain
 * what it does.
 * @param companions - the companion plugins.
 * @param disabledCompanions - the identities turned off in the settings.
 */
export function companionItems(
  companions: CompanionEntry[],
  disabledCompanions: readonly string[]
): OptionItem[] {
  return companions.map(({ identity, name, description, features }) => ({
    headline: msg(str`${name} companion plugin`),
    supportingText: [description, ...(features ?? [])]
      .filter(text => text !== undefined && text !== '')
      .join('. '),
    selected: !disabledCompanions.includes(identity),
    defaultSelected: true
  }));
}

/**
 * The companion plugins turned off once the settings are applied. Companions
 * which are not loaded now keep their setting.
 * @param companions - the companion plugins listed in the settings.
 * @param chosen - the settings items of the companions as applied.
 * @param disabledCompanions - the identities turned off before.
 */
export function disabledCompanionsAfter(
  companions: CompanionEntry[],
  chosen: SelectItem[],
  disabledCompanions: readonly string[]
): string[] {
  const listed = companions.map(({ identity }) => identity);
  return [
    ...disabledCompanions.filter(identity => !listed.includes(identity)),
    ...companions
      .filter((_, index) => !chosen[index]?.selected)
      .map(({ identity }) => identity)
  ];
}

export const sharedStyles = css`
  :host {
    display: block;
    min-width: 0;
  }

  section {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .list-title {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 48px;
    margin: 0;
    padding: 4px 8px;
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--md-sys-color-on-surface);
  }

  .list-title .title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-title .title.selected {
    color: var(--md-sys-color-primary);
  }

  .read-only-icon {
    --md-icon-size: 20px;
    vertical-align: middle;
    margin-inline-start: 4px;
  }

  .option-button {
    flex: 0 0 auto;
    color: var(--md-sys-color-on-surface);
  }

  /* a filter or sort which differs from its default is shown in the accent
     colour, so that an off-nominal view is obvious */
  .option-button.filter-off,
  .option-button.filter-off oscd-icon {
    color: var(--md-sys-color-primary);
  }

  h3 {
    margin: 16px;
    font-size: 1rem;
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
  }
`;
