import { crearTurno, extraerUltimaPalabra, normalizarComparacion } from './analysis';
import type { TurnoJuego } from '../types';

type CreadorRespuesta = (palabra: string) => string[];

const RESPUESTAS_ESPECIFICAS: Record<string, string[]> = {
  abierta: [
    'Si yo fuera abierta, sería una invitación.',
    'Si yo fuera abierta, dejaría pasar la luz.',
  ],
  baloncesto: [
    'Si yo fuera baloncesto, sería una canasta.',
    'Si yo fuera baloncesto, botaría en una pista.',
  ],
  canasta: [
    'Si yo fuera canasta, sería una celebración.',
    'Si yo fuera canasta, tendría una red.',
  ],
  cacahuete: [
    'Si yo fuera cacahuete, crujiría dentro de una cáscara.',
    'Si yo fuera cacahuete, sería merienda de elefante.',
  ],
  celebracion: [
    'Si yo fuera celebración, sería una fiesta.',
    'Si yo fuera celebración, llenaría la sala de aplausos.',
  ],
  elefante: [
    'Si yo fuera elefante, caminaría por la sabana.',
    'Si yo fuera elefante, levantaría una trompa.',
    'Si yo fuera elefante, viajaría con la manada.',
  ],
  final: [
    'Si yo fuera final, cerraría una puerta.',
    'Si yo fuera final, dejaría un silencio.',
    'Si yo fuera final, abriría un recuerdo.',
  ],
  fantastica: [
    'Si yo fuera fantástica, viviría en una aventura.',
    'Si yo fuera fantástica, rompería una regla.',
    'Si yo fuera fantástica, aparecería en un sueño.',
  ],
  fantastico: [
    'Si yo fuera fantástico, viviría en una aventura.',
    'Si yo fuera fantástico, rompería una regla.',
  ],
  fiesta: [
    'Si yo fuera fiesta, sería una canción.',
    'Si yo fuera fiesta, acabaría con confeti.',
  ],
  historia: [
    'Si yo fuera historia, tendría un personaje.',
    'Si yo fuera historia, cruzaría un conflicto.',
    'Si yo fuera historia, escondería un secreto.',
  ],
  iglesia: [
    'Si yo fuera iglesia, sería una campana.',
    'Si yo fuera iglesia, guardaría un silencio.',
  ],
  iglesias: [
    'Si yo fuera iglesias, sería un eco.',
    'Si yo fuera iglesias, tendría muchas campanas.',
  ],
  mundo: [
    'Si yo fuera mundo, estaría lleno de personas.',
    'Si yo fuera mundo, giraría alrededor del sol.',
    'Si yo fuera mundo, tendría muchos mapas.',
  ],
  nina: [
    'Si yo fuera niña, tendría una coleta.',
    'Si yo fuera niña, inventaría un juego.',
  ],
  ninas: [
    'Si yo fuera niña, tendría una coleta.',
    'Si yo fuera niña, inventaría un juego.',
  ],
  parque: [
    'Si yo fuera parque, recibiría feliz a las niñas.',
    'Si yo fuera parque, tendría bancos y columpios.',
  ],
  pelota: [
    'Si yo fuera pelota, sería de baloncesto.',
    'Si yo fuera pelota, rebotaría en el suelo.',
  ],
  personas: [
    'Si yo fuera personas, formaría una comunidad.',
    'Si yo fuera personas, llenaría una plaza.',
  ],
  redonda: [
    'Si yo fuera redonda, sería una pelota.',
    'Si yo fuera redonda, rodaría por una cuesta.',
  ],
  tierra: [
    'Si yo fuera Tierra, sería redonda.',
    'Si yo fuera Tierra, tendría océanos.',
  ],
};

const RELACIONES_SEMANTICAS: Array<{ palabras: string[]; crear: CreadorRespuesta }> = [
  {
    palabras: ['animal', 'elefante', 'perro', 'gato', 'leon', 'león', 'pajaro', 'pájaro', 'caballo', 'jirafa', 'mono'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, buscaría comida.`,
      `Si yo fuera ${palabra}, dejaría huellas.`,
      `Si yo fuera ${palabra}, viviría en una manada.`,
    ],
  },
  {
    palabras: ['mundo', 'planeta', 'tierra', 'pais', 'país', 'ciudad', 'pueblo', 'barrio', 'calle', 'casa', 'habitacion', 'habitación'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, estaría lleno de personas.`,
      `Si yo fuera ${palabra}, tendría caminos.`,
      `Si yo fuera ${palabra}, aparecería en un mapa.`,
    ],
  },
  {
    palabras: ['persona', 'personas', 'gente', 'familia', 'amigo', 'amiga', 'vecino', 'vecina', 'niño', 'niña', 'nino', 'nina'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, tendría un deseo.`,
      `Si yo fuera ${palabra}, hablaría con alguien.`,
      `Si yo fuera ${palabra}, guardaría un recuerdo.`,
    ],
  },
  {
    palabras: ['puerta', 'ventana', 'mesa', 'silla', 'maleta', 'llave', 'caja', 'libro', 'telefono', 'teléfono', 'vaso', 'cuchara'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, guardaría una huella.`,
      `Si yo fuera ${palabra}, tendría una función.`,
      `Si yo fuera ${palabra}, estaría en una casa.`,
    ],
  },
  {
    palabras: ['mar', 'rio', 'río', 'montaña', 'bosque', 'arbol', 'árbol', 'flor', 'lluvia', 'viento', 'sol', 'luna', 'nube'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, cambiaría el paisaje.`,
      `Si yo fuera ${palabra}, tendría una estación.`,
      `Si yo fuera ${palabra}, respiraría naturaleza.`,
    ],
  },
  {
    palabras: ['pelota', 'balon', 'balón', 'raqueta', 'portería', 'porteria', 'canasta', 'estadio', 'equipo', 'baloncesto', 'futbol', 'fútbol'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, jugaría un partido.`,
      `Si yo fuera ${palabra}, escucharía al público.`,
      `Si yo fuera ${palabra}, sudaría en la pista.`,
    ],
  },
  {
    palabras: ['alegria', 'alegría', 'miedo', 'rabia', 'tristeza', 'amor', 'sorpresa', 'vergüenza', 'verguenza', 'calma'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, se me notaría en la cara.`,
      `Si yo fuera ${palabra}, cambiaría una voz.`,
      `Si yo fuera ${palabra}, movería el cuerpo.`,
    ],
  },
  {
    palabras: ['cancion', 'canción', 'musica', 'música', 'ritmo', 'voz', 'eco', 'campana', 'silencio', 'ruido'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, llenaría una habitación.`,
      `Si yo fuera ${palabra}, tendría un ritmo.`,
      `Si yo fuera ${palabra}, viajaría por el aire.`,
    ],
  },
  {
    palabras: ['pregunta', 'respuesta', 'idea', 'secreto', 'recuerdo', 'sueño', 'sueno', 'duda', 'promesa', 'historia', 'final'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, viviría dentro de una cabeza.`,
      `Si yo fuera ${palabra}, cambiaría una decisión.`,
      `Si yo fuera ${palabra}, necesitaría un personaje.`,
    ],
  },
  {
    palabras: ['comida', 'pan', 'queso', 'fruta', 'manzana', 'cacahuete', 'chocolate', 'sopa', 'galleta'],
    crear: (palabra) => [
      `Si yo fuera ${palabra}, acabaría en una mesa.`,
      `Si yo fuera ${palabra}, tendría sabor.`,
      `Si yo fuera ${palabra}, sería parte de una merienda.`,
    ],
  },
];

const FALLBACKS: CreadorRespuesta = (palabra) => [
  `Si yo fuera ${palabra}, tendría una consecuencia.`,
  `Si yo fuera ${palabra}, cambiaría una escena.`,
  `Si yo fuera ${palabra}, provocaría una reacción.`,
  `Si yo fuera ${palabra}, escondería un detalle.`,
  `Si yo fuera ${palabra}, necesitaría un lugar.`,
];

function obtenerCandidatas(palabra: string): string[] {
  const clave = normalizarComparacion(palabra);

  if (RESPUESTAS_ESPECIFICAS[clave]) {
    return RESPUESTAS_ESPECIFICAS[clave];
  }

  const relacion = RELACIONES_SEMANTICAS.find((item) =>
    item.palabras.some((candidata) => normalizarComparacion(candidata) === clave),
  );

  return relacion ? relacion.crear(palabra) : FALLBACKS(palabra);
}

function elegirSinCerrarEnPalabraReciente(candidatas: string[], historial: TurnoJuego[]): string {
  const recientes = new Set(historial.slice(-6).map((turno) => normalizarComparacion(turno.ultimaPalabra)));
  const candidataSinRepetir = candidatas.find((candidata) => {
    const ultima = normalizarComparacion(extraerUltimaPalabra(candidata));
    return ultima !== '' && !recientes.has(ultima);
  });

  return candidataSinRepetir ?? candidatas[0];
}

export function generarTurnoCompanera(palabraJugador: string, historial: TurnoJuego[] = []): TurnoJuego {
  const palabra = palabraJugador || 'silencio';
  const texto = elegirSinCerrarEnPalabraReciente(obtenerCandidatas(palabra), historial);

  return crearTurno({
    autor: 'ia',
    texto,
    palabraEsperada: palabra,
  });
}
