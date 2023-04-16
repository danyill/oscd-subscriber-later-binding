import { SCLTag } from '../utils/scldata.js';
import {
  associationIdentity,
  clientLNIdentity,
  connectedAPIdentity,
  controlBlockIdentity,
  enumValIdentity,
  extRefIdentity,
  fCDAIdentity,
  hitemIdentity,
  idNamingIdentity,
  iEDNameIdentity,
  ixNamingIdentity,
  kDCIdentity,
  lDeviceIdentity,
  lNIdentity,
  lNodeIdentity,
  namingIdentity,
  physConnIdentity,
  pIdentity,
  protNsIdentity,
  sCLIdentity,
  singletonIdentity,
  terminalIdentity,
  valIdentity,
} from './identity.js';
import {
  associationSelector,
  clientLNSelector,
  connectedAPSelector,
  controlBlockSelector,
  enumValSelector,
  extRefSelector,
  fCDASelector,
  hitemSelector,
  idNamingSelector,
  iEDNameSelector,
  ixNamingSelector,
  kDCSelector,
  lDeviceSelector,
  lNodeSelector,
  lNSelector,
  namingSelector,
  physConnSelector,
  protNsSelector,
  pSelector,
  sCLSelector,
  singletonSelector,
  terminalSelector,
  valSelector,
  voidSelector,
} from './selector.js';

type IdentityFunction = (e: Element) => string | number;
type SelectorFunction = (tagName: SCLTag, identity: string) => string;

export const tags: Record<
  SCLTag,
  {
    identity: IdentityFunction;
    selector: SelectorFunction;
  }
> = {
  AccessControl: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  AccessPoint: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Address: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Association: {
    identity: associationIdentity,
    selector: associationSelector,
  },
  Authentication: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  BDA: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  BitRate: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Bay: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  ClientLN: {
    identity: clientLNIdentity,
    selector: clientLNSelector,
  },
  ClientServices: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  CommProt: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Communication: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConductingEquipment: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  ConfDataSet: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfLdName: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfLNs: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfLogControl: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfReportControl: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfSG: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConfSigRef: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ConnectedAP: {
    identity: connectedAPIdentity,
    selector: connectedAPSelector,
  },
  ConnectivityNode: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  DA: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  DAI: {
    identity: ixNamingIdentity,
    selector: ixNamingSelector,
  },
  DAType: {
    identity: idNamingIdentity,
    selector: idNamingSelector,
  },
  DO: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  DOI: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  DOType: {
    identity: idNamingIdentity,
    selector: idNamingSelector,
  },
  DataObjectDirectory: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  DataSet: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  DataSetDirectory: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  DataTypeTemplates: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  DynAssociation: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  DynDataSet: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  EnumType: {
    identity: idNamingIdentity,
    selector: idNamingSelector,
  },
  EnumVal: {
    identity: enumValIdentity,
    selector: enumValSelector,
  },
  EqFunction: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  EqSubFunction: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  ExtRef: {
    identity: extRefIdentity,
    selector: extRefSelector,
  },
  FCDA: {
    identity: fCDAIdentity,
    selector: fCDASelector,
  },
  FileHandling: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Function: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  GeneralEquipment: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  GetCBValues: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GetDataObjectDefinition: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GetDataSetValue: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GetDirectory: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GOOSE: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GOOSESecurity: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  GSE: {
    identity: controlBlockIdentity,
    selector: controlBlockSelector,
  },
  GSEDir: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GSEControl: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  GSESettings: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  GSSE: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Header: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  History: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Hitem: {
    identity: hitemIdentity,
    selector: hitemSelector,
  },
  IED: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  IEDName: {
    identity: iEDNameIdentity,
    selector: iEDNameSelector,
  },
  Inputs: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  IssuerName: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  KDC: {
    identity: kDCIdentity,
    selector: kDCSelector,
  },
  LDevice: {
    identity: lDeviceIdentity,
    selector: lDeviceSelector,
  },
  LN: {
    identity: lNIdentity,
    selector: lNSelector,
  },
  LN0: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  LNode: {
    identity: lNodeIdentity,
    selector: lNodeSelector,
  },
  LNodeType: {
    identity: idNamingIdentity,
    selector: idNamingSelector,
  },
  Line: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Log: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  LogControl: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  LogSettings: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  MaxTime: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  McSecurity: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  MinTime: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  NeutralPoint: {
    identity: terminalIdentity,
    selector: terminalSelector,
  },
  OptFields: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  P: {
    identity: pIdentity,
    selector: pSelector,
  },
  PhysConn: {
    identity: physConnIdentity,
    selector: physConnSelector,
  },
  PowerTransformer: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Private: {
    identity: () => NaN,
    selector: () => voidSelector,
  },
  Process: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  ProtNs: {
    identity: protNsIdentity,
    selector: protNsSelector,
  },
  Protocol: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ReadWrite: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  RedProt: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ReportControl: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  ReportSettings: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  RptEnabled: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SamplesPerSec: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SampledValueControl: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  SecPerSamples: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SCL: {
    identity: sCLIdentity,
    selector: sCLSelector,
  },
  SDI: {
    identity: ixNamingIdentity,
    selector: ixNamingSelector,
  },
  SDO: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Server: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  ServerAt: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Services: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SetDataSetValue: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SettingControl: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SettingGroups: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SGEdit: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SmpRate: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SMV: {
    identity: controlBlockIdentity,
    selector: controlBlockSelector,
  },
  SmvOpts: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SMVsc: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SMVSecurity: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  SMVSettings: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  SubEquipment: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  SubFunction: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  SubNetwork: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Subject: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Substation: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  SupSubscription: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  TapChanger: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  Terminal: {
    identity: terminalIdentity,
    selector: terminalSelector,
  },
  Text: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  TimerActivatedControl: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  TimeSyncProt: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  TransformerWinding: {
    identity: namingIdentity,
    selector: namingSelector,
  },
  TrgOps: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Val: {
    identity: valIdentity,
    selector: valSelector,
  },
  ValueHandling: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  Voltage: {
    identity: singletonIdentity,
    selector: singletonSelector,
  },
  VoltageLevel: {
    identity: namingIdentity,
    selector: namingSelector,
  },
};
