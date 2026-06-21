import { OpenAI } from 'openai';
import { normalizarTextoVisible } from '../../shared/textEncoding';
import { transcribirAudioImpro } from '../../structure/services/groq';
import { extraerUltimaPalabra, normalizarComparacion } from './analysis';
import type { EvaluacionProblema, TurnoJuego } from '../types';

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

export async function transcribirAudioJuego(audioBlob: Blob | null): Promise<string> {
  return transcribirAudioImpro(audioBlob);
}

function limpiarRespuesta(texto: string): string {
  return normalizarTextoVisible(texto)
    .replace(/^["“”'«»]+|["“”'«»]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function asegurarPuntoFinal(texto: string): string {
  return /[.!?]$/.test(texto) ? texto : `${texto}.`;
}

function extraerJsonObjeto(textoCrudo: string): Record<string, unknown> {
  try {
    return JSON.parse(textoCrudo);
  } catch {
    const inicio = textoCrudo.indexOf('{');
    const fin = textoCrudo.lastIndexOf('}');

    if (inicio === -1 || fin === -1 || fin <= inicio) {
      return {};
    }

    try {
      return JSON.parse(textoCrudo.slice(inicio, fin + 1));
    } catch {
      return {};
    }
  }
}

function crearPromptCompaneraSiYoFuera(palabra: string, historial: TurnoJuego[]): string {
  const ultimasPalabras = historial
    .slice(-8)
    .map((turno) => turno.ultimaPalabra)
    .filter(Boolean)
    .join(', ');
  const turnosRecientes = historial
    .slice(-4)
    .map((turno) => `${turno.autor === 'jugador' ? 'Jugador' : 'IA'}: ${turno.texto}`)
    .join('\n');

  return [
    'Eres una compañera de improvisación en el juego "Si yo fuera...".',
    `Debes responder a la palabra exacta: "${palabra}".`,
    'Crea UNA sola frase en español con esta forma exacta: "Si yo fuera [palabra], ...".',
    'La continuación debe tener relación semántica clara con la palabra, no una asociación aleatoria.',
    'No uses comodines vacíos como "tendría una historia", "sería algo", "sería una cosa" ni equivalentes.',
    'No termines con una palabra ya usada recientemente si puedes evitarlo.',
    'Máximo 16 palabras. Sin explicación. Sin comillas.',
    ultimasPalabras ? `Palabras finales recientes que conviene evitar: ${ultimasPalabras}.` : '',
    turnosRecientes ? `Turnos recientes:\n${turnosRecientes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function respuestaSiYoFueraEsValida(texto: string, palabra: string, historial: TurnoJuego[]): boolean {
  const normalizada = normalizarComparacion(texto);
  const palabraNormalizada = normalizarComparacion(palabra);
  const ultima = normalizarComparacion(extraerUltimaPalabra(texto));
  const finalesRecientes = new Set(historial.slice(-4).map((turno) => normalizarComparacion(turno.ultimaPalabra)));

  return (
    normalizada.startsWith(`si yo fuera ${palabraNormalizada}`) &&
    !normalizada.includes('tendria una historia') &&
    !normalizada.includes('seria una historia') &&
    ultima !== '' &&
    !finalesRecientes.has(ultima)
  );
}

export async function generarRespuestaCompaneraJuego(params: {
  palabra: string;
  historial: TurnoJuego[];
}): Promise<string> {
  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: crearPromptCompaneraSiYoFuera(params.palabra, params.historial) }],
    temperature: 0.75,
    max_tokens: 36,
  });

  const texto = limpiarRespuesta(response.choices[0]?.message?.content || '');

  if (!respuestaSiYoFueraEsValida(texto, params.palabra, params.historial)) {
    throw new Error('La respuesta generada no cumple las reglas del juego.');
  }

  return asegurarPuntoFinal(texto);
}

function crearPromptHistoriaInterrumpida(historial: TurnoJuego[]): string {
  const turnosRecientes = historial
    .slice(-8)
    .map((turno) => `${turno.autor === 'jugador' ? 'Jugador' : 'IA'}: ${turno.texto}`)
    .join('\n');

  return [
    'Eres la compañera IA del juego "Historia interrumpida".',
    'El jugador está narrando una historia en pasado y en primera persona.',
    'Responde con UNA sola frase breve que continúe la historia anterior.',
    'Tu frase debe aceptar lo dicho por el jugador, añadir una propuesta útil y hacer avanzar la narración.',
    'No corrijas al jugador, no contradigas lo anterior y no cierres la historia.',
    'No expliques nada. No uses comillas. Máximo 18 palabras.',
    `Historia reciente:\n${turnosRecientes}`,
  ].join('\n');
}

export async function generarRespuestaHistoriaInterrumpida(params: {
  historial: TurnoJuego[];
}): Promise<string> {
  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: crearPromptHistoriaInterrumpida(params.historial) }],
    temperature: 0.72,
    max_tokens: 42,
  });

  const texto = limpiarRespuesta(response.choices[0]?.message?.content || '');

  if (texto.length < 8) {
    throw new Error('La respuesta narrativa generada está vacía o es demasiado corta.');
  }

  return asegurarPuntoFinal(texto);
}

function crearPromptProblemaPortero(historial: TurnoJuego[]): string {
  const problemasRecientes = historial
    .filter((turno) => turno.autor === 'ia')
    .slice(-6)
    .map((turno) => turno.texto)
    .join('\n');

  return [
    'Eres un personaje que llega ante el jugador en el juego teatral "El portero".',
    'Plantea UNA problemática concreta y urgente en primera persona.',
    'Debe poder resolverse con una acción rápida, afirmativa y creativa del jugador.',
    'Cambia de personaje y de tipo de problema respecto a los recientes.',
    'No expliques el juego. No incluyas la solución. Máximo 18 palabras.',
    problemasRecientes ? `Problemas recientes que no debes repetir:\n${problemasRecientes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function generarProblemaPortero(params: {
  historial: TurnoJuego[];
}): Promise<string> {
  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: crearPromptProblemaPortero(params.historial) }],
    temperature: 0.88,
    max_tokens: 44,
  });

  const texto = limpiarRespuesta(response.choices[0]?.message?.content || '');

  if (texto.length < 8) {
    throw new Error('La problemática generada está vacía o es demasiado corta.');
  }

  return asegurarPuntoFinal(texto);
}

function emparejarProblemasYRespuestas(turnos: TurnoJuego[]): Array<{ problema: string; respuesta: string }> {
  const pares: Array<{ problema: string; respuesta: string }> = [];

  for (let i = 0; i < turnos.length; i += 1) {
    const turno = turnos[i];

    if (turno.autor !== 'ia') {
      continue;
    }

    const respuesta = turnos.slice(i + 1).find((siguiente) => siguiente.autor === 'jugador');

    if (respuesta) {
      pares.push({ problema: turno.texto, respuesta: respuesta.texto });
    }
  }

  return pares;
}

function crearPromptEvaluacionPortero(pares: Array<{ problema: string; respuesta: string }>): string {
  const casos = pares
    .map((par, index) => `${index + 1}. Problema: ${par.problema}\nRespuesta: ${par.respuesta}`)
    .join('\n\n');

  return [
    'Evalúa respuestas del juego teatral "El portero".',
    'Criterio: respuesta rápida, afirmativa, entra en rol, acepta el problema y propone una acción concreta que lo haga avanzar.',
    'No exijas realismo perfecto: premia creatividad útil y decisión clara.',
    `Debes devolver exactamente ${pares.length} evaluaciones, una por cada caso y en el mismo orden.`,
    'Devuelve SOLO JSON válido con esta forma:',
    '{"evaluaciones":[{"problema":"...","respuesta":"...","adecuada":true,"comentario":"máximo 18 palabras"}],"comentarioGlobal":"máximo 24 palabras"}',
    `Casos:\n${casos}`,
  ].join('\n');
}

export async function evaluarRespuestasPortero(params: {
  turnos: TurnoJuego[];
}): Promise<{ evaluaciones: EvaluacionProblema[]; comentarioGlobal: string }> {
  const pares = emparejarProblemasYRespuestas(params.turnos);

  if (pares.length === 0) {
    return {
      evaluaciones: [],
      comentarioGlobal: 'No se han registrado respuestas suficientes para evaluar las problemáticas.',
    };
  }

  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: crearPromptEvaluacionPortero(pares) }],
    temperature: 0.2,
    max_tokens: Math.min(1100, 220 + pares.length * 130),
    response_format: { type: 'json_object' },
  });

  const objeto = extraerJsonObjeto(response.choices[0]?.message?.content || '{}');
  const evaluacionesCrudas = Array.isArray(objeto.evaluaciones) ? objeto.evaluaciones : [];
  const evaluaciones = pares.map((par, index) => {
    const item = evaluacionesCrudas[index] ?? {};
    const evaluacion = item as Partial<EvaluacionProblema>;

    return {
      problema: normalizarTextoVisible(String(evaluacion.problema || par.problema)),
      respuesta: normalizarTextoVisible(String(evaluacion.respuesta || par.respuesta)),
      adecuada: !!evaluacion.adecuada,
      comentario: normalizarTextoVisible(String(evaluacion.comentario || 'Respuesta revisada.')),
    };
  });

  return {
    evaluaciones,
    comentarioGlobal: normalizarTextoVisible(String(objeto.comentarioGlobal || 'Evaluación completada.')),
  };
}
