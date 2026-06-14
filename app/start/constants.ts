import type { EstrategiaInicio } from './types';

export const TIEMPO_INICIAL = 30;

export const TAMANO_MINIMO_VOZ = 12288;

export const ALUCINACIONES_WHISPER = [
  'subtitulos',
  'gracias por ver',
  'suscribete',
  'gracias',
  'todos los derechos',
  'diseno de sonido',
  'reproducir musica',
  'teatro, actuacion',
  'buena puntuacion',
];

export const ESTRATEGIAS_INICIO: EstrategiaInicio[] = [
{
    id: 'estilo-libre',
    tecnica: 'Estilo Libre',
    enfoque: 'Abierto / Creativo',
    mecanica: 'Reacciona al tÃ­tulo de forma orgÃ¡nica e intuitiva, utilizando cualquier recurso (fÃ­sico, verbal, relacional o espacial) sin restricciones de mÃ©todo.',
    pensamiento: 'Pensamiento asociativo y espontÃ¡neo: juego libre sin filtros tÃ©cnicos.',
    idealPara: 'Cualquier formato, calentamientos, alumnos principiantes o exploraciÃ³n sin presiÃ³n estructural.',
    criterioExito: 'ConstrucciÃ³n de plataforma clara y jugable.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Establece en los primeros segundos una base sÃ³lida para la escena (quiÃ©n es, dÃ³nde estÃ¡ y quÃ© le pasa) y acepta el estÃ­mulo del tÃ­tulo de forma honesta y utilizable para el compaÃ±ero.',
    lucesRojas:
      'Se queda bloqueado por exceso de libertad (parÃ¡lisis), ignora por completo el tÃ­tulo propuesto, o genera una propuesta caÃ³tica que no construye ninguna situaciÃ³n dramÃ¡tica.',
  },
  {
    id: 'asociaciones-satelite',
    tecnica: 'Asociaciones Satelite',
    enfoque: 'Narrativo',
    mecanica: 'Antes de decir la primera palabra, mentalmente (o en un segundo si estÃ¡s en el escenario), desglosa el tÃ­tulo en tres palabras clave relacionadas.',
    pensamiento: 'Pensamiento lateral: evita la obviedad.',
    idealPara: 'Formatos largos, drama y misterio.',
    criterioExito: 'Originalidad periferica y coherence.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Arranca con un elemento indirecto pero conectado al universo del titulo. Evita nombrar el titulo de golpe.',
    lucesRojas:
      'Cae en la literalidad absoluta o introduce un elemento tan inconexo que rompe el sentido del titulo.',
  },
  {
    id: 'disparador-primera-linea',
    tecnica: 'Disparador Primera Linea',
    enfoque: 'Narrativo',
    mecanica: 'Utiliza el tÃ­tulo para justificar una primera frase impactante que rompa la expectativa.',
    pensamiento: 'Pensamiento verbal e ingenio: crea premisas rapidas.',
    idealPara: 'Comedia, sketches y formatos de juego corto.',
    criterioExito: 'Impacto y justificacion del contexto.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'La primera frase engancha al publico, rompe la expectativa obvia y plantea una premisa clara para la escena.',
    lucesRojas:
      'Dice una frase ingeniosa pero flotante que no construye plataforma ni da juego a su companero.',
  },
  {
    id: 'objeto-imaginario',
    tecnica: 'Objeto Imaginario',
    enfoque: 'Fisico',
    mecanica: 'Interactua con un elemento invisible del titulo prestando atencion al mimo.',
    pensamiento: 'Pensamiento espacial y kinestesico: baja la ansiedad cerebral.',
    idealPara: 'Teatro gestual, drama y escenas costumbristas.',
    criterioExito: 'Mimo, precision y peso dramatico.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'El objeto invisible tiene volumen, peso y consistencia fisica. Se toma tiempo para que el publico lo vea antes de hablar.',
    lucesRojas:
      'El objeto desaparece a los dos segundos porque el alumno se pone a hablar y se olvida de su fisicidad.',
  },
  {
    id: 'modificacion-postura',
    tecnica: 'Modificacion de Postura',
    enfoque: 'Fisico',
    mecanica: 'Adopta la energia y el estatus corporal que evoca el titulo.',
    pensamiento: 'Pensamiento emocional y fisico: el cuerpo lidera la mente.',
    idealPara: 'Creacion de personajes e improvisacion de estilo.',
    criterioExito: 'Compromiso corporal y estatus.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'La energia y la postura del cuerpo entero sostienen la atmosfera del titulo antes, durante y despues de la primera palabra.',
    lucesRojas:
      'Solo cambia la cara o la voz, pero mantiene una postura corporal neutra o cotidiana.',
  },
  {
    id: 'zoom-in',
    tecnica: 'El Zoom In',
    enfoque: 'Atmosfera',
    mecanica: 'Empieza describiendo el entorno que sugiere el tÃ­tulo como si fueras un narrador o un personaje que observa el espacio.',
    pensamiento: 'Pensamiento descriptivo y visual: pinta la escena.',
    idealPara: 'Monologos de inicio, escenas intimas y realismo magico.',
    criterioExito: 'Capacidad descriptiva e imaginaria.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Pinta el espacio con palabras y detalles sensoriales, transportando al espectador antes de meter el conflicto.',
    lucesRojas:
      'Hace una descripcion tipo inventario o se alarga tanto que la escena no avanza.',
  },
  {
    id: 'in-media-res',
    tecnica: 'In Media Res',
    enfoque: 'Atmosfera',
    mecanica: 'Ignora la introducciÃ³n. Imagina que el tÃ­tulo es el clÃ­max o la consecuencia de algo que ya pasÃ³, y empieza con una discusiÃ³n o una acciÃ³n fÃ­sica ya iniciada.',
    pensamiento: 'Pensamiento reactivo e impulsivo: accion sin filtro.',
    idealPara: 'Escenas de alta energia, discusiones comicas y accion.',
    criterioExito: 'Manejo del ritmo y de la urgencia.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Entra con la accion fisica o el conflicto en su punto algido. El companero puede reaccionar de inmediato.',
    lucesRojas:
      'Entra gritando sin un motivo claro, generando ruido pero no informacion dramatica utilizable.',
  },
  {
    id: 'efecto-mariposa',
    tecnica: 'Efecto Mariposa',
    enfoque: 'Estructural',
    mecanica: 'Toma el tÃ­tulo como el resultado final de una larga cadena de eventos. Tu improvisaciÃ³n no empieza en el tÃ­tulo, sino en el primer eslabÃ³n que llevarÃ¡ inevitablemente a Ã©l.',
    pensamiento: 'Pensamiento causal: construccion de plataformas solidas.',
    idealPara: 'Tragedia, comedia de enredo e historias lineales.',
    criterioExito: 'Construccion de tension y progresion.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Empieza desde la normalidad and realiza acciones cotidianas que el publico asocia logicamente con el desencadenante del titulo.',
    lucesRojas:
      'Fuerza el accidente o el climax demasiado rapido en lugar de disfrutar del camino.',
  },
  {
    id: 'flashforward',
    tecnica: 'Flashforward',
    enfoque: 'Estructural',
    mecanica: 'Empieza mostrando la consecuencia directa del tÃ­tulo y luego avanza desde ahÃ­ o haz un viaje al pasado.',
    pensamiento: 'Pensamiento resignado y reflexivo: sostener el despues.',
    idealPara: 'Dramas profundos, escenas poeticas o de cierre.',
    criterioExito: 'Sostenimiento de la consecuencia.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Asume la carga emocional del despues y juega con la melancolia, el alivio o el shock de lo que ya paso.',
    lucesRojas:
      'Se queda sin ideas tras la primera frase y reinicia la escena volviendo al pasado de forma tosca.',
  },
  {
    id: 'punto-vista-opuesto',
    tecnica: 'Punto de Vista Opuesto',
    enfoque: 'Psicologico',
    mecanica: 'Reacciona al titulo con la emocion opuesta a la logica.',
    pensamiento: 'Pensamiento disruptivo: rompe el cliche al cien por cien.',
    idealPara: 'Humor absurdo, humor negro y comedia contemporanea.',
    criterioExito: 'Contrapunto emocional y verdad.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'La emocion opuesta se juega con honestidad. La desconexion genera comedia o misterio genuino.',
    lucesRojas:
      'Se vuelve una parodia donde el alumno se rie de su propia ocurrencia en lugar de vivir la escena.',
  },
  {
    id: 'subtexto-oculto',
    tecnica: 'Subtexto Oculto',
    enfoque: 'Psicologico',
    mecanica: 'Utiliza el tÃ­tulo como un secreto que tu personaje sabe, pero que no quiere revelar bajo ningÃºn concepto. Toda tu improvisaciÃ³n consistirÃ¡ en evitar hablar del tÃ­tulo, aunque todo lo que hagas estÃ© condicionado por Ã©l.',
    pensamiento: 'Pensamiento estrategico: doble lectura y mascara.',
    idealPara: 'Suspense, drama psicologico e improvisacion estilo Chejov o Pinter.',
    criterioExito: 'Tension interna y juego de mascara.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'El alumno suda el secreto. Sus acciones intentan tapar el titulo, pero sus ojos y lenguaje corporal lo delatan.',
    lucesRojas:
      'El subtexto es tan oculto que ni el companero ni el publico entienden que esta pasando.',
  },
  {
    id: 'metafora-literal',
    tecnica: 'Metafora Literal',
    enfoque: 'Conceptual',
    mecanica: 'Convierte una frase poetica o abstracta en una realidad fisica real.',
    pensamiento: 'Pensamiento logico-absurdo: crea realidades paralelas.',
    idealPara: 'Estilos surrealistas, comic y realismo sucio.',
    criterioExito: 'Aceptacion del codigo absurdo.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Trata la metafora fisica con naturalidad dentro de la logica del personaje. El entorno reacciona a esa literalidad.',
    lucesRojas:
      'Lo juega como un chiste de mimica en lugar de una reality fisica aplastante para el personaje.',
  },
  {
    id: 'ritmo-onomatopeya',
    tecnica: 'Ritmo y Onomatopeya',
    enfoque: 'Conceptual',
    mecanica: 'A veces los tÃ­tulos tienen una musicalidad. OlvÃ­date del significado de las palabras y concÃ©ntrate en su sonido. Empieza la escena repitiendo ese ritmo con un sonido, un tic fÃ­sico o una tarea repetitiva.',
    pensamiento: 'Pensamiento musical y abstracto: desconecta el texto.',
    idealPara: 'Improvisacion musical, danza-teatro y formatos experimentales.',
    criterioExito: 'Musicalidad y permanencia del patron.',
    ejemplo: 'Descripcion generica sin tema concreto: aplica la tecnica mediante una accion escenica visible, una relacion jugable y una decision clara de personaje.',
    indicadoresLogro:
      'Se deja contagiar por el tempo del titulo y mantiene ese patron ritmico en su habla o cuerpo como motor.',
    lucesRojas:
      'El ritmo se diluye en cuanto empieza a pensar en el argumento o en el texto.',
  },
];
