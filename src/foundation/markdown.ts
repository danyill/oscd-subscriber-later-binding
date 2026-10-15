import type {
  ControlRow,
  FcdaListRow,
  FcdaRow,
  SubscriberExtRefRow,
  SubscriberListRow
} from './rows.js';

/** One control block with the FCDA rows which follow it. */
function groupFcdaRows(
  rows: FcdaListRow[]
): { control: ControlRow; fcdas: FcdaRow[] }[] {
  const groups: { control: ControlRow; fcdas: FcdaRow[] }[] = [];
  rows.forEach((row) => {
    if (row.type === 'control') {
      groups.push({ control: row, fcdas: [] });
    } else {
      groups[groups.length - 1].fcdas.push(row);
    }
  });
  return groups;
}

function fcdaMarkdown(row: FcdaRow): string {
  const subscriptions = row.count
    ? `(${row.count} subscription${row.count > 1 ? 's' : ''})`
    : '';
  return `    * ${row.title}

      ${row.subtitle} ${subscriptions}

      (${row.spec?.cdc ?? '?'}, ${row.spec?.bType ?? '?'})
`;
}

/**
 * Markdown describing the control blocks and FCDAs listed, to paste into
 * documentation.
 * @param rows - the rows of the FCDA list, as built for display.
 * @returns a Markdown list, which is empty when there are no rows.
 */
export function fcdaRowsToMarkdown(rows: FcdaListRow[]): string {
  return groupFcdaRows(rows)
    .map(
      ({ control, fcdas }) => `* ${control.title}
  
  ${control.reference} ${control.description ? ` - ${control.description}` : ''}

${fcdas.map(fcdaMarkdown).join('\n')}
`
    )
    .join('\n');
}

function extRefMarkdown(row: SubscriberExtRefRow): string {
  const { subscribed, invalidMapping, missingMapping } = row;

  const supervision =
    subscribed && row.supervisionPath !== undefined && !invalidMapping && !missingMapping
      ? `💓 ${row.supervisionPath}`
      : undefined;
  const source =
    row.supervisionPath || row.controlPath
      ? [row.controlPath, supervision].filter(part => part !== undefined).join(', ')
      : '';

  const mapping =
    subscribed || invalidMapping
      ? ` ⬅ ${subscribed ? row.mapping : ''} ${invalidMapping ? 'Invalid Mapping' : ''} `
      : '';
  const dataDescription =
    row.description && row.dataDescription !== ''
      ? ` ⬅ ${row.dataDescription}`
      : '';
  const sourceText = row.description && source !== '' ? ` (${source})` : source;

  return `  * ${subscribed ? '🔗 ' : ''}${row.title}${mapping}
    ${row.description}${dataDescription}${sourceText}${
      invalidMapping ? ' (❌ Invalid)' : ''
    }${missingMapping ? ' (⚠️ Missing Mapping)' : ''}

`;
}

/**
 * Markdown describing the IEDs and inputs listed, to paste into documentation.
 * @param rows - the rows of the subscriber list, as built for display.
 * @returns a Markdown list, which is empty when there are no rows.
 */
export function subscriberRowsToMarkdown(rows: SubscriberListRow[]): string {
  const groups: { name: string; info: string; extRefs: SubscriberExtRefRow[] }[] = [];
  rows.forEach((row) => {
    if (row.type === 'ied') {
      groups.push({ name: row.name, info: row.info, extRefs: [] });
    } else {
      groups[groups.length - 1].extRefs.push(row);
    }
  });

  return groups
    .map(
      ({ name, info, extRefs }) =>
        `* 📦 ${name}\n  ${info}\n\n${extRefs.map(extRefMarkdown).join('')}`
    )
    .join('\n');
}
