import { subscribe, unsubscribe } from '@openscd/scl-lib';
import type { EditV2 } from '@openscd/oscd-api';

import type { SubscriberSettings } from './settings.js';
import {
  isPartiallyConfigured,
  isSubscribed
} from './subscription/subscription.js';

export type ActionSettings = Pick<
  SubscriberSettings,
  'ignoreSupervision' | 'checkOnlyPreferredBasicType'
>;

/**
 * The edits which remove an ExtRef's subscription. Supervisions are removed
 * with it unless the setting to leave them alone is on.
 * @param extRef - the ExtRef with a later binding to unsubscribe.
 * @param settings - whether supervisions are changed.
 * @returns the edits to dispatch.
 */
export function unsubscribeEdits(
  extRef: Element,
  settings: Pick<ActionSettings, 'ignoreSupervision'>
): EditV2[] {
  return unsubscribe([extRef], { ignoreSupervision: settings.ignoreSupervision });
}

/**
 * Whether an ExtRef must be unsubscribed before it can be subscribed to
 * something else: it has a subscription, or part of one.
 * @param extRef - the ExtRef to subscribe.
 */
export function needsUnsubscribe(extRef: Element): boolean {
  return isSubscribed(extRef) || isPartiallyConfigured(extRef);
}

/**
 * The edits which subscribe an ExtRef to an FCDA of a control block. They are
 * worked out from the document as it is, so an old subscription is removed and
 * that edit applied first.
 * @param extRef - the ExtRef with an internal address to subscribe.
 * @param control - the control block of the FCDA.
 * @param fcda - the FCDA to subscribe to.
 * @param settings - whether supervisions are added and how types are checked.
 * @returns the edits to dispatch.
 */
export function subscribeEdits(
  extRef: Element,
  control: Element,
  fcda: Element,
  settings: ActionSettings
): EditV2[] {
  return subscribe(
    { sink: extRef, source: { fcda, controlBlock: control } },
    {
      force: false,
      ignoreSupervision: settings.ignoreSupervision,
      checkOnlyBType: settings.checkOnlyPreferredBasicType
    }
  );
}
