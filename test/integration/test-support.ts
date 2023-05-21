import { ListItemBase } from '@material/mwc-list/mwc-list-item-base';
import { OscdFilteredList } from '@openscd/oscd-filtered-list';

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
): ListItemBase | null {
  return listElement.querySelector(
    `mwc-list-item.fcda[data-control="${controlIdentity}"][data-fcda="${fcdaIdentity}"]`
  );
}

export function getExtRefItem(
  listElement: OscdFilteredList,
  extRefId: string
): ListItemBase | null {
  return listElement.querySelector(
    `mwc-list-item.extref[data-extref="${extRefId}"]`
  );
}
