import type { FaseActo, MensajeChat, TipoIntervencion } from './types';

const MAX_MENSAJES_MODELO = 10;
const MAX_MENSAJES_DIRECTOR = 12;
const MAX_CARACTERES_INTERVENCION = 260;

const ETIQUETAS_INTERVENCION: Record<TipoIntervencion, string> = {
  personaje: 'PERSONAJE',
  accion: 'ACCION',
  narrador: 'NARRADOR',
  tiempo: 'TIEMPO',
};

function etiquetaIntervencion(tipo?: TipoIntervencion): string {
  return tipo ? ETIQUETAS_INTERVENCION[tipo] : 'PERSONAJE';
}

function limitarTextoIntervencion(texto: string): string {
  const limpio = texto.replace(/\s+/g, ' ').trim();

  if (limpio.length <= MAX_CARACTERES_INTERVENCION) {
    return limpio;
  }

  return `${limpio.slice(0, MAX_CARACTERES_INTERVENCION).replace(/[\s,;:.]+$/g, '')}...`;
}

function tomarContextoReciente(historial: MensajeChat[], maxMensajes: number): MensajeChat[] {
  return historial.slice(-maxMensajes);
}

function crearLibretoAnotado(historial: MensajeChat[], maxMensajes = MAX_MENSAJES_DIRECTOR): string {
  return historial
    .slice(-maxMensajes)
    .map((mensaje) => {
      const autor = mensaje.role === 'user' ? 'ACTOR (Usuario)' : 'CO-ACTOR (IA)';
      return `${autor} [${etiquetaIntervencion(mensaje.tipo)}]: ${limitarTextoIntervencion(mensaje.content)}`;
    })
    .join('\n');
}

export function crearPromptCoactor(historial: MensajeChat[]): string {
  const historialReciente = tomarContextoReciente(historial, MAX_MENSAJES_MODELO);
  const libretoAnotado = crearLibretoAnotado(historialReciente, MAX_MENSAJES_MODELO);

  return `Eres co-actor de improvisacion. Continua la escena aceptando lo ultimo, conservando lugar/reglas/conflictos recientes y respondiendo como personaje, accion, narrador o salto temporal.

LIBRETO RECIENTE:
${libretoAnotado || 'La escena aun no ha empezado.'}

Formato: 1 o 2 lineas, maximo 55 palabras. Etiquetas validas: PERSONAJE:, ACCION:, NARRADOR:, TIEMPO:. No expliques nada ni des consejos.`;
}

export function crearConsignasDirector(fase: FaseActo, titulo: string): string {
  if (fase === 'intro') {
    return `OBJETIVO DE LA EVALUACION DE INTRODUCCION:
- Evalua si en la obra completa el actor ayudo a establecer una plataforma inicial clara.
- Debe haber titulo integrado, personajes o roles, relacion, lugar o situacion reconocible y primer conflicto jugable.
- No exijas que todo aparezca en la primera frase, pero si debe quedar claro durante el arranque de la conversacion.
- No suspendas por falta de exposicion escolar si el actor conecta tematicamente con el titulo mediante una norma, prohibicion, politica, queja o conflicto social claro.
- Si el titulo sugiere una regla absurda y el actor la convierte en queja activa o debate entre personajes, considera que el titulo esta integrado.
- La conexion con el titulo debe venir de una aportacion del ACTOR (Usuario), no solo de una interpretacion del CO-ACTOR (IA).
- Si las lineas del actor no contienen ninguna imagen, lugar, objeto, accion o tema reconocible del titulo, "aprobado" DEBE ser false.
- Si el usuario evade el titulo "${titulo}" por completo, dice sinsentidos inconexos o no aporta plataforma, debes poner "aprobado": false.`;
  }

  if (fase === 'nudo') {
    return `OBJETIVO DE LA EVALUACION DEL NUDO:
- Evalua si en la obra completa el actor sostuvo desarrollo y complicacion, no solo una charla plana.
- Debe haber al menos un giro, revelacion, imprevisto, escalada, factor limite o cambio de estrategia que aumente el conflicto.
- Puede haber reaccion a giros propuestos por la IA, siempre que el actor los acepte y los empuje.
- Si la escena se estanca en un solo chiste o no avanza, debes poner "aprobado": false.`;
  }

  return `OBJETIVO DE LA EVALUACION DEL DESENLACE:
- Evalua si la obra completa termina con una resolucion, remate, decision final o cierre reconocible.
- El actor debe participar en el cierre, no solo dejar que la IA lo resuelva.
- Presta especial atencion a las ultimas 2 intervenciones del ACTOR (Usuario).
- No apruebes por la energia del nudo si el final real no cierra nada.
- Si la ultima intervencion del actor deja una pregunta abierta, una amenaza activa, una persecucion sin resolver, una accion futura pendiente o solo propone un plan, "aprobado" DEBE ser false.
- Para aprobar debe haber consecuencia visible o decision cerrada: victoria, fracaso, rendicion, acuerdo, castigo, fuga completada, revelacion final o remate definitivo.
- Si el texto carece de sustancia resolutiva o corta la escena abruptamente sin cerrar nada, "aprobado" DEBE ser false.`;
}

export function crearPromptDirector(params: {
  fase: FaseActo;
  titulo: string;
  historial: MensajeChat[];
}): string {
  const historialReciente = tomarContextoReciente(params.historial, MAX_MENSAJES_DIRECTOR);
  const libretoCompleto = crearLibretoAnotado(historialReciente);
  const lineasActor = historialReciente
    .filter((mensaje) => mensaje.role === 'user')
    .map((mensaje) => `ACTOR (Usuario) [${etiquetaIntervencion(mensaje.tipo)}]: ${limitarTextoIntervencion(mensaje.content)}`)
    .join('\n');
  const lineasCoactor = historialReciente
    .filter((mensaje) => mensaje.role === 'assistant')
    .map((mensaje) => `CO-ACTOR (IA) [${etiquetaIntervencion(mensaje.tipo)}]: ${limitarTextoIntervencion(mensaje.content)}`)
    .join('\n');

  return `
[ROL]
Eres Director de improvisacion. Evalua con criterio tecnico y breve.

[MISION DE ANALISIS]
Juzga solo si el ACTOR (Usuario) cumple el criterio de la fase actual. El titulo y el co-actor son contexto; no evalues al co-actor.

[CONSIGNAS ESPECIFICAS PARA ESTE CRITERIO]
${crearConsignasDirector(params.fase, params.titulo)}

[DATOS DE ENTRADA DE LA ESCENA]
<titulo_escena_context>${params.titulo}</titulo_escena_context>

[LIBRETO RECIENTE]
${libretoCompleto || 'El actor no ha intervenido.'}

[LINEAS DEL ACTOR A EVALUAR]
${lineasActor || 'El actor no ha intervenido.'}

[LINEAS DEL CO-ACTOR SOLO COMO CONTEXTO]
${lineasCoactor || 'El co-actor no ha intervenido.'}

[REGLA INQUEBRANTABLE DE MUTISMO]
- Si el ACTOR (Usuario) no tiene ninguna linea registrada en el libreto o solo el texto "[SIN_RESPUESTA]", el campo "aprobado" DEBE ser false.
- La IA puede haber creado contexto util, pero solo debes aprobar al ACTOR si sus propias lineas aportan o aceptan material suficiente.

[REGLA DE INDEPENDENCIA DE CRITERIOS]
- Evalua solo el criterio solicitado ahora. Un nudo divertido no puede hacer aprobar el desenlace si no hay cierre real.
- Una introduccion imperfecta puede aprobar si establece una plataforma jugable conectada al titulo.
- Un desenlace solo puede aprobar si hay cierre, no solo escalada.

[CALIDAD DEL COMENTARIO]
- Maximo 55 palabras.
- Menciona al menos un detalle concreto del dialogo.
- Explica por que aprueba o rechaza y que faltaria mejorar.

[FORMATO DE SALIDA ESTRICTO]
Devuelve EXCLUSIVAMENTE un objeto JSON con esta estructura exacta:
{
  "aprobado": true o false,
  "comentario": "Critica teatral breve con detalles concretos."
}`;
}
