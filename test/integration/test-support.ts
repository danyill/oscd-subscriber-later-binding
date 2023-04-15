import { OscdFilteredList } from '../../foundation/components/oscd-filtered-list.js';

export function getFcdaItem(
  listElement: OscdFilteredList,
  controlIdentity: string,
  fcdaIdentity: string
): HTMLElement | null {
  return listElement.querySelector(
    `mwc-list-item.fcda[data-control="${controlIdentity}"][data-fcda="${fcdaIdentity}"]`
  );
}

export function getFcdaItemCount(
  listElement: OscdFilteredList,
  controlIdentity: string,
  fcdaIdentity: string
): string | null | undefined {
  const element = getFcdaItem(listElement, controlIdentity, fcdaIdentity);
  return element?.querySelector('.fcda span[slot="meta"]')?.textContent;
}

export function getExtRefItem(
  listElement: OscdFilteredList,
  extRefId: string
): HTMLElement | null {
  return listElement.querySelector(
    `mwc-list-item.extref[data-extref="${extRefId}"]`
  );
}

// export function getSubscribedExtRefsCount(
//     listElement: ExtRefLaterBindingListSubscriber,
//     iedName: string
//   ): number {
//     return (
//       Array.from(
//         listElement.shadowRoot!.querySelectorAll(
//           'mwc-list-item.extref.show-bound'
//         )
//       ).filter(listItem => listItem.getAttribute('value')!.startsWith(iedName))
//         .length || 0
//     );
//   }
