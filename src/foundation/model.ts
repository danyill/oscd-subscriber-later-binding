import {
  extRefTypeRestrictions,
  fcdaBaseTypes,
  identity,
  matchSrcAttributes
} from '@openscd/scl-lib';

import { serviceTypes, supervisionClasses } from './control-tag.js';
import type { ControlTag, ServiceType } from './control-tag.js';
import {
  getCbReference,
  getFcdaElements,
  getSubscribedExtRefElements,
  getUsedSupervisionInstances,
  isSubscribed
} from './subscription/subscription.js';
import { getFcdaInstDesc } from './tDataSet/getFcdaInstDesc.js';
import type { fcdaDesc } from './tDataSet/getFcdaInstDesc.js';

/** The common data class and basic type of an FCDA or of an ExtRef's `pDO`. */
export type DataSpec = { cdc: string; bType?: string | undefined } | undefined;

export type FcdaInfo = { spec: DataSpec; desc: fcdaDesc };

export type ExtRefInfo = { spec: DataSpec };

const dataAttributes = [
  'ldInst',
  'prefix',
  'lnClass',
  'lnInst',
  'doName',
  'daName'
];

/**
 * What the plugin needs to know about one document for one type of control
 * block: how often each FCDA is subscribed, the data type of FCDAs and ExtRefs
 * and which supervision logical node supervises which subscription.
 *
 * It describes the document as it is when it is created, so a new model is built
 * whenever the document changes. All of it is found in a pass over the document
 * when the model is created or, for the type information, the first time it is
 * asked for.
 */
export class SubscriptionModel {
  readonly serviceType: ServiceType;

  private readonly counts = new Map<string, number>();

  private readonly fcdaInfos = new Map<string, FcdaInfo>();

  private readonly extRefInfos = new Map<string, ExtRefInfo>();

  private readonly supervisions = new Map<string, Element>();

  /** Control blocks in document order, found once. */
  readonly controls: Element[];

  constructor(
    readonly doc: XMLDocument | undefined,
    readonly controlTag: ControlTag
  ) {
    this.serviceType = serviceTypes[controlTag];
    this.controls = doc
      ? Array.from(doc.querySelectorAll(`LN0 > ${controlTag}`))
      : [];
    if (doc) {
      this.countSubscriptions();
      this.indexSupervisions();
    }
  }

  /** The FCDAs of the data set of a control block. */
  fcdasOf(control: Element): Element[] {
    return getFcdaElements(control);
  }

  /** How many later binding ExtRefs subscribe to an FCDA of a control block. */
  extRefCount(fcda: Element, control: Element): number {
    const id = this.countKey(control, fcda);
    let count = this.counts.get(id);
    if (count === undefined) {
      count = getSubscribedExtRefElements(
        this.doc!.getRootNode() as Element,
        fcda,
        control,
        true
      ).length;
      this.counts.set(id, count);
    }
    return count;
  }

  fcdaInfo(fcda: Element): FcdaInfo {
    const id = `${identity(fcda)}`;
    let info = this.fcdaInfos.get(id);
    if (info === undefined) {
      info = { spec: fcdaBaseTypes(fcda), desc: getFcdaInstDesc(fcda) };
      this.fcdaInfos.set(id, info);
    }
    return info;
  }

  extRefInfo(extRef: Element): ExtRefInfo {
    const id = `${identity(extRef)}`;
    let info = this.extRefInfos.get(id);
    if (info === undefined) {
      info = { spec: extRefTypeRestrictions(extRef) };
      this.extRefInfos.set(id, info);
    }
    return info;
  }

  /** The supervision logical node of the control block an ExtRef subscribes to. */
  supervisionOf(extRef: Element): Element | undefined {
    const iedName = extRef.closest('IED')?.getAttribute('name');
    return this.supervisions.get(`${iedName} ${getCbReference(extRef)}`);
  }

  private countKey(control: Element, fcda: Element): string {
    return `${identity(control)} ${identity(fcda)}`;
  }

  /**
   * Counts subscriptions for every FCDA of every control block in one pass,
   * which is much quicker than searching for each FCDA when documents are large.
   */
  private countSubscriptions(): void {
    const doc = this.doc!;

    const controlsOfDataSet = new Map<string, Element[]>();
    this.controls.forEach((control) => {
      const dataSet = control.parentElement!.querySelector(
        `DataSet[name="${control.getAttribute('datSet')}"]`
      );
      if (dataSet) {
        const id = `${identity(dataSet)}`;
        controlsOfDataSet.set(id, [...(controlsOfDataSet.get(id) ?? []), control]);
      }
    });

    const controlsOfFcda = new Map<Element, { key: string; control: Element }[]>();
    const fcdaByReference = new Map<string, Element>();

    doc
      .querySelectorAll(
        `:root > IED > AccessPoint > Server > LDevice > LN > DataSet,
         :root > IED > AccessPoint > Server > LDevice > LN0 > DataSet`
      )
      .forEach((dataSet) => {
        const controls = controlsOfDataSet.get(`${identity(dataSet)}`);
        if (!controls) {
          return;
        }
        controls.forEach((control) => {
          dataSet.querySelectorAll('FCDA').forEach((fcda) => {
            const key = this.countKey(control, fcda);
            controlsOfFcda.set(fcda, [
              ...(controlsOfFcda.get(fcda) ?? []),
              { key, control }
            ]);
            this.counts.set(key, 0);

            const iedName = fcda.closest('IED')!.getAttribute('name');
            const cbName = control.getAttribute('name');
            fcdaByReference.set(
              `${iedName} ${cbName} ${dataAttributes
                .map(attr => fcda.getAttribute(attr))
                .join(' ')}`,
              fcda
            );
          });
        });
      });

    Array.from(
      doc.querySelectorAll(
        `:root > IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef,
         :root > IED > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
      )
    )
      .filter(extRef => isSubscribed(extRef) && extRef.hasAttribute('intAddr'))
      .forEach((extRef) => {
        const reference = [
          extRef.getAttribute('iedName'),
          extRef.getAttribute('srcCBName'),
          ...dataAttributes.map(attr => extRef.getAttribute(attr))
        ].join(' ');
        const fcda = fcdaByReference.get(reference);
        if (!fcda) {
          return;
        }
        controlsOfFcda.get(fcda)!.forEach(({ key, control }) => {
          if (matchSrcAttributes(extRef, control)) {
            this.counts.set(key, this.counts.get(key)! + 1);
          }
        });
      });
  }

  private indexSupervisions(): void {
    const referenceSelector =
      supervisionClasses[this.controlTag] === 'LGOS'
        ? 'DOI[name="GoCBRef"]'
        : 'DOI[name="SvCBRef"]';

    getUsedSupervisionInstances(this.doc!, this.serviceType).forEach(
      (supervision) => {
        const reference = supervision.querySelector(
          `${referenceSelector}>DAI[name="setSrcRef"]>Val`
        );
        const iedName = supervision.closest('IED')?.getAttribute('name');
        if (reference && iedName !== undefined) {
          this.supervisions.set(`${iedName} ${reference.textContent}`, supervision);
        }
      }
    );
  }
}
