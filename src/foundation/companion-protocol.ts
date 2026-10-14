import type { EditV2 } from '@openscd/oscd-api';

/**
 * Events between this plugin and its companion plugins, which subscribe or
 * unsubscribe further ExtRefs for a manufacturer, e.g. the other phases of a
 * sampled value stream.
 *
 * Companions do not watch the host's edit events. This plugin tells them what
 * it did and dispatches the edits they make, so that they are part of the same
 * undoable edit. Companions are not affected if the host's edit events change.
 *
 * All events are dispatched on `window`, as the plugins can be anywhere in the
 * host and either may be loaded first. Companions keep an identical copy of
 * this file until it is published as a package.
 */
export const companionProtocolVersion = 1;

export const subscriptionChangeEventName = 'oscd-lb-subscription-change';

export const companionRequestEventName = 'oscd-lb-companion-request';

export const companionAnnounceEventName = 'oscd-lb-companion-announce';

export const companionWithdrawEventName = 'oscd-lb-companion-withdraw';

/** The settings of this plugin which companions follow. */
export interface CompanionSettings {
  ignoreSupervision: boolean;
  checkOnlyPreferredBasicType: boolean;
}

export interface ApplyOptions {
  /** A title for the undoable edit, e.g. "SEL subscribe". */
  title?: string;
}

/**
 * Sent after this plugin has subscribed or unsubscribed an ExtRef, and only
 * if external plugins are allowed. The edit is already applied.
 */
export interface SubscriptionChangeDetail {
  version: number;
  action: 'subscribe' | 'unsubscribe';
  extRef: Element;
  /** The FCDA subscribed to, or for an unsubscription the one it was. */
  fcda?: Element;
  /** The control block of the FCDA, found in the same way. */
  controlBlock?: Element;
  settings: CompanionSettings;
  /**
   * Applies edits as part of the same user action. They are dispatched at once,
   * so the document is up to date when the call returns.
   */
  apply: (edits: EditV2[], options?: ApplyOptions) => void;
}

/** Sent by this plugin when it is connected, so companions announce themselves. */
export interface CompanionRequestDetail {
  version: number;
}

/**
 * Sent by a companion when it is connected, when asked, and when it is enabled
 * or disabled.
 */
export interface CompanionAnnounceDetail {
  version: number;
  identity: string;
  /** A short name to show the user, e.g. "SEL". */
  name: string;
  enabled: boolean;
}

/** Sent by a companion when it is disconnected. */
export interface CompanionWithdrawDetail {
  version: number;
  identity: string;
}

export type SubscriptionChangeEvent = CustomEvent<SubscriptionChangeDetail>;

export type CompanionRequestEvent = CustomEvent<CompanionRequestDetail>;

export type CompanionAnnounceEvent = CustomEvent<CompanionAnnounceDetail>;

export type CompanionWithdrawEvent = CustomEvent<CompanionWithdrawDetail>;

export function newSubscriptionChangeEvent(
  detail: Omit<SubscriptionChangeDetail, 'version'>
): SubscriptionChangeEvent {
  return new CustomEvent(subscriptionChangeEventName, {
    detail: { version: companionProtocolVersion, ...detail }
  });
}

export function newCompanionRequestEvent(): CompanionRequestEvent {
  return new CustomEvent(companionRequestEventName, {
    detail: { version: companionProtocolVersion }
  });
}

export function newCompanionAnnounceEvent(
  detail: Omit<CompanionAnnounceDetail, 'version'>
): CompanionAnnounceEvent {
  return new CustomEvent(companionAnnounceEventName, {
    detail: { version: companionProtocolVersion, ...detail }
  });
}

export function newCompanionWithdrawEvent(
  detail: Omit<CompanionWithdrawDetail, 'version'>
): CompanionWithdrawEvent {
  return new CustomEvent(companionWithdrawEventName, {
    detail: { version: companionProtocolVersion, ...detail }
  });
}

declare global {
  interface WindowEventMap {
    ['oscd-lb-subscription-change']: SubscriptionChangeEvent;
    ['oscd-lb-companion-request']: CompanionRequestEvent;
    ['oscd-lb-companion-announce']: CompanionAnnounceEvent;
    ['oscd-lb-companion-withdraw']: CompanionWithdrawEvent;
  }
}
