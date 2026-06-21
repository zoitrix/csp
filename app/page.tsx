import Link from 'next/link';
import styles from './home.module.css';

const menuItems = [
  {
    title: 'Arco Dramático',
    description:
      'Entrena la construcción de una historia por actos: inicio, giros y desenlace.',
    href: '/structure',
    action: 'Practicar arco',
  },
  {
    title: 'Inicios',
    description:
      'Practica cómo arrancar una escena desde un título usando estrategias concretas de apertura.',
    href: '/start',
    action: 'Practicar inicios',
  },
  {
    title: 'Finales',
    description:
      'Entrena los diferentes finales desde una escena ya planteada.',
    href: '/end',
    action: 'Practicar finales',
  },
  {
    title: 'Juegos',
    description:
      'Juega a diferentes dinámicas para practicar los pilares básicos de la improvisación.',
    href: '/games',
    action: 'Jugar ahora',
  },
  {
    title: '🚧ImprovIA🚧',
    description:
      '¡El gran reto! Comparte escena con un coactor vIArtual y desarrolla tu propia historia.',
    href: '/improia',
    action: 'Improvisar ahora',
  },
];

export default function HomePage() {
  return (
    <main className={styles.teatroContainer}>
      <header className={styles.teatroHeader}>
        <h1>Impro TrAIner</h1>
        <p className={styles.subtitulo}>Elige tu escenario de entrenamiento (v0.34)</p>
      </header>

      <section className={styles.escenario} aria-label="Menú principal">
        {menuItems.map((item) => (
          <Link key={item.href} className={styles.menuCard} href={item.href}>
            <span className={styles.cardContent}>
              <span className={styles.cardTitle}>{item.title}</span>
              <span className={styles.cardDescription}>{item.description}</span>
            </span>
            <span className={styles.cardAction}>{item.action}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
