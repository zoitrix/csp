'use client';

import styles from '../structure/base.module.css';
import { ConfigScreen } from './components/ConfigScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { PlayingScreen } from './components/PlayingScreen';
import { useGamesController } from './hooks/useGamesController';

export default function GamesPage() {
  const controller = useGamesController();

  return (
    <div className={styles.teatroContainer}>
      <header className={styles.teatroHeader}>
        <h1>Juegos</h1>
        <p className={styles.subtitulo}>
          {controller.pantalla === 'config'
            ? 'Elige una dinámica de entrenamiento'
            : 'Juega escuchando el último impulso'}
        </p>
      </header>

      <main className={styles.escenario}>
        {controller.pantalla === 'config' && (
          <ConfigScreen
            juego={controller.juego}
            juegoId={controller.juegoId}
            juegos={controller.juegos}
            loading={controller.loading}
            onIniciar={controller.iniciarJuego}
            onObjetivoAyudasChange={controller.handleObjetivoAyudasChange}
            onJuegoChange={controller.setJuegoId}
            onTiempoChange={controller.handleTiempoChange}
            objetivoAyudas={controller.objetivoAyudas}
            tiempoConfig={controller.tiempoConfig}
          />
        )}

        {controller.pantalla === 'jugando' && (
          <PlayingScreen
            escuchando={controller.escuchando}
            faseTurno={controller.faseTurno}
            juego={controller.juego}
            loading={controller.loading}
            loadingTexto={controller.loadingTexto}
            onTerminar={controller.terminarJuego}
            onTerminarFrase={controller.terminarFraseJugador}
            ayudasResueltas={controller.ayudasResueltas}
            objetivoAyudas={controller.objetivoAyudas}
            timeLeft={controller.timeLeft}
            turnos={controller.turnos}
          />
        )}

        {controller.pantalla === 'feedback' && (
          <FeedbackScreen
            evaluacion={controller.evaluacion}
            juego={controller.juego}
            loading={controller.loading}
            loadingTexto={controller.loadingTexto}
            onReiniciar={controller.reiniciarJuego}
            onReintentar={controller.reintentarJuego}
            textoUsuario={controller.textoUsuario}
          />
        )}
      </main>
    </div>
  );
}
