'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { INFORME_INICIAL, TIEMPOS_INICIALES } from '../constants';
import { evaluarActoDirector, generarReplicaCoactor, generarTituloChat, transcribirTurno } from '../services/groq';
import type { DificultadChat, FaseActo, InformeDirector, MensajeChat, PantallaChat, TiemposConfig } from '../types';
import { useSpeechSynthesisActor } from './useSpeechSynthesisActor';
import { useVoiceTurnRecorder } from './useVoiceTurnRecorder';

const FASES_EVALUACION: FaseActo[] = ['intro', 'nudo', 'desenlace'];

function getLineasUsuario(historial: MensajeChat[]): string[] {
  return historial.filter((mensaje) => mensaje.role === 'user').map((mensaje) => mensaje.content.trim()).filter(Boolean);
}

function textoNormalizado(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function ultimoTurnoUsuario(historial: MensajeChat[]): string {
  return [...historial].reverse().find((mensaje) => mensaje.role === 'user')?.content.trim() || '';
}

function ultimoTurnoPareceAbierto(historial: MensajeChat[]): boolean {
  const ultimoTurno = ultimoTurnoUsuario(historial);
  const normalizado = textoNormalizado(ultimoTurno);

  return (
    !ultimoTurno ||
    /[?\u00bf]\s*$/.test(ultimoTurno) ||
    /\b(y si|que pasa si|deberiamos|podriamos|vamos a|voy a|iba a|plan|alarma|nos siguen|nos atrapan|salimos corriendo)\b/.test(
      normalizado,
    )
  );
}

function evaluarCriterioLocal(fase: FaseActo, historial: MensajeChat[], textoActor: string) {
  const lineasUsuario = getLineasUsuario(historial);
  const texto = textoNormalizado(textoActor);

  if (fase === 'intro') {
    const aprobado = lineasUsuario.length >= 2 && texto.length > 80;

    return {
      aprobado,
      comentario: aprobado
        ? 'La introduccion ofrece una plataforma jugable porque el actor sostiene varias intervenciones, abre una situacion reconocible y empieza a negociar un conflicto con el co-actor. Aunque el Director automatico no pudo completar su lectura, el libreto muestra suficiente relacion escenica, objetivo y tension inicial para arrancar la obra con claridad.'
        : 'La introduccion queda demasiado debil porque el actor aporta pocas lineas o material demasiado general. Para aprobar, deberia verse una situacion concreta, una relacion escenica y un primer conflicto conectado al titulo, no solo una frase suelta o una respuesta que dependa de que el co-actor invente toda la plataforma.',
      transcripcionAcumulada: textoActor || 'Sin intervencion de voz.',
    };
  }

  if (fase === 'nudo') {
    const indicadoresProgreso = /(pero|entonces|ahora|si no|tenemos que|resulta|descubro|aparece|problema|norma|amenaza|guerra|investigar|decidimos)/.test(
      texto,
    );
    const aprobado = lineasUsuario.length >= 5 && indicadoresProgreso;

    return {
      aprobado,
      comentario: aprobado
        ? 'El nudo muestra desarrollo suficiente porque el actor mantiene varias rondas de intercambio, acepta el juego propuesto y empuja la situacion hacia complicaciones nuevas. Se aprecia escucha activa y progresion, aunque convendria concentrar mejor los giros para que no parezcan solo variaciones del mismo problema.'
        : 'El nudo queda plano o demasiado corto. Para aprobar, la obra necesita una complicacion reconocible: revelacion, obstaculo, cambio de estrategia, amenaza o escalada que transforme la situacion inicial. Aqui el actor no empuja lo bastante el conflicto y la escena no gana una segunda capa dramatica clara.',
      transcripcionAcumulada: textoActor || 'Sin intervencion de voz.',
    };
  }

  const abierto = ultimoTurnoPareceAbierto(historial);
  const aprobado = lineasUsuario.length >= 4 && !abierto;

  return {
    aprobado,
    comentario: aprobado
      ? 'El desenlace alcanza un cierre reconocible porque el actor participa en una decision final y la escena deja de abrir problemas nuevos. La solucion puede ser absurda o sencilla, pero funciona si convierte el juego acumulado en una consecuencia clara para los personajes y permite apagar la escena sin preguntas importantes pendientes.'
      : 'La escena no termina de cerrar. El actor puede haber sostenido bien el nudo, pero el final necesita una decision, consecuencia visible o remate definitivo. Si la ultima intervencion deja una pregunta, un plan futuro o una amenaza activa, el publico sigue esperando el verdadero cierre.',
    transcripcionAcumulada: textoActor || 'Sin intervencion de voz.',
  };
}

export function useImproChatController() {
  const [dificultad, setDificultad] = useState<DificultadChat>('media');
  const [tiemposConfig, setTiemposConfig] = useState<TiemposConfig>(TIEMPOS_INICIALES);
  const [pantalla, setPantalla] = useState<PantallaChat>('config');
  const [titulo, setTitulo] = useState('');
  const [historialLetra, setHistorialLetra] = useState<MensajeChat[]>([]);
  const [titulos, setTitulos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTexto, setLoadingTexto] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [iaHablando, setIaHablando] = useState(false);
  const [informeFinal, setInformeFinal] = useState<InformeDirector>(INFORME_INICIAL);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pantallaRef = useRef<PantallaChat>('config');
  const historialLetraRef = useRef<MensajeChat[]>([]);
  const tituloRef = useRef('');
  const tiemposConfigRef = useRef<TiemposConfig>(TIEMPOS_INICIALES);
  const procesandoTurnoRef = useRef(false);
  const finalizandoRef = useRef(false);

  const recorder = useVoiceTurnRecorder();

  const vozActor = useSpeechSynthesisActor({
    onStart: () => setIaHablando(true),
    onEnd: () => setIaHablando(false),
  });

  useEffect(() => {
    pantallaRef.current = pantalla;
  }, [pantalla]);

  useEffect(() => {
    historialLetraRef.current = historialLetra;
  }, [historialLetra]);

  useEffect(() => {
    tituloRef.current = titulo;
  }, [titulo]);

  useEffect(() => {
    tiemposConfigRef.current = tiemposConfig;
  }, [tiemposConfig]);

  const procesarTurnoConversacionalRef = useRef<() => Promise<void>>(async () => {});

  const iniciarEscuchaAutomatica = useCallback((streamInicial?: MediaStream | null) => {
    setTimeout(() => {
      if (pantallaRef.current === 'jugando' && !procesandoTurnoRef.current && !finalizandoRef.current) {
        recorder.iniciarGrabacion(streamInicial, () => {
          void procesarTurnoConversacionalRef.current();
        });
      }
    }, 100);
  }, [recorder]);

  const evaluarFuncionCompleta = useCallback(async (historial: MensajeChat[]) => {
    const textoActor = historial
      .filter((mensaje) => mensaje.role === 'user')
      .map((mensaje) => mensaje.content)
      .join(' ');

    const entradas = [];

    for (const fase of FASES_EVALUACION) {
      setLoadingTexto(`El Director evalua ${fase}...`);

      try {
        const evaluacion = await evaluarActoDirector({
          fase,
          titulo: tituloRef.current,
          historial,
          textoActor,
        });

        entradas.push([fase, evaluacion] as const);
      } catch (error) {
        console.error(`Error evaluando ${fase}:`, error);
        entradas.push([fase, evaluarCriterioLocal(fase, historial, textoActor)] as const);
      }
    }

    const informe = Object.fromEntries(entradas);

    setInformeFinal({
      intro: informe.intro ?? null,
      nudo: informe.nudo ?? null,
      desenlace: informe.desenlace ?? null,
    });
  }, []);

  const finalizarFuncionYMostrarInforme = useCallback(async () => {
    if (finalizandoRef.current) return;

    finalizandoRef.current = true;
    setLoading(true);
    setLoadingTexto('El Director esta evaluando la obra completa...');
    vozActor.cancelarVoz();

    let historialParaEvaluar = historialLetraRef.current;

    try {
      const audioBlob = await recorder.detenerGrabacionYObtenerAudio();
      const ultimoTexto = await transcribirTurno(audioBlob);

      if (ultimoTexto.trim()) {
        historialParaEvaluar = [...historialParaEvaluar, { role: 'user', content: ultimoTexto.trim() }];
        setHistorialLetra(historialParaEvaluar);
      }
    } catch (error) {
      console.error('No se pudo recuperar el ultimo turno antes de evaluar:', error);
      recorder.cancelarGrabacion();
    }

    recorder.liberarMicrofono();

    await evaluarFuncionCompleta(historialParaEvaluar);

    setLoading(false);
    setLoadingTexto('');
    setIaHablando(false);
    setPantalla('final');
  }, [evaluarFuncionCompleta, recorder, vozActor]);

  useEffect(() => {
    if (pantalla === 'jugando' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (pantalla === 'jugando' && timeLeft === 0) {
      void finalizarFuncionYMostrarInforme();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [finalizarFuncionYMostrarInforme, pantalla, timeLeft]);

  const handleTiempoChange = useCallback((valor: number) => {
    setTiemposConfig({ total: valor });
  }, []);

  const procesarTurnoConversacional = useCallback(async () => {
    if (pantallaRef.current !== 'jugando' || procesandoTurnoRef.current || finalizandoRef.current) return;

    procesandoTurnoRef.current = true;
    setLoading(true);
    setLoadingTexto('Escuchando tu turno...');

    try {
      const audioBlob = await recorder.detenerGrabacionYObtenerAudio();
      const transcripcion = await transcribirTurno(audioBlob);
      const transcripcionUsuario = transcripcion.trim();

      if (!transcripcionUsuario) {
        setLoading(false);
        procesandoTurnoRef.current = false;
        iniciarEscuchaAutomatica();
        return;
      }

      const nuevoHistorial: MensajeChat[] = [
        ...historialLetraRef.current,
        { role: 'user', content: transcripcionUsuario },
      ];

      setHistorialLetra(nuevoHistorial);
      setLoadingTexto('Tu co-actor esta respondiendo...');

      const respuestaIA = await generarReplicaCoactor(nuevoHistorial);
      const historialConIA: MensajeChat[] = [...nuevoHistorial, { role: 'assistant', content: respuestaIA }];

      setHistorialLetra(historialConIA);
      setLoading(false);
      procesandoTurnoRef.current = false;

      vozActor.reproducirVoz(respuestaIA, () => iniciarEscuchaAutomatica());
    } catch (error) {
      console.error(error);
      setLoading(false);
      procesandoTurnoRef.current = false;
      iniciarEscuchaAutomatica();
    }
  }, [iniciarEscuchaAutomatica, recorder, vozActor]);

  useEffect(() => {
    procesarTurnoConversacionalRef.current = procesarTurnoConversacional;
  }, [procesarTurnoConversacional]);

  const iniciarEjercicio = useCallback(async () => {
    let streamInicial: MediaStream | null = null;

    try {
      streamInicial = await recorder.solicitarMicrofono();
    } catch {
      alert('El escenario requiere permisos de microfono.');
      return;
    }

    setLoading(true);
    setLoadingTexto('El publico esta buscando una propuesta...');
    setHistorialLetra([]);
    setInformeFinal(INFORME_INICIAL);
    finalizandoRef.current = false;
    procesandoTurnoRef.current = false;

    try {
      const nuevoTitulo = await generarTituloChat(dificultad, titulos);
      setTitulo(nuevoTitulo);
      setTitulos((prev) => [...prev, nuevoTitulo]);
      setTimeLeft(tiemposConfigRef.current.total);
      setPantalla('jugando');
      setLoading(false);
      iniciarEscuchaAutomatica(streamInicial);
    } catch (error) {
      console.error(error);
      recorder.liberarMicrofono();
      setPantalla('config');
      setLoading(false);
    }
  }, [dificultad, iniciarEscuchaAutomatica, recorder, titulos]);

  const reiniciarTeatroCompleto = useCallback(() => {
    recorder.liberarMicrofono();
    vozActor.cancelarVoz();
    setTitulo('');
    setHistorialLetra([]);
    setPantalla('config');
    setIaHablando(false);
    setInformeFinal(INFORME_INICIAL);
    finalizandoRef.current = false;
    procesandoTurnoRef.current = false;
  }, [recorder, vozActor]);

  return {
    dificultad,
    escuchando: recorder.escuchando,
    finalizarFuncionYMostrarInforme,
    handleTiempoChange,
    historialLetra,
    iaHablando,
    informeFinal,
    iniciarEjercicio,
    loading,
    loadingTexto,
    pantalla,
    reiniciarTeatroCompleto,
    setDificultad,
    tiemposConfig,
    timeLeft,
    titulo,
  };
}
