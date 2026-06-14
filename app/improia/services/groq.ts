import { OpenAI } from 'openai';
import { PATRONES_WHISPER_FANTASMA } from '../constants';
import { crearPromptCoactor, crearPromptDirector } from '../prompts';
import type { DificultadChat, EvaluacionActo, FaseActo, MensajeChat } from '../types';
import { generarTituloComun } from '../../shared/titleGeneration';

function crearClienteGroq(): OpenAI {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Falta la API Key.');
  }

  return new OpenAI({
    apiKey: apiKey.trim(),
    baseURL: 'https://api.groq.com/openai/v1',
    dangerouslyAllowBrowser: true,
  });
}

function esAlucinacionAudio(texto: string): boolean {
  const normalizado = texto.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?\u00a1\u00bf]/g, '').trim();

  if (normalizado.length <= 2) {
    return true;
  }

  return PATRONES_WHISPER_FANTASMA.some((patron) => patron.test(normalizado));
}

function ultimoTurnoUsuario(historial: MensajeChat[]): string {
  return [...historial].reverse().find((mensaje) => mensaje.role === 'user')?.content.trim() || '';
}

const PALABRAS_VACIAS_TITULO = new Set([
  'a',
  'al',
  'como',
  'con',
  'de',
  'del',
  'el',
  'en',
  'es',
  'esta',
  'este',
  'hay',
  'la',
  'las',
  'lo',
  'los',
  'para',
  'por',
  'que',
  'se',
  'sin',
  'su',
  'sus',
  'tiene',
  'un',
  'una',
  'vende',
  'y',
]);

function normalizarTextoComparacion(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .replace(/[?\u00bf!\u00a1.,;:"'()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function raizComparacion(palabra: string): string {
  if (palabra.length > 6 && palabra.endsWith('es')) {
    return palabra.slice(0, -2);
  }

  if (palabra.length > 5 && palabra.endsWith('s')) {
    return palabra.slice(0, -1);
  }

  return palabra;
}

function extraerAnclasTitulo(titulo: string): string[] {
  return normalizarTextoComparacion(titulo)
    .split(' ')
    .map(raizComparacion)
    .filter((palabra) => palabra.length > 3 && !PALABRAS_VACIAS_TITULO.has(palabra));
}

function actorIntegraTitulo(titulo: string, textoActor: string): boolean {
  const anclas = extraerAnclasTitulo(titulo);
  const textoActorLimpio = textoActor.trim();

  if (anclas.length === 0) {
    return textoActorLimpio.length > 40;
  }

  const texto = normalizarTextoComparacion(textoActor);
  const coincidencias = anclas.filter((ancla) => texto.includes(ancla)).length;

  if (coincidencias > 0) {
    return true;
  }

  const palabras = texto.split(' ').filter(Boolean);
  const tieneVerbosDeEscena = /\b(quiero|necesito|vengo|busco|tengo|tenemos|voy|vamos|estoy|estamos|debo|debemos|puedo|podemos|quieres|dices|pasa)\b/.test(
    texto,
  );
  const tieneInterlocucion = /\b(usted|tu|oye|mira|perdone|senor|senora|tio|compañero|companero)\b/.test(texto);

  return palabras.length >= 28 && tieneVerbosDeEscena && tieneInterlocucion;
}

function desenlacePareceAbierto(historial: MensajeChat[]): boolean {
  const ultimoTurno = ultimoTurnoUsuario(historial);

  if (!ultimoTurno) {
    return true;
  }

  const normalizado = ultimoTurno
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return (
    /[?\u00bf]\s*$/.test(ultimoTurno) ||
    /\b(y si|que pasa si|deberiamos|podriamos|vamos a|voy a|iba a|plan|alarma|nos siguen|nos atrapan|salimos corriendo)\b/.test(
      normalizado,
    )
  );
}

function extraerEvaluacionDirector(textoCrudo: string): Partial<EvaluacionActo> {
  try {
    return JSON.parse(textoCrudo);
  } catch {
    const inicioJson = textoCrudo.indexOf('{');
    const finJson = textoCrudo.lastIndexOf('}');

    if (inicioJson === -1 || finJson === -1 || finJson <= inicioJson) {
      return {};
    }

    try {
      return JSON.parse(textoCrudo.substring(inicioJson, finJson + 1));
    } catch {
      return {};
    }
  }
}

export async function generarTituloChat(dificultad: DificultadChat, titulos: string[]): Promise<string> {
  return generarTituloComun(dificultad, titulos);
}

export async function transcribirTurno(audioBlob: Blob | null): Promise<string> {
  if (!audioBlob) {
    return '';
  }

  const groq = crearClienteGroq();
  const tipoLimpio = audioBlob.type.split(';')[0];
  const extension = tipoLimpio.includes('mp4') || tipoLimpio.includes('m4a') ? 'm4a' : 'webm';
  const archivoAudio = new File([audioBlob], `impro.${extension}`, { type: tipoLimpio });

  const respuestaWhisper = await groq.audio.transcriptions.create({
    file: archivoAudio,
    model: 'whisper-large-v3',
    language: 'es',
    temperature: 0.0,
    prompt: '.',
  });

  const textoCrudo = respuestaWhisper.text?.trim() || '';
  return esAlucinacionAudio(textoCrudo) ? '' : textoCrudo;
}

export async function generarReplicaCoactor(historial: MensajeChat[]): Promise<string> {
  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: crearPromptCoactor(historial) },
      ...historial,
    ],
    temperature: 0.6,
    max_tokens: 60,
  });

  return response.choices[0]?.message?.content?.trim() || 'Continua, te escucho.';
}

export async function evaluarActoDirector(params: {
  fase: FaseActo;
  titulo: string;
  historial: MensajeChat[];
  textoActor: string;
}): Promise<EvaluacionActo> {
  const groq = crearClienteGroq();
  const propuestaFinal = params.textoActor.trim() ? params.textoActor : '[SIN_RESPUESTA]';
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: crearPromptDirector(params) }],
    temperature: 0.1,
    max_tokens: 150,
    response_format: { type: 'json_object' },
  });

  const textoCrudo = response.choices[0]?.message?.content?.trim() || '{}';
  const resultado = extraerEvaluacionDirector(textoCrudo);

  const desenlaceAbierto = params.fase === 'desenlace' && desenlacePareceAbierto(params.historial);
  const introDesconectada = params.fase === 'intro' && !actorIntegraTitulo(params.titulo, propuestaFinal);

  return {
    aprobado: !!resultado.aprobado && !desenlaceAbierto && !introDesconectada,
    comentario: introDesconectada
      ? 'El actor no integra el titulo en su propia propuesta inicial. Falta una imagen, lugar, objeto o conflicto reconocible del estimulo.'
      : desenlaceAbierto
        ? 'El nudo tiene energia, pero el ultimo turno deja la accion pendiente o en pregunta. Falta una decision o remate que cierre la obra.'
        : resultado.comentario || 'Cumple con el ritmo del libreto.',
    transcripcionAcumulada: propuestaFinal === '[SIN_RESPUESTA]' ? 'Sin intervencion de voz.' : propuestaFinal,
  };
}
