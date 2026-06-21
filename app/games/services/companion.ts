import { crearTurno } from './analysis';
import type { TurnoJuego } from '../types';

const RESPUESTAS_ESPECIFICAS: Record<string, string> = {
  baloncesto: 'Si yo fuera baloncesto, sería una canasta.',
  canasta: 'Si yo fuera canasta, sería una celebración.',
  celebracion: 'Si yo fuera celebración, sería una sorpresa.',
  iglesia: 'Si yo fuera iglesia, sería una campana.',
  iglesias: 'Si yo fuera iglesias, sería un eco.',
  niñas: 'Si yo fuera niña, tendría una coleta.',
  nina: 'Si yo fuera niña, tendría una coleta.',
  parque: 'Si yo fuera parque, recibiría feliz a las niñas.',
  pelota: 'Si yo fuera pelota, sería de baloncesto.',
  redonda: 'Si yo fuera redonda, sería una pelota.',
  tierra: 'Si yo fuera Tierra, sería redonda.',
};

const RESPUESTAS_GENERICAS = [
  { predicado: 'sería una puerta abierta', ultima: 'abierta' },
  { predicado: 'guardaría un secreto pequeño', ultima: 'pequeño' },
  { predicado: 'viajaría dentro de una maleta', ultima: 'maleta' },
  { predicado: 'sonaría como una campana', ultima: 'campana' },
  { predicado: 'buscaría una sombra fresca', ultima: 'fresca' },
  { predicado: 'se convertiría en una pregunta', ultima: 'pregunta' },
  { predicado: 'bailaría encima de una mesa', ultima: 'mesa' },
  { predicado: 'esperaría junto a una ventana', ultima: 'ventana' },
];

function elegirRespuestaGenerica(palabra: string): string {
  const indice = palabra.split('').reduce((total, letra) => total + letra.charCodeAt(0), 0) % RESPUESTAS_GENERICAS.length;
  const respuesta = RESPUESTAS_GENERICAS[indice];

  return `Si yo fuera ${palabra}, ${respuesta.predicado}.`;
}

export function generarTurnoCompanera(palabraJugador: string): TurnoJuego {
  const palabra = palabraJugador || 'silencio';
  const texto = RESPUESTAS_ESPECIFICAS[palabra] ?? elegirRespuestaGenerica(palabra);

  return crearTurno({
    autor: 'ia',
    texto,
    palabraEsperada: palabra,
  });
}
