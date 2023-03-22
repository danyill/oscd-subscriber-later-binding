import { html, svg, TemplateResult } from 'lit';

const pathsSVG = {
  gooseIcon: svg`<path d="M11,7H15V9H11V15H13V11H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />`,
  smvIcon: svg`'<path d="M11,7H15V9H11V11H13A2,2 0 0,1 15,13V15A2,2 0 0,1 13,17H9V15H13V13H11A2,2 0 0,1 9,11V9A2,2 0 0,1 11,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />`,
};

export const gooseIcon = svg`<svg style="width:24px;height:24px" viewBox="0 0 24 24">${pathsSVG.gooseIcon}</svg>`;
export const smvIcon = svg`<svg style="width:24px;height:24px" viewBox="0 0 24 24">${pathsSVG.smvIcon}</svg>`;

export type iconType = 'smvIcon' | 'gooseIcon';

export function getFilterIcon(type: iconType, state: boolean): TemplateResult {
  const height = 24;
  const width = 24;
  return html`<svg
    slot="${state ? 'onIcon' : 'offIcon'}"
    xmlns="http://www.w3.orgs/2000/svg"
    height="${height}"
    viewBox="0 0 ${width} ${height}"
    width="${width}"
  >
    ${pathsSVG[type]}
  </svg> `;
}
