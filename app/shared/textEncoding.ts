const REEMPLAZOS_MOJIBAKE: Array<[string, string]> = [
  ['\u00c3\u00a1', 'á'],
  ['\u00c3\u00a9', 'é'],
  ['\u00c3\u00ad', 'í'],
  ['\u00c3\u00b3', 'ó'],
  ['\u00c3\u00ba', 'ú'],
  ['\u00c3\u00bc', 'ü'],
  ['\u00c3\u00b1', 'ñ'],
  ['\u00c3\u0081', 'Á'],
  ['\u00c3\u0089', 'É'],
  ['\u00c3\u008d', 'Í'],
  ['\u00c3\u0093', 'Ó'],
  ['\u00c3\u009a', 'Ú'],
  ['\u00c3\u009c', 'Ü'],
  ['\u00c3\u0091', 'Ñ'],
  ['\u00c2\u00a1', '¡'],
  ['\u00c2\u00bf', '¿'],
  ['\u00c2\u00ab', '«'],
  ['\u00c2\u00bb', '»'],
  ['\u00c2\u00b4', '´'],
  ['\u00c2\u00a8', '¨'],
  ['\u00c2\u00b7', '·'],
  ['\u00e2\u20ac\u0153', '“'],
  ['\u00e2\u20ac\u009d', '”'],
  ['\u00e2\u20ac\u02dc', '‘'],
  ['\u00e2\u20ac\u2122', '’'],
  ['\u00e2\u20ac\u201c', '-'],
  ['\u00e2\u20ac\u201d', '-'],
  ['\u00e2\u20ac\u00a6', '...'],
  ['\u00e3\u20ac\u0082', '。'],
];

export function repararMojibake(texto: string): string {
  return REEMPLAZOS_MOJIBAKE.reduce(
    (resultado, [corrupto, correcto]) => resultado.replaceAll(corrupto, correcto),
    texto,
  );
}

export function normalizarTextoVisible(texto: string): string {
  return repararMojibake(texto).normalize('NFC');
}
