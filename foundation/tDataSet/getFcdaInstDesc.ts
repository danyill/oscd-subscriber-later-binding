// TODO: This needs careful review!
export function getFcdaInstDesc(fcda: Element, includeDai: boolean): string[] {
  const [doName, daName] = ['doName', 'daName'].map(attr =>
    fcda.getAttribute(attr)
  );

  const ied = fcda.closest('IED')!;

  const anyLn = Array.from(
    ied.querySelectorAll(
      `LDevice[inst="${fcda.getAttribute(
        'ldInst'
      )}"] > LN, LDevice[inst="${fcda.getAttribute('ldInst')}"] LN0`
    )
  ).find(
    lN =>
      (lN.getAttribute('prefix') ?? '') ===
        (fcda.getAttribute('prefix') ?? '') &&
      lN.getAttribute('lnClass') === (fcda.getAttribute('lnClass') ?? '') &&
      (lN.getAttribute('inst') ?? '') === (fcda.getAttribute('lnInst') ?? '')
  );

  if (!anyLn) return [];

  const descs: (string | null | undefined)[] = [];

  descs.push(anyLn.closest('LDevice')!.getAttribute('desc'));
  descs.push(anyLn.getAttribute('desc'));

  const doNames = doName!.split('.');

  const doi = anyLn.querySelector(`DOI[name="${doNames[0]}"`);

  if (!doi) return descs.filter(d => d !== null && d !== undefined) as string[];

  descs.push(doi?.getAttribute('desc'));

  let previousDI: Element = doi;
  doNames.slice(1).forEach(sdiName => {
    const sdi = previousDI.querySelector(`SDI[name="${sdiName}"]`);
    if (sdi) previousDI = sdi;
    descs.push(sdi?.getAttribute('desc'));
  });

  if (!includeDai || !daName)
    return descs.filter(d => d !== null && d !== undefined) as string[];

  const daNames = daName?.split('.');
  const dai = previousDI.querySelector(`DAI[name="${daNames[0]}"]`);
  descs.push(dai?.getAttribute('desc'));

  return descs.filter(d => d !== null && d !== undefined) as string[];
}
