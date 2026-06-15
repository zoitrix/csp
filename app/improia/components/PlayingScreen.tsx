import styles from '../../structure/base.module.css';
import type { MensajeChat, TipoIntervencion } from '../types';

const OPCIONES_INTERVENCION: Array<{
  id: TipoIntervencion;
  label: string;
  ayuda: string;
}> = [
  {
    id: 'personaje',
    label: 'Personaje',
    ayuda: 'Dialogo en primera persona.',
  },
  {
    id: 'accion',
    label: 'Accion',
    ayuda: 'Accion fisica de tu personaje.',
  },
  {
    id: 'narrador',
    label: 'Narrador',
    ayuda: 'Descripcion literaria o atmosferica.',
  },
  {
    id: 'tiempo',
    label: 'Tiempo',
    ayuda: 'Saltos, elipsis o flashbacks.',
  },
];

const ETIQUETAS_INTERVENCION: Record<TipoIntervencion, string> = {
  personaje: 'Personaje',
  accion: 'Accion',
  narrador: 'Narrador',
  tiempo: 'Tiempo',
};

const ETIQUETAS_IA: Record<TipoIntervencion, string> = {
  personaje: 'Co-Actor',
  accion: 'Direccion',
  narrador: 'Narrador',
  tiempo: 'Tiempo',
};

function tipoIntervencionEsContexto(tipo: TipoIntervencion): boolean {
  return tipo === 'accion' || tipo === 'narrador' || tipo === 'tiempo';
}

function detectarTipoLineaIA(linea: string): TipoIntervencion {
  const normalizada = linea.trim().toLowerCase();

  if (/^(narrador)\s*:/.test(normalizada) || /^\[(narrador|director)\]/.test(normalizada)) {
    return 'narrador';
  }

  if (/^(tiempo)\s*:/.test(normalizada) || /^\[tiempo\]/.test(normalizada)) {
    return 'tiempo';
  }

  if (/^(accion|acción)\s*:/.test(normalizada) || /^\[(accion|acción)\]/.test(normalizada) || /^\[[^\]]+\]/.test(normalizada)) {
    return 'accion';
  }

  return 'personaje';
}

function limpiarEtiquetaLineaIA(linea: string): string {
  return linea
    .replace(/^\s*(PERSONAJE|ACCION|ACCIÓN|NARRADOR|TIEMPO)\s*:\s*/i, '')
    .replace(/^\s*\[(Narrador|Director|Accion|Acción|Tiempo|Personaje)\]\s*/i, '')
    .trim();
}

function dividirRespuestaIA(contenido: string) {
  return contenido
    .split(/\n+/)
    .map((linea) => {
      const texto = limpiarEtiquetaLineaIA(linea);

      if (!texto) {
        return null;
      }

      return {
        texto,
        tipo: detectarTipoLineaIA(linea),
      };
    })
    .filter((linea): linea is { texto: string; tipo: TipoIntervencion } => linea !== null);
}

function detectarTipoLineaIAVisible(linea: string): TipoIntervencion {
  const normalizada = linea.trim().toLowerCase();

  if (/^(narrador)\s*:/.test(normalizada) || /^\[(narrador|director)\]/.test(normalizada)) {
    return 'narrador';
  }

  if (/^(tiempo)\s*:/.test(normalizada) || /^\[tiempo\]/.test(normalizada)) {
    return 'tiempo';
  }

  if (/^(accion|acci.n)\s*:/.test(normalizada) || /^\[(accion|acci.n)\s*:/.test(normalizada) || /^\[[^\]]+\]/.test(normalizada)) {
    return 'accion';
  }

  return 'personaje';
}

function limpiarEtiquetaLineaIAVisible(linea: string): string {
  return linea
    .replace(/^\s*(PERSONAJE|ACCION|ACCI.N|NARRADOR|TIEMPO)\s*:\s*/i, '')
    .replace(/^\s*\[(ACCION|ACCI.N)\s*:\s*/i, '[')
    .replace(/^\s*\[(Narrador|Director|Accion|Acci.n|Tiempo|Personaje)\]\s*/i, '')
    .trim();
}

function dividirLineaMixtaIAVisible(linea: string) {
  const tipoLinea = detectarTipoLineaIAVisible(linea);

  if (tipoLinea !== 'personaje') {
    const texto = limpiarEtiquetaLineaIAVisible(linea);
    return texto ? [{ texto, tipo: tipoLinea }] : [];
  }

  const lineaSinEtiqueta = limpiarEtiquetaLineaIAVisible(linea);

  return lineaSinEtiqueta
    .split(/(\[(?:ACCION|ACCI.N|Accion|Acci.n)\s*:[^\]]+\]|\[[^\]]+\])/g)
    .map((fragmento) => {
      const texto = limpiarEtiquetaLineaIAVisible(fragmento);

      if (!texto) {
        return null;
      }

      return {
        texto,
        tipo: /^\s*\[/.test(fragmento) ? 'accion' : 'personaje',
      };
    })
    .filter((linea): linea is { texto: string; tipo: TipoIntervencion } => linea !== null);
}

function dividirRespuestaIAVisible(contenido: string) {
  return contenido
    .split(/\n+/)
    .flatMap(dividirLineaMixtaIAVisible);
}

interface PlayingScreenProps {
  escuchando: boolean;
  historialLetra: MensajeChat[];
  iaHablando: boolean;
  loading: boolean;
  loadingTexto: string;
  onConcluir: () => void;
  onTipoIntervencionChange: (tipo: TipoIntervencion) => void;
  timeLeft: number;
  tipoIntervencion: TipoIntervencion;
  titulo: string;
}

export function PlayingScreen({
  escuchando,
  historialLetra,
  iaHablando,
  loading,
  loadingTexto,
  onConcluir,
  onTipoIntervencionChange,
  timeLeft,
  tipoIntervencion,
  titulo,
}: PlayingScreenProps) {
  return (
    <div className={styles.bloqueJuego}>
      <div className={styles.cronometro}>{timeLeft}s</div>

      <div className={styles.carteleraTitulo}>
        <h2>{titulo}</h2>
      </div>

      <MissionPanel />
      <InterventionSelector
        disabled={loading || iaHablando}
        onChange={onTipoIntervencionChange}
        value={tipoIntervencion}
      />
      <VoiceStatus
        escuchando={escuchando}
        iaHablando={iaHablando}
        loading={loading}
        loadingTexto={loadingTexto}
        tipoIntervencion={tipoIntervencion}
      />
      <RecentDialogue historialLetra={historialLetra} />

      <button className={`${styles.btnTeatro} ${styles.btnReiniciar}`} onClick={onConcluir} disabled={loading}>
        {loading ? 'Evaluando...' : 'Terminar obra'}
      </button>
    </div>
  );
}

function MissionPanel() {
  return (
    <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fffdf5', border: '1px solid var(--color-oro)' }}>
      <p style={{ color: '#b92929', textAlign: 'center', marginTop: 0 }}>
        <strong>Escena continua con co-direccion</strong>
      </p>
      <p style={{ marginBottom: 0 }}>
        Elige como quieres intervenir y habla con naturalidad. Cuando calles un momento, la IA respondera como co-actor
        y tambien podra usar dialogo, accion, narracion o transiciones temporales.
      </p>
    </div>
  );
}

function InterventionSelector({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (tipo: TipoIntervencion) => void;
  value: TipoIntervencion;
}) {
  return (
    <div className={styles.recuadroExplicativo} style={{ backgroundColor: '#fdfbf7', border: '1px solid #e2d6b5' }}>
      <p style={{ margin: '0 0 10px', color: '#4f2b2b', fontWeight: 800 }}>Hablar como</p>
      <div className={styles.panelAcciones}>
        {OPCIONES_INTERVENCION.map((opcion) => {
          const activo = opcion.id === value;

          return (
            <button
              key={opcion.id}
              type="button"
              aria-pressed={activo}
              disabled={disabled}
              onClick={() => onChange(opcion.id)}
              style={{
                minHeight: '58px',
                padding: '10px 12px',
                border: activo ? '2px solid var(--color-telon)' : '1px solid rgba(143, 29, 44, 0.22)',
                borderRadius: '8px',
                backgroundColor: activo ? '#fff3cd' : '#ffffff',
                color: activo ? 'var(--color-telon)' : '#4f2b2b',
                cursor: disabled ? 'not-allowed' : 'pointer',
                font: 'inherit',
                fontWeight: 800,
                opacity: disabled ? 0.65 : 1,
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'block' }}>{opcion.label}</span>
              <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.25 }}>
                {opcion.ayuda}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VoiceStatus({
  escuchando,
  iaHablando,
  loading,
  loadingTexto,
  tipoIntervencion,
}: {
  escuchando: boolean;
  iaHablando: boolean;
  loading: boolean;
  loadingTexto: string;
  tipoIntervencion: TipoIntervencion;
}) {
  return (
    <div className={`${styles.recuadroTranscripcion} ${escuchando ? styles.ondaActiva : ''}`}>
      {loading ? (
        <p className={styles.textoHablado}>{loadingTexto}</p>
      ) : escuchando ? (
        <p className={styles.textoHablado}>
          {tipoIntervencionEsContexto(tipoIntervencion)
            ? `Habla ahora como ${ETIQUETAS_INTERVENCION[tipoIntervencion]}. Se incorporara a la escena sin respuesta inmediata.`
            : `Habla ahora como ${ETIQUETAS_INTERVENCION[tipoIntervencion]}. La IA respondera cuando detecte silencio.`}
        </p>
      ) : iaHablando ? (
        <p className={styles.textoHablado}>Tu co-actor responde...</p>
      ) : (
        <p className={styles.placeholderVoz}>Preparando el siguiente turno...</p>
      )}
    </div>
  );
}

function RecentDialogue({ historialLetra }: { historialLetra: MensajeChat[] }) {
  return (
    <div className={styles.historialRecorte}>
      {historialLetra.length === 0 ? (
        <div className={`${styles.lineaDialogo} ${styles.assistant}`}>
          <strong>Co-Actor: </strong>
          Empieza cuando quieras; estoy escuchando.
        </div>
      ) : (
        historialLetra.slice(-5).map((mensaje, index) => (
          <div key={index} className={`${styles.lineaDialogo} ${mensaje.role === 'user' ? styles.user : styles.assistant}`}>
            {mensaje.role === 'user' ? (
              <>
                <strong>{`Tu (${ETIQUETAS_INTERVENCION[mensaje.tipo || 'personaje']}): `}</strong>
                {mensaje.content}
              </>
            ) : (
              <AssistantContent content={mensaje.content} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AssistantContent({ content }: { content: string }) {
  const lineas = dividirRespuestaIAVisible(content);

  if (lineas.length === 0) {
    return (
      <>
        <strong>Co-Actor: </strong>
        {content}
      </>
    );
  }

  return (
    <>
      {lineas.map((linea, index) => (
        <span key={index} style={{ display: 'block' }}>
          <strong>{`${ETIQUETAS_IA[linea.tipo]}: `}</strong>
          {linea.texto}
        </span>
      ))}
    </>
  );
}
