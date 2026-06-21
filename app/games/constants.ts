import type { JuegoImpro } from './types';

export const TIEMPO_JUEGO_INICIAL = 60;
export const TIEMPO_PORTERO_INICIAL = 10;
export const AYUDAS_PORTERO_INICIAL = 6;

export const JUEGOS_IMPRO: JuegoImpro[] = [
  {
    id: 'si-yo-fuera',
    nombre: 'Si yo fuera...',
    nivel: 'Nivel 1',
    duracion: 'Duración corta',
    categoria: 'Escucha y rebote',
    objetivo:
      'Potenciar la capacidad de rebotar utilizando el aporte de la compañera como estímulo para crear una frase nueva.',
    reglas:
      'Di una frase que empiece por "Si yo fuera..." o "Si yo fuese...". La IA responderá como compañera tomando tu última palabra. Después tú continuarás desde la última palabra de la IA.',
    ejemplo:
      'Jugador: Si yo fuera el planeta Tierra, sería redonda. IA: Si yo fuera redonda, sería una pelota. Jugador: Si yo fuese una pelota, sería de baloncesto.',
    pista:
      'Puedes rebotar por significado, apariencia, contradicción, afinidad, conjunto semántico, sonido o cualquier asociación que mantenga viva la cadena.',
  },
  {
    id: 'historia-interrumpida',
    nombre: 'Historia interrumpida',
    nivel: 'Nivel 1',
    duracion: 'Duración media',
    categoria: 'Sí y adaptación',
    objetivo:
      'Entrenar la capacidad de aceptar y valorar las propuestas del otro, adaptando la historia para seguir creando.',
    reglas:
      'Empieza una historia en pasado y en primera persona. La IA añadirá una frase que continúe lo anterior. Después tú aceptas esa propuesta, la incorporas y sigues narrando.',
    ejemplo:
      'Jugador: Ayer fui con mi novio a la montaña. IA: Fuimos con nuestros siete hijos. Jugador: Y con mis siete hijos, en la excursión, el menor desapareció.',
    pista:
      'Acepta la información nueva como si siempre hubiera formado parte de la historia. No la corrijas: incorpórala y avanza.',
  },
  {
    id: 'el-portero',
    nombre: 'El portero',
    nivel: 'Nivel 1',
    duracion: 'Duración larga',
    categoria: 'Sí y adaptación',
    objetivo:
      'Responder rápida y afirmativamente, entrando en situación y personaje a partir de la propuesta del otro.',
    reglas:
      'La IA interpreta a un personaje con un problema. Responde en pocos segundos diciendo qué harías para resolverlo. Después llegará otro personaje con otra problemática.',
    ejemplo:
      'IA: Doctor, me duele muchísimo la espalda. Jugador: Le doy una pastilla, un masaje y le mando reposo. IA: Funcionaria, he perdido todos mis papeles.',
    pista:
      'Registra al personaje, toma una decisión rápida y juega a favor de la situación. No busques la solución perfecta: busca una respuesta útil y afirmativa.',
  },
];
