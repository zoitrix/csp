import { OpenAI } from 'openai';
import { crearAvisoVariedadTitulos, tituloSePareceAHistorial } from './titleSimilarity';
import { MODELO_CHAT_GROQ } from './groqConfig';
import { normalizarTextoVisible } from './textEncoding';

const INTENTOS_TITULO = 4;
const MAX_TITULOS_HISTORIAL_PROMPT = 3;
const CANDIDATOS_TITULO_POR_INTENTO = 3;
// GPT-OSS consume parte de este presupuesto en razonamiento, incluso con esfuerzo bajo.
// 1024 evita que termine por longitud antes de emitir las tres líneas visibles.
const MAX_TOKENS_RESPUESTA_TITULOS = 1024;

const FORMAS_SINTACTICAS = [
  'pregunta',
  'orden',
  'aviso',
  'noticia contada en lenguaje natural',
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

const PALABRAS_COMUNES_CON_MAYUSCULA_INCORRECTA = new Set([
  'alcalde',
  'alcaldesa',
  'abuelo',
  'abuela',
  'banco',
  'bar',
  'biblioteca',
  'camarero',
  'camarera',
  'casa',
  'colegio',
  'consejo',
  'director',
  'directora',
  'escuela',
  'familia',
  'fiesta',
  'gobierno',
  'hospital',
  'jefe',
  'jefa',
  'junta',
  'madre',
  'mercado',
  'ministro',
  'ministra',
  'oficina',
  'padre',
  'parque',
  'presidente',
  'presidenta',
  'profesor',
  'profesora',
  'reunion',
  'supermercado',
  'teatro',
  'tienda',
  'vecino',
  'vecina',
  'vecinos',
  'vecinas',
]);

const PALABRAS_DEFORMADAS_FRECUENTES = new Set([
  'alcaldesaes',
  'congresoa',
  'congresar',
  'consejio',
  'diviertese',
  'funerala',
  'gobiernao',
  'hospitala',
  'juecesa',
  'ministrao',
  'presidento',
  'ustede',
  'ustedeses',
  'vecindarioa',
]);

function elegirFormaSintactica(): string {
  return FORMAS_SINTACTICAS[Math.floor(Math.random() * FORMAS_SINTACTICAS.length)];
}

function crearClienteGroq(): OpenAI {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('La API Key de Groq no está configurada.');
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

  return `Da ${CANDIDATOS_TITULO_POR_INTENTO} titulos de impro en espanol, uno por linea.
Forma: ${formaSintactica}. Nivel ${dificultadNormalizada}: ${crearGuiaDificultadTitulo(dificultad)}
Reglas: cada titulo debe tener 5-9 palabras; frase completa, natural, logica y jugable; concordancia y preposiciones correctas; solo mayuscula inicial; sin nombres propios, siglas, comillas, markdown, palabras inventadas, "usted/ustedes", ni "se divierte a alguien".
Escribe como una frase narrativa, no como un titular de prensa telegrafico. No omitas articulos para acortar: un sustantivo comun contable en singular que funciona como sujeto debe llevar normalmente un determinante como "el", "la", "un" o "una".
Comprueba el significado de las preposiciones: distingue, por ejemplo, entre pedir pizza "a la luna" y pedir pizza "de luna".
Mal: Invasion de luces parpadeantes causa confusion. Bien: Una invasion de luces parpadeantes causa confusion.
Mal: Mano gigante exige pizza de luna. Bien: Una mano gigante exige pizza a la luna.
Evita estructuras y palabras recientes. Historial: ${historialTitulos}.
${avisoVariedad}
Ordena primero el titulo que suene mas natural en espanol. Escribe exactamente ${CANDIDATOS_TITULO_POR_INTENTO} lineas, sin numeracion, explicaciones ni lineas vacias:`;
}

function elegirTituloFallback(dificultad: string, titulos: string[]): string {
  const dificultadNormalizada = normalizarDificultad(dificultad);
  const titulosBase =
    dificultadNormalizada === 'facil'
      ? [
          'La nevera exige vacaciones',
          'El vecino guarda la luna',
          'La mesa pide perdon',
          'Los zapatos llegan tarde',
        ]
      : dificultadNormalizada === 'media'
        ? [
            'El barrio vota en pijama',
            'La reunion prohibe los suspiros',
            'Los clientes esconden la puerta',
            'La familia subasta el silencio',
          ]
        : [
            'El ascensor declara la independencia',
            'La gravedad cancela los lunes',
            'Los espejos convocan una huelga',
            'El calendario demanda testigos',
          ];

  const tituloNuevo = titulosBase.find(
    (titulo) => tituloTieneSentidoBasico(titulo) && !tituloSePareceAHistorial(titulo, titulos),
  );

  if (tituloNuevo) {
    return tituloNuevo;
  }

  // Si todos se parecen al historial, evita al menos repetir literalmente uno ya usado.
  // Los candidatos rechazados por el modelo no deben bloquear también los fallbacks seguros.
  const titulosNormalizados = new Set(titulos.map(normalizarTituloParaValidacion));
  const tituloNoUsado = titulosBase.find(
    (titulo) => !titulosNormalizados.has(normalizarTituloParaValidacion(titulo)),
  );

  return tituloNoUsado || titulosBase[titulos.length % titulosBase.length];
}

function tituloUsaPlantillaPersonalObvia(titulo: string): boolean {
  const normalizado = normalizarTextoVisible(titulo)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿?¡!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return /^(mi|mis|tu|tus|su|sus|nuestro|nuestra|nuestros|nuestras)\s+\S+\s+(es|son|era|eran|esta|estan|tiene|tienen|quiere|quieren|compra|compran|vende|venden|odia|odian)\b/.test(
    normalizado,
  );
}

function normalizarTituloParaValidacion(titulo: string): string {
  return normalizarTextoVisible(titulo)
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

function tituloTieneMayusculasInternasInjustificadas(titulo: string): boolean {
  const palabrasOriginales = normalizarTextoVisible(titulo).split(/\s+/).filter(Boolean);

  return palabrasOriginales.some((palabra, index) => {
    if (index === 0) {
      return false;
    }

    const limpia = palabra.replace(/[¿?¡!.,;:]/g, '');
    const normalizada = limpia
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return /^[A-ZÁÉÍÓÚÜÑ]/.test(limpia) && PALABRAS_COMUNES_CON_MAYUSCULA_INCORRECTA.has(normalizada);
  });
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
  return /[:;]/.test(titulo) || /(?:\b[\p{L}]\.){2,}/u.test(titulo) || /[\p{Ll}][\p{Lu}]/u.test(titulo);
}

function tituloTieneConcordanciaRota(titulo: string): boolean {
  const normalizado = normalizarTituloParaValidacion(titulo);

  const cuantificadorMalEncajado =
    /\b(el|la|los|las)\s+\S+\s+se\s+(ha|han)\s+\S+(ado|ido|to|so|cho)\s+tod[oa]s?\b/.test(normalizado);
  const vocativoPluralConVerboSingular = /^[a-zñ]+s,\s+[a-zñ]+[ae]\b/.test(normalizado);
  const reflexivoConDestinoImposible =
    /\bse\s+(aburre|aburren|divierte|divierten|duerme|duermen|enfada|enfadan|rie|rien)\s+a\s+\S+/.test(
      normalizado,
    );

  return cuantificadorMalEncajado || vocativoPluralConVerboSingular || reflexivoConDestinoImposible;
}

function tituloEsMetalinguistico(titulo: string): boolean {
  return /^(el|la|un|una)?\s*(titulo|titular|frase|respuesta|propuesta)\s+(puede|podria|debe|seria|es)\s+/i.test(
    normalizarTituloParaValidacion(titulo),
  );
}

function tituloTieneTratamientoRoto(titulo: string): boolean {
  const normalizado = normalizarTituloParaValidacion(titulo);

  return /\busted(e|es)?\b/.test(normalizado) || /\ba\s+usted(?:e|es)?\b/.test(normalizado);
}

function tituloTienePalabraDeformada(palabras: string[]): boolean {
  return palabras.some((palabra) => {
    if (PALABRAS_DEFORMADAS_FRECUENTES.has(palabra)) {
      return true;
    }

    return (
      /^congres[a-zñ]+$/.test(palabra) &&
      !['congreso', 'congresos', 'congresista', 'congresistas'].includes(palabra)
    );
  });
}

function tituloTieneBaseLogicaDebil(titulo: string): boolean {
  const normalizado = normalizarTituloParaValidacion(titulo);

  return (
    /\b(algo|cosa|tema|asunto|situacion)\s+(raro|rara|curioso|curiosa|extrano|extrana)\b/.test(normalizado) ||
    /\b(se\s+)?(divierte|divierten|entretiene|entretienen)\s+(a|de|con)\s+(usted|ustedes|ustede)\b/.test(normalizado)
  );
}

function tituloTieneSentidoBasico(titulo: string): boolean {
  const palabras = extraerPalabrasTitulo(titulo);
  const ultimaPalabra = palabras[palabras.length - 1];

  // Se pide 5-9 al modelo, con una palabra de tolerancia en ambos extremos.
  // Los artículos y las preposiciones necesarias no deben penalizar un título natural.
  if (palabras.length < 4 || palabras.length > 10) {
    return false;
  }

  if (!ultimaPalabra || CIERRES_GRAMATICALES_DEBILES.has(ultimaPalabra)) {
    return false;
  }

  if (
    tituloTieneRepeticionTorpe(palabras) ||
    tituloTieneMayusculasInternasInjustificadas(titulo) ||
    tituloTieneFormatoRoto(titulo) ||
    tituloTieneConcordanciaRota(titulo) ||
    tituloTieneTratamientoRoto(titulo) ||
    tituloTienePalabraDeformada(palabras) ||
    tituloTieneBaseLogicaDebil(titulo) ||
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
  const sinPrefijo = normalizarTextoVisible(textoCrudo).replace(
    /^(?:aqui tienes(?: una frase| un titulo)?|(?:el|la|un|una)?\s*(?:frase final|frase|titulo|titular|propuesta|respuesta)\s+(?:puede|podria|debe|seria|es)\s*:?\s*|frase final|frase|titulo|titular|propuesta|respuesta)\s*:\s*/i,
    '',
  );

  return sinPrefijo
    .replace(/\s*[\(\[\{][^\)\]\}]*[\)\]\}]\s*/g, ' ')
    .replace(/[*_~]+/g, '')
    .replace(/["'`“”‘’«»]/g, '')
    .replace(/[.。]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(.+)$/, normalizarMayusculasTitulo);
}

function extraerTitulosGenerados(textoCrudo: string): string[] {
  return textoCrudo
    .split(/\r?\n/)
    .map((linea) => linea.replace(/^\s*(?:[-*]|\d+[.)])\s*/, '').trim())
    .map(limpiarTituloGenerado)
    .filter(Boolean);
}

function getTemperaturaTitulo(dificultad: string): number {
  const dificultadNormalizada = normalizarDificultad(dificultad);

  if (dificultadNormalizada === 'facil') {
    return 0.65;
  }

  if (dificultadNormalizada === 'media') {
    return 0.8;
  }

  return 0.95;
}

export async function generarTituloComun(dificultad: string, titulos: string[]): Promise<string> {
  const groq = crearClienteGroq();
  const rechazados: string[] = [];
  const respuestasSinCandidatos: Array<{
    intento: number;
    finishReason: string | null;
    contenido: string;
    completionTokens: number | null;
  }> = [];
  let mejorTitulo = '';

  for (let intento = 0; intento < INTENTOS_TITULO; intento += 1) {
    const historialParaPrompt = [...titulos, ...rechazados];
    const response = await groq.chat.completions.create({
      model: MODELO_CHAT_GROQ,
      messages: [{ role: 'user', content: crearPromptTitulo(dificultad, historialParaPrompt) }],
      temperature: Math.min(getTemperaturaTitulo(dificultad) + intento * 0.08, 1.05),
      presence_penalty: 0.7,
      frequency_penalty: 0.5,
      reasoning_effort: 'low',
      max_completion_tokens: MAX_TOKENS_RESPUESTA_TITULOS,
    });

    const choice = response.choices[0];
    const contenido = choice?.message?.content?.trim() || '';
    const candidatos = extraerTitulosGenerados(contenido);

    if (candidatos.length === 0) {
      const diagnosticoRespuestaVacia = {
        intento: intento + 1,
        finishReason: choice?.finish_reason || null,
        contenido,
        completionTokens: response.usage?.completion_tokens ?? null,
      };

      respuestasSinCandidatos.push(diagnosticoRespuestaVacia);

      if (process.env.NODE_ENV === 'development') {
        console.warn('Groq no devolvio candidatos de titulo en este intento.', diagnosticoRespuestaVacia);
      }

      continue;
    }

    for (const titulo of candidatos) {
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
  }

  if (mejorTitulo) {
    return mejorTitulo;
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('Se usa un titulo fallback: Groq no produjo candidatos validos.', {
      dificultad: normalizarDificultad(dificultad),
      candidatosRechazados: rechazados,
      respuestasSinCandidatos,
    });
  }

  return elegirTituloFallback(dificultad, titulos);
}
