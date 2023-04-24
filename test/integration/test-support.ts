import { OscdFilteredList } from '../../foundation/components/oscd-filtered-list.js';

// getFcdaItem
// getExtRefItem
// getSwitchView
// getSwitchType
// getFcdaSearchField
// getExtRefSearchField
// getFcdaFilterField
// getExtRefFilterField
// getExtRefSettingsField
// getUndoButton
// getRedoButton
// getFilterFieldListItem
// getSettingsFieldListItem

export function midEl(element: Element): [number, number] {
  const { x, y, width, height } = element.getBoundingClientRect();

  return [
    Math.floor(x + window.pageXOffset + width / 2),
    Math.floor(y + window.pageYOffset + height / 2),
  ];
}

export function getFcdaItem(
  listElement: OscdFilteredList,
  controlIdentity: string,
  fcdaIdentity: string
): HTMLElement | null {
  return listElement.querySelector(
    `mwc-list-item.fcda[data-control="${controlIdentity}"][data-fcda="${fcdaIdentity}"]`
  );
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
