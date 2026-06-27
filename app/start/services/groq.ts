import { OpenAI } from 'openai';
import { crearPromptDirectorInicio } from '../prompts';
import type { DificultadStart, EstrategiaInicio, EvaluacionDirector } from '../types';
import {
  generarTituloImpro as generarTituloStructure,
  transcribirAudioImpro as transcribirAudioStructure,
} from '../../structure/services/groq';
import { MODELO_CHAT_GROQ } from '../../shared/groqConfig';
import { normalizarTextoVisible } from '../../shared/textEncoding';

const PALABRAS_VACIAS_LITERALIDAD = new Set([
  'a',
  'al',
  'como',
  'con',
  'de',
  'del',
  'el',
  'en',
  'la',
  'las',
  'le',
  'lo',
  'los',
  'me',
  'mi',
  'mis',
  'para',
  'por',
  'que',
  'se',
  'su',
  'sus',
  'tu',
  'un',
  'una',
  'y',
]);

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

function extraerEvaluacionDirector(textoCrudo: string): Partial<EvaluacionDirector> {
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

function comentarioIndicaTecnicaInsuficiente(comentario: string): boolean {
  const normalizado = comentario
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return [
    'tecnica limitada',
    'aplicacion limitada',
    'podria haber explorado mas',
    'podria explorar mas',
    'demasiado literal',
    'muy literal',
    'no se aprecia la tecnica',
    'falta la tecnica',
    'sin aplicar la tecnica',
    'tecnica insuficiente',
  ].some((patron) => normalizado.includes(patron));
}

function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
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

function extraerTerminosLiteralidad(texto: string): string[] {
  return normalizarTexto(texto)
    .split(' ')
    .map(raizComparacion)
    .filter((palabra) => palabra.length > 2 && !PALABRAS_VACIAS_LITERALIDAD.has(palabra));
}

function compartenRaiz(a: string, b: string): boolean {
  if (a === b) {
    return true;
  }

  const longitud = Math.min(a.length, b.length);
  return longitud >= 5 && a.slice(0, 5) === b.slice(0, 5);
}

function propuestaEsLiteralParaAsociacionesSatelite(titulo: string, propuesta: string): boolean {
  const terminosTitulo = [...new Set(extraerTerminosLiteralidad(titulo))];
  const terminosPropuesta = new Set(extraerTerminosLiteralidad(propuesta));

  if (terminosTitulo.length === 0 || terminosPropuesta.size === 0) {
    return false;
  }

  const coincidencias = terminosTitulo.filter((terminoTitulo) => {
    const coincidePorRaiz = [...terminosPropuesta].some((terminoPropuesta) =>
      compartenRaiz(terminoTitulo, terminoPropuesta),
    );

    return coincidePorRaiz;
  }).length;

  return coincidencias >= 2 && coincidencias / terminosTitulo.length >= 0.5;
}

export async function generarTituloInicio(dificultad: DificultadStart, titulos: string[]): Promise<string> {
  return generarTituloStructure(dificultad, titulos);
}

export async function transcribirAudioInicio(audioBlob: Blob | null): Promise<string> {
  return transcribirAudioStructure(audioBlob);
}

export async function evaluarInicioConDirector(params: {
  titulo: string;
  propuestaFinal: string;
  estrategia: EstrategiaInicio;
}): Promise<EvaluacionDirector> {
  const groq = crearClienteGroq();
  const response = await groq.chat.completions.create({
    model: MODELO_CHAT_GROQ,
    messages: [{ role: 'user', content: crearPromptDirectorInicio(params) }],
    temperature: 0.2,
    max_tokens: 180,
    response_format: { type: 'json_object' },
  });

  const textoCrudo = response.choices[0]?.message?.content?.trim() || '{}';
  const objetoJSON = extraerEvaluacionDirector(textoCrudo);
  const comentario = normalizarTextoVisible(
    objetoJSON.comentario || 'Falta una entrada escénica más concreta y alineada con la técnica.',
  );
  const tecnicaInsuficiente = comentarioIndicaTecnicaInsuficiente(comentario);
  const literalidadSatelite =
    params.estrategia.id === 'asociaciones-satelite' &&
    propuestaEsLiteralParaAsociacionesSatelite(params.titulo, params.propuestaFinal);

  return {
    aprobado: !!objetoJSON.aprobado && !tecnicaInsuficiente && !literalidadSatelite,
    comentario: literalidadSatelite
      ? 'La introducción es jugable, pero va al núcleo literal del título. Para Asociaciones Satélite necesitas arrancar desde una asociación periférica.'
      : comentario,
  };
}
