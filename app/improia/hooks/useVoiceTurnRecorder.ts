'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface DetectorVoz {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  intervalo: NodeJS.Timeout | null;
  habloAlMenosUnaVez: boolean;
  iniciadoEn: number | null;
  procesandoSilencio: boolean;
  ruidoBase: number | null;
  ultimoSonidoEn: number | null;
}

const CALIBRACION_RUIDO_MS = 700;
const SILENCIO_DESPUES_DE_HABLAR_MS = 1200;
const DURACION_MAXIMA_TURNO_CON_VOZ_MS = 12000;
const DURACION_MAXIMA_TURNO_SIN_VOZ_MS = 6500;
const DURACION_MAXIMA_TURNO_ABSOLUTA_MS = 14000;
const UMBRAL_VOZ_MINIMO = 0.018;
const UMBRAL_SILENCIO_MINIMO = 0.014;

export function useVoiceTurnRecorder() {
  const [escuchando, setEscuchando] = useState(false);
  const detectorVozRef = useRef<DetectorVoz>({
    audioContext: null,
    analyser: null,
    intervalo: null,
    habloAlMenosUnaVez: false,
    iniciadoEn: null,
    procesandoSilencio: false,
    ruidoBase: null,
    ultimoSonidoEn: null,
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fragmentosAudioRef = useRef<Blob[]>([]);
  const flujoAudioRef = useRef<MediaStream | null>(null);

  const liberarDetector = useCallback(() => {
    const { audioContext, intervalo } = detectorVozRef.current;

    if (intervalo) {
      clearInterval(intervalo);
    }

    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }

    detectorVozRef.current = {
      audioContext: null,
      analyser: null,
      intervalo: null,
      habloAlMenosUnaVez: false,
      iniciadoEn: null,
      procesandoSilencio: false,
      ruidoBase: null,
      ultimoSonidoEn: null,
    };
  }, []);

  function calcularRms(bufferDatos: Uint8Array): number {
    let sumaCuadrados = 0;

    for (const valor of bufferDatos) {
      const muestraNormalizada = (valor - 128) / 128;
      sumaCuadrados += muestraNormalizada * muestraNormalizada;
    }

    return Math.sqrt(sumaCuadrados / bufferDatos.length);
  }

  const liberarMicrofono = useCallback(() => {
    liberarDetector();

    if (flujoAudioRef.current) {
      flujoAudioRef.current.getTracks().forEach((track) => track.stop());
      flujoAudioRef.current = null;
    }
  }, [liberarDetector]);

  useEffect(() => {
    return () => {
      liberarMicrofono();
    };
  }, [liberarMicrofono]);

  const solicitarMicrofono = useCallback(async (): Promise<MediaStream> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    flujoAudioRef.current = stream;
    return stream;
  }, []);

  const iniciarGrabacion = useCallback(async (streamExistente?: MediaStream | null, onSilencio?: () => void) => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        return;
      }

      fragmentosAudioRef.current = [];
      let stream = streamExistente || flujoAudioRef.current;

      if (!stream || !stream.active) {
        stream = await solicitarMicrofono();
      }

      flujoAudioRef.current = stream;

      const opciones = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' } : undefined;
      const mediaRecorder = new MediaRecorder(stream, opciones);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          fragmentosAudioRef.current.push(event.data);
        }
      };

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const iniciadoEn = Date.now();

      detectorVozRef.current = {
        audioContext,
        analyser,
        habloAlMenosUnaVez: false,
        iniciadoEn,
        procesandoSilencio: false,
        ruidoBase: null,
        ultimoSonidoEn: null,
        intervalo: setInterval(() => {
          const bufferDatos = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(bufferDatos);
          const rms = calcularRms(bufferDatos);
          const ahora = Date.now();
          const detector = detectorVozRef.current;
          const tiempoDesdeInicio = detector.iniciadoEn ? ahora - detector.iniciadoEn : 0;

          if (tiempoDesdeInicio < CALIBRACION_RUIDO_MS) {
            detector.ruidoBase = detector.ruidoBase === null ? rms : Math.min(detector.ruidoBase, rms);
            return;
          }

          const ruidoBase = detector.ruidoBase ?? 0;
          const umbralVoz = Math.max(UMBRAL_VOZ_MINIMO, ruidoBase * 2.2);
          const umbralSilencio = Math.max(UMBRAL_SILENCIO_MINIMO, ruidoBase * 1.35);

          if (rms >= umbralVoz) {
            detector.habloAlMenosUnaVez = true;
            detector.ultimoSonidoEn = ahora;
            return;
          }

          const silencioMs = detector.ultimoSonidoEn ? ahora - detector.ultimoSonidoEn : 0;
          const turnoConVozMs = detector.ultimoSonidoEn && detector.iniciadoEn ? ahora - detector.iniciadoEn : 0;
          const debeCerrarPorSilencio = detector.habloAlMenosUnaVez && rms <= umbralSilencio && silencioMs > SILENCIO_DESPUES_DE_HABLAR_MS;
          const debeCerrarPorMaximo = detector.habloAlMenosUnaVez && turnoConVozMs > DURACION_MAXIMA_TURNO_CON_VOZ_MS;
          const debeCerrarSinVoz = !detector.habloAlMenosUnaVez && tiempoDesdeInicio > DURACION_MAXIMA_TURNO_SIN_VOZ_MS;
          const debeCerrarPorAbsoluto = tiempoDesdeInicio > DURACION_MAXIMA_TURNO_ABSOLUTA_MS;

          if (
            onSilencio &&
            (debeCerrarPorSilencio || debeCerrarPorMaximo || debeCerrarSinVoz || debeCerrarPorAbsoluto) &&
            !detector.procesandoSilencio
          ) {
            detector.procesandoSilencio = true;
            onSilencio();
          }
        }, 100),
      };

      mediaRecorder.start(500);
      setEscuchando(true);
    } catch (error) {
      console.error('Error al iniciar grabación con VAD:', error);
    }
  }, [solicitarMicrofono]);

  const detenerGrabacionYObtenerAudio = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return null;
    }

    setEscuchando(false);
    const mediaRecorder = mediaRecorderRef.current;
    const mimeTypeUsado = mediaRecorder.mimeType;
    const habloAlMenosUnaVez = detectorVozRef.current.habloAlMenosUnaVez;

    liberarDetector();

    const audioBlobListo = await new Promise<Blob | null>((resolve) => {
      mediaRecorder.onstop = () => {
        if (fragmentosAudioRef.current.length === 0) {
          resolve(null);
          return;
        }

        const audioBlob = new Blob(fragmentosAudioRef.current, { type: mimeTypeUsado });

        if (audioBlob.size < 1200) {
          resolve(null);
          return;
        }

        resolve(habloAlMenosUnaVez || audioBlob.size > 3500 ? audioBlob : null);
      };

      mediaRecorder.stop();
    });

    fragmentosAudioRef.current = [];
    return audioBlobListo;
  }, [liberarDetector]);

  const cancelarGrabacion = useCallback(() => {
    setEscuchando(false);
    liberarDetector();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }

    fragmentosAudioRef.current = [];
  }, [liberarDetector]);

  return {
    cancelarGrabacion,
    detenerGrabacionYObtenerAudio,
    escuchando,
    iniciarGrabacion,
    liberarMicrofono,
    solicitarMicrofono,
  };
}
