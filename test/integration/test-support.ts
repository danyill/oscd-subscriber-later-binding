import { ListItemBase } from '@material/mwc-list/mwc-list-item-base';
import { OscdFilteredList } from '@openscd/oscd-filtered-list';

import { setViewport, resetMouse, sendMouse } from '@web/test-runner-commands';

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

export async function setViewPort(): Promise<void> {
  // target 1920x1080 screen-resolution, giving typical browser size of...
  await setViewport({ width: 1745, height: 845 });
}

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

/**
 * Avoids mouse being focussed or hovering over items during snapshots
 * As this appears to make screenshots inconsistent between browsers and environments
 */
export async function resetMouseState(): Promise<void> {
  await timeout(50);
  await resetMouse();
  await sendMouse({ type: 'click', position: [0, 0] });
}
