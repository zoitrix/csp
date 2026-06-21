'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AYUDAS_PORTERO_INICIAL,
  JUEGOS_IMPRO,
  TIEMPO_JUEGO_INICIAL,
  TIEMPO_PORTERO_INICIAL,
} from '../constants';
import {
  crearTurno,
  evaluarHistoriaInterrumpida,
  evaluarPortero,
  evaluarTurnosSiYoFuera,
} from '../services/analysis';
import { generarTurnoCompanera } from '../services/companion';
import {
  evaluarRespuestasPortero,
  generarProblemaPortero,
  generarRespuestaCompaneraJuego,
  generarRespuestaHistoriaInterrumpida,
  transcribirAudioJuego,
} from '../services/groq';
import type { EvaluacionJuego, FaseTurnoJuego, JuegoId, PantallaJuego, TurnoJuego } from '../types';
import { useSpeechSynthesisActor } from '../../improia/hooks/useSpeechSynthesisActor';
import { useNativeRecorder } from '../../structure/hooks/useNativeRecorder';

const EVALUACION_INICIAL: EvaluacionJuego = {
  aprobado: false,
  comentario: '',
  turnos: [],
  turnosJugador: 0,
  rebotesCorrectosJugador: 0,
  evaluacionesProblemas: [],
};

function buscarJuegoPorId(id: JuegoId) {
  return JUEGOS_IMPRO.find((juego) => juego.id === id) ?? JUEGOS_IMPRO[0];
}

function crearTurnoFallbackHistoria(): TurnoJuego {
  return crearTurno({
    autor: 'ia',
    texto: 'Entonces apareció un nuevo problema que nos obligó a cambiar de plan.',
    palabraEsperada: '',
  });
}

function crearTurnoFallbackPortero(): TurnoJuego {
  return crearTurno({
    autor: 'ia',
    texto: 'Perdone, necesito ayuda urgente: mi maleta se ha abierto y he perdido los papeles.',
    palabraEsperada: '',
  });
}

export function useGamesController() {
  const [juegoId, setJuegoIdState] = useState<JuegoId>(JUEGOS_IMPRO[0].id);
  const [tiempoConfig, setTiempoConfig] = useState(TIEMPO_JUEGO_INICIAL);
  const [objetivoAyudas, setObjetivoAyudas] = useState(AYUDAS_PORTERO_INICIAL);
  const [pantalla, setPantalla] = useState<PantallaJuego>('config');
  const [faseTurno, setFaseTurno] = useState<FaseTurnoJuego>('jugador');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTexto, setLoadingTexto] = useState('');
  const [textoUsuario, setTextoUsuario] = useState('');
  const [turnos, setTurnos] = useState<TurnoJuego[]>([]);
  const [evaluacion, setEvaluacion] = useState<EvaluacionJuego>(EVALUACION_INICIAL);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const juegoIdRef = useRef(juegoId);
  const tiempoConfigRef = useRef(tiempoConfig);
  const objetivoAyudasRef = useRef(objetivoAyudas);
  const timeLeftRef = useRef(timeLeft);
  const turnosRef = useRef<TurnoJuego[]>([]);
  const palabraEsperadaRef = useRef('');
  const cerrarTrasTurnoRef = useRef(false);
  const faseTurnoRef = useRef<FaseTurnoJuego>('jugador');
  const partidaActivaRef = useRef(false);
  const recorderRef = useRef<ReturnType<typeof useNativeRecorder> | null>(null);

  useEffect(() => {
    juegoIdRef.current = juegoId;
  }, [juegoId]);

  useEffect(() => {
    tiempoConfigRef.current = tiempoConfig;
  }, [tiempoConfig]);

  useEffect(() => {
    objetivoAyudasRef.current = objetivoAyudas;
  }, [objetivoAyudas]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    turnosRef.current = turnos;
  }, [turnos]);

  useEffect(() => {
    faseTurnoRef.current = faseTurno;
  }, [faseTurno]);

  const finalizarPartida = useCallback(async (turnosFinales = turnosRef.current) => {
    partidaActivaRef.current = false;
    setPantalla('feedback');
    setFaseTurno('jugador');
    setLoading(juegoIdRef.current === 'el-portero');
    setLoadingTexto(juegoIdRef.current === 'el-portero' ? 'Evaluando tus soluciones...' : '');

    if (juegoIdRef.current === 'el-portero') {
      const evaluacionBase = evaluarPortero(turnosFinales);

      try {
        const evaluacionIA = await evaluarRespuestasPortero({ turnos: turnosFinales });
        const adecuadas = evaluacionIA.evaluaciones.filter((item) => item.adecuada).length;

        setEvaluacion({
          ...evaluacionBase,
          aprobado: evaluacionIA.evaluaciones.length > 0 && adecuadas >= Math.ceil(evaluacionIA.evaluaciones.length * 0.6),
          comentario: evaluacionIA.comentarioGlobal,
          evaluacionesProblemas: evaluacionIA.evaluaciones,
        });
      } catch (error) {
        console.warn('No se pudo evaluar El portero con IA:', error);
        setEvaluacion(evaluacionBase);
      } finally {
        setLoading(false);
        setLoadingTexto('');
      }

      return;
    }

    setLoading(false);
    setLoadingTexto('');
    setEvaluacion(
      juegoIdRef.current === 'historia-interrumpida'
        ? evaluarHistoriaInterrumpida(turnosFinales)
        : evaluarTurnosSiYoFuera(turnosFinales),
    );
  }, []);

  const vozCompanera = useSpeechSynthesisActor({
    onStart: () => setFaseTurno('ia'),
    onEnd: () => undefined,
  });

  const hablarYEscuchar = useCallback((turnoIA: TurnoJuego, reiniciarTiempo: boolean) => {
    vozCompanera.reproducirVoz(turnoIA.texto, () => {
      if (!partidaActivaRef.current) {
        return;
      }

      if (cerrarTrasTurnoRef.current) {
        finalizarPartida(turnosRef.current);
        return;
      }

      if (reiniciarTiempo) {
        setTimeLeft(tiempoConfigRef.current);
      }

      setFaseTurno('jugador');
      recorderRef.current?.iniciarGrabacion();
    });
  }, [finalizarPartida, vozCompanera]);

  const generarSiguienteProblemaPortero = useCallback(async (historial: TurnoJuego[]) => {
    setLoading(true);
    setLoadingTexto('Llega un nuevo personaje con un problema...');

    let turnoIA: TurnoJuego;

    try {
      const problema = await generarProblemaPortero({ historial });
      turnoIA = crearTurno({ autor: 'ia', texto: problema, palabraEsperada: '' });
    } catch (error) {
      console.warn('Fallback local para El portero:', error);
      turnoIA = crearTurnoFallbackPortero();
    }

    const turnosConProblema = [...historial, turnoIA];
    setTurnos(turnosConProblema);
    turnosRef.current = turnosConProblema;
    setLoading(false);
    setLoadingTexto('');
    hablarYEscuchar(turnoIA, true);
  }, [hablarYEscuchar]);

  const procesarTurnoJugador = useCallback(async (audioBlob: Blob | null) => {
    if (!partidaActivaRef.current) {
      return;
    }

    setLoading(true);
    setFaseTurno('procesando');

    try {
      setLoadingTexto('Escuchando tu frase...');
      const transcripcion = await transcribirAudioJuego(audioBlob);
      const esPortero = juegoIdRef.current === 'el-portero';

      if (!transcripcion.trim() && !esPortero) {
        setLoading(false);
        setLoadingTexto('');

        if (cerrarTrasTurnoRef.current || timeLeftRef.current <= 0) {
          finalizarPartida();
          return;
        }

        setFaseTurno('jugador');
        setTimeout(() => recorderRef.current?.iniciarGrabacion(), 150);
        return;
      }

      const esHistoria = juegoIdRef.current === 'historia-interrumpida';
      const turnoJugador = crearTurno({
        autor: 'jugador',
        texto: transcripcion.trim() || '[Sin respuesta]',
        palabraEsperada: esHistoria || esPortero ? '' : palabraEsperadaRef.current,
      });
      const turnosConJugador = [...turnosRef.current, turnoJugador];

      setTextoUsuario((prev) => (prev ? `${prev}\n${turnoJugador.texto}` : turnoJugador.texto));
      setTurnos(turnosConJugador);
      turnosRef.current = turnosConJugador;

      if (
        cerrarTrasTurnoRef.current ||
        (!esPortero && timeLeftRef.current <= 0) ||
        (!esHistoria && !esPortero && !turnoJugador.ultimaPalabra)
      ) {
        finalizarPartida(turnosConJugador);
        return;
      }

      if (esPortero) {
        const ayudasResueltas = turnosConJugador.filter((turno) => turno.autor === 'jugador').length;

        if (ayudasResueltas >= objetivoAyudasRef.current) {
          finalizarPartida(turnosConJugador);
          return;
        }

        await generarSiguienteProblemaPortero(turnosConJugador);
        return;
      }

      setLoadingTexto(esHistoria ? 'La compañera está continuando la historia...' : 'La compañera está rebotando...');
      let turnoIA: TurnoJuego;

      try {
        const respuestaIA = esHistoria
          ? await generarRespuestaHistoriaInterrumpida({ historial: turnosConJugador })
          : await generarRespuestaCompaneraJuego({
              palabra: turnoJugador.ultimaPalabra,
              historial: turnosConJugador,
            });

        turnoIA = crearTurno({
          autor: 'ia',
          texto: respuestaIA,
          palabraEsperada: esHistoria ? '' : turnoJugador.ultimaPalabra,
        });
      } catch (error) {
        console.warn('Fallback local para la compañera IA:', error);
        turnoIA = esHistoria
          ? crearTurnoFallbackHistoria()
          : generarTurnoCompanera(turnoJugador.ultimaPalabra, turnosConJugador);
      }

      const turnosConIA = [...turnosConJugador, turnoIA];

      palabraEsperadaRef.current = esHistoria ? '' : turnoIA.ultimaPalabra;
      setTurnos(turnosConIA);
      turnosRef.current = turnosConIA;
      setLoading(false);
      setLoadingTexto('');
      hablarYEscuchar(turnoIA, false);
    } catch (error) {
      console.error('Fallo en el juego:', error);
      finalizarPartida(turnosRef.current);
    }
  }, [finalizarPartida, generarSiguienteProblemaPortero, hablarYEscuchar]);

  const recorder = useNativeRecorder(procesarTurnoJugador);

  useEffect(() => {
    recorderRef.current = recorder;
  }, [recorder]);

  useEffect(() => {
    const esPortero = juegoIdRef.current === 'el-portero';

    if (pantalla === 'jugando' && timeLeft > 0 && (!esPortero || faseTurno === 'jugador')) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && pantalla === 'jugando') {
      if (esPortero) {
        if (faseTurnoRef.current === 'jugador') {
          recorder.detenerGrabacion();
        }
      } else {
        cerrarTrasTurnoRef.current = true;

        if (faseTurnoRef.current === 'jugador') {
          recorder.detenerGrabacion();
        } else {
          finalizarPartida(turnosRef.current);
        }
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [faseTurno, finalizarPartida, pantalla, recorder, timeLeft]);

  const handleTiempoChange = useCallback((valor: number) => {
    setTiempoConfig(valor);
  }, []);

  const handleObjetivoAyudasChange = useCallback((valor: number) => {
    setObjetivoAyudas(valor);
  }, []);

  const handleJuegoChange = useCallback((id: JuegoId) => {
    setJuegoIdState(id);
    setTiempoConfig(id === 'el-portero' ? TIEMPO_PORTERO_INICIAL : TIEMPO_JUEGO_INICIAL);
  }, []);

  const iniciarJuego = useCallback(async () => {
    const tiempo = tiempoConfigRef.current;

    if (tiempo <= 0) {
      alert('Introduce un tiempo válido mayor que 0 segundos.');
      return;
    }

    setLoading(true);
    setLoadingTexto('Preparando el juego...');
    setTextoUsuario('');
    setTurnos([]);
    turnosRef.current = [];
    palabraEsperadaRef.current = '';
    cerrarTrasTurnoRef.current = false;
    partidaActivaRef.current = true;
    setEvaluacion(EVALUACION_INICIAL);

    try {
      setTimeLeft(juegoIdRef.current === 'el-portero' ? 0 : tiempo);
      setFaseTurno(juegoIdRef.current === 'el-portero' ? 'ia' : 'jugador');
      setPantalla('jugando');

      if (juegoIdRef.current === 'el-portero') {
        await generarSiguienteProblemaPortero([]);
        return;
      }

      await recorder.iniciarGrabacion();
    } catch (error) {
      console.error(error);
      alert('No he podido abrir el micrófono. Revisa los permisos del navegador.');
      partidaActivaRef.current = false;
      setPantalla('config');
    } finally {
      if (juegoIdRef.current !== 'el-portero') {
        setLoading(false);
        setLoadingTexto('');
      }
    }
  }, [generarSiguienteProblemaPortero, recorder]);

  const terminarFraseJugador = useCallback(() => {
    if (faseTurnoRef.current !== 'jugador') {
      return;
    }

    recorder.detenerGrabacion();
  }, [recorder]);

  const terminarJuego = useCallback(() => {
    cerrarTrasTurnoRef.current = true;
    vozCompanera.cancelarVoz();

    if (timerRef.current) clearTimeout(timerRef.current);

    if (faseTurnoRef.current === 'jugador') {
      recorder.detenerGrabacion();
    } else {
      finalizarPartida(turnosRef.current);
    }
  }, [finalizarPartida, recorder, vozCompanera]);

  const reintentarJuego = useCallback(async () => {
    vozCompanera.cancelarVoz();
    setTextoUsuario('');
    setTurnos([]);
    turnosRef.current = [];
    palabraEsperadaRef.current = '';
    cerrarTrasTurnoRef.current = false;
    partidaActivaRef.current = true;
    setEvaluacion(EVALUACION_INICIAL);
    setTimeLeft(juegoIdRef.current === 'el-portero' ? 0 : tiempoConfigRef.current);
    setFaseTurno(juegoIdRef.current === 'el-portero' ? 'ia' : 'jugador');
    setPantalla('jugando');

    if (juegoIdRef.current === 'el-portero') {
      await generarSiguienteProblemaPortero([]);
      return;
    }

    setTimeout(() => recorder.iniciarGrabacion(), 100);
  }, [generarSiguienteProblemaPortero, recorder, vozCompanera]);

  const reiniciarJuego = useCallback(() => {
    vozCompanera.cancelarVoz();
    recorder.liberarMicrofono();
    partidaActivaRef.current = false;
    setPantalla('config');
    setTextoUsuario('');
    setTurnos([]);
    setEvaluacion(EVALUACION_INICIAL);
    setTimeLeft(0);
    setFaseTurno('jugador');
  }, [recorder, vozCompanera]);

  return {
    escuchando: recorder.escuchando,
    evaluacion,
    faseTurno,
    juego: buscarJuegoPorId(juegoId),
    juegoId,
    juegos: JUEGOS_IMPRO,
    ayudasResueltas: turnos.filter((turno) => turno.autor === 'jugador').length,
    handleTiempoChange,
    handleObjetivoAyudasChange,
    iniciarJuego,
    loading,
    loadingTexto,
    pantalla,
    reiniciarJuego,
    reintentarJuego,
    setJuegoId: handleJuegoChange,
    terminarFraseJugador,
    terminarJuego,
    textoUsuario,
    tiempoConfig,
    objetivoAyudas,
    timeLeft,
    turnos,
  };
}
