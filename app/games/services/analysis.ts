import { normalizarTextoVisible } from '../../shared/textEncoding';
import type { EvaluacionJuego, TurnoJuego } from '../types';

const PALABRAS_VACIAS = new Set([
  'a',
  'al',
  'ante',
  'bajo',
  'con',
  'contra',
  'de',
  'del',
  'desde',
  'durante',
  'el',
  'ella',
  'ellas',
  'ellos',
  'en',
  'entre',
  'fuera',
  'fuese',
  'hacia',
  'hasta',
  'la',
  'las',
  'lo',
  'los',
  'me',
  'mi',
  'mis',
  'para',
  'por',
  'porque',
  'que',
  'se',
  'segun',
  'seria',
  'si',
  'sin',
  'sobre',
  'su',
  'sus',
  'tu',
  'un',
  'una',
  'unos',
  'unas',
  'yo',
]);

export function normalizarComparacion(texto: string): string {
  return normalizarTextoVisible(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zñ0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function limpiarArticuloInicial(texto: string): string {
  return texto.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i, '').trim();
}

function extraerPalabras(texto: string): string[] {
  return normalizarComparacion(texto)
    .split(' ')
    .filter((palabra) => palabra.length > 1 && !PALABRAS_VACIAS.has(palabra));
}

function raiz(palabra: string): string {
  if (palabra.length > 6 && palabra.endsWith('es')) {
    return palabra.slice(0, -2);
  }

  if (palabra.length > 5 && palabra.endsWith('s')) {
    return palabra.slice(0, -1);
  }

  return palabra;
}

export function palabrasCompatibles(a: string, b: string): boolean {
  const raizA = raiz(normalizarComparacion(a));
  const raizB = raiz(normalizarComparacion(b));

  return raizA === raizB || (Math.min(raizA.length, raizB.length) >= 5 && raizA.slice(0, 5) === raizB.slice(0, 5));
}

export function extraerEstimulo(frase: string): string {
  const fraseLimpia = normalizarTextoVisible(frase).trim();
  const despuesDeInicio = fraseLimpia.replace(/^si\s+yo\s+(fuera|fuese)\s+/i, '').trim();
  const hastaPredicado = despuesDeInicio.split(/\b(seria|sería|tendria|tendría|haria|haría|podria|podría|estaria|estaría|me|rodaria|rodaría|recibiria|recibiría|llamaria|llamaría)\b/i)[0];
  const palabras = extraerPalabras(limpiarArticuloInicial(hastaPredicado));

  return palabras[0] || '';
}

export function extraerUltimaPalabra(frase: string): string {
  const palabras = extraerPalabras(frase);

  return palabras[palabras.length - 1] || '';
}

export function crearTurno(params: {
  autor: TurnoJuego['autor'];
  texto: string;
  palabraEsperada: string;
}): TurnoJuego {
  const texto = normalizarTextoVisible(params.texto).replace(/\s+/g, ' ').trim();
  const estimulo = extraerEstimulo(texto);
  const ultimaPalabra = extraerUltimaPalabra(texto);
  const reboteCorrecto =
    params.palabraEsperada === '' || (estimulo !== '' && palabrasCompatibles(estimulo, params.palabraEsperada));

  return {
    autor: params.autor,
    texto,
    estimulo,
    ultimaPalabra,
    palabraEsperada: params.palabraEsperada,
    reboteCorrecto,
  };
}

export function evaluarTurnosSiYoFuera(turnos: TurnoJuego[]): EvaluacionJuego {
  const turnosJugador = turnos.filter((turno) => turno.autor === 'jugador');
  const rebotesCorrectosJugador = turnosJugador.filter((turno) => turno.reboteCorrecto).length;

  if (turnosJugador.length === 0) {
    return {
      aprobado: false,
      comentario:
        'No he detectado ninguna intervención del jugador. Empieza con una frase completa: "Si yo fuera..." o "Si yo fuese...".',
      turnos,
      turnosJugador: 0,
      rebotesCorrectosJugador: 0,
    };
  }

  if (turnosJugador.length < 2) {
    return {
      aprobado: false,
      comentario:
        'Has iniciado la cadena, pero todavía falta ida y vuelta. Busca al menos dos turnos tuyos para entrenar el rebote con la compañera.',
      turnos,
      turnosJugador: turnosJugador.length,
      rebotesCorrectosJugador,
    };
  }

  if (rebotesCorrectosJugador < turnosJugador.length) {
    return {
      aprobado: false,
      comentario:
        'La cadena avanza, pero alguna respuesta no toma con claridad la última palabra de la IA. Escucha su cierre, úsalo como sujeto y completa el predicado.',
      turnos,
      turnosJugador: turnosJugador.length,
      rebotesCorrectosJugador,
    };
  }

  return {
    aprobado: true,
    comentario:
      'Buen juego de escucha. Tus turnos recogen la última palabra de la compañera y la transforman en una propuesta nueva.',
    turnos,
    turnosJugador: turnosJugador.length,
    rebotesCorrectosJugador,
  };
}

export function evaluarHistoriaInterrumpida(turnos: TurnoJuego[]): EvaluacionJuego {
  const turnosJugador = turnos.filter((turno) => turno.autor === 'jugador');
  const turnosIA = turnos.filter((turno) => turno.autor === 'ia');

  if (turnosJugador.length === 0) {
    return {
      aprobado: false,
      comentario:
        'No he detectado ninguna intervención del jugador. Empieza narrando una historia en pasado y en primera persona.',
      turnos,
      turnosJugador: 0,
      rebotesCorrectosJugador: 0,
    };
  }

  if (turnosJugador.length < 2 || turnosIA.length < 1) {
    return {
      aprobado: false,
      comentario:
        'La historia ha empezado, pero todavía necesita más ida y vuelta. Acepta la frase de la IA y continúa desde ahí.',
      turnos,
      turnosJugador: turnosJugador.length,
      rebotesCorrectosJugador: turnosJugador.length,
    };
  }

  return {
    aprobado: true,
    comentario:
      'Buen trabajo de aceptación. La historia se construye por turnos y cada intervención recoge la propuesta anterior para seguir avanzando.',
    turnos,
    turnosJugador: turnosJugador.length,
    rebotesCorrectosJugador: turnosJugador.length,
  };
}
