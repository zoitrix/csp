import type { FaseActo, InformeDirector, TiemposConfig } from './types';

export const TIEMPOS_INICIALES: TiemposConfig = {
  total: 120,
};

export const INFORME_INICIAL: InformeDirector = {
  intro: null,
  nudo: null,
  desenlace: null,
};

export const ACTOS_FINALES: Array<{ id: FaseActo; nombre: string }> = [
  { id: 'intro', nombre: 'Acto I: Introducción' },
  { id: 'nudo', nombre: 'Acto II: Nudo (Doble Giro)' },
  { id: 'desenlace', nombre: 'Acto III: Desenlace Final' },
];

export const NOMBRES_FASES: Record<FaseActo, string> = {
  intro: 'Acto I (Intro)',
  nudo: 'Acto II (Nudo: Dos Giros)',
  desenlace: 'Acto III (Desenlace)',
};

export const PATRONES_WHISPER_FANTASMA = [
  /^gracias$/,
  /^gracias por ver$/,
  /^gracias por ver el video$/,
  /^subtitulos$/,
  /^subtitulado$/,
  /^reproduccion$/,
  /^amén$/,
  /^oiga$/,
  /^mira$/,
  /^reproducir$/,
  /^por ver$/,
  /^todos$/,
];
