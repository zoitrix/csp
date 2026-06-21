'use client';

import { useCallback, useEffect, useRef } from 'react';

const RETARDO_TRAS_CANCELAR_MS = 320;
const DURACION_DESPERTAR_AUDIO_MS = 260;
const RETARDO_TRAS_DESPERTAR_AUDIO_MS = 140;

type TipoVozEscena = 'actor' | 'narrador';

interface SegmentoVozEscena {
  texto: string;
  tipo: TipoVozEscena;
}

function obtenerVocesEspanol(): SpeechSynthesisVoice[] {
  const voces = window.speechSynthesis.getVoices();

  if (voces.length === 0) {
    return [];
  }

  return voces.filter((voz) => voz.lang.startsWith('es') && !voz.name.toLowerCase().includes('helena'));
}

function obtenerVozHumanaSinHelena(): SpeechSynthesisVoice | null {
  const vocesPermitidas = obtenerVocesEspanol();

  const premium = vocesPermitidas.find(
    (voz) => voz.name.includes('Google') || voz.name.includes('Natural') || voz.name.includes('Neural'),
  );

  if (premium) {
    return premium;
  }

  const alternativaLocal = vocesPermitidas.find(
    (voz) => voz.name.includes('Monica') || voz.name.includes('Jorge') || voz.name.includes('Microsoft'),
  );

  return alternativaLocal ?? vocesPermitidas[0] ?? null;
}

function obtenerVozNarrador(vozActor: SpeechSynthesisVoice | null): SpeechSynthesisVoice | null {
  const vocesPermitidas = obtenerVocesEspanol();

  if (vocesPermitidas.length === 0) {
    return null;
  }

  const vozDiferente = vocesPermitidas.find((voz) => voz.voiceURI !== vozActor?.voiceURI);

  return vozDiferente ?? vozActor ?? vocesPermitidas[0] ?? null;
}

function prepararTextoParaVoz(texto: string): string {
  return texto
    .replace(/^\s*(PERSONAJE|ACCION|NARRADOR|TIEMPO)\s*:\s*/i, '')
    .replace(/^\s*\[([^\]]+)\]\s*$/i, '$1')
    .replace(/^\s*\[(Narrador|Director|Accion|Acción|Tiempo|Personaje)\]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectarTipoSegmento(linea: string): TipoVozEscena {
  const normalizada = linea.trim().toLowerCase();

  if (/^(narrador|accion|acción|tiempo)\s*:/.test(normalizada)) {
    return 'narrador';
  }

  if (/^\[(narrador|director|accion|acción|tiempo)\]/.test(normalizada)) {
    return 'narrador';
  }

  if (/^\[[^\]]+\]/.test(normalizada)) {
    return 'narrador';
  }

  return 'actor';
}

function dividirLineaParaVoz(linea: string): SegmentoVozEscena[] {
  const tipoLinea = detectarTipoSegmento(linea);

  if (tipoLinea === 'narrador') {
    const textoPreparado = prepararTextoParaVoz(linea);
    return textoPreparado ? [{ texto: textoPreparado, tipo: 'narrador' }] : [];
  }

  const lineaSinEtiqueta = linea.replace(/^\s*PERSONAJE\s*:\s*/i, '');

  return lineaSinEtiqueta
    .split(/(\[[^\]]+\])/g)
    .map((fragmento) => {
      const textoPreparado = prepararTextoParaVoz(fragmento);

      if (!textoPreparado) {
        return null;
      }

      return {
        texto: textoPreparado,
        tipo: /^\s*\[[^\]]+\]\s*$/.test(fragmento) ? 'narrador' : 'actor',
      };
    })
    .filter((segmento): segmento is SegmentoVozEscena => segmento !== null);
}

function prepararSegmentosVoz(texto: string): SegmentoVozEscena[] {
  return texto
    .split(/\n+/)
    .flatMap(dividirLineaParaVoz)
    .filter((segmento) => segmento.tipo === 'actor');
}

function aplicarVozComun(
  utterance: SpeechSynthesisUtterance,
  vozElegida: SpeechSynthesisVoice | null,
  tipo: TipoVozEscena,
) {
  if (vozElegida) {
    utterance.voice = vozElegida;
    utterance.lang = vozElegida.lang;
  } else {
    utterance.lang = 'es-ES';
  }

  utterance.rate = tipo === 'narrador' ? 0.96 : 1.08;
  utterance.pitch = tipo === 'narrador' ? 0.86 : 1.0;
}

async function despertarSalidaAudio(): Promise<void> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.frequency.value = 440;
  gain.gain.value = 0.002;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();

  await new Promise((resolve) => setTimeout(resolve, DURACION_DESPERTAR_AUDIO_MS));

  oscillator.stop();

  window.setTimeout(() => {
    if (audioContext.state !== 'closed') {
      audioContext.close().catch(() => undefined);
    }
  }, 1200);
}

export function useSpeechSynthesisActor(params: {
  onStart: () => void;
  onEnd: () => void;
}) {
  const timeoutVozRef = useRef<NodeJS.Timeout | null>(null);
  const reproduciendoRef = useRef(false);

  const limpiarTimeoutVoz = useCallback(() => {
    if (timeoutVozRef.current) {
      clearTimeout(timeoutVozRef.current);
      timeoutVozRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    const cargarVoces = () => {
      window.speechSynthesis.getVoices();
    };

    cargarVoces();
    window.speechSynthesis.addEventListener('voiceschanged', cargarVoces);

    return () => {
      limpiarTimeoutVoz();
      window.speechSynthesis.removeEventListener('voiceschanged', cargarVoces);
      window.speechSynthesis.cancel();
    };
  }, [limpiarTimeoutVoz]);

  const cancelarVoz = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      limpiarTimeoutVoz();
      window.speechSynthesis.cancel();

      if (reproduciendoRef.current) {
        reproduciendoRef.current = false;
        params.onEnd();
      }
    }
  }, [limpiarTimeoutVoz, params]);

  const reproducirVoz = useCallback((texto: string, callbackAlTerminar: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('SpeechSynthesis no está soportado.');
      callbackAlTerminar();
      return;
    }

    const segmentosVoz = prepararSegmentosVoz(texto);

    if (segmentosVoz.length === 0) {
      callbackAlTerminar();
      return;
    }

    limpiarTimeoutVoz();
    window.speechSynthesis.cancel();

    timeoutVozRef.current = setTimeout(async () => {
      const vozActor = obtenerVozHumanaSinHelena();
      const vozNarrador = obtenerVozNarrador(vozActor);

      try {
        await despertarSalidaAudio();
        await new Promise((resolve) => setTimeout(resolve, RETARDO_TRAS_DESPERTAR_AUDIO_MS));
      } catch (error) {
        console.warn('No se pudo despertar la salida de audio antes de la voz:', error);
      }

      let indiceSegmento = 0;

      const finalizarSecuencia = () => {
        reproduciendoRef.current = false;
        params.onEnd();
        callbackAlTerminar();
      };

      const reproducirSiguienteSegmento = () => {
        const segmento = segmentosVoz[indiceSegmento];

        if (!segmento) {
          finalizarSecuencia();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(segmento.texto);
        aplicarVozComun(utterance, segmento.tipo === 'narrador' ? vozNarrador : vozActor, segmento.tipo);

        utterance.onstart = () => {
          if (!reproduciendoRef.current) {
            reproduciendoRef.current = true;
            params.onStart();
          }
        };

        utterance.onend = () => {
          indiceSegmento += 1;
          reproducirSiguienteSegmento();
        };

        utterance.onerror = (event) => {
          console.error('Error en sintesis de voz:', event);
          finalizarSecuencia();
        };

        window.speechSynthesis.speak(utterance);
      };

      reproducirSiguienteSegmento();
    }, RETARDO_TRAS_CANCELAR_MS);
  }, [limpiarTimeoutVoz, params]);

  return {
    cancelarVoz,
    reproducirVoz,
  };
}
