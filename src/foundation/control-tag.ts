/** The two kinds of control block this plugin binds subscriptions for. */
export type ControlTag = 'GSEControl' | 'SampledValueControl';

export type ServiceType = 'GOOSE' | 'SMV';

export const controlTags: readonly ControlTag[] = [
  'GSEControl',
  'SampledValueControl'
];

/** The `serviceType` of an ExtRef subscribing to a control block type. */
export const serviceTypes: Record<ControlTag, ServiceType> = {
  GSEControl: 'GOOSE',
  SampledValueControl: 'SMV'
};

/** The logical node class supervising subscriptions to a control block type. */
export const supervisionClasses: Record<ControlTag, 'LGOS' | 'LSVS'> = {
  GSEControl: 'LGOS',
  SampledValueControl: 'LSVS'
};

/** Names of the icons in `@omicronenergy/oscd-ui` for each control block type. */
export const controlIconNames: Record<ControlTag, string> = {
  GSEControl: 'gooseIcon',
  SampledValueControl: 'smvIcon'
};

export function isControlTag(value: unknown): value is ControlTag {
  return controlTags.includes(value as ControlTag);
}
