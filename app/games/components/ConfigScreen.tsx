import Link from 'next/link';
import styles from '../../structure/base.module.css';
import type { JuegoId, JuegoImpro } from '../types';

interface ConfigScreenProps {
  juego: JuegoImpro;
  juegoId: JuegoId;
  juegos: JuegoImpro[];
  loading: boolean;
  onIniciar: () => void;
  onObjetivoAyudasChange: (valor: number) => void;
  onJuegoChange: (id: JuegoId) => void;
  onTiempoChange: (valor: number) => void;
  objetivoAyudas: number;
  tiempoConfig: number;
}

export function ConfigScreen({
  juego,
  juegoId,
  juegos,
  loading,
  onIniciar,
  onObjetivoAyudasChange,
  onJuegoChange,
  onTiempoChange,
  objetivoAyudas,
  tiempoConfig,
}: ConfigScreenProps) {
  const esPortero = juego.id === 'el-portero';

  return (
    <div className={styles.bloqueConfig}>
      <div className={styles.recuadroExplicativo}>
        <div className={styles.tituloMision}>Misión de juegos</div>
        Selecciona una dinámica, configura el tiempo y juega en voz alta. El micrófono grabará tu partida para revisar después escucha, adaptación y claridad.
      </div>

      <br />
      <div className={styles.controlesGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label className={styles.labelStyle} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          Juego
          <select
            className={styles.selectStyle}
            value={juegoId}
            onChange={(event) => onJuegoChange(event.target.value as JuegoId)}
          >
            {juegos.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fffdf5' }}>
          <p style={{ marginTop: 0 }}>
            <strong>{juego.nombre}</strong> ({juego.nivel}, {juego.duracion})
          </p>
          <p><strong>Categoría:</strong> {juego.categoria}</p>
          <p><strong>Objetivo:</strong> {juego.objetivo}</p>
          <p><strong>Cómo se juega:</strong> {juego.reglas}</p>
          <p style={{ marginBottom: 0 }}><strong>Ejemplo:</strong> {juego.ejemplo}</p>
        </div>

        <label className={styles.labelStyle} style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
          {esPortero ? 'Tiempo por problemática' : 'Tiempo de partida'}
          <input
            type="number"
            className={styles.inputTiempoNumber}
            value={tiempoConfig}
            min={esPortero ? 3 : 10}
            max={esPortero ? 60 : 300}
            onChange={(event) => onTiempoChange(Number(event.target.value))}
          />
        </label>

        {esPortero && (
          <label className={styles.labelStyle} style={{ display: 'flex', flexDirection: 'column', margin: 0 }}>
            Número de ayudas a superar
            <input
              type="number"
              className={styles.inputTiempoNumber}
              value={objetivoAyudas}
              min={1}
              max={30}
              onChange={(event) => onObjetivoAyudasChange(Number(event.target.value))}
            />
          </label>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
        <button className={`${styles.btnTeatro} ${styles.btnComenzar}`} onClick={onIniciar} disabled={loading}>
          {loading ? 'Preparando...' : 'Empezar juego'}
        </button>
        <Link
          className={`${styles.btnTeatro} ${styles.btnRepetir}`}
          href="/"
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          Volver al menú
        </Link>
      </div>
    </div>
  );
}
