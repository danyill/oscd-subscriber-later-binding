import { css } from 'lit';

import type { SubscriberSettings } from '../foundation/settings.js';

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

  .option-button.filter-off {
    color: var(--md-sys-color-primary);
  }

  h3 {
    margin: 16px;
    font-size: 1rem;
    font-weight: 400;
    color: var(--md-sys-color-on-surface-variant);
  }
`;
