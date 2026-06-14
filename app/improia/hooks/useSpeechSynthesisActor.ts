'use client';

import { useCallback, useEffect, useRef } from 'react';

const RETARDO_ARRANQUE_VOZ_MS = 180;
const RETARDO_TRAS_CALENTAMIENTO_MS = 120;
const TEXTO_CALENTAMIENTO_VOZ = '.';

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

  return limpio;
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

    timeoutVozRef.current = setTimeout(() => {
      const vozElegida = obtenerVozHumanaSinHelena();
      const calentamiento = new SpeechSynthesisUtterance(TEXTO_CALENTAMIENTO_VOZ);

      aplicarVozComun(calentamiento, vozElegida);
      calentamiento.volume = 0;

      calentamiento.onstart = () => {
        reproduciendoRef.current = true;
        params.onStart();
      };

      const reproducirTextoReal = () => {
        timeoutVozRef.current = setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(textoPreparado);
          aplicarVozComun(utterance, vozElegida);

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
        }, RETARDO_TRAS_CALENTAMIENTO_MS);
      };

      calentamiento.onend = reproducirTextoReal;
      calentamiento.onerror = reproducirTextoReal;

      try {
        window.speechSynthesis.speak(calentamiento);
      } catch (error) {
        console.error('Error en calentamiento de sintesis de voz:', error);
        reproducirTextoReal();
      };
    }, RETARDO_ARRANQUE_VOZ_MS);
  }, [limpiarTimeoutVoz, params]);

  return {
    cancelarVoz,
    reproducirVoz,
  };
}
