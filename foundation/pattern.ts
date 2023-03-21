const typeBase = {
  IP: '([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
  OSI: '[0-9A-F]+',
  OSId: '[0-9]+',
  OSIAPi: '[0-9\u002C]+',
  MAC: '([0-9A-F]{2}-){5}[0-9A-F]{2}',
  APPID: '[0-9A-F]{4}',
  VLANp: '[0-7]',
  VLANid: '[0-9A-F]{3}',
  port: '0|([1-9][0-9]{0,3})|([1-5][0-9]{4,4})|(6[0-4][0-9]{3,3})|(65[0-4][0-9]{2,2})|(655[0-2][0-9])|(6553[0-5])',
  IPv6: '([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}',
  IPv6sub: '/[1-9]|/[1-9][0-9]|/1[0-1][0-9]|/12[0-7]',
};

/** Patterns from IEC 61850-6 for all `P` elements */
export const typePattern: Partial<Record<string, string>> = {
  IP: typeBase.IP,
  'IP-SUBNET': typeBase.IP,
  'IP-GATEWAY': typeBase.IP,
  'OSI-TSEL': typeBase.OSI,
  'OSI-SSEL': typeBase.OSI,
  'OSI-PSEL': typeBase.OSI,
  'OSI-AP-Title': typeBase.OSIAPi,
  'OSI-AP-Invoke': typeBase.OSId,
  'OSI-AE-Qualifier': typeBase.OSId,
  'OSI-AE-Invoke': typeBase.OSId,
  'MAC-Address': typeBase.MAC,
  APPID: typeBase.APPID,
  'VLAN-ID': typeBase.VLANid,
  'VLAN-PRIORITY': typeBase.VLANp,
  'OSI-NSAP': typeBase.OSI,
  'SNTP-Port': typeBase.port,
  'MMS-Port': typeBase.port,
  DNSName: '[^ ]*',
  'UDP-Port': typeBase.port,
  'TCP-Port': typeBase.port,
  'C37-118-IP-Port':
    '102[5-9]|10[3-9][0-9]|1[1-9][0-9][0-9]|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]',
  IPv6: typeBase.IPv6,
  'IPv6-SUBNET': typeBase.IPv6sub,
  'IPv6-GATEWAY': typeBase.IPv6,
  IPv6FlowLabel: '[0-9a-fA-F]{1,5}',
  IPv6ClassOfTraffic: '[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]',
  'IPv6-IGMPv3Src': typeBase.IPv6,
  'IP-IGMPv3Sr': typeBase.IP,
  'IP-ClassOfTraffic': typeBase.OSI,
};

/** Whether `P` element is required within `Address` */
export const typeNullable: Partial<Record<string, boolean>> = {
  IP: false,
  'IP-SUBNET': false,
  'IP-GATEWAY': true,
  'OSI-TSEL': true,
  'OSI-SSEL': true,
  'OSI-PSEL': true,
  'OSI-AP-Title': true,
  'OSI-AP-Invoke': true,
  'OSI-AE-Qualifier': true,
  'OSI-AE-Invoke': true,
  'OSI-NSAP': true,
  'MAC-Address': false,
  APPID: false,
  'VLAN-ID': true,
  'VLAN-PRIORITY': true,
  'SNTP-Port': true,
  'MMS-Port': true,
  DNSName: true,
  'UDP-Port': true,
  'TCP-Port': true,
  'C37-118-IP-Port': true,
  IPv6: true,
  'IPv6-SUBNET': true,
  'IPv6-GATEWAY': true,
  IPv6FlowLabel: true,
  IPv6ClassOfTraffic: true,
  'IPv6-IGMPv3Src': true,
  'IP-IGMPv3Sr': true,
  'IP-ClassOfTraffic': true,
};

const nameStartChar =
  '[:_A-Za-z]|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]' +
  '|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]' +
  '|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]';
const nameChar = `${nameStartChar}|[.0-9-]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040]`;
const name = `${nameStartChar}(${nameChar})*`;
const nmToken = `(${nameChar})+`;

export const patterns = {
  string:
    '([\u0009-\u000A]|[\u000D]|[\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]' +
    '|[\uE000-\uFFFD])*',
  normalizedString:
    '([\u0020-\u007E]|[\u0085]|[\u00A0-\uD7FF]|[\uE000-\uFFFD])*',
  name,
  nmToken,
  names: `${name}( ${name})*`,
  nmTokens: `${nmToken}( ${nmToken})*`,
  decimal: '[+-]?[0-9]+(([.][0-9]*)?|([.][0-9]+))',
  unsigned: '[+]?[0-9]+(([.][0-9]*)?|([.][0-9]+))',
  alphanumericFirstUpperCase: '[A-Z][0-9,A-Z,a-z]*',
  asciName: '[A-Za-z][0-9,A-Z,a-z_]*',
  lnClass: '[A-Z]{4,4}',
  tRestrName1stL: '[a-z][0-9A-Za-z]*',
  abstractDataAttributeName:
    '((T)|(Test)|(Check)|(SIUnit)|(Oper)|(SBO)|(SBOw)|(Cancel)|[a-z][0-9A-Za-z]*)',
  cdc:
    '(SPS)|(DPS)|(INS)|(ENS)|(ACT)|(ACD)|(SEC)|(BCR)|(HST)|(VSS)|(MV)|(CMV)|(SAV)|' +
    '(WYE)|(DEL)|(SEQ)|(HMV)|(HWYE)|(HDEL)|(SPC)|(DPC)|(INC)|(ENC)|(BSC)|(ISC)|(APC)|(BAC)|' +
    '(SPG)|(ING)|(ENG)|(ORG)|(TSG)|(CUG)|(VSG)|(ASG)|(CURVE)|(CSG)|(DPL)|(LPL)|(CSD)|(CST)|' +
    '(BTS)|(UTS)|(LTS)|(GTS)|(MTS)|(NTS)|(STS)|(CTS)|(OTS)|(VSD)',
};

export const maxLength = {
  cbName: 32,
  abstracDaName: 60,
};
