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
  timeLeft: number;
  turnos: TurnoJuego[];
}

function textoEstadoTurno(faseTurno: FaseTurnoJuego, escuchando: boolean, loadingTexto: string): string {
  if (faseTurno === 'procesando') {
    return loadingTexto || 'Procesando tu frase...';
  }

  if (faseTurno === 'ia') {
    return 'La compañera IA está respondiendo. Escucha su última palabra.';
  }

  return escuchando
    ? 'Tu turno. Di una frase completa que empiece por "Si yo fuera...".'
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
  timeLeft,
  turnos,
}: PlayingScreenProps) {
  const ultimoTurno = turnos[turnos.length - 1];
  const ultimaPalabra = ultimoTurno?.ultimaPalabra || '';

  return (
    <div className={styles.bloqueJuego}>
      <div className={styles.cronometro}>Tiempo: {timeLeft}s</div>

      <div className={styles.carteleraTitulo}>
        <h2>{juego.nombre}</h2>
      </div>

      <div className={styles.recuadroExplicativo} style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <p>
          <strong>Turno actual:</strong>{' '}
          {faseTurno === 'jugador' ? 'Jugador' : faseTurno === 'ia' ? 'Compañera IA' : 'Procesando'}
        </p>
        <p>
          <strong>Regla:</strong> cada frase empieza por "Si yo fuera..." y toma la última palabra de la intervención anterior.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Última palabra:</strong> {ultimaPalabra || 'empieza libremente'}
        </p>
      </div>

      {turnos.length > 0 && (
        <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fffdf5', marginBottom: '15px' }}>
          {turnos.slice(-4).map((turno, index) => (
            <p key={`${turno.autor}-${turno.texto}-${index}`} style={{ marginTop: index === 0 ? 0 : undefined }}>
              <strong>{turno.autor === 'jugador' ? 'Tú' : 'IA'}:</strong> {turno.texto}
            </p>
          ))}
        </div>
      )}

      <div className={styles.formularioTextoWrapper} style={{ textAlign: 'center' }}>
        <div className={`indicadorEstadoVoz ${escuchando ? 'grabandoActivoPc' : ''}`}>
          <p className={styles.textoEstado}>{textoEstadoTurno(faseTurno, escuchando, loadingTexto)}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className={`${styles.btnTeatro} ${styles.btnComenzar}`}
          onClick={onTerminarFrase}
          disabled={loading || faseTurno !== 'jugador'}
        >
          Terminar frase
        </button>
        <button className={`${styles.btnTeatro} ${styles.btnReiniciar}`} onClick={onTerminar}>
          Terminar juego
        </button>
      </div>
    </div>
  );
}
