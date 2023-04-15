import { LitElement, PropertyValues, TemplateResult } from 'lit';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-menu';
import '@material/mwc-icon-button-toggle';
import type { Icon } from '@material/mwc-icon';
import type { IconButtonToggle } from '@material/mwc-icon-button-toggle';
import type { ListItem } from '@material/mwc-list/mwc-list-item';
import type { Menu } from '@material/mwc-menu';
import './foundation/components/oscd-filtered-list.js';
import type { OscdFilteredList } from './foundation/components/oscd-filtered-list.js';
declare type controlTagType = 'SampledValueControl' | 'GSEControl';
export default class SubscriberLaterBinding extends LitElement {
    doc: XMLDocument;
    controlTag: controlTagType;
    private extRefCounters;
    get subscriberView(): boolean;
    set subscriberView(val: boolean);
    get hideSubscribed(): boolean;
    set hideSubscribed(value: boolean);
    get hideNotSubscribed(): boolean;
    set hideNotSubscribed(value: boolean);
    get notAutoIncrement(): boolean;
    set notAutoIncrement(value: boolean);
    get hideBound(): boolean;
    set hideBound(value: boolean);
    get hideNotBound(): boolean;
    set hideNotBound(value: boolean);
    switchViewUI?: IconButtonToggle;
    filterMenuFcdaUI: Menu;
    filterMenuFcdaButtonUI: Icon;
    filterMenuExtRefUI: Menu;
    filterMenuExtRefButtonUI: Icon;
    listContainerUI: HTMLDivElement;
    settingsMenuExtRefUI: Menu;
    settingsMenuExtRefButtonUI: Icon;
    fcdaListUI: OscdFilteredList;
    extRefListPublisherUI?: OscdFilteredList;
    publisherExtRefSectionUI?: HTMLElement;
    extRefListSubscriberUI?: OscdFilteredList;
    extRefListSubscriberSelectedUI?: ListItem;
    private iconControlLookup;
    private supervisionData;
    currentSelectedControlElement: Element | undefined;
    currentSelectedFcdaElement: Element | undefined;
    currentIedElement: Element | undefined;
    currentSelectedExtRefElement: Element | undefined;
    serviceTypeLookup: {
        GSEControl: string;
        SampledValueControl: string;
    };
    private getControlElements;
    private getExtRefCount;
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
    getAvailableExtRefElements(): Element[];
    private reCreateSupervisionCache;
    private getExtRefElementsByIED;
    private getCachedSupervision;
    private updateExtRefFilter;
    private updateFcdaFilter;
    private updateView;
    protected firstUpdated(): void;
    private renderSubscribedExtRefElement;
    renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult;
    renderFCDAListTitle(): TemplateResult;
    renderControlList(controlElements: Element[]): TemplateResult;
    private renderPublisherViewSubscribedExtRefs;
    private renderPublisherViewAvailableExtRefs;
    private renderSubscriberViewExtRefListTitle;
    private renderSubscriberViewExtRef;
    private renderSubscriberViewExtRefs;
    renderExtRefs(): TemplateResult;
    renderPublisherFCDAs(): TemplateResult;
    renderControlTypeSelector(): TemplateResult;
    render(): TemplateResult;
    static styles: import("lit").CSSResult;
}
export {};
