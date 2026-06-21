import type { EstrategiaInicio } from './types';

export const TIEMPO_INICIAL = 30;

export const TAMANO_MINIMO_VOZ = 12288;

export const ALUCINACIONES_WHISPER = [
  'subtítulos',
  'gracias por ver',
  'suscríbete',
  'gracias',
  'todos los derechos',
  'diseño de sonido',
  'reproducir música',
  'teatro, actuación',
  'buena puntuación',
];

export const ESTRATEGIAS_INICIO: EstrategiaInicio[] = [
{
    id: 'estilo-libre',
    tecnica: 'Estilo Libre',
    enfoque: 'Abierto / Creativo',
    mecanica: 'Reacciona al título de forma orgánica e intuitiva, utilizando cualquier recurso (físico, verbal, relacional o espacial) sin restricciones de método.',
    pensamiento: 'Pensamiento asociativo y espontáneo: juego libre sin filtros técnicos.',
    idealPara: 'Cualquier formato, calentamientos, alumnos principiantes o exploración sin presión estructural.',
    criterioExito: 'Construcción de plataforma clara y jugable.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Establece en los primeros segundos una base sólida para la escena (quién es, dónde está y qué le pasa) y acepta el estímulo del título de forma honesta y utilizable para el compañero.',
    lucesRojas:
      'Se queda bloqueado por exceso de libertad (parálisis), ignora por completo el título propuesto, o genera una propuesta caótica que no construye ninguna situación dramática.',
  },
  {
    id: 'asociaciones-satelite',
    tecnica: 'Asociaciones Satélite',
    enfoque: 'Narrativo',
    mecanica: 'Antes de decir la primera palabra, mentalmente (o en un segundo si estás en el escenario), desglosa el título en tres palabras clave relacionadas.',
    pensamiento: 'Pensamiento lateral: evita la obviedad.',
    idealPara: 'Formatos largos, drama y misterio.',
    criterioExito: 'Originalidad periférica y coherencia.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Arranca con un elemento indirecto pero conectado al universo del título. Evita nombrar el título de golpe.',
    lucesRojas:
      'Cae en la literalidad absoluta o introduce un elemento tan inconexo que rompe el sentido del título.',
  },
  {
    id: 'disparador-primera-linea',
    tecnica: 'Disparador Primera Línea',
    enfoque: 'Narrativo',
    mecanica: 'Utiliza el título para justificar una primera frase impactante que rompa la expectativa.',
    pensamiento: 'Pensamiento verbal e ingenio: crea premisas rápidas.',
    idealPara: 'Comedia, sketches y formatos de juego corto.',
    criterioExito: 'Impacto y justificación del contexto.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'La primera frase engancha al público, rompe la expectativa obvia y plantea una premisa clara para la escena.',
    lucesRojas:
      'Dice una frase ingeniosa pero flotante que no construye plataforma ni da juego a su compañero.',
  },
  {
    id: 'objeto-imaginario',
    tecnica: 'Objeto Imaginario',
    enfoque: 'Físico',
    mecanica: 'Interactúa con un elemento invisible del título prestando atención al mimo.',
    pensamiento: 'Pensamiento espacial y kinestésico: baja la ansiedad cerebral.',
    idealPara: 'Teatro gestual, drama y escenas costumbristas.',
    criterioExito: 'Mimo, precisión y peso dramático.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'El objeto invisible tiene volumen, peso y consistencia física. Se toma tiempo para que el público lo vea antes de hablar.',
    lucesRojas:
      'El objeto desaparece a los dos segundos porque el alumno se pone a hablar y se olvida de su fisicidad.',
  },
  {
    id: 'modificacion-postura',
    tecnica: 'Modificación de Postura',
    enfoque: 'Físico',
    mecanica: 'Adopta la energía y el estatus corporal que evoca el título.',
    pensamiento: 'Pensamiento emocional y físico: el cuerpo lidera la mente.',
    idealPara: 'Creación de personajes e improvisación de estilo.',
    criterioExito: 'Compromiso corporal y estatus.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'La energía y la postura del cuerpo entero sostienen la atmósfera del título antes, durante y después de la primera palabra.',
    lucesRojas:
      'Solo cambia la cara o la voz, pero mantiene una postura corporal neutra o cotidiana.',
  },
  {
    id: 'zoom-in',
    tecnica: 'El Zoom In',
    enfoque: 'Atmósfera',
    mecanica: 'Empieza describiendo el entorno que sugiere el título como si fueras un narrador o un personaje que observa el espacio.',
    pensamiento: 'Pensamiento descriptivo y visual: pinta la escena.',
    idealPara: 'Monólogos de inicio, escenas íntimas y realismo mágico.',
    criterioExito: 'Capacidad descriptiva e imaginaria.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Pinta el espacio con palabras y detalles sensoriales, transportando al espectador antes de meter el conflicto.',
    lucesRojas:
      'Hace una descripción tipo inventario o se alarga tanto que la escena no avanza.',
  },
  {
    id: 'in-media-res',
    tecnica: 'In Media Res',
    enfoque: 'Atmósfera',
    mecanica: 'Ignora la introducción. Imagina que el título es el clímax o la consecuencia de algo que ya pasó, y empieza con una discusión o una acción física ya iniciada.',
    pensamiento: 'Pensamiento reactivo e impulsivo: acción sin filtro.',
    idealPara: 'Escenas de alta energía, discusiones cómicas y acción.',
    criterioExito: 'Manejo del ritmo y de la urgencia.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Entra con la acción física o el conflicto en su punto álgido. El compañero puede reaccionar de inmediato.',
    lucesRojas:
      'Entra gritando sin un motivo claro, generando ruido pero no información dramática utilizable.',
  },
  {
    id: 'efecto-mariposa',
    tecnica: 'Efecto Mariposa',
    enfoque: 'Estructural',
    mecanica: 'Toma el título como el resultado final de una larga cadena de eventos. Tu improvisación no empieza en el título, sino en el primer eslabón que llevará inevitablemente a él.',
    pensamiento: 'Pensamiento causal: construcción de plataformas sólidas.',
    idealPara: 'Tragedia, comedia de enredo e historias lineales.',
    criterioExito: 'Construcción de tensión y progresión.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Empieza desde la normalidad y realiza acciones cotidianas que el público asocia lógicamente con el desencadenante del título.',
    lucesRojas:
      'Fuerza el accidente o el clímax demasiado rápido en lugar de disfrutar del camino.',
  },
  {
    id: 'flashforward',
    tecnica: 'Flashforward',
    enfoque: 'Estructural',
    mecanica: 'Empieza mostrando la consecuencia directa del título y luego avanza desde ahí o haz un viaje al pasado.',
    pensamiento: 'Pensamiento resignado y reflexivo: sostener el después.',
    idealPara: 'Dramas profundos, escenas poéticas o de cierre.',
    criterioExito: 'Sostenimiento de la consecuencia.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Asume la carga emocional del después y juega con la melancolía, el alivio o el shock de lo que ya pasó.',
    lucesRojas:
      'Se queda sin ideas tras la primera frase y reinicia la escena volviendo al pasado de forma tosca.',
  },
  {
    id: 'punto-vista-opuesto',
    tecnica: 'Punto de Vista Opuesto',
    enfoque: 'Psicológico',
    mecanica: 'Reacciona al título con la emoción opuesta a la lógica.',
    pensamiento: 'Pensamiento disruptivo: rompe el cliché al cien por cien.',
    idealPara: 'Humor absurdo, humor negro y comedia contemporánea.',
    criterioExito: 'Contrapunto emocional y verdad.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'La emoción opuesta se juega con honestidad. La desconexión genera comedia o misterio genuino.',
    lucesRojas:
      'Se vuelve una parodia donde el alumno se ríe de su propia ocurrencia en lugar de vivir la escena.',
  },
  {
    id: 'subtexto-oculto',
    tecnica: 'Subtexto Oculto',
    enfoque: 'Psicológico',
    mecanica: 'Utiliza el título como un secreto que tu personaje sabe, pero que no quiere revelar bajo ningún concepto. Toda tu improvisación consistirá en evitar hablar del título, aunque todo lo que hagas esté condicionado por él.',
    pensamiento: 'Pensamiento estratégico: doble lectura y máscara.',
    idealPara: 'Suspense, drama psicológico e improvisación estilo Chéjov o Pinter.',
    criterioExito: 'Tensión interna y juego de máscara.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'El alumno suda el secreto. Sus acciones intentan tapar el título, pero sus ojos y lenguaje corporal lo delatan.',
    lucesRojas:
      'El subtexto es tan oculto que ni el compañero ni el público entienden qué está pasando.',
  },
  {
    id: 'metafora-literal',
    tecnica: 'Metáfora Literal',
    enfoque: 'Conceptual',
    mecanica: 'Convierte una frase poética o abstracta en una realidad física real.',
    pensamiento: 'Pensamiento lógico-absurdo: crea realidades paralelas.',
    idealPara: 'Estilos surrealistas, cómic y realismo sucio.',
    criterioExito: 'Aceptación del código absurdo.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Trata la metáfora física con naturalidad dentro de la lógica del personaje. El entorno reacciona a esa literalidad.',
    lucesRojas:
      'Lo juega como un chiste de mímica en lugar de una realidad física aplastante para el personaje.',
  },
  {
    id: 'ritmo-onomatopeya',
    tecnica: 'Ritmo y Onomatopeya',
    enfoque: 'Conceptual',
    mecanica: 'A veces los títulos tienen una musicalidad. Olvídate del significado de las palabras y concéntrate en su sonido. Empieza la escena repitiendo ese ritmo con un sonido, un tic físico o una tarea repetitiva.',
    pensamiento: 'Pensamiento musical y abstracto: desconecta el texto.',
    idealPara: 'Improvisación musical, danza-teatro y formatos experimentales.',
    criterioExito: 'Musicalidad y permanencia del patrón.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Se deja contagiar por el tempo del título y mantiene ese patrón rítmico en su habla o cuerpo como motor.',
    lucesRojas:
      'El ritmo se diluye en cuanto empieza a pensar en el argumento o en el texto.',
  },
];
