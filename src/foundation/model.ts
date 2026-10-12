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
 * Data type information kept while the same document is edited. It is slow to
 * work out and an edit seldom changes it, so each entry keeps the attributes it
 * was worked out from, and the data type templates are checked by size.
 */
export class TypeInfoCache {
  readonly fcdas = new WeakMap<Element, { key: string; info: FcdaInfo }>();

  readonly extRefs = new WeakMap<Element, { key: string; info: ExtRefInfo }>();
}

/** All of an element's attributes as one string. */
function attributesKey(element: Element): string {
  return element
    .getAttributeNames()
    .map(name => `${name}=${element.getAttribute(name)}`)
    .join('\u0000');
}

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

  private readonly supervisions = new Map<string, Element>();

  private readonly identities = new WeakMap<Element, string>();

  private readonly memos = new Map<string, WeakMap<Element, unknown>>();

  private fcdaIndex?: Map<string, Element[]>;

  private laterBinding?: { extRef: Element; ied: Element | null }[];

  private iedExtRefs = new WeakMap<Element, Element[]>();

  /** Control blocks in document order, found once. */
  readonly controls: Element[];

  /** Changes when the data type templates do, which makes cached types stale. */
  private readonly templatesKey: string;

  constructor(
    readonly doc: XMLDocument | undefined,
    readonly controlTag: ControlTag,
    private readonly typeCache = new TypeInfoCache()
  ) {
    this.serviceType = serviceTypes[controlTag];
    this.templatesKey = `${
      doc?.querySelector('DataTypeTemplates')?.getElementsByTagName('*').length
    }`;
    this.controls = doc
      ? Array.from(doc.querySelectorAll(`LN0 > ${controlTag}`))
      : [];
    if (doc) {
      this.countSubscriptions();
      this.indexSupervisions();
    }
  }

  /** The identity of an element, which is slow to work out, kept for reuse. */
  identityOf(element: Element): string {
    let id = this.identities.get(element);
    if (id === undefined) {
      id = `${identity(element)}`;
      this.identities.set(element, id);
    }
    return id;
  }

  /**
   * What is worked out about an element, e.g. its row in a list, kept until the
   * document changes and the model is replaced.
   * @param kind - what is kept, so that an element can have several.
   * @param element - what it is about.
   * @param make - works it out the first time.
   * @returns the kept value.
   */
  memo<T>(kind: string, element: Element, make: () => T): T {
    let kept = this.memos.get(kind);
    if (kept === undefined) {
      kept = new WeakMap();
      this.memos.set(kind, kept);
    }
    if (!kept.has(element)) {
      kept.set(element, make());
    }
    return kept.get(element) as T;
  }

  /**
   * The FCDAs an ExtRef refers to, found with an index of all the FCDAs so that
   * the document is searched once and not once for each ExtRef.
   */
  fcdasOfExtRef(extRef: Element): Element[] {
    if (!this.doc || extRef.tagName !== 'ExtRef' || extRef.closest('Private')) {
      return [];
    }
    if (this.fcdaIndex === undefined) {
      this.fcdaIndex = new Map();
      this.doc.querySelectorAll('FCDA').forEach((fcda) => {
        const ied = fcda.closest('IED');
        if (!ied || fcda.closest('Private')) {
          return;
        }
        const key = this.referenceKey(ied.getAttribute('name'), fcda);
        const found = this.fcdaIndex!.get(key);
        if (found) {
          found.push(fcda);
        } else {
          this.fcdaIndex!.set(key, [fcda]);
        }
      });
    }
    return (
      this.fcdaIndex.get(
        this.referenceKey(extRef.getAttribute('iedName'), extRef)
      ) ?? []
    );
  }

  private referenceKey(iedName: string | null, element: Element): string {
    return [iedName, ...dataAttributes.map(name => element.getAttribute(name) ?? '')]
      .join('\u0000');
  }

  /** Every ExtRef with an internal address and its IED, found once. */
  laterBindingExtRefs(): { extRef: Element; ied: Element | null }[] {
    if (this.laterBinding === undefined) {
      this.laterBinding = this.doc
        ? Array.from(this.doc.querySelectorAll('ExtRef[intAddr]')).map(
          extRef => ({ extRef, ied: extRef.closest('IED') })
        )
        : [];
    }
    return this.laterBinding;
  }

  /** The ExtRefs of an IED which have an internal address, found once. */
  extRefsOfIed(ied: Element): Element[] {
    let found = this.iedExtRefs.get(ied);
    if (found === undefined) {
      found = Array.from(
        ied.querySelectorAll(
          `:scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef,
           :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef`
        )
      );
      this.iedExtRefs.set(ied, found);
    }
    return found;
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
    const key = `${this.templatesKey} ${attributesKey(fcda)}`;
    let kept = this.typeCache.fcdas.get(fcda);
    if (kept === undefined || kept.key !== key) {
      kept = {
        key,
        info: { spec: fcdaBaseTypes(fcda), desc: getFcdaInstDesc(fcda) }
      };
      this.typeCache.fcdas.set(fcda, kept);
    }
    return kept.info;
  }

  extRefInfo(extRef: Element): ExtRefInfo {
    const key = `${this.templatesKey} ${attributesKey(extRef)}`;
    let kept = this.typeCache.extRefs.get(extRef);
    if (kept === undefined || kept.key !== key) {
      kept = { key, info: { spec: extRefTypeRestrictions(extRef) } };
      this.typeCache.extRefs.set(extRef, kept);
    }
    return kept.info;
  }

  /** The supervision logical node of the control block an ExtRef subscribes to. */
  supervisionOf(extRef: Element): Element | undefined {
    const iedName = extRef.closest('IED')?.getAttribute('name');
    return this.supervisions.get(`${iedName} ${getCbReference(extRef)}`);
  }

  private countKey(control: Element, fcda: Element): string {
    return `${this.identityOf(control)} ${this.identityOf(fcda)}`;
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
        const id = this.identityOf(dataSet);
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
        const controls = controlsOfDataSet.get(this.identityOf(dataSet));
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
