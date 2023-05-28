import { LitElement, PropertyValues, TemplateResult } from 'lit';
import '@material/mwc-icon';
import '@material/mwc-icon-button-toggle';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-menu';
import '@openscd/oscd-filtered-list';
import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { Menu } from '@material/mwc-menu';
import type { OscdFilteredList } from '@openscd/oscd-filtered-list';
declare type controlTagType = 'SampledValueControl' | 'GSEControl';
declare type fcdaInfo = {
    spec: {
        cdc: string | null;
        bType: string | null;
    };
    desc: string[];
};
declare type extRefInfo = {
    spec: {
        cdc: string | null;
        bType: string | null;
    };
};
export default class SubscriberLaterBinding extends LitElement {
    doc: XMLDocument;
    docName: string;
    editCount: number;
    controlTag: controlTagType;
    subscriberView: boolean;
    hideSubscribed: boolean;
    hideNotSubscribed: boolean;
    hideDataObjects: boolean;
    hidePreconfiguredNotMatching: boolean;
    notAutoIncrement: boolean;
    notChangeSupervisionLNs: boolean;
    hideBound: boolean;
    hideNotBound: boolean;
    strictServiceTypes: boolean;
    switchViewUI?: IconButtonToggle;
    switchControlTypeUI?: IconButtonToggle;
    filterMenuFcdaUI: Menu;
    filterMenuFcdaButtonUI: Icon;
    filterMenuExtRefSubscriberUI: Menu;
    filterMenuExtRefPublisherUI: Menu;
    filterMenuExtRefSubscriberButtonUI: Icon;
    filterMenuExtrefPublisherButtonUI: Icon;
    listContainerUI: HTMLDivElement;
    settingsMenuExtRefSubscriberUI: Menu;
    settingsMenuExtRefPublisherUI: Menu;
    settingsMenuExtRefSubscriberButtonUI: Icon;
    settingsMenuExtRefPublisherButtonUI: Icon;
    fcdaListUI: OscdFilteredList;
    extRefListPublisherUI?: OscdFilteredList;
    publisherExtRefSectionUI?: HTMLElement;
    extRefListSubscriberUI?: OscdFilteredList;
    extRefListSubscriberSelectedUI?: ListItem;
    fcdaListSelectedUI?: ListItem;
    currentSelectedControlElement: Element | undefined;
    currentSelectedFcdaElement: Element | undefined;
    currentIedElement: Element | undefined;
    currentSelectedExtRefElement: Element | undefined;
    controlBlockFcdaInfo: Map<string, number>;
    fcdaInfo: Map<string, fcdaInfo>;
    extRefInfo: Map<string, extRefInfo>;
    private supervisionData;
    protected storeSettings(): void;
    protected restoreSettings(): void;
    private getControlElements;
    private getExtRefCount;
    private getFcdaInfo;
    private getExtRefInfo;
    protected updated(_changedProperties: PropertyValues): void;
    /**
     * Unsubscribing means removing a list of attributes from the ExtRef Element.
     *
     * @param extRef - The Ext Ref Element to clean from attributes.
     */
    private unsubscribe;
    /**
     * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
     *
     * @param extRef - The ExtRef Element to add the attributes to.
     */
    private subscribe;
    getSubscribedExtRefElements(): Element[];
    private isExtRefViewable;
    getAvailableExtRefElements(): Element[];
    private reCreateSupervisionCache;
    private getExtRefElementsByIED;
    private getCachedSupervision;
    private updateView;
    connectedCallback(): void;
    protected firstUpdated(): Promise<void>;
    private renderSubscribedExtRefElement;
    /**
     * Check data consistency of source `FCDA` and sink `ExtRef` based on
     * `ExtRef`'s `pLN`, `pDO`, `pDA` and `pServT` attributes.
     * Consistent means `CDC` and `bType` of both ExtRef and FCDA is equal.
     * In case
     *  - `pLN`, `pDO`, `pDA` or `pServT` attributes are not present, allow subscribing
     *  - no CDC or bType can be extracted, do not allow subscribing
     *
     * @param extRef - The `ExtRef` Element to check against
     * @param fcdaElement - The SCL `FCDA` element within the DataSet
     * @param controlElement - The control element associated with the `FCDA` `DataSet`
     */
    nonMatchingExtRefElement(extRef: Element | undefined, fcdaElement: Element | undefined, controlElement: Element | undefined): boolean;
    private isFcdaDisabled;
    renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult;
    renderFCDAListTitle(): TemplateResult;
    renderControlList(controlElements: Element[]): TemplateResult;
    private renderPublisherViewSubscribedExtRefs;
    private renderPublisherViewAvailableExtRefs;
    private renderPublisherViewExtRefListTitle;
    private renderSubscriberViewExtRefListTitle;
    private renderSubscriberViewExtRef;
    private renderSubscriberViewExtRefs;
    renderExtRefs(): TemplateResult;
    renderControlTypeSelector(): TemplateResult;
    renderPublisherFCDAs(): TemplateResult;
    renderSwitchView(): TemplateResult;
    render(): TemplateResult;
    static styles: import("lit").CSSResult;
}
export {};
