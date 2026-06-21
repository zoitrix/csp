export type PantallaJuego = 'config' | 'jugando' | 'feedback';

export type JuegoId = 'si-yo-fuera' | 'historia-interrumpida' | 'el-portero';

export type AutorTurno = 'jugador' | 'ia';

export type FaseTurnoJuego = 'jugador' | 'procesando' | 'ia';

export interface JuegoImpro {
  id: JuegoId;
  nombre: string;
  nivel: string;
  duracion: string;
  categoria: string;
  objetivo: string;
  reglas: string;
  ejemplo: string;
  pista: string;
}

export interface TurnoJuego {
  autor: AutorTurno;
  texto: string;
  estimulo: string;
  ultimaPalabra: string;
  palabraEsperada: string;
  reboteCorrecto: boolean;
}

export interface EvaluacionProblema {
  problema: string;
  respuesta: string;
  adecuada: boolean;
  comentario: string;
}

export interface EvaluacionJuego {
  aprobado: boolean;
  comentario: string;
  turnos: TurnoJuego[];
  turnosJugador: number;
  rebotesCorrectosJugador: number;
  evaluacionesProblemas?: EvaluacionProblema[];
}
