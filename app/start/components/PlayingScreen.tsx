import styles from '../../structure/base.module.css';
import type { EstrategiaInicio } from '../types';

interface PlayingScreenProps {
  escuchando: boolean;
  estrategia: EstrategiaInicio;
  loading: boolean;
  onTerminar: () => void;
  timeLeft: number;
  titulo: string;
}

export function PlayingScreen({ escuchando, estrategia, loading, onTerminar, timeLeft, titulo }: PlayingScreenProps) {
  return (
    <div className={styles.bloqueJuego}>
      <div className={styles.cronometro}>Tiempo: {timeLeft}s</div>

      <div className={styles.carteleraTitulo}>
        <h2>{titulo}</h2>
      </div>

      <div className={styles.recuadroExplicativo} style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <p>
          <strong>Objetivo:</strong> Describe cómo empezarías la improvisación usando la estrategia{' '}
          <strong>{estrategia.tecnica}</strong>.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Pista:</strong> {estrategia.mecanica}
        </p>
      </div>

      <div className={styles.formularioTextoWrapper} style={{ textAlign: 'center' }}>
        <div className={`indicadorEstadoVoz ${escuchando ? 'grabandoActivoPc' : ''}`}>
          <p className={styles.textoEstado}>
            {escuchando
              ? 'El escenario está abierto. Explica tu arranque en voz alta.'
              : 'Finalizando grabación de audio...'}
          </p>
        </div>
      </div>

      <button className={`${styles.btnTeatro} ${styles.btnComenzar}`} onClick={onTerminar} disabled={loading}>
        Terminar inicio
      </button>
    </div>
  );
}
