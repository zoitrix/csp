import { OpenAI } from 'openai';
import { crearAvisoVariedadTitulos, tituloSePareceAHistorial } from './titleSimilarity';

const INTENTOS_TITULO = 10;
const MAX_TITULOS_HISTORIAL_PROMPT = 6;

const FORMAS_SINTACTICAS = [
  'pregunta',
  'orden',
  'aviso',
  'titular',
  'queja',
  'rumor',
  'frase oida al pasar',
  'cartel',
  'consigna',
  'enunciado absurdo',
];

const CIERRES_GRAMATICALES_DEBILES = new Set([
  'a',
  'al',
  'ante',
  'bajo',
  'con',
  'contra',
  'de',
  'del',
  'desde',
  'el',
  'en',
  'entre',
  'hacia',
  'hasta',
  'la',
  'las',
  'lo',
  'los',
  'mi',
  'mis',
  'para',
  'por',
  'que',
  'se',
  'sin',
  'sobre',
  'su',
  'sus',
  'tras',
  'tu',
  'tus',
  'un',
  'una',
  'ya',
]);

function elegirFormaSintactica(): string {
  return FORMAS_SINTACTICAS[Math.floor(Math.random() * FORMAS_SINTACTICAS.length)];
}

function crearClienteGroq(): OpenAI {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('La API Key de Groq no esta configurada.');
  }

  return new OpenAI({
    apiKey: apiKey.trim(),
    baseURL: 'https://api.groq.com/openai/v1',
    dangerouslyAllowBrowser: true,
  });
}

function normalizarDificultad(dificultad: string): 'facil' | 'media' | 'dificil' {
  const dificultadNormalizada = dificultad
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (dificultadNormalizada === 'facil') {
    return 'facil';
  }

  if (dificultadNormalizada === 'dificil') {
    return 'dificil';
  }

  return 'media';
}

function crearGuiaDificultadTitulo(dificultad: string): string {
  const dificultadNormalizada = normalizarDificultad(dificultad);

  if (dificultadNormalizada === 'facil') {
    return 'Cotidiano, concreto y facil de actuar. Rareza pequena, no cosmica.';
  }

  if (dificultadNormalizada === 'media') {
    return 'Caos social claro. Puede haber sospecha, regla rara, queja o aviso. Debe entenderse rapido.';
  }

  return 'Absurdo extremo pero escenico y concreto. Sin misterio generico ni palabras inventadas.';
}

function crearPromptTitulo(dificultad: string, titulos: string[]): string {
  const historialReciente = titulos.slice(-MAX_TITULOS_HISTORIAL_PROMPT);
  const historialTitulos = historialReciente.length > 0 ? historialReciente.join(' | ') : 'ninguno';
  const avisoVariedad = crearAvisoVariedadTitulos(historialReciente);
  const dificultadNormalizada = normalizarDificultad(dificultad).toUpperCase();
  const formaSintactica = elegirFormaSintactica();

  return `Genera UN titulo de impro en espanol.
Forma obligatoria: ${formaSintactica}.
Dificultad ${dificultadNormalizada}: ${crearGuiaDificultadTitulo(dificultad)}
Reglas:
- 4 a 7 palabras.
- Unidad gramatical con sentido real.
- Concordancia obligatoria entre sujeto, verbo, genero y numero.
- Si llamas a un grupo en plural, el verbo tambien debe ir en plural.
- Comedia jugable, concreta, no poetica.
- Espanol natural y oral: una persona podria decirlo en voz alta sin que suene roto.
- Sin palabras inventadas, deformadas, truncadas, siglas, abreviaturas con puntos, spanglish, markdown, comillas, parentesis ni explicaciones.
- Prohibido cerrar con cuantificadores mal encajados o muletillas que rompan la frase.
- Prohibido escribir frases sobre el titulo o la forma: responde con el titulo final, no con una introduccion.
- No fuerces la forma obligatoria si eso rompe la gramatica: prioriza una frase correcta y comprensible.
- Solo mayuscula inicial o nombres propios.
- No termines con palabra colgante.
- Evita plantillas posesivas obvias.
- No repitas titulos, palabras clave ni estructura reciente.
Historial reciente: ${historialTitulos}.
${avisoVariedad}
Respuesta:`;
}

function tituloUsaPlantillaPersonalObvia(titulo: string): boolean {
  const normalizado = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[Â¿?Â¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return /^(mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras)\s+\S+\s+(es|son|era|eran|esta|estan|tiene|tienen|quiere|quieren|compra|compran|vende|venden|odia|odian)\b/.test(
    normalizado,
  );
}

function normalizarTituloParaValidacion(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extraerPalabrasTitulo(titulo: string): string[] {
  return normalizarTituloParaValidacion(titulo).split(' ').filter(Boolean);
}

function tituloEstaEnMayusculas(titulo: string): boolean {
  const letras = titulo
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-ZñÑ]/g, '');

  return letras.length >= 4 && letras === letras.toUpperCase() && letras !== letras.toLowerCase();
}

function tituloTieneRepeticionTorpe(palabras: string[]): boolean {
  return palabras.some((palabra, index) => index > 0 && palabra === palabras[index - 1]);
}

function tituloTieneFormatoRoto(titulo: string): boolean {
  return /(?:\b[\p{L}]\.){2,}/u.test(titulo) || /[\p{Ll}][\p{Lu}]/u.test(titulo);
}

function tituloTieneConcordanciaRota(titulo: string): boolean {
  const normalizado = normalizarTituloParaValidacion(titulo);

  const cuantificadorMalEncajado =
    /\b(el|la|los|las)\s+\S+\s+se\s+(ha|han)\s+\S+(ado|ido|to|so|cho)\s+tod[oa]s?\b/.test(normalizado);
  const vocativoPluralConVerboSingular = /^[a-zñ]+s,\s+[a-zñ]+[ae]\b/.test(normalizado);

  return cuantificadorMalEncajado || vocativoPluralConVerboSingular;
}

function tituloEsMetalinguistico(titulo: string): boolean {
  return /^(el|la|un|una)?\s*(titulo|titular|frase|respuesta|propuesta)\s+(puede|podria|debe|seria|es)\s+/i.test(
    normalizarTituloParaValidacion(titulo),
  );
}

function tituloTieneSentidoBasico(titulo: string): boolean {
  const palabras = extraerPalabrasTitulo(titulo);
  const ultimaPalabra = palabras[palabras.length - 1];

  if (palabras.length < 4 || palabras.length > 7) {
    return false;
  }

  if (!ultimaPalabra || CIERRES_GRAMATICALES_DEBILES.has(ultimaPalabra)) {
    return false;
  }

  if (
    tituloTieneRepeticionTorpe(palabras) ||
    tituloTieneFormatoRoto(titulo) ||
    tituloTieneConcordanciaRota(titulo) ||
    tituloEsMetalinguistico(titulo)
  ) {
    return false;
  }

  return true;
}

function normalizarMayusculasTitulo(titulo: string): string {
  if (!tituloEstaEnMayusculas(titulo)) {
    return titulo;
  }

  const tituloMinusculas = titulo.toLocaleLowerCase('es-ES');
  const indicePrimeraLetra = tituloMinusculas.search(/\p{L}/u);

  if (indicePrimeraLetra === -1) {
    return tituloMinusculas;
  }

  return (
    tituloMinusculas.slice(0, indicePrimeraLetra) +
    tituloMinusculas.charAt(indicePrimeraLetra).toLocaleUpperCase('es-ES') +
    tituloMinusculas.slice(indicePrimeraLetra + 1)
  );
}

function limpiarTituloGenerado(textoCrudo: string): string {
  const primeraLinea = textoCrudo
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .find(Boolean) || '';

  const sinPrefijo = primeraLinea.replace(
    /^(?:aqui tienes(?: una frase| un titulo)?|(?:el|la|un|una)?\s*(?:frase final|frase|titulo|titular|propuesta|respuesta)\s+(?:puede|podria|debe|seria|es)\s*:?\s*|frase final|frase|titulo|titular|propuesta|respuesta)\s*:\s*/i,
    '',
  );

  return sinPrefijo
    .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]\s*/g, ' ')
    .replace(/[*_~]+/g, '')
    .replace(/["'`â€œâ€â€˜â€™Â«Â»]/g, '')
    .replace(/[.ã€‚]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(.+)$/, normalizarMayusculasTitulo);
}

function getTemperaturaTitulo(dificultad: string): number {
  const dificultadNormalizada = normalizarDificultad(dificultad);

  if (dificultadNormalizada === 'facil') {
    return 0.85;
  }

  if (dificultadNormalizada === 'media') {
    return 1.0;
  }

  return 1.1;
}

export async function generarTituloComun(dificultad: string, titulos: string[]): Promise<string> {
  const groq = crearClienteGroq();
  const rechazados: string[] = [];
  let mejorTitulo = '';

  for (let intento = 0; intento < INTENTOS_TITULO; intento += 1) {
    const historialParaPrompt = [...titulos, ...rechazados];
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: crearPromptTitulo(dificultad, historialParaPrompt) }],
      temperature: Math.min(getTemperaturaTitulo(dificultad) + intento * 0.15, 1.2),
      presence_penalty: 0.7,
      frequency_penalty: 0.5,
      max_tokens: 20,
    });

    const titulo = limpiarTituloGenerado(response.choices[0]?.message?.content?.trim() || '');

    if (!titulo) {
      continue;
    }

    if (!mejorTitulo && tituloTieneSentidoBasico(titulo)) {
      mejorTitulo = titulo;
    }

    if (
      tituloTieneSentidoBasico(titulo) &&
      !tituloUsaPlantillaPersonalObvia(titulo) &&
      !tituloSePareceAHistorial(titulo, titulos)
    ) {
      return titulo;
    }

    rechazados.push(titulo);
  }

  if (mejorTitulo) {
    return mejorTitulo;
  }

  throw new Error('No se pudo generar un titulo valido: ' + rechazados.join(' | '));
}
