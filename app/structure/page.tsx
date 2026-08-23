'use client';

import styles from './base.module.css';
import { ConfigScreen } from './components/ConfigScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { FinalScreen } from './components/FinalScreen';
import { PlayingScreen } from './components/PlayingScreen';
import { useImproBaseController } from './hooks/useImproBaseController';

export default function ImproBaseModularPage() {
  const controller = useImproBaseController();

  if (controller.pantalla === 'final') {
    return <FinalScreen obra={controller.obra} onReiniciar={controller.reiniciarTeatroCompleto} />;
  }

  return (
    <div className={styles.teatroContainer}>
      <header className={styles.teatroHeader}>
        <h1>🎭 Estructuras 🎬</h1>
        <p className={styles.subtitulo}>
          {controller.pantalla === 'config'
            ? '¡Saca un título y construye tu historia!'
            : controller.pantalla === 'cuentaAtras'
              ? 'El telón está a punto de subir'
              : `Fase actual: Acto de ${controller.faseActual.toUpperCase()}`}
        </p>
      </header>

      <main className={styles.escenario}>
        {controller.pantalla !== 'config' && controller.titulo && (
          <div className={styles.carteleraTitulo}>
            <h2>{controller.titulo}</h2>
          </div>
        )}

        {controller.pantalla === 'config' && (
          <ConfigScreen
            cuentaAtrasConfig={controller.cuentaAtrasConfig}
            dificultad={controller.dificultad}
            explicacionInicial={controller.getExplicacionInicial()}
            loading={controller.loading}
            onCuentaAtrasChange={controller.setCuentaAtrasConfig}
            onDificultadChange={controller.setDificultad}
            onIniciar={controller.iniciarEjercicio}
            onTiempoChange={controller.handleTiempoChange}
            tiemposConfig={controller.tiemposConfig}
          />
        )}

        {controller.pantalla === 'cuentaAtras' && (
          <>
            <div
              className={styles.recuadroExplicativo}
              style={{ marginBottom: '15px', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p style={{ margin: 0 }}>
                <strong>🎯 Objetivo:</strong> Plantea la escena. Muestra claramente la relación de los personajes,
                el estado anímico, el conflicto y el lugar.
              </p>
            </div>
            <CountdownScreen segundos={controller.cuentaAtras} />
          </>
        )}

        {controller.pantalla === 'jugando' && (
          <PlayingScreen
            escuchando={controller.escuchando}
            faseActual={controller.faseActual}
            loading={controller.loading}
            obra={controller.obra}
            onTerminarActo={controller.clickBotonTerminarManual}
            tiemposConfig={controller.tiemposConfig}
            timeLeft={controller.timeLeft}
          />
        )}

        {controller.pantalla === 'feedback' && (
          <FeedbackScreen
            aprobadoPorDirector={controller.aprobadoPorDirector}
            faseActual={controller.faseActual}
            feedbackDirector={controller.feedbackDirector}
            loading={controller.loading}
            loadingTexto={controller.loadingTexto}
            onAvanzar={controller.avanzarSiguienteFase}
            onReiniciar={controller.reiniciarTeatroCompleto}
            onReintentar={controller.reintentarActoActual}
            textoUsuario={controller.textoUsuario}
          />
        )}
      </main>
    </div>
  );
}
