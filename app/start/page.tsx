'use client';

import styles from '../structure/base.module.css';
import { CountdownScreen } from '../structure/components/CountdownScreen';
import { ConfigScreen } from './components/ConfigScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { PlayingScreen } from './components/PlayingScreen';
import { useStartController } from './hooks/useStartController';

export default function StartPage() {
  const controller = useStartController();

  return (
    <div className={styles.teatroContainer}>
      <header className={styles.teatroHeader}>
        <h1>🎭 Inicios 🎬</h1>
        <p className={styles.subtitulo}>
          {controller.pantalla === 'config'
            ? 'Elige una estrategia y prepara el primer impulso'
            : controller.pantalla === 'cuentaAtras'
              ? 'El telón está a punto de subir'
              : 'Describe cómo abrirías la escena'}
        </p>
      </header>

      <main className={styles.escenario}>
        {controller.pantalla === 'config' && (
          <ConfigScreen
            cuentaAtrasConfig={controller.cuentaAtrasConfig}
            dificultad={controller.dificultad}
            estrategia={controller.estrategia}
            estrategiaId={controller.estrategiaId}
            estrategias={controller.estrategias}
            loading={controller.loading}
            onCuentaAtrasChange={controller.setCuentaAtrasConfig}
            onDificultadChange={controller.setDificultad}
            onEstrategiaChange={controller.setEstrategiaId}
            onIniciar={controller.iniciarEjercicio}
            onTiempoChange={controller.handleTiempoChange}
            tiempoConfig={controller.tiempoConfig}
          />
        )}

        {controller.pantalla === 'cuentaAtras' && (
          <>
            <div className={styles.carteleraTitulo}>
              <h2>{controller.titulo}</h2>
            </div>
            <div
              className={styles.recuadroExplicativo}
              style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p>
                <strong>Objetivo:</strong> Describe cómo empezarías la improvisación usando la estrategia{' '}
                <strong>{controller.estrategia.tecnica}</strong>.
              </p>
              <p style={{ marginBottom: 0 }}>
                <strong>Pista:</strong> {controller.estrategia.mecanica}
              </p>
            </div>
            <CountdownScreen segundos={controller.cuentaAtras} />
          </>
        )}

        {controller.pantalla === 'jugando' && (
          <PlayingScreen
            escuchando={controller.escuchando}
            estrategia={controller.estrategia}
            loading={controller.loading}
            onTerminar={controller.terminarInicio}
            timeLeft={controller.timeLeft}
            titulo={controller.titulo}
          />
        )}

        {controller.pantalla === 'feedback' && (
          <FeedbackScreen
            aprobadoPorDirector={controller.aprobadoPorDirector}
            estrategia={controller.estrategia}
            feedbackDirector={controller.feedbackDirector}
            loading={controller.loading}
            loadingTexto={controller.loadingTexto}
            onReiniciar={controller.reiniciarEjercicio}
            onReintentar={controller.reintentarInicio}
            textoUsuario={controller.textoUsuario}
            titulo={controller.titulo}
          />
        )}
      </main>
    </div>
  );
}
