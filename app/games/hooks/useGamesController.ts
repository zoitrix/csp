'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { JUEGOS_IMPRO, TIEMPO_JUEGO_INICIAL } from '../constants';
import { crearTurno, evaluarHistoriaInterrumpida, evaluarTurnosSiYoFuera } from '../services/analysis';
import { generarTurnoCompanera } from '../services/companion';
import {
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

export function useGamesController() {
  const [juegoId, setJuegoId] = useState<JuegoId>(JUEGOS_IMPRO[0].id);
  const [tiempoConfig, setTiempoConfig] = useState(TIEMPO_JUEGO_INICIAL);
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
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    turnosRef.current = turnos;
  }, [turnos]);

  useEffect(() => {
    faseTurnoRef.current = faseTurno;
  }, [faseTurno]);

  const finalizarPartida = useCallback((turnosFinales = turnosRef.current) => {
    partidaActivaRef.current = false;
    setPantalla('feedback');
    setFaseTurno('jugador');
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

  const procesarTurnoJugador = useCallback(async (audioBlob: Blob | null) => {
    if (!partidaActivaRef.current) {
      return;
    }

    setLoading(true);
    setFaseTurno('procesando');

    try {
      setLoadingTexto('Escuchando tu frase...');
      const transcripcion = await transcribirAudioJuego(audioBlob);

      if (!transcripcion.trim()) {
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
        texto: transcripcion,
        palabraEsperada: esHistoria ? '' : palabraEsperadaRef.current,
      });
      const turnosConJugador = [...turnosRef.current, turnoJugador];

      setTextoUsuario((prev) => (prev ? `${prev}\n${turnoJugador.texto}` : turnoJugador.texto));
      setTurnos(turnosConJugador);
      turnosRef.current = turnosConJugador;

      if (cerrarTrasTurnoRef.current || timeLeftRef.current <= 0 || (!esHistoria && !turnoJugador.ultimaPalabra)) {
        finalizarPartida(turnosConJugador);
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

      vozCompanera.reproducirVoz(turnoIA.texto, () => {
        if (!partidaActivaRef.current) {
          return;
        }

        if (timeLeftRef.current <= 0 || cerrarTrasTurnoRef.current) {
          finalizarPartida(turnosRef.current);
          return;
        }

        setFaseTurno('jugador');
        recorderRef.current?.iniciarGrabacion();
      });
    } catch (error) {
      console.error('Fallo en el juego:', error);
      finalizarPartida(turnosRef.current);
    }
  }, [finalizarPartida, vozCompanera]);

  const recorder = useNativeRecorder(procesarTurnoJugador);

  useEffect(() => {
    recorderRef.current = recorder;
  }, [recorder]);

  useEffect(() => {
    if (pantalla === 'jugando' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && pantalla === 'jugando') {
      cerrarTrasTurnoRef.current = true;

      if (faseTurnoRef.current === 'jugador') {
        recorder.detenerGrabacion();
      } else {
        finalizarPartida(turnosRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [finalizarPartida, pantalla, recorder, timeLeft]);

  const handleTiempoChange = useCallback((valor: number) => {
    setTiempoConfig(valor);
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
      setTimeLeft(tiempo);
      setFaseTurno('jugador');
      setPantalla('jugando');
      await recorder.iniciarGrabacion();
    } catch (error) {
      console.error(error);
      alert('No he podido abrir el micrófono. Revisa los permisos del navegador.');
      partidaActivaRef.current = false;
      setPantalla('config');
    } finally {
      setLoading(false);
      setLoadingTexto('');
    }
  }, [recorder]);

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
    setTimeLeft(tiempoConfigRef.current);
    setFaseTurno('jugador');
    setPantalla('jugando');
    setTimeout(() => recorder.iniciarGrabacion(), 100);
  }, [recorder, vozCompanera]);

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
    handleTiempoChange,
    iniciarJuego,
    loading,
    loadingTexto,
    pantalla,
    reiniciarJuego,
    reintentarJuego,
    setJuegoId,
    terminarFraseJugador,
    terminarJuego,
    textoUsuario,
    tiempoConfig,
    timeLeft,
    turnos,
  };
}
