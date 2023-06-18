export type fcdaDesc = {
  LDevice?: string | null;
  LN?: string | null;
  DOI?: string | null;
  SDI?: string[];
  DAI?: string | null;
};

export function getFcdaInstDesc(fcda: Element, includeDai: boolean): fcdaDesc {
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

  if (!anyLn) return {};

  let descs: fcdaDesc = {};

  const ldDesc = anyLn.closest('LDevice')!.getAttribute('desc');
  const lnDesc = anyLn.getAttribute('desc');
  descs = { ...descs, ...(ldDesc && { LDevice: ldDesc }) };
  descs = { ...descs, ...(lnDesc && { LN: lnDesc }) };

  const doNames = doName!.split('.');

  const doi = anyLn.querySelector(`DOI[name="${doNames[0]}"`);

  if (!doi) return descs;

  const doiDesc = doi?.getAttribute('desc');
  descs = { ...descs, ...(doiDesc && { DOI: doiDesc }) };

  let previousDI: Element = doi;
  doNames.slice(1).forEach(sdiName => {
    const sdi = previousDI.querySelector(`SDI[name="${sdiName}"]`);
    if (sdi) previousDI = sdi;
    const sdiDesc = sdi?.getAttribute('desc');
    if (!('SDI' in descs)) {
      descs = { ...descs, ...(sdiDesc && { SDI: [sdiDesc] }) };
    } else if (sdiDesc) descs.SDI!.push(sdiDesc);
  });

  if (!includeDai || !daName) return descs;

  const daNames = daName?.split('.');
  const dai = previousDI.querySelector(`DAI[name="${daNames[0]}"]`);

  const daiDesc = dai?.getAttribute('desc');
  descs = { ...descs, ...(daiDesc && { DAI: daiDesc }) };

  return descs;
}
