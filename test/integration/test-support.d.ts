import { ListItemBase } from '@material/mwc-list/mwc-list-item-base';
import { OscdFilteredList } from '@openscd/oscd-filtered-list';
export declare function setViewPort(): Promise<void>;
export declare function midEl(element: Element): [number, number];
export declare function getFcdaItem(listElement: OscdFilteredList, controlIdentity: string, fcdaIdentity: string): ListItemBase | null;
export declare function getExtRefItem(listElement: OscdFilteredList, extRefId: string): ListItemBase | null;
/**
 * Avoids mouse being focussed or hovering over items during snapshots
 * As this appears to make screenshots inconsistent between browsers and environments
 */
export declare function resetMouseState(): Promise<void>;
