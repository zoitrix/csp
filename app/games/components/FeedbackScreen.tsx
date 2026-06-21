import styles from '../../structure/base.module.css';
import type { EvaluacionJuego, EvaluacionProblema, JuegoImpro } from '../types';

interface FeedbackScreenProps {
  evaluacion: EvaluacionJuego;
  juego: JuegoImpro;
  loading: boolean;
  loadingTexto: string;
  onReiniciar: () => void;
  onReintentar: () => void;
  textoUsuario: string;
}

function BloqueEvaluaciones({
  titulo,
  items,
  color,
}: {
  titulo: string;
  items: EvaluacionProblema[];
  color: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section style={{ marginTop: '12px' }}>
      <h5 style={{ color, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{titulo}</h5>
      {items.map((item, index) => (
        <article
          key={`${item.problema}-${index}`}
          style={{
            borderTop: '1px solid rgba(44, 62, 80, 0.16)',
            padding: '9px 0',
          }}
        >
          <p style={{ margin: '0 0 4px' }}>
            <strong>Problema:</strong> {item.problema}
          </p>
          <p style={{ margin: '0 0 4px' }}>
            <strong>Solución:</strong> {item.respuesta}
          </p>
          <p style={{ color, fontWeight: 700, margin: 0 }}>{item.comentario}</p>
        </article>
      ))}
    </section>
  );
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
  const esHistoria = juego.id === 'historia-interrumpida';
  const esPortero = juego.id === 'el-portero';
  const evaluacionesPortero = evaluacion.evaluacionesProblemas ?? [];
  const logradas = evaluacionesPortero.filter((item) => item.adecuada);
  const aReforzar = evaluacionesPortero.filter((item) => !item.adecuada);

  return (
    <div className={styles.bloqueFeedback} style={esPortero ? { gap: '10px' } : undefined}>
      <div className={styles.carteleraTitulo} style={esPortero ? { padding: '14px' } : undefined}>
        <h2>{juego.nombre}</h2>
      </div>

      <div className={styles.recuadroExplicativo} style={esPortero ? { padding: '10px 12px' } : undefined}>
        <strong>Objetivo revisado:</strong>{' '}
        {esPortero
          ? 'rapidez, aceptación del personaje, entrada en rol y solución concreta.'
          : esHistoria
            ? 'aceptación de propuestas, adaptación y avance de la narración.'
            : 'escucha activa y rebote desde la última palabra de la compañera IA.'}
      </div>

      {!esPortero && (
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
      )}

      <div className={styles.recuadroFeedback} style={esPortero ? { padding: '14px' } : undefined}>
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
            <p className={styles.textoFeedback} style={esPortero ? { marginTop: '6px' } : undefined}>
              Turnos del jugador: <strong>{evaluacion.turnosJugador}</strong>
              {esPortero && (
                <>
                  {' '}| Logrados: <strong>{logradas.length}</strong> | A reforzar:{' '}
                  <strong>{aReforzar.length}</strong>
                </>
              )}
              {!esHistoria && !esPortero && (
                <>
                  . Rebotes correctos: <strong>{evaluacion.rebotesCorrectosJugador}</strong>
                </>
              )}
            </p>

            {esPortero && evaluacionesPortero.length > 0 && (
              <div style={{ marginTop: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
                <BloqueEvaluaciones titulo="Objetivo logrado" items={logradas} color="#0f7b37" />
                <BloqueEvaluaciones titulo="Objetivo no logrado" items={aReforzar} color="#b92929" />
              </div>
            )}

            {evaluacion.turnos.length > 0 && !esPortero && (
              <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fffdf5', marginTop: '12px' }}>
                {evaluacion.turnos.map((turno, index) => (
                  <p key={`${turno.autor}-${turno.texto}-${index}`} style={{ marginTop: index === 0 ? 0 : undefined }}>
                    <strong>{turno.autor === 'jugador' ? 'Tú' : 'IA'}:</strong> {turno.texto}
                    {!esHistoria && turno.autor === 'jugador' && turno.palabraEsperada && (
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
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
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
