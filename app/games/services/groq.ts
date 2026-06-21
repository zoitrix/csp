import { OpenAI } from 'openai';
import { normalizarTextoVisible } from '../../shared/textEncoding';
import { transcribirAudioImpro } from '../../structure/services/groq';
import { extraerUltimaPalabra, normalizarComparacion } from './analysis';
import type { TurnoJuego } from '../types';

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
