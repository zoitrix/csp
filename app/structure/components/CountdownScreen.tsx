import styles from '../base.module.css';

interface CountdownScreenProps {
  segundos: number;
}

export function CountdownScreen({ segundos }: CountdownScreenProps) {
  return (
    <div className={styles.bloqueCuentaAtras} aria-live="polite">
      <p className={styles.cuentaAtrasEtiqueta}>Prepárate para improvisar</p>
      <div className={styles.cuentaAtrasNumero} key={segundos}>
        {segundos}
      </div>
      <p className={styles.cuentaAtrasAyuda}>El juego y la grabación comenzarán al terminar la cuenta atrás.</p>
    </div>
  );
}
