import styles from '../../structure/base.module.css';
import type { EvaluacionJuego, JuegoImpro } from '../types';

interface FeedbackScreenProps {
  evaluacion: EvaluacionJuego;
  juego: JuegoImpro;
  loading: boolean;
  loadingTexto: string;
  onReiniciar: () => void;
  onReintentar: () => void;
  textoUsuario: string;
}

export function FeedbackScreen({
  evaluacion,
  juego,
  loading,
  loadingTexto,
  onReiniciar,
  onReintentar,
  textoUsuario,
}: FeedbackScreenProps) {
  return (
    <div className={styles.bloqueFeedback}>
      <div className={styles.carteleraTitulo}>
        <h2>{juego.nombre}</h2>
      </div>

      <div className={styles.recuadroExplicativo}>
        <strong>Objetivo revisado:</strong> escucha activa y rebote desde la última palabra de la compañera IA.
      </div>

      <div className={styles.recuadroTuTexto}>
        <h4>Tus intervenciones</h4>
        <p className={styles.textoGuardadoUsuario}>
          {loading && !textoUsuario ? (
            <span className={styles.loadingSubtext}>Transcribiendo tu voz...</span>
          ) : textoUsuario.trim() ? (
            textoUsuario.trim()
          ) : (
            <i>[No se detectó voz o la partida quedó en silencio]</i>
          )}
        </p>
      </div>

      <div className={styles.recuadroFeedback}>
        <h4>
          Resultado:{' '}
          {!loading && (
            <span style={{ color: evaluacion.aprobado ? '#4cd964' : '#ff3b30', fontWeight: 'bold' }}>
              {evaluacion.aprobado ? '[CONSEGUIDO]' : '[A REFORZAR]'}
            </span>
          )}
        </h4>
        {loading ? (
          <p className={styles.loadingText}>{loadingTexto || 'Analizando tu partida...'}</p>
        ) : (
          <>
            <p className={styles.textoFeedback}>{evaluacion.comentario}</p>
            <p className={styles.textoFeedback}>
              Turnos del jugador: <strong>{evaluacion.turnosJugador}</strong>. Rebotes correctos:{' '}
              <strong>{evaluacion.rebotesCorrectosJugador}</strong>.
            </p>
            {evaluacion.turnos.length > 0 && (
              <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fffdf5', marginTop: '12px' }}>
                {evaluacion.turnos.map((turno, index) => (
                  <p key={`${turno.autor}-${turno.texto}-${index}`} style={{ marginTop: index === 0 ? 0 : undefined }}>
                    <strong>{turno.autor === 'jugador' ? 'Tú' : 'IA'}:</strong> {turno.texto}
                    {turno.autor === 'jugador' && turno.palabraEsperada && (
                      <span style={{ color: turno.reboteCorrecto ? '#0f7b37' : '#b92929', fontWeight: 700 }}>
                        {' '}
                        {turno.reboteCorrecto ? 'Rebote correcto.' : `Debía partir de "${turno.palabraEsperada}".`}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {!loading && (
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button className={`${styles.btnTeatro} ${styles.btnComenzar}`} onClick={onReintentar}>
            Repetir juego
          </button>
          <button className={`${styles.btnTeatro} ${styles.btnReiniciar}`} onClick={onReiniciar}>
            Elegir juego
          </button>
        </div>
      )}
    </div>
  );
}
