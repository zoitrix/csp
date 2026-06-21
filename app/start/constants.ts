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
    id: 'motor-accion',
    tecnica: 'Arranque por Accion',
    enfoque: 'Fisico / Motor de Movimiento',
    mecanica: 'El jugador comienza con una accion fisica concreta (peinarse, barrer, etc.) sin saber aun quien es o donde esta, descubriendo la escena a partir del trabajo con ese motor.',
    pensamiento: 'Pensamiento kinestesico y de descubrimiento: la accion precede a la justificacion.',
    idealPara: 'Romper la parálisis del texto, encontrar la escena de forma organica y realismo sucio.',
    criterioExito: 'Sostenimiento de la actividad fisica e incorporacion del titulo.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno entra a escena e inmediatamente simula pasar un trapo de forma obsesiva por una barra invisible, manteniendo el movimiento. Al cabo de unos segundos, se detiene, mira el trapo con frustración y dice: "Ni limpiando se me quita el disgusto de lo de ayer".',
    indicadoresLogro:
      'Mantiene la accion fisica concreta de forma nitida durante los primeros segundos, permitiendo que el que, quien o donde emerjan logicamente de ese movimiento corporal.',
    lucesRojas:
      'Nombra la accion en lugar de hacerla, o abandona el movimiento fisico por completo en cuanto empieza a hablar.',
  },
  {
    id: 'motor-espacio',
    tecnica: 'Exploración del Entorno',
    enfoque: 'Atmosfera / Entorno',
    mecanica: 'Comienza trabajando con la creacion y exploracion de un espacio imaginario especifico (un baño, una nave espacial, una isla desierta) sugerido o modificado por el titulo.',
    pensamiento: 'Pensamiento espacial y geografico: el entorno define las reglas del juego.',
    idealPara: 'Escenas costumbristas, ciencia ficcion, monologos y situaciones de encierro.',
    criterioExito: 'Consistencia en la interaccion con la arquitectura imaginaria.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno camina con cuidado tocando paredes invisibles estrechas, se agacha simulando abrir una taquilla metalica pegada a la pared, busca dentro y palpa las esquinas vacias con desesperacion.',
    indicadoresLogro:
      'Respeta las dimensiones, objetos fijas y la atmosfera del lugar elegido a traves de su mirada y comportamiento fisico inicial.',
    lucesRojas:
      'Atraviesa paredes imaginarias, olvida donde coloco los elementos del entorno o describe el espacio de palabra sin habitarlo corporalmente.',
  },
  {
    id: 'motor-gesto',
    tecnica: 'Gesticulación Corporal',
    enfoque: 'Corporal / Abstracto',
    mecanica: 'El improvisador sale a escena con un movimiento abstracto o tic corporal que repite constantemente, el cual no constituye una accion cotidiana o concreta en principio.',
    pensamiento: 'Pensamiento abstracto y ritmico: el bucle corporal genera la psicologia.',
    idealPara: 'Humor absurdo, estilos expresionistas, creacion de obsesiones y juego corto.',
    criterioExito: 'Mantenimiento del patron gestual como motor psicologico.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno entra estirando rítmicamente el cuello de su camiseta hacia delante y soltándolo de golpe cada tres pasos, con la mirada ida. Tras repetir el gesto tres veces, dice: "Siento que me ahogo desde lo de ayer".',
    indicadoresLogro:
      'Sostiene la repeticion del movimiento abstracto con precision formal, utilizandolo como el motor que tiñe su forma de hablar o reaccionar.',
    lucesRojas:
      'Realiza el gesto solo una vez a modo de adorno y lo olvida, o lo confunde con una accion cotidiana utilitaria (como rascarse).',
  },
  {
    id: 'motor-tipo-personaje',
    tecnica: 'Caracterización del Personaje',
    enfoque: 'Caracterizacion / Estatus',
    mecanica: 'Empezar la improvisacion adoptando directamente la configuracion corporal, voz, energia y acciones arquetipicas de un tipo social o rol (un mafioso, un filosofo, un ejecutivo, un ser gris).',
    pensamiento: 'Pensamiento relacional y arquetipico: jugar desde una mascara clara.',
    idealPara: 'Comedia de caracteres, improvisacion de epoca, sketches y cambio de estatus.',
    criterioExito: 'Sostenimiento de la mascara corporal y vocal adoptada.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno adopta la postura rigida, el pecho inflado y el caminar pesado de un mafioso de pelicula, masca chicle de forma ruda y le dice a su compañero con voz ronca: "Nadie le quita nada a un Leone y vive para contarlo".',
    indicadoresLogro:
      'Modifica su registro neutro para encarnar el arquetipo desde el primer segundo a traves del peso, la velocidad de movimiento y el tono de voz.',
    lucesRojas:
      'Rompe el personaje y vuelve a su actitud cotidiana en cuanto el compañero le propone un contraestimulo.',
  },
  {
    id: 'motor-estado-animo',
    tecnica: 'Arranque por Estado de Animo',
    enfoque: 'Emocional',
    mecanica: 'Arrancar la escena poseido al cien por cien por una emocion basica o estado interno visceral (triste, miedoso, enamorado) provocado por el significado del titulo.',
    pensamiento: 'Pensamiento emocional puro: la emocion filtra toda la realidad de la escena.',
    idealPara: 'Drama, melodrama, comedias de enredo y formatos de alta intensidad.',
    criterioExito: 'Verdad y consistencia en el filtro emocional escogido.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno irrumpe en escena con los ojos desorbitados, temblando visiblemente, mirando hacia atras a cada segundo y sobresaltandose exageradamente ante cualquier ruido minimo del espacio.',
    indicadoresLogro:
      'Justifica todo lo que ve y oye a traves del filtro del estado de animo elegido, contagiando la atmosfera emocional al compañero.',
    lucesRojas:
      'Menciona la emocion de palabra ("estoy muy triste") pero su cuerpo y energia muestran una neutralidad absoluta.',
  },
  {
    id: 'motor-imagen',
    tecnica: 'Visualización de una Imagen',
    enfoque: 'Conceptual / Mental',
    mecanica: 'Salir a escena con una imagen mental fija en la cabeza e inspirar la energia, velocidad, mirada y tono muscular en la dinamica de esa metafora (un grano de arena en el desierto, un hielo deshaciendose).',
    pensamiento: 'Pensamiento poetico y analogico: traducir un concepto visual a dinamica corporal.',
    idealPara: 'Teatro conceptual, formatos de Long Form liricos o experimentales y realismo magico.',
    criterioExito: 'Traduccion fisica coherente de la metafora interna.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno retiene la imagen de "un hielo deshaciéndose". Entra muy rigido y, conforme avanza la escena y recuerda el robo, sus articulaciones se van aflojando pesadamente, derramandose de forma literal sobre una silla.',
    indicadoresLogro:
      'Logra plasmar en su dinamica de movimiento, ritmo o mirada la cualidad fisica que inspira la imagen mental elegida.',
    lucesRojas:
      'La imagen se queda atrapada en el plano mental del alumno sin traducirse en ningun cambio fisico u organico visible.',
  },
  {
    id: 'motor-sensacion',
    tecnica: 'Arranque basado en Sensaciones',
    enfoque: 'Fisico / Organico',
    mecanica: 'Iniciar la escena condicionado por un estado puramente organico o sensorial del cuerpo (frio, cansancio, desequilibrio, ceguera).',
    pensamiento: 'Pensamiento organico y sensorial: el estimulo fisico real lidera la improvisacion.',
    idealPara: 'Formatos dramaticos, teatro fisico, situaciones limite y entrenamiento de escucha corporal.',
    criterioExito: 'Organicidad y permanencia de la limitacion o condicion fisica.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno entra tiritando de forma incontrolable, encogiendose sobre si mismo y frotandose las manos con violencia para buscar calor, vinculando esa desproteccion termica con el desamparo de haber sido robado.',
    indicadoresLogro:
      'Mantiene la reaccion fisiologica a la sensacion elegida (pesadez de parpados si es cansancio, temblor si es frio) de manera organica durante toda la introduccion.',
    lucesRojas:
      'Sana milagrosamente de la sensacion o limitacion fisica en cuanto el argumento de la escena exige desplazarse o hablar.',
  },
  {
    id: 'motor-texto',
    tecnica: 'Arranque verbal por Texto',
    enfoque: 'Verbal / Impulsivo',
    mecanica: 'Lanzar una frase o palabra contundente nada mas pisar el escenario, utilizandola como un tiro en la oscuridad para descubrir hacia donde lleva y que realidad construye.',
    pensamiento: 'Pensamiento intuitivo-verbal: compromiso absoluto con el primer impulso oral.',
    idealPara: 'Formatos de juego corto, comedia rapida, resolucion de bloqueos y estilos realistas.',
    criterioExito: 'Aceptacion inmediata de la premisa lanzada en la primera linea.',
    ejemplo: 'Título: "Me robaron mi billetera ayer". El alumno pone un pie en el escenario, mira fijamente al vacio y suelta de golpe a gran volumen: "¡Siete! ¡Siete veces seguidas me ha pasado!". A partir de ahi construye el universo de su mala suerte.',
    indicadoresLogro:
      'Lanza la primera frase sin titubeos ni rodeos y asume las consecuencias logicas de sus propias palabras para edificar la plataforma de la escena.',
    lucesRojas:
      'Dice una frase ambigua o de relleno ("hola", "bueno") que no propone informacion, o se retracta del sentido de su frase un segundo despues.',
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
  }
];
