import type { EscenaFinal, TipoFinal } from './types';

export const TIEMPO_INICIAL_FINAL = 30;

export const ESCENA_FINAL_VACIA: EscenaFinal = {
  titulo: '',
  planteamiento: '',
  nudo: '',
};

export const TIPOS_FINAL: TipoFinal[] = [
  {
    id: 'final-cerrado',
    tecnica: 'Final Cerrado',
    enfoque: 'Resolución / Conclusión',
    mecanica:
      'Identifica el conflicto principal de la escena y ejecuta una acción o toma una decisión definitiva que responda a la gran pregunta de la historia, eliminando la necesidad de continuidad.',
    pensamiento:
      'Pensamiento convergente y resolutivo: cerrar hilos narrativos en lugar de abrir nuevas subtramas.',
    idealPara:
      'Formatos cortos de improvisación, escenas independientes y entrenamiento de estructura clásica aristotélica.',
    criterioExito:
      'Resolución del conflicto principal de forma clara y contundente, sin dejar preguntas importantes en el aire.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Resuelve el motor de la escena de manera definitiva, ofrece una conclusión satisfactoria para el espectador y limpia los cabos sueltos argumentales antes del apagón.',
    lucesRojas:
      'La escena termina por inercia o aburrimiento sin resolver el problema inicial, se introduce un conflicto nuevo en el último segundo que invalida el cierre o se alarga el diálogo en un bucle repetitivo.',
  },
  {
    id: 'final-abierto',
    tecnica: 'Final Abierto',
    enfoque: 'Tensión / Cliffhanger',
    mecanica:
      'Eleva el conflicto al punto de máxima tensión o revela un elemento crítico inminente, cortando la escena justo antes de que se produzca la resolución.',
    pensamiento:
      'Pensamiento estratégico y de suspensión: sostener la incertidumbre y proyectar el futuro en la mente del público.',
    idealPara:
      'Formatos largos, transiciones de capítulos, estructura serial y escenas que entrenan ritmo y timing.',
    criterioExito:
      'Cortar la escena exactamente en el clímax de tensión, dejando al público con la intriga en su punto máximo.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Identifica el pico más alto de la acción dramática para congelar o detener la escena, y plantea una situación donde las consecuencias futuras quedan claras y sugeridas para el espectador.',
    lucesRojas:
      'Cortar la escena en un momento plano o confuso, retardar tanto el corte que el misterio se resuelva solo, o transformar el final abierto en un final cerrado.',
  },
  {
    id: 'final-circular',
    tecnica: 'Final Circular',
    enfoque: 'Simetría / Retorno',
    mecanica:
      'Utiliza la memoria escénica para recuperar con precisión mimética el elemento inicial de la escena y otorgarle un nuevo significado tras el viaje de los personajes.',
    pensamiento:
      'Pensamiento asociativo: conectar desenlace con la plataforma inicial de la historia.',
    idealPara:
      'Formatos de comedia, improvisaciones poéticas y entrenamiento de escucha a largo plazo y memoria espacial.',
    criterioExito:
      'Conectar a la perfección con el inicio, otorgándole un nuevo significado a la escena.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Demuestra una excelente memoria escénica al replicar el inicio y justifica orgánicamente por qué los personajes regresan al origen, mostrando el impacto del cambio o el bucle que habitan.',
    lucesRojas:
      'Ignorar por completo el punto de partida, intentar hacer un cierre circular entrando en la frase original o en la posición física sin que conecte con el público, o destruir la simetría estética.',
  },
  {
    id: 'final-giro-inesperado',
    tecnica: 'Final de Giro Inesperado',
    enfoque: 'Sorpresa / Recontextualización',
    mecanica:
      'Introduce una revelación o información oculta en los últimos segundos que cambia por completo el sentido de todo lo que el público ha visto, apoyándose en pistas sutiles dejadas previamente.',
    pensamiento:
      'Pensamiento lateral y de doble codificación: construir una realidad aparente mientras se siembran pistas de la realidad oculta.',
    idealPara:
      'Formatos de misterio, suspense, drama o comedia inteligente, y alumnos avanzados que dominan la sutileza.',
    criterioExito:
      'La revelación final es sorprendente pero lógica gracias a las pistas sutiles que se sembraron durante la escena.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Siembra pistas válidas durante el desarrollo sin hacerlas evidentes, y ejecuta la revelación final con total coherencia, provocando una recontextualización inmediata en la mente del espectador.',
    lucesRojas:
      'Sacarse de la manga un final tramposo que no tiene relación con lo anterior, generar un giro que contradice la lógica interna de la escena o confunde al compañero de juego.',
  },
  {
    id: 'final-anticlimax',
    tecnica: 'Final Anticlímax',
    enfoque: 'Contraste / Ruptura Cómica',
    mecanica:
      'Construye y exagera una atmósfera de extrema gravedad, peligro o drama épico para, en el último segundo, desinflar la tensión por completo resolviendo el conflicto con un elemento cotidiano, banal o ridículo.',
    pensamiento:
      'Pensamiento del absurdo y manejo del ritmo: sostener la verdad de la tragedia para potenciar el remate cómico.',
    idealPara:
      'Escenas cómicas, parodias de género y entrenamiento de modulación de energía e intensidad en escena.',
    criterioExito:
      'Elevar la tensión al máximo y desinflarla de golpe hacia algo cotidiano con un ritmo cómico excelente.',
    ejemplo: 'Descripción genérica sin tema concreto: aplica la técnica mediante una acción escénica visible, una relación jugable y una decisión clara de personaje.',
    indicadoresLogro:
      'Mantiene una actuación honesta y de alta intensidad dramática durante el nudo de la escena y ejecuta la caída de tensión de forma drástica y rápida, clavando el timing del chiste.',
    lucesRojas:
      'No construir suficiente tensión dramática previa, abandonar la verdad del personaje antes del remate o romper la magia cómica de la escena.',
  },
];
