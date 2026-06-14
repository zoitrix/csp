import type { EstrategiaInicio } from './types';
import { crearCriteriosIntroduccionEscenica } from '../shared/introEvaluation';

interface RubricaTecnica {
  tecnica: string;
  criterioExito: string;
  indicadoresLogro: string;
  lucesRojas: string;
  decisionEvaluador: string;
}

const RUBRICAS_TECNICAS: Record<string, RubricaTecnica> = {
  'estilo-libre': {
    tecnica: 'Estilo Libre',
    criterioExito: 'Construccion de plataforma clara y jugable.',
    indicadoresLogro:
      'Establece quien es, donde esta, que le pasa y que tension abre la escena, aceptando el titulo de forma honesta y util para el companero.',
    lucesRojas:
      'Se queda en una ocurrencia, una sinopsis, una frase bonita o una reaccion generica que no construye una situacion dramatica.',
    decisionEvaluador:
      'Para aprobar, debe haber una decision escenica clara y accionable. La libertad no permite vaguedad.',
  },
  'asociaciones-satelite': {
    tecnica: 'Asociaciones Satelite',
    criterioExito: 'Originalidad periferica y coherencia.',
    indicadoresLogro:
      'Arranca con un elemento indirecto pero conectado al universo del titulo. Evita nombrar el titulo de golpe.',
    lucesRojas:
      'Cae en la literalidad absoluta o introduce un elemento tan inconexo que rompe el sentido del titulo.',
    decisionEvaluador:
      'Para aprobar, debe partir de un satelite reconocible: lugar, sensacion, consecuencia lateral, objeto secundario, ambiente o detalle periferico. Reutilizar el sujeto, accion o imagen central del titulo de forma directa debe suspender, aunque la introduccion sea completa.',
  },
  'disparador-primera-linea': {
    tecnica: 'Disparador Primera Linea',
    criterioExito: 'Impacto y justificacion del contexto.',
    indicadoresLogro:
      'La primera frase engancha al publico, rompe la expectativa obvia y plantea una premisa clara para la escena.',
    lucesRojas:
      'Dice una frase ingeniosa pero flotante que no construye plataforma ni da juego a su companero.',
    decisionEvaluador:
      'Para aprobar, debe aparecer una primera frase concreta de personaje y esa frase debe abrir relacion, premisa o conflicto inmediato.',
  },
  'objeto-imaginario': {
    tecnica: 'Objeto Imaginario',
    criterioExito: 'Mimo, precision y peso dramatico.',
    indicadoresLogro:
      'El objeto invisible tiene volumen, peso y consistencia fisica. El alumno se toma tiempo para que el publico vea el objeto antes de hablar.',
    lucesRojas:
      'El objeto desaparece magicamente a los dos segundos porque el alumno se pone a hablar y se olvida de su fisicidad.',
    decisionEvaluador:
      'Para aprobar, debe describir interaccion fisica precisa con un objeto o elemento invisible y al menos una cualidad fisica: peso, tamano, forma, textura, resistencia, distancia o volumen.',
  },
  'modificacion-postura': {
    tecnica: 'Modificacion de Postura',
    criterioExito: 'Compromiso corporal y estatus.',
    indicadoresLogro:
      'La energia y la postura fisica del cuerpo entero sostienen la atmosfera del titulo antes, durante y despues de la primera palabra.',
    lucesRojas:
      'Solo cambia la cara o la voz, pero mantiene una postura corporal neutra o cotidiana.',
    decisionEvaluador:
      'Para aprobar, debe haber una decision corporal visible del cuerpo entero: columna, hombros, mirada, ritmo, peso, respiracion, altura, tension, avance o retirada.',
  },
  'zoom-in': {
    tecnica: 'El Zoom In',
    criterioExito: 'Capacidad descriptiva e imaginaria.',
    indicadoresLogro:
      'Consigue pintar el espacio con palabras y detalles sensoriales, transportando al espectador al lugar antes de meter el conflicto.',
    lucesRojas:
      'Hace una descripcion aburrida tipo inventario o se alarga tanto describiendo que la escena no avanza.',
    decisionEvaluador:
      'Para aprobar, debe crear atmosfera espacial o sensorial concreta y despues conectar esa atmosfera con personajes, relacion y tension.',
  },
  'in-media-res': {
    tecnica: 'In Media Res',
    criterioExito: 'Manejo del ritmo y de la urgencia.',
    indicadoresLogro:
      'Entra con la accion fisica o el conflicto ya en su punto algido. El companero puede reaccionar de inmediato a la energia propuesta.',
    lucesRojas:
      'Entra gritando sin un motivo claro, generando ruido pero no informacion dramatica utilizable.',
    decisionEvaluador:
      'Para aprobar, la escena debe empezar ya en mitad de una accion, discusion o consecuencia activa. No debe explicar antecedentes largos antes del conflicto.',
  },
  'efecto-mariposa': {
    tecnica: 'Efecto Mariposa',
    criterioExito: 'Construccion de tension y progresion.',
    indicadoresLogro:
      'Empieza desde la normalidad y realiza acciones cotidianas que el publico asocia logicamente con el desencadenante del titulo.',
    lucesRojas:
      'Fuerza el accidente o el climax demasiado rapido en lugar de disfrutar del camino.',
    decisionEvaluador:
      'Para aprobar, debe empezar por un primer eslabon pequeno y cotidiano que pueda conducir logicamente al titulo como consecuencia final.',
  },
  flashforward: {
    tecnica: 'Flashforward',
    criterioExito: 'Sostenimiento de la consecuencia.',
    indicadoresLogro:
      'Asume la carga emocional del despues: sabe jugar con la melancolia, el alivio o el shock de lo que ya paso.',
    lucesRojas:
      'Se queda sin ideas tras la primera frase y reinicia la escena volviendo al pasado de forma tosca.',
    decisionEvaluador:
      'Para aprobar, debe empezar en el despues: consecuencia, ruina, resaca emocional, juicio, limpieza, despedida o momento posterior al evento sugerido por el titulo.',
  },
  'punto-vista-opuesto': {
    tecnica: 'Punto de Vista Opuesto',
    criterioExito: 'Contrapunto emocional y verdad.',
    indicadoresLogro:
      'La emocion opuesta se juega con total honestidad, no como un chiste tonto. La desconexion genera comedia o misterio genuino.',
    lucesRojas:
      'Se vuelve una parodia absurda donde el alumno se rie de su propia ocurrencia en lugar de vivir la escena.',
    decisionEvaluador:
      'Para aprobar, la emocion, actitud o valoracion debe ser claramente contraria a la esperada y debe sostenerse con verdad interna.',
  },
  'subtexto-oculto': {
    tecnica: 'Subtexto Oculto',
    criterioExito: 'Tension interna y juego de mascara.',
    indicadoresLogro:
      'El alumno suda el secreto. Sus acciones intentan tapar el titulo, pero sus ojos y su lenguaje corporal lo delatan.',
    lucesRojas:
      'El subtexto es tan oculto que ni el companero ni el publico se enteran de que esta pasando.',
    decisionEvaluador:
      'Para aprobar, debe haber doble capa: lo que el personaje dice en superficie y lo que intenta tapar por debajo. No debe confesar el secreto directamente al inicio.',
  },
  'metafora-literal': {
    tecnica: 'Metafora Literal',
    criterioExito: 'Aceptacion del codigo absurdo.',
    indicadoresLogro:
      'Trata la metafora fisica con total naturalidad dentro de la logica del personaje. El entorno reacciona a esa literalidad.',
    lucesRojas:
      'Lo juega como si fuera un chiste de mimica en lugar de una realidad fisica aplastante para el personaje.',
    decisionEvaluador:
      'Para aprobar, debe convertir una expresion figurada o abstracta del titulo en una realidad fisica concreta con reglas escenicas.',
  },
  'ritmo-onomatopeya': {
    tecnica: 'Ritmo y Onomatopeya',
    criterioExito: 'Musicalidad y permanencia del patron.',
    indicadoresLogro:
      'El alumno se deja contagiar por el tempo del titulo y mantiene ese patron ritmico en su habla o en su cuerpo como motor.',
    lucesRojas:
      'El ritmo se diluye en cuanto el alumno empieza a pensar en el argumento o en el texto.',
    decisionEvaluador:
      'Para aprobar, debe aparecer un ritmo, sonido, repeticion, tic fisico, patron vocal o tarea repetitiva que se mantenga como motor escenico.',
  },
};

function crearPruebaTecnicaEstrategia(estrategia: EstrategiaInicio): string {
  const rubrica = RUBRICAS_TECNICAS[estrategia.id];

  if (!rubrica) {
    return `PRUEBA ESPECIFICA DE LA TECNICA:
- Criterio de exito: ${estrategia.criterioExito}
- Indicadores de logro: ${estrategia.indicadoresLogro}
- Luces rojas / errores comunes: ${estrategia.lucesRojas}
- Decision del evaluador: para aprobar, la tecnica elegida debe verse en la forma concreta de arrancar la escena, no solo mencionarse de manera conceptual.
- Si la propuesta podria funcionar igual con cualquier otra estrategia, considera que la tecnica no esta aplicada y "aprobado" DEBE ser false.`;
  }

  return `PRUEBA ESPECIFICA PARA ${rubrica.tecnica.toUpperCase()}:
- Criterio de exito: ${rubrica.criterioExito}
- Indicadores de logro: ${rubrica.indicadoresLogro}
- Luces rojas / errores comunes: ${rubrica.lucesRojas}
- Decision del evaluador: ${rubrica.decisionEvaluador}
- Si aparece la luz roja o el criterio de exito no se cumple claramente, "aprobado" DEBE ser false aunque la introduccion escenica sea completa.
`;
}

export function crearPromptDirectorInicio(params: {
  titulo: string;
  propuestaFinal: string;
  estrategia: EstrategiaInicio;
}): string {
  return `
[ROL]
Eres un Director de teatro de improvisacion hiperactivo, tecnico, apasionado y muy exigente. Hablas siempre utilizando jerga teatral.

[MISION]
Evalua si el actor ha planteado un INICIO DE ESCENA jugable a partir del titulo y de la tecnica elegida.
No evalues el titulo: el titulo es contexto fijo. Evalua solo el trabajo del actor en <texto_del_actor>.

[TITULO DE LA ESCENA]
${params.titulo}

[TECNICA ELEGIDA]
Nombre: ${params.estrategia.tecnica}
Enfoque: ${params.estrategia.enfoque}
Mecanica que debia usar: ${params.estrategia.mecanica}
Tipo de pensamiento: ${params.estrategia.pensamiento}
Ideal para: ${params.estrategia.idealPara}

[CRITERIOS DE EVALUACION ESPECIFICOS]
Criterio de exito: ${params.estrategia.criterioExito}
Indicadores de logro: ${params.estrategia.indicadoresLogro}
Luces rojas / errores comunes: ${params.estrategia.lucesRojas}

[CRITERIOS OBLIGATORIOS DE INTRODUCCION ESCENICA]
${crearCriteriosIntroduccionEscenica(params.titulo)}

[CRITERIO OBLIGATORIO DE TECNICA DE INICIO]
- Ademas de construir una introduccion escenica completa, el actor debe aplicar de forma visible la tecnica elegida.
- La tecnica no sustituye a la introduccion escenica: una idea ingeniosa pero sin personajes, relacion, emocion y conflicto debe suspender.
- La introduccion escenica no sustituye a la tecnica: una escena completa pero sin la estrategia elegida debe suspender.

[PRUEBA TECNICA ESPECIFICA]
${crearPruebaTecnicaEstrategia(params.estrategia)}

[REGLAS DE RECHAZO]
- Si <texto_del_actor> es exactamente "[SIN_RESPUESTA]", el campo "aprobado" DEBE ser false.
- Si solo repite o parafrasea el titulo, "aprobado" DEBE ser false.
- Si no hay personajes o roles escenicos identificables, "aprobado" DEBE ser false.
- Si no hay relacion clara entre personajes o roles, "aprobado" DEBE ser false.
- Si no hay emocion, actitud o estado interno jugable, "aprobado" DEBE ser false.
- Si no hay conflicto, tension, deseo incompatible o problema activo, "aprobado" DEBE ser false.
- Si no se aprecia la tecnica elegida, "aprobado" DEBE ser false aunque haya una idea escenica.
- Si la propuesta cumple la introduccion escenica pero falla la prueba tecnica especifica, "aprobado" DEBE ser false.
- Si la tecnica aparece de forma limitada, superficial, accidental, demasiado literal o mejorable, "aprobado" DEBE ser false. No escribas "aprobado": true junto a una critica de tecnica insuficiente.
- Si es una idea inconexa, demasiado vaga o sin detalles accionables para empezar a improvisar, "aprobado" DEBE ser false.
- No exijas perfeccion literaria: si la propuesta es simple pero jugable, conectada al titulo, contiene los cuatro elementos de introduccion y usa la tecnica, puede aprobar.

[TEXTO DEL ACTOR]
<texto_del_actor>${params.propuestaFinal}</texto_del_actor>

[FORMATO DE SALIDA ESTRICTO]
Devuelve EXCLUSIVAMENTE un objeto JSON valido:
{
  "aprobado": true o false,
  "comentario": "Critica teatral breve de maximo 45 palabras, mencionando la tecnica elegida."
}`;
}
