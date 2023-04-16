import { isSCLTag } from '../utils/scldata.js';
import { tags } from './scltags.js';

/** @returns a string uniquely identifying `e` in its document, or NaN if `e`
 * is unidentifiable. */
export function identity(e: Element | null): string | number {
  if (e === null) return NaN;
  if (e.closest('Private')) return NaN;
  const tag = e.tagName;

  if (isSCLTag(tag)) return tags[tag].identity(e);

  return NaN;
}

export function hitemIdentity(e: Element): string {
  return `${e.getAttribute('version')}\t${e.getAttribute('revision')}`;
}

export function terminalIdentity(e: Element): string {
  return `${identity(e.parentElement)}>${e.getAttribute('connectivityNode')}`;
}

export function lNodeIdentity(e: Element): string {
  const [iedName, ldInst, prefix, lnClass, lnInst, lnType] = [
    'iedName',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'lnType',
  ].map(name => e.getAttribute(name));
  if (iedName === 'None')
    return `${identity(e.parentElement)}>(${lnClass} ${lnType})`;
  return `${iedName} ${ldInst || '(Client)'}/${prefix ?? ''} ${lnClass} ${
    lnInst ?? ''
  }`;
}

export function kDCIdentity(e: Element): string {
  return `${identity(e.parentElement)}>${e.getAttribute(
    'iedName'
  )} ${e.getAttribute('apName')}`;
}

export function associationIdentity(e: Element): string {
  return `${identity(e.parentElement)}>${
    e.getAttribute('associationID') ?? ''
  }`;
}

export function lDeviceIdentity(e: Element): string {
  return `${identity(e.closest('IED')!)}>>${e.getAttribute('inst')}`;
}

export function iEDNameIdentity(e: Element): string {
  const iedName = e.textContent;
  const [apRef, ldInst, prefix, lnClass, lnInst] = [
    'apRef',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
  ].map(name => e.getAttribute(name));
  return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${
    ldInst || ''
  }/${prefix ?? ''} ${lnClass ?? ''} ${lnInst ?? ''}`;
}

export function fCDAIdentity(e: Element): string {
  const [ldInst, prefix, lnClass, lnInst, doName, daName, fc, ix] = [
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'doName',
    'daName',
    'fc',
    'ix',
  ].map(name => e.getAttribute(name));
  const dataPath = `${ldInst}/${prefix ?? ''} ${lnClass} ${
    lnInst ?? ''
  }.${doName} ${daName || ''}`;
  return `${identity(e.parentElement)}>${dataPath} (${fc}${
    ix ? ` [${ix}]` : ''
  })`;
}

export function extRefIdentity(e: Element): string | number {
  if (!e.parentElement) return NaN;
  const parentIdentity = identity(e.parentElement);
  const iedName = e.getAttribute('iedName');
  const intAddr = e.getAttribute('intAddr');
  const intAddrIndex = Array.from(
    e.parentElement.querySelectorAll(`ExtRef[intAddr="${intAddr}"]`)
  ).indexOf(e);
  if (intAddr) return `${parentIdentity}>${intAddr}[${intAddrIndex}]`;
  const [
    ldInst,
    prefix,
    lnClass,
    lnInst,
    doName,
    daName,
    serviceType,
    srcLDInst,
    srcPrefix,
    srcLNClass,
    srcLNInst,
    srcCBName,
  ] = [
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
    'doName',
    'daName',
    'serviceType',
    'srcLDInst',
    'srcPrefix',
    'srcLNClass',
    'srcLNInst',
    'srcCBName',
  ].map(name => e.getAttribute(name));

  const cbPath = srcCBName
    ? `${serviceType}:${srcCBName} ${srcLDInst ?? ''}/${srcPrefix ?? ''} ${
        srcLNClass ?? ''
      } ${srcLNInst ?? ''}`
    : '';
  const dataPath = `${iedName} ${ldInst}/${prefix ?? ''} ${lnClass} ${
    lnInst ?? ''
  } ${doName} ${daName || ''}`;
  return `${parentIdentity}>${cbPath ? `${cbPath} ` : ''}${dataPath}${
    intAddr ? `@${intAddr}` : ''
  }`;
}

export function lNIdentity(e: Element): string {
  const [prefix, lnClass, inst] = ['prefix', 'lnClass', 'inst'].map(name =>
    e.getAttribute(name)
  );
  return `${identity(e.parentElement)}>${prefix ?? ''} ${lnClass} ${inst}`;
}

export function clientLNIdentity(e: Element): string {
  const [apRef, iedName, ldInst, prefix, lnClass, lnInst] = [
    'apRef',
    'iedName',
    'ldInst',
    'prefix',
    'lnClass',
    'lnInst',
  ].map(name => e.getAttribute(name));
  return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${ldInst}/${
    prefix ?? ''
  } ${lnClass} ${lnInst}`;
}

export function ixNamingIdentity(e: Element): string {
  const [name, ix] = ['name', 'ix'].map(naming => e.getAttribute(naming));
  return `${identity(e.parentElement)}>${name}${ix ? `[${ix}]` : ''}`;
}

export function valIdentity(e: Element): string | number {
  if (!e.parentElement) return NaN;
  const sGroup = e.getAttribute('sGroup');
  const index = Array.from(e.parentElement.children)
    .filter(child => child.getAttribute('sGroup') === sGroup)
    .findIndex(child => child.isSameNode(e));
  return `${identity(e.parentElement)}>${sGroup ? `${sGroup}.` : ''} ${index}`;
}

export function connectedAPIdentity(e: Element): string {
  const [iedName, apName] = ['iedName', 'apName'].map(name =>
    e.getAttribute(name)
  );
  return `${iedName} ${apName}`;
}

export function controlBlockIdentity(e: Element): string {
  const [ldInst, cbName] = ['ldInst', 'cbName'].map(name =>
    e.getAttribute(name)
  );
  return `${ldInst} ${cbName}`;
}

export function physConnIdentity(e: Element): string | number {
  if (!e.parentElement) return NaN;
  if (!e.parentElement.querySelector('PhysConn[type="RedConn"]')) return NaN;
  const pcType = e.getAttribute('type');
  if (
    e.parentElement.children.length > 1 &&
    pcType !== 'Connection' &&
    pcType !== 'RedConn'
  )
    return NaN;
  return `${identity(e.parentElement)}>${pcType}`;
}

export function pIdentity(e: Element): string | number {
  if (!e.parentElement) return NaN;
  const eParent = e.parentElement;
  const eType = e.getAttribute('type');
  if (eParent.tagName === 'PhysConn')
    return `${identity(e.parentElement)}>${eType}`;
  const index = Array.from(e.parentElement.children)
    .filter(child => child.getAttribute('type') === eType)
    .findIndex(child => child.isSameNode(e));
  return `${identity(e.parentElement)}>${eType} [${index}]`;
}

export function enumValIdentity(e: Element): string {
  return `${identity(e.parentElement)}>${e.getAttribute('ord')}`;
}

export function protNsIdentity(e: Element): string {
  return `${identity(e.parentElement)}>${e.getAttribute('type') || '8-MMS'}\t${
    e.textContent
  }`;
}

export function sCLIdentity(): string {
  return '';
}

export function namingIdentity(e: Element): string {
  return e.parentElement!.tagName === 'SCL'
    ? e.getAttribute('name')!
    : `${identity(e.parentElement)}>${e.getAttribute('name')}`;
}

export function singletonIdentity(e: Element): string {
  return identity(e.parentElement).toString();
}

export function idNamingIdentity(e: Element): string {
  return `#${e.id}`;
}
