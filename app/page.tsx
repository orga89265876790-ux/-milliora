"use client";

import { useEffect, useMemo, useState } from "react";

type MetricKey = "mood" | "wellbeing" | "energy";
type SaveKey = MetricKey | "sleep" | "focus-0" | "focus-1" | "focus-2" | "diary";

const metricCards: Array<{ key: MetricKey; title: string; icon: string; accent: string }> = [
  { key: "mood", title: "Настроение", icon: "☺", accent: "violet" },
  { key: "wellbeing", title: "Самочувствие", icon: "♡", accent: "pink" },
  { key: "energy", title: "Энергия", icon: "ϟ", accent: "orange" },
];

const defaultMetrics: Record<MetricKey, string> = { mood: "7", wellbeing: "8", energy: "6" };
const thoughts = [
  "Сделай ещё один шаг к счастливой жизни.",
  "Сегодня достаточно двигаться в своём темпе.",
  "Заметь хорошее — даже если оно совсем небольшое.",
];
const quickActions = [
  ["☾", "Сон", "violet"], ["✦", "Хорар", "pink"], ["✎", "Почерк", "orange"],
  ["▣", "Фото", "pink"], ["❀", "Тест", "violet"], ["✧", "Гороскоп", "blue"],
];

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch { return fallback; }
}

function Brand() {
  return (
    <div className="brand" aria-label="MilliOra">
      <svg className="brand-logo" viewBox="0 0 72 72" aria-hidden="true">
        <defs><linearGradient id="logo-gradient" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor="#f130bd"/><stop offset=".5" stopColor="#7837f5"/><stop offset="1" stopColor="#ff7b28"/></linearGradient></defs>
        <path d="M36 62C15 59 10 43 12 22c11 2 20 7 24 15 4-8 13-13 24-15 2 21-3 37-24 40Z" fill="none" stroke="url(#logo-gradient)" strokeWidth="6" strokeLinejoin="round"/>
        <path d="M36 36v27" stroke="url(#logo-gradient)" strokeWidth="4" strokeLinecap="round"/>
        <path d="m36 43 4 7 8 3-8 3-4 7-4-7-8-3 8-3 4-7Z" fill="url(#logo-gradient)"/>
      </svg>
      <strong>MilliOra</strong>
    </div>
  );
}

export default function Home() {
  const [metrics, setMetrics] = useState<Record<MetricKey, string>>(defaultMetrics);
  const [sleepHours, setSleepHours] = useState("8");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [focuses, setFocuses] = useState(["", "", ""]);
  const [diary, setDiary] = useState("");
  const [saved, setSaved] = useState<SaveKey | null>(null);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMetrics(readStored("milliora.metrics", defaultMetrics));
      const sleep = readStored("milliora.sleep", { hours: "8", wakeTime: "07:30" });
      setSleepHours(sleep.hours); setWakeTime(sleep.wakeTime);
      setFocuses(readStored("milliora.focuses", ["", "", ""]));
      setDiary(readStored("milliora.diary", ""));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const today = useMemo(() => new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()), []);

  function showSaved(key: SaveKey) {
    setSaved(key);
    window.setTimeout(() => setSaved((current) => current === key ? null : current), 1500);
  }
  function saveMetric(key: MetricKey) { window.localStorage.setItem("milliora.metrics", JSON.stringify(metrics)); showSaved(key); }
  function saveSleep() { if (!sleepHours || !wakeTime) return; window.localStorage.setItem("milliora.sleep", JSON.stringify({ hours: sleepHours, wakeTime })); showSaved("sleep"); }
  function saveFocus(index: number) { if (!focuses[index].trim()) return; window.localStorage.setItem("milliora.focuses", JSON.stringify(focuses)); showSaved(`focus-${index}` as SaveKey); }
  function saveDiary() { if (!diary.trim()) return; window.localStorage.setItem("milliora.diary", JSON.stringify(diary)); showSaved("diary"); }
  function openAction(label: string) {
    if (label === "Сон") { document.getElementById("sleep-card")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (label === "Хорар" || label === "Посмотреть хорар") { window.location.href = "/ora#astrology"; return; }
    setNotice(`${label}: раздел будет открыт на следующем экране`); window.setTimeout(() => setNotice(""), 2200);
  }

  return (
    <main className="app-shell">
      <div className="page-content">
        <header className="topbar">
          <button className="square-button notification-button" aria-label="Уведомления">♧<span /></button>
          <Brand />
          <button className="square-button" aria-label="Поиск" onClick={() => setSearchOpen((current) => !current)}>⌕</button>
        </header>

        {searchOpen && <div className="search-bar panel"><span>⌕</span><input autoFocus placeholder="Найти раздел, тест или запись"/><button onClick={() => setSearchOpen(false)}>Закрыть</button></div>}

        <section className="welcome">
          <h1>Доброе утро, Андрей! <span>☀</span></h1>
          <div className="thought-line"><b>✣</b><p>{thoughts[thoughtIndex]}</p><button aria-label="Другая мысль" onClick={() => setThoughtIndex((thoughtIndex + 1) % thoughts.length)}>↻</button></div>
          <div className="day-context"><span>☀ 22° · Москва</span><span>⌁ Магнитное поле спокойное</span></div>
          <p className="question">Как ты сегодня себя чувствуешь?</p>
        </section>

        <section className="metrics-grid" aria-label="Показатели состояния">
          {metricCards.map((card) => {
            const score = Number(metrics[card.key]) || 0;
            return <article className={`metric-card panel ${card.accent}`} key={card.key}>
              <div className="metric-heading"><div><h2>{card.title}</h2><strong>{score || "—"}<small> / 10</small></strong></div><span className="round-icon">{card.icon}</span></div>
              <div className="score-dots" aria-label={`Выбрать оценку: ${card.title}`}>
                {Array.from({ length: 10 }, (_, index) => <button aria-label={`${index + 1} из 10`} className={index < score ? "filled" : ""} key={index} onClick={() => setMetrics((current) => ({ ...current, [card.key]: String(index + 1) }))}/>) }
              </div>
              <button className="mini-save" onClick={() => saveMetric(card.key)}>{saved === card.key ? "Сохранено ✓" : "Сохранить"}</button>
            </article>;
          })}
        </section>

        <section className="milli-card panel">
          <div className="milli-copy"><h2><span>✣</span> Милли рекомендует</h2><p>Сегодня лучше не принимать поспешных решений.</p><p>Есть хорошие возможности для общения.</p><button onClick={() => setNotice("Милли уже готова к разговору")}>Поговорить с Милли <span>›</span></button></div>
          <div className="cosmos-art" aria-hidden="true"><i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/><b>✦</b><span className="spark s1">✦</span><span className="spark s2">✦</span><span className="spark s3">✦</span></div>
        </section>

        <section className="dashboard-grid">
          <article className="todo-card panel">
            <div className="card-title"><h2>Сегодня стоит сделать</h2><span>▦</span></div>
            <div className="todo-list">{[["✧", "Символ дня", "violet"], ["❀", "Пройти психологический тест", "pink"], ["☾", "Записать свой сон", "purple"], ["✹", "Посмотреть хорар", "orange"]].map(([icon, label, color]) => <button key={label} onClick={() => openAction(label)}><span className={color}>{icon}</span><b>{label}</b><i>›</i></button>)}</div>
            <button className="card-link" onClick={() => setNotice("Показываю все рекомендации дня")}>Показать все <span>›</span></button>
          </article>

          <article className="horoscope-card panel">
            <div className="card-title"><h2>Гороскоп на сегодня</h2><span>♌</span></div><p className="card-date">{today}</p>
            <div className="zodiac"><span>♌</span><div><strong>Лев</strong><small>23 июля — 22 августа</small></div></div>
            <p>Сегодня отличный день для общения и новых идей. Доверяйте своей интуиции — она подскажет верный путь. Возможны приятные новости и удачные встречи.</p>
            <div className="horoscope-rates"><span>Любовь <b>♥</b><small>★★★★☆</small></span><span>Работа <b>▣</b><small>★★★★☆</small></span><span>Финансы <b>●</b><small>★★★☆☆</small></span></div>
            <button className="card-link">Смотреть полный гороскоп <span>›</span></button>
          </article>

          <article className="changes-card panel">
            <div className="card-title"><h2>Что изменилось</h2><span>▥</span></div>
            <div className="change-list"><div><span className="violet">↗</span><p>Настроение стало стабильнее</p></div><div><span className="pink">↗</span><p>Стало меньше тревожности</p></div><div><span className="orange">↗</span><p>Улучшились отношения</p></div></div>
            <div className="mini-chart" aria-label="График положительной динамики"><div className="chart-bars"><i/><i/><i/><i/></div><svg viewBox="0 0 280 105" preserveAspectRatio="none"><polyline points="6,94 62,70 118,48 174,36 224,32 274,8"/></svg></div>
          </article>
        </section>

        <section className="lower-grid">
          <article className="insight-card panel"><div><h2>Инсайт дня <span>✦</span></h2><b>“</b><p>Иногда лучший ответ появляется тогда, когда перестаёшь его искать.</p></div><div className="lotus" aria-hidden="true"><span>✦</span></div></article>
          <article className="quick-card panel"><h2>Быстрые действия</h2><div className="quick-actions">{quickActions.map(([icon, label, color]) => <button key={label} onClick={() => openAction(label)}><span className={color}>{icon}</span><b>{label}</b></button>)}</div></article>
        </section>

        <section className="personal-grid">
          <article className="sleep-card panel" id="sleep-card">
            <div className="card-title"><div><span className="eyebrow">Восстановление</span><h2>Сон и подъём</h2></div><span>☾</span></div>
            <div className="sleep-fields"><label><span>Сколько спал</span><input max="24" min="0" step="0.5" type="number" value={sleepHours} onChange={(event) => setSleepHours(event.target.value)}/><small>часов</small></label><label><span>Время подъёма</span><input type="time" value={wakeTime} onChange={(event) => setWakeTime(event.target.value)}/></label></div>
            <button className="primary-button" onClick={saveSleep}>{saved === "sleep" ? "Сохранено ✓" : "Сохранить сон"}</button>
          </article>
          <article className="focus-card panel">
            <div className="card-title"><div><span className="eyebrow">Мой месяц</span><h2>Три главных фокуса</h2></div><span>✣</span></div>
            <div className="focus-list">{focuses.map((focus, index) => <label key={index}><b>0{index + 1}</b><input maxLength={64} value={focus} placeholder={["Для себя", "Для отношений", "Для развития"][index]} onChange={(event) => { const next = [...focuses]; next[index] = event.target.value; setFocuses(next); }}/><button onClick={() => saveFocus(index)}>{saved === `focus-${index}` ? "✓" : "Сохранить"}</button></label>)}</div>
          </article>
          <article className="diary-card panel">
            <div className="card-title"><div><span className="eyebrow">Мой дневник</span><h2>Что хочется сохранить?</h2></div><span>✎</span></div>
            <textarea maxLength={500} value={diary} placeholder="Мысль, событие или ощущение этого дня…" onChange={(event) => setDiary(event.target.value)}/>
            <div className="diary-footer"><span>{diary.length}/500</span><button className="primary-button" onClick={saveDiary}>{saved === "diary" ? "Сохранено ✓" : "Сохранить запись"}</button></div>
          </article>
        </section>

        <section className="install-card panel"><span>⌂</span><div><b>MilliOra всегда рядом</b><p>Добавить приложение на главный экран телефона</p></div><button onClick={() => setNotice("Откройте меню браузера и выберите «На экран Домой»")}>Как установить</button></section>
      </div>

      {notice && <div className="toast" role="status">{notice}</div>}
      <nav className="bottom-nav" aria-label="Основная навигация">{[["⌂", "Главная"], ["▦", "Разделы"], ["✣", "Милли"], ["♧", "Ора"], ["♙", "Профиль"]].map(([icon, label], index) => <button aria-current={index === 0 ? "page" : undefined} className={index === 0 ? "active" : ""} key={label} onClick={() => { if (label === "Ора") window.location.href = "/ora"; }}><span>{icon}</span><b>{label}</b></button>)}</nav>
    </main>
  );
}
