import type { JuegoImpro } from './types';

export const TIEMPO_JUEGO_INICIAL = 60;

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
      'Di una frase que empiece por "Si yo fuera...". La IA responderá como compañera tomando tu última palabra. Después tú continuarás desde la última palabra de la IA.',
    ejemplo:
      'Jugador: Si yo fuera el planeta Tierra, sería redonda. IA: Si yo fuera redonda, sería una pelota. Jugador: Si yo fuera una pelota, sería de baloncesto.',
    pista:
      'Puedes rebotar por significado, apariencia, contradicción, afinidad, conjunto semántico, sonido o cualquier asociación que mantenga viva la cadena.',
  },
];
