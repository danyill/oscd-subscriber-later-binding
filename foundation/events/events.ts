export interface SubscriptionChangedDetail {
  control: Element | undefined;
  fcda: Element | undefined;
}
export type SubscriptionChangedEvent = CustomEvent<SubscriptionChangedDetail>;
export function newSubscriptionChangedEvent(
  control: Element | undefined,
  fcda: Element | undefined,
  eventInitDict?: CustomEventInit<SubscriptionChangedDetail>
): SubscriptionChangedEvent {
  return new CustomEvent<SubscriptionChangedDetail>('subscription-changed', {
    bubbles: true,
    composed: true,
    ...eventInitDict,
    detail: { control, fcda, ...eventInitDict?.detail },
  });
}

export interface ExtRefSelectionChangedDetail {
  extRefElement: Element | undefined;
}
export type ExtRefSelectionChangedEvent =
  CustomEvent<ExtRefSelectionChangedDetail>;
export function newExtRefSelectionChangedEvent(
  extRefElement: Element | undefined,
  eventInitDict?: CustomEventInit<ExtRefSelectionChangedDetail>
): ExtRefSelectionChangedEvent {
  return new CustomEvent<ExtRefSelectionChangedDetail>(
    'extref-selection-changed',
    {
      bubbles: true,
      composed: true,
      ...eventInitDict,
      detail: { extRefElement, ...eventInitDict?.detail },
    }
  );
}

declare global {
  interface ElementEventMap {
    ['subscription-changed']: SubscriptionChangedEvent;
    ['extref-selection-changed']: ExtRefSelectionChangedEvent;
  }
}
