import { TemplateResult } from 'lit';
export declare const gooseIcon: TemplateResult<2>;
export declare const smvIcon: TemplateResult<2>;
export declare const gooseActionIcon: TemplateResult<2>;
export declare const smvActionIcon: TemplateResult<2>;
export declare type iconType = 'smvIcon' | 'gooseIcon';
export declare function getFilterIcon(type: iconType, state: boolean): TemplateResult;
