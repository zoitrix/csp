import { normalizarTextoVisible } from './textEncoding';

const PALABRAS_VACIAS = new Set([
  'a',
  'al',
  'ante',
  'bajo',
  'cada',
  'como',
  'con',
  'contra',
  'de',
  'del',
  'desde',
  'el',
  'en',
  'entre',
  'es',
  'esa',
  'ese',
  'esta',
  'este',
  'la',
  'las',
  'le',
  'lo',
  'los',
  'me',
  'mi',
  'mis',
  'no',
  'nos',
  'para',
  'por',
  'que',
  'se',
  'sin',
  'su',
  'sus',
  'te',
  'tu',
  'tus',
  'un',
  'una',
  'y',
  'ya',
]);

function normalizarTexto(texto: string): string {
  return normalizarTextoVisible(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function raizSimple(palabra: string): string {
  if (palabra.length > 6 && palabra.endsWith('es')) {
    return palabra.slice(0, -2);
  }

  if (palabra.length > 5 && palabra.endsWith('s')) {
    return palabra.slice(0, -1);
  }

  return palabra;
}

function extraerTerminos(texto: string): Set<string> {
  return new Set(
    normalizarTexto(texto)
      .split(' ')
      .map(raizSimple)
      .filter((palabra) => palabra.length > 2 && !PALABRAS_VACIAS.has(palabra)),
  );
}

function contarFrecuencias(valores: string[]): Map<string, number> {
  const frecuencias = new Map<string, number>();

  valores.forEach((valor) => {
    frecuencias.set(valor, (frecuencias.get(valor) || 0) + 1);
  });

  return frecuencias;
}

function contarInterseccion(a: Set<string>, b: Set<string>): number {
  let coincidencias = 0;

  a.forEach((valor) => {
    if (b.has(valor)) {
      coincidencias += 1;
    }
  });

  return coincidencias;
}

function esTituloParecido(titulo: string, anterior: string): boolean {
  const tituloNormalizado = normalizarTexto(titulo);
  const anteriorNormalizado = normalizarTexto(anterior);

  if (!tituloNormalizado || !anteriorNormalizado) {
    return false;
  }

  if (tituloNormalizado === anteriorNormalizado) {
    return true;
  }

  const terminosTitulo = extraerTerminos(titulo);
  const terminosAnterior = extraerTerminos(anterior);
  const coincidencias = contarInterseccion(terminosTitulo, terminosAnterior);
  const union = new Set([...terminosTitulo, ...terminosAnterior]).size;
  const jaccard = union > 0 ? coincidencias / union : 0;

  if (coincidencias >= 2 || (coincidencias >= 1 && jaccard >= 0.34)) {
    return true;
  }

  return false;
}

export function tituloSePareceAHistorial(titulo: string, historial: string[]): boolean {
  if (historial.some((anterior) => esTituloParecido(titulo, anterior))) {
    return true;
  }

  const restricciones = crearRestriccionesVariedad(historial);
  const terminosTitulo = extraerTerminos(titulo);

  return restricciones.palabrasVetadas.some((palabra) => terminosTitulo.has(palabra));
}

export function crearRestriccionesVariedad(historial: string[]): {
  palabrasVetadas: string[];
} {
  const terminos = historial.flatMap((titulo) => [...extraerTerminos(titulo)]);
  const frecuenciasTerminos = contarFrecuencias(terminos);

  const palabrasVetadas = [...frecuenciasTerminos.entries()]
    .filter(([, veces]) => veces >= 1)
    .map(([palabra]) => palabra)
    .slice(0, 18);

  return { palabrasVetadas };
}

export function crearAvisoVariedadTitulos(historial: string[]): string {
  const { palabrasVetadas } = crearRestriccionesVariedad(historial);
  const palabras = palabrasVetadas.length > 0 ? palabrasVetadas.join(', ') : 'ninguna todavia';

  return `Palabras significativas ya gastadas que debes evitar: [${palabras}]. Cambia también la forma sintáctica y la fuente del conflicto sin usar una lista cerrada de temas.`;
}
