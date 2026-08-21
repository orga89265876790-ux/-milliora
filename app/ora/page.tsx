import Link from "next/link";
import styles from "./ora.module.css";

const tools = [
  {
    id: "dreams",
    icon: "☾",
    title: "Анализ сновидений",
    description: "Опиши сон и получи разбор с точки зрения психики и внутренних переживаний.",
  },
  {
    id: "name",
    icon: "A",
    title: "Анализ имени",
    description: "Фамилия, имя и отчество: происхождение, возможные значения и сочетание данных.",
    note: "ФИО + подпись + натальная карта",
  },
  {
    id: "signature",
    icon: "✎",
    title: "Анализ подписи",
    description: "Загрузи роспись и получи AI-разбор особенностей подписи.",
  },
  {
    id: "handwriting",
    icon: "✒",
    title: "Анализ почерка",
    description: "Портрет личности по особенностям рукописного текста.",
  },
  {
    id: "matrix",
    icon: "✧",
    title: "Матрица судьбы",
    description: "Числовой разбор ключевых энергий, повторяющихся тем и жизненных задач.",
  },
  {
    id: "numerology",
    icon: "369",
    title: "Нумерология",
    description: "Обычная и каббалистическая нумерология в одном разделе.",
  },
  {
    id: "tarot",
    icon: "▥",
    title: "Таро",
    description: "Карты для разбора ситуации, вариантов и возможных направлений.",
  },
  {
    id: "runes",
    icon: "ᚱ",
    title: "Руны",
    description: "Символический ответ и подсказка для размышления над ситуацией.",
  },
];

function OraLogo() {
  return (
    <div className={styles.logoWrap} aria-label="Ора">
      <svg className={styles.logo} viewBox="0 0 72 72" aria-hidden="true">
        <defs>
          <linearGradient id="ora-logo-gradient" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff4db8" />
            <stop offset=".5" stopColor="#7c4dff" />
            <stop offset="1" stopColor="#ff9a3d" />
          </linearGradient>
        </defs>
        <path d="M36 62C15 59 10 43 12 22c11 2 20 7 24 15 4-8 13-13 24-15 2 21-3 37-24 40Z" fill="none" stroke="url(#ora-logo-gradient)" strokeWidth="6" strokeLinejoin="round" />
        <path d="M36 36v27" stroke="url(#ora-logo-gradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="m36 43 4 7 8 3-8 3-4 7-4-7-8-3 8-3 4-7Z" fill="url(#ora-logo-gradient)" />
      </svg>
      <div>
        <strong>Ора</strong>
        <span>Твоя тайная помощница.</span>
        <b>Она всё помнит.</b>
      </div>
    </div>
  );
}

export default function OraPage() {
  return (
    <main className={styles.page}>
      <div className={styles.ambientOne} aria-hidden="true" />
      <div className={styles.ambientTwo} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconButton} aria-label="Назад на главную">‹</Link>
          <OraLogo />
          <button className={styles.iconButton} type="button" aria-label="Поиск">⌕</button>
        </header>

        <section className={styles.hero}>
          <div className={styles.memoryArt} aria-hidden="true">
            <div className={styles.chest}>✦</div>
            <span className={styles.floatOne}>♡</span>
            <span className={styles.floatTwo}>☾</span>
            <span className={styles.floatThree}>✎</span>
            <span className={styles.floatFour}>✧</span>
          </div>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Инструменты Оры</span>
            <h1>Пойми себя глубже</h1>
            <p>Ора собирает важные данные о тебе, связывает результаты анализов и помогает видеть повторяющиеся закономерности.</p>
          </div>
        </section>

        <section className={styles.astrology} id="astrology">
          <div className={styles.astrologySymbol} aria-hidden="true">
            <div className={styles.zodiacRing}>✦</div>
          </div>
          <div className={styles.astrologyCopy}>
            <span className={styles.eyebrow}>Большой раздел</span>
            <h2>Астрологический анализ</h2>
            <p>Все основные персональные астрологические инструменты в одном месте.</p>
            <div className={styles.chips}>
              <a href="#natal">Личная натальная карта</a>
              <a href="#horary">Хорар</a>
              <a href="#solar">Соляр</a>
              <a href="#transits">Транзиты</a>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </section>

        <section className={styles.grid} aria-label="Инструменты Оры">
          {tools.map((tool) => (
            <a className={styles.toolCard} href={`#${tool.id}`} id={tool.id} key={tool.id}>
              <span className={styles.toolIcon}>{tool.icon}</span>
              <div>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
                {tool.note && <small>{tool.note}</small>}
              </div>
              <span className={styles.cardArrow}>›</span>
            </a>
          ))}
        </section>
      </div>

      <nav className={styles.bottomNav} aria-label="Основная навигация">
        <Link href="/"><span>⌂</span><b>Главная</b></Link>
        <span className={styles.disabled}><span>▦</span><b>Разделы</b></span>
        <span className={styles.disabled}><span>✣</span><b>Милли</b></span>
        <Link href="/ora" className={styles.active} aria-current="page"><span>♧</span><b>Ора</b></Link>
        <span className={styles.disabled}><span>♙</span><b>Профиль</b></span>
      </nav>
    </main>
  );
}
