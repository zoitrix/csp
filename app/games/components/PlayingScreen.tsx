'use client';

import { useEffect, useRef } from 'react';
import styles from '../../structure/base.module.css';
import type { FaseTurnoJuego, JuegoImpro, TurnoJuego } from '../types';

interface PlayingScreenProps {
  escuchando: boolean;
  faseTurno: FaseTurnoJuego;
  juego: JuegoImpro;
  loading: boolean;
  loadingTexto: string;
  onTerminar: () => void;
  onTerminarFrase: () => void;
  ayudasResueltas: number;
  objetivoAyudas: number;
  timeLeft: number;
  turnos: TurnoJuego[];
}

function textoEstadoTurno(
  faseTurno: FaseTurnoJuego,
  escuchando: boolean,
  loadingTexto: string,
  juego: JuegoImpro,
): string {
  if (faseTurno === 'procesando') {
    return loadingTexto || 'Procesando tu frase...';
  }

  if (faseTurno === 'ia') {
    if (juego.id === 'el-portero') {
      return loadingTexto || 'Llega un personaje con un problema. Escúchalo y responde rápido.';
    }

    return juego.id === 'historia-interrumpida'
      ? 'La compañera IA está continuando la historia. Escucha su propuesta.'
      : 'La compañera IA está respondiendo. Escucha su última palabra.';
  }

  if (juego.id === 'el-portero') {
    return escuchando
      ? 'Tu turno. Resuelve el problema con una acción clara antes de que acabe el tiempo.'
      : 'Preparando tu micrófono...';
  }

  if (juego.id === 'historia-interrumpida') {
    return escuchando
      ? 'Tu turno. Acepta lo último que dijo la IA y continúa la historia.'
      : 'Preparando tu micrófono...';
  }

  return escuchando
    ? 'Tu turno. Di una frase completa que empiece por "Si yo fuera..." o "Si yo fuese...".'
    : 'Preparando tu micrófono...';
}

export function PlayingScreen({
  escuchando,
  faseTurno,
  juego,
  loading,
  loadingTexto,
  onTerminar,
  onTerminarFrase,
  ayudasResueltas,
  objetivoAyudas,
  timeLeft,
  turnos,
}: PlayingScreenProps) {
  const historialRef = useRef<HTMLDivElement | null>(null);
  const ultimoTurno = turnos[turnos.length - 1];
  const ultimaPalabra = ultimoTurno?.ultimaPalabra || '';
  const esHistoria = juego.id === 'historia-interrumpida';
  const esPortero = juego.id === 'el-portero';

  useEffect(() => {
    if (!esPortero || !historialRef.current) {
      return;
    }

    historialRef.current.scrollTop = historialRef.current.scrollHeight;
  }, [esPortero, turnos.length]);

  return (
    <div className={styles.bloqueJuego} style={esPortero ? { gap: '12px' } : undefined}>
      <div className={styles.cronometro} style={esPortero ? { fontSize: '2rem' } : undefined}>
        {esPortero ? `Ayudas: ${ayudasResueltas}/${objetivoAyudas} | Ronda: ${timeLeft}s` : `Tiempo: ${timeLeft}s`}
      </div>

      <div className={styles.carteleraTitulo} style={esPortero ? { padding: '14px' } : undefined}>
        <h2>{juego.nombre}</h2>
      </div>

      <div
        className={styles.recuadroExplicativo}
        style={{
          marginBottom: esPortero ? '6px' : '15px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: esPortero ? '10px 12px' : undefined,
        }}
      >
        <p style={esPortero ? { margin: '0 0 6px' } : undefined}>
          <strong>Turno actual:</strong>{' '}
          {faseTurno === 'jugador' ? 'Jugador' : faseTurno === 'ia' ? 'Personaje IA' : 'Procesando'}
        </p>
        {esPortero ? (
          <p style={{ margin: 0 }}>
            <strong>Impulso:</strong> acepta el problema y toma una decisión concreta.
          </p>
        ) : esHistoria ? (
          <>
            <p>
              <strong>Regla:</strong> el jugador inicia la historia, la IA añade una frase y el jugador acepta esa propuesta para seguir.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Impulso:</strong> continúa la narración anterior sin corregirla.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Regla:</strong> cada frase empieza por "Si yo fuera..." o "Si yo fuese..." y toma la última palabra de la intervención anterior.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Última palabra:</strong> {ultimaPalabra || 'empieza libremente'}
            </p>
          </>
        )}
      </div>

      {turnos.length > 0 && (
        <div
          ref={esPortero ? historialRef : undefined}
          className={esPortero ? styles.historialRecorte : styles.recuadroExplicativo}
          style={
            esPortero
              ? { marginBottom: '6px', maxHeight: '260px', gap: '6px', padding: '8px' }
              : { backgroundColor: '#fffdf5', marginBottom: '15px' }
          }
        >
          {(esPortero ? turnos : turnos.slice(-4)).map((turno, index) => (
            <p
              key={`${turno.autor}-${turno.texto}-${index}`}
              className={esPortero ? `${styles.lineaDialogo} ${turno.autor === 'jugador' ? styles.user : styles.assistant}` : undefined}
              style={esPortero ? { margin: 0, padding: '7px 9px' } : { marginTop: index === 0 ? 0 : undefined }}
            >
              <strong>{turno.autor === 'jugador' ? 'Tú' : esPortero ? 'Personaje' : 'IA'}:</strong> {turno.texto}
            </p>
          ))}
        </div>
      )}

      <div className={styles.formularioTextoWrapper} style={{ textAlign: 'center' }}>
        <div className={`indicadorEstadoVoz ${escuchando ? 'grabandoActivoPc' : ''}`}>
          <p className={styles.textoEstado} style={esPortero ? { margin: '6px 0' } : undefined}>
            {textoEstadoTurno(faseTurno, escuchando, loadingTexto, juego)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className={`${styles.btnTeatro} ${styles.btnComenzar}`}
          onClick={onTerminarFrase}
          disabled={loading || faseTurno !== 'jugador'}
          style={esPortero ? { padding: '11px' } : undefined}
        >
          Terminar frase
        </button>
        <button
          className={`${styles.btnTeatro} ${styles.btnReiniciar}`}
          onClick={onTerminar}
          style={esPortero ? { padding: '11px' } : undefined}
        >
          Terminar juego
        </button>
      </div>
    </div>
  );
}
