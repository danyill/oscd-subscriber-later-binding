import {
  css,
  html,
  LitElement,
  nothing,
  PropertyValues,
  SVGTemplateResult,
  TemplateResult,
} from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, queryAll, state } from 'lit/decorators.js';

import '@material/dialog';
import '@material/mwc-button';
import '@material/mwc-list/mwc-check-list-item';
import { Menu } from '@material/mwc-menu';
import { List } from '@material/mwc-list';
import { Icon } from '@material/mwc-icon';

import { styles } from './foundation/styles/styles';
import { identity } from './foundation/identities/identity';
import {
  getFcdaSubtitleValue,
  getFcdaTitleValue,
  getSubscribedExtRefElements,
  unsupportedExtRefElement,
} from './foundation/subscription/subscription';
import {
  getDescriptionAttribute,
  getNameAttribute,
} from './foundation/foundation';
import { gooseIcon, smvIcon } from './foundation/icons';
import {
  ExtRefSelectionChangedEvent,
  SubscriptionChangedEvent,
} from './foundation/events/events';

const controlTag = 'GSEControl';

type controlTag = 'SampledValueControl' | 'GSEControl';

type iconLookup = Record<controlTag, SVGTemplateResult>;

function translate(name: string): string {
  return name;
}

export default class SubscriberLaterBinding extends LitElement {
  @property({ attribute: false })
  doc!: XMLDocument;

  @property()
  controlTag: typeof controlTag = 'GSEControl'; // eventually parameterise
  @property()
  includeLaterBinding!: boolean;
  @property({ attribute: true })
  subscriberview!: boolean;

  @state()
  private extRefCounters = new Map();

  @property({ type: Boolean })
  get hideSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${
          this.includeLaterBinding ? 'later-binding' : 'data-binding'
        }-${this.controlTag}$hideSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideSubscribed(value: boolean) {
    const oldValue = this.hideSubscribed;
    localStorage.setItem(
      `fcda-binding-list-${
        this.includeLaterBinding ? 'later-binding' : 'data-binding'
      }-${this.controlTag}$hideSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideSubscribed', oldValue);
  }

  @property({ type: Boolean })
  get hideNotSubscribed(): boolean {
    return (
      localStorage.getItem(
        `fcda-binding-list-${
          this.includeLaterBinding ? 'later-binding' : 'data-binding'
        }-${this.controlTag}$hideNotSubscribed`
      ) === 'true' ?? false
    );
  }

  set hideNotSubscribed(value: boolean) {
    const oldValue = this.hideNotSubscribed;
    localStorage.setItem(
      `fcda-binding-list-${
        this.includeLaterBinding ? 'later-binding' : 'data-binding'
      }-${this.controlTag}$hideNotSubscribed`,
      `${value}`
    );
    this.requestUpdate('hideNotSubscribed', oldValue);
  }

  @query('.actions-menu') actionsMenu!: Menu;
  @query('.actions-menu-icon') actionsMenuIcon!: Icon;
  @query('.control-block-list') controlBlockList!: List;
  // The selected elements when a FCDA Line is clicked.
  private selectedControlElement: Element | undefined;
  private selectedFcdaElement: Element | undefined;
  private selectedExtRefElement: Element | undefined;

  private iconControlLookup: iconLookup = {
    SampledValueControl: smvIcon,
    GSEControl: gooseIcon,
  };

  constructor() {
    super();

    this.resetSelection = this.resetSelection.bind(this);
    parent.addEventListener('open-doc', this.resetSelection);

    const parentDiv = this.closest('.container');
    if (parentDiv) {
      this.resetExtRefCount = this.resetExtRefCount.bind(this);
      parentDiv.addEventListener('subscription-changed', this.resetExtRefCount);

      this.updateExtRefSelection = this.updateExtRefSelection.bind(this);
      parentDiv.addEventListener(
        'extref-selection-changed',
        this.updateExtRefSelection
      );
    }
  }

  private getControlElements(): Element[] {
    if (this.doc) {
      return Array.from(this.doc.querySelectorAll(`LN0 > ${this.controlTag}`));
    }
    return [];
  }

  private getFcdaElements(controlElement: Element): Element[] {
    const lnElement = controlElement.parentElement;
    if (lnElement) {
      return Array.from(
        lnElement.querySelectorAll(
          `:scope > DataSet[name=${controlElement.getAttribute(
            'datSet'
          )}] > FCDA`
        )
      );
    }
    return [];
  }

  private resetExtRefCount(event: SubscriptionChangedEvent): void {
    //   if (!this.subscriberview) {
    //     this.resetSelection();
    //   }
    //   if (event.detail.control && event.detail.fcda) {
    //     const controlBlockFcdaId = `${identity(event.detail.control)} ${identity(
    //       event.detail.fcda
    //     )}`;
    //     this.extRefCounters.delete(controlBlockFcdaId);
    //   }
  }

  private updateExtRefSelection(event: ExtRefSelectionChangedEvent): void {
    //   if (event.detail.extRefElement) {
    //     this.selectedExtRefElement = event.detail.extRefElement;
    //     this.requestUpdate();
    //   }
  }

  private getExtRefCount(
    fcdaElement: Element,
    controlElement: Element
  ): number {
    const controlBlockFcdaId = `${identity(controlElement)} ${identity(
      fcdaElement
    )}`;
    if (!this.extRefCounters.has(controlBlockFcdaId)) {
      const extRefCount = getSubscribedExtRefElements(
        <Element>this.doc.getRootNode(),
        this.controlTag,
        fcdaElement,
        controlElement!,
        this.includeLaterBinding
      ).length;
      this.extRefCounters.set(controlBlockFcdaId, extRefCount);
    }
    return this.extRefCounters.get(controlBlockFcdaId);
  }

  private openEditWizard(controlElement: Element): void {
    // const wizard = wizards[this.controlTag].edit(controlElement);
    // if (wizard) this.dispatchEvent(newWizardEvent(wizard));
  }

  private resetSelection(): void {
    this.selectedControlElement = undefined;
    this.selectedFcdaElement = undefined;
  }

  private onFcdaSelect(controlElement: Element, fcdaElement: Element) {
    this.selectedControlElement = controlElement;
    this.selectedFcdaElement = fcdaElement;
    // this.dispatchEvent(
    //   newFcdaSelectEvent(this.selectedControlElement, this.selectedFcdaElement)
    // );
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    // When a new document is loaded we will reset the Map to clear old entries.
    if (_changedProperties.has('doc')) {
      this.extRefCounters = new Map();
    }
  }

  renderFCDA(controlElement: Element, fcdaElement: Element): TemplateResult {
    const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);

    const filterClasses = {
      subitem: true,
      'show-subscribed': fcdaCount !== 0,
      'show-not-subscribed': fcdaCount === 0,
    };

    return html`<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${this.subscriberview &&
      unsupportedExtRefElement(
        this.selectedExtRefElement,
        fcdaElement,
        controlElement
      )}
      twoline
      class="${classMap(filterClasses)}"
      @click=${() => this.onFcdaSelect(controlElement, fcdaElement)}
      value="${identity(controlElement)}
             ${identity(fcdaElement)}"
    >
      <span>${getFcdaTitleValue(fcdaElement)}</span>
      <span slot="secondary">${getFcdaSubtitleValue(fcdaElement)}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? html`<span slot="meta">${fcdaCount}</span>` : nothing}
    </mwc-list-item>`;
  }

  updateBaseFilterState(): void {
    !this.hideSubscribed
      ? this.controlBlockList!.classList.add('show-subscribed')
      : this.controlBlockList!.classList.remove('show-subscribed');
    !this.hideNotSubscribed
      ? this.controlBlockList!.classList.add('show-not-subscribed')
      : this.controlBlockList!.classList.remove('show-not-subscribed');
  }

  protected firstUpdated(): void {
    this.actionsMenu.anchor = <HTMLElement>this.actionsMenuIcon;

    this.actionsMenu.addEventListener('closed', () => {
      this.hideSubscribed = !(<Set<number>>this.actionsMenu.index).has(0);
      this.hideNotSubscribed = !(<Set<number>>this.actionsMenu.index).has(1);
      this.updateBaseFilterState();
    });

    this.updateBaseFilterState();
  }

  renderTitle(): TemplateResult {
    const menuClasses = {
      'filter-off': this.hideSubscribed || this.hideNotSubscribed,
    };
    return html`<h1>
      ${translate(`subscription.${this.controlTag}.controlBlockList.title`)}
      ${!this.subscriberview && this.includeLaterBinding
        ? html`<mwc-icon-button
            class="switch-view"
            icon="alt_route"
            title="${translate(
              `subscription.laterBinding.switchControlBlockView`
            )}"
            @click=${() =>
              this.dispatchEvent(
                new Event('change-view', { bubbles: true, composed: true })
              )}
          ></mwc-icon-button>`
        : nothing}
      <mwc-icon-button
        class="actions-menu-icon ${classMap(menuClasses)}"
        icon="filter_list"
        @click=${() => {
          if (!this.actionsMenu.open) this.actionsMenu.show();
          else this.actionsMenu.close();
        }}
      ></mwc-icon-button>
      <mwc-menu
        multi
        class="actions-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="filter-subscribed"
          left
          ?selected=${!this.hideSubscribed}
        >
          <span>${translate('subscription.subscriber.subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-not-subscribed"
          left
          ?selected=${!this.hideNotSubscribed}
        >
          <span>${translate('subscription.subscriber.notSubscribed')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1> `;
  }

  renderControls(controlElements: Element[]): TemplateResult {
    const filteredListClasses = {
      'control-block-list': true,
      'show-subscribed': !this.hideSubscribed,
      'show-not-subscribed': !this.hideNotSubscribed,
    };
    return html`<filtered-list
      class="${classMap(filteredListClasses)}"
      activatable
    >
      ${controlElements
        .filter(controlElement => this.getFcdaElements(controlElement).length)
        .map(controlElement => {
          const fcdaElements = this.getFcdaElements(controlElement);
          const showSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) !== 0
          );
          const showNotSubscribed = fcdaElements.some(
            fcda => this.getExtRefCount(fcda, controlElement) === 0
          );

          const filterClasses = {
            control: true,
            'show-subscribed': showSubscribed,
            'show-not-subscribed': showNotSubscribed,
          };

          return html`
            <mwc-list-item
              noninteractive
              class="${classMap(filterClasses)}"
              graphic="icon"
              twoline
              hasMeta
              value="${identity(controlElement)}${fcdaElements
                .map(
                  fcdaElement => `
                        ${getFcdaTitleValue(fcdaElement)}
                        ${getFcdaSubtitleValue(fcdaElement)}
                        ${identity(fcdaElement)}`
                )
                .join('')}"
            >
              <mwc-icon-button
                slot="meta"
                icon="edit"
                class="interactive"
                @click=${() => this.openEditWizard(controlElement)}
              ></mwc-icon-button>
              <span
                >${getNameAttribute(controlElement)}
                ${getDescriptionAttribute(controlElement)
                  ? html`${getDescriptionAttribute(controlElement)}`
                  : nothing}</span
              >
              <span slot="secondary">${identity(controlElement)}</span>
              <mwc-icon slot="graphic"
                >${this.iconControlLookup[this.controlTag]}</mwc-icon
              >
            </mwc-list-item>
            <li divider role="separator"></li>
            ${fcdaElements.map(fcdaElement =>
              this.renderFCDA(controlElement, fcdaElement)
            )}
          `;
        })}
    </filtered-list>`;
  }

  render(): TemplateResult {
    const controlElements = this.getControlElements();
    return html`<section tabindex="0">
      ${this.renderTitle()}
      ${controlElements
        ? this.renderControls(controlElements)
        : html`<h3>${translate('subscription.subscriber.notSubscribed')}</h3> `}
    </section>`;
  }

  static styles = css`
    ${styles}

    h3 {
      margin: 4px 8px 16px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    section {
      position: relative;
    }

    .actions-menu-icon {
      float: right;
    }

    .actions-menu-icon.filter-off {
      color: var(--secondary);
      background-color: var(--mdc-theme-background);
    }

    /* remove all control blocks if no filters */
    filtered-list.control-block-list:not(.show-subscribed, .show-not-subscribed)
      mwc-list-item {
      display: none;
    }

    /* remove control blocks taking care to respect multiple conditions */
    filtered-list.control-block-list.show-not-subscribed:not(.show-subscribed)
      mwc-list-item.control.show-subscribed:not(.show-not-subscribed) {
      display: none;
    }

    filtered-list.control-block-list.show-subscribed:not(.show-not-subscribed)
      mwc-list-item.control.show-not-subscribed:not(.show-subscribed) {
      display: none;
    }

    /* remove fcdas if not part of filter */
    filtered-list.control-block-list:not(.show-not-subscribed)
      mwc-list-item.subitem.show-not-subscribed {
      display: none;
    }

    filtered-list.control-block-list:not(.show-subscribed)
      mwc-list-item.subitem.show-subscribed {
      display: none;
    }

    .interactive {
      pointer-events: all;
    }

    .subitem {
      padding-left: var(--mdc-list-side-padding, 16px);
    }
  `;
}
