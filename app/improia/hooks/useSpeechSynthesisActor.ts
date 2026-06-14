'use client';

import { useCallback, useEffect, useRef } from 'react';

const RETARDO_TRAS_CANCELAR_MS = 260;
const PAUSA_INICIAL_TEXTO = '... ... ';

function obtenerVozHumanaSinHelena(): SpeechSynthesisVoice | null {
  const voces = window.speechSynthesis.getVoices();

  if (voces.length === 0) {
    return null;
  }

  const vocesPermitidas = voces.filter((voz) => voz.lang.startsWith('es') && !voz.name.toLowerCase().includes('helena'));

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

function prepararTextoParaVoz(texto: string): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();

  if (!limpio) {
    return '';
  }

  return `${PAUSA_INICIAL_TEXTO}${limpio}`;
}

function aplicarVozComun(utterance: SpeechSynthesisUtterance, vozElegida: SpeechSynthesisVoice | null) {
  if (vozElegida) {
    utterance.voice = vozElegida;
    utterance.lang = vozElegida.lang;
  } else {
    utterance.lang = 'es-ES';
  }

  utterance.rate = 1.08;
  utterance.pitch = 1.0;
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
  gain.gain.value = 0.0001;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();

  await new Promise((resolve) => setTimeout(resolve, 180));

  oscillator.stop();
  await audioContext.close();
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
      console.warn('SpeechSynthesis no esta soportado.');
      callbackAlTerminar();
      return;
    }

    const textoPreparado = prepararTextoParaVoz(texto);

    if (!textoPreparado) {
      callbackAlTerminar();
      return;
    }

    limpiarTimeoutVoz();
    window.speechSynthesis.cancel();

    timeoutVozRef.current = setTimeout(async () => {
      const vozElegida = obtenerVozHumanaSinHelena();

      try {
        await despertarSalidaAudio();
      } catch (error) {
        console.warn('No se pudo despertar la salida de audio antes de la voz:', error);
      }

      const utterance = new SpeechSynthesisUtterance(textoPreparado);
      aplicarVozComun(utterance, vozElegida);

      utterance.onstart = () => {
        reproduciendoRef.current = true;
        params.onStart();
      };

      utterance.onend = () => {
        reproduciendoRef.current = false;
        params.onEnd();
        callbackAlTerminar();
      };

      utterance.onerror = (event) => {
        reproduciendoRef.current = false;
        console.error('Error en sintesis de voz:', event);
        params.onEnd();
        callbackAlTerminar();
      };

      window.speechSynthesis.speak(utterance);
    }, RETARDO_TRAS_CANCELAR_MS);
  }, [limpiarTimeoutVoz, params]);

  return {
    cancelarVoz,
    reproducirVoz,
  };
}
