"use client";

import { useEffect, useMemo, useState } from "react";

type MetricKey = "mood" | "energy" | "wellbeing";
type SaveKey = MetricKey | "sleep" | "focus-0" | "focus-1" | "focus-2" | "diary";

const metricCards: Array<{
  key: MetricKey;
  title: string;
  hint: string;
  icon: string;
  accent: string;
}> = [
  { key: "mood", title: "Настроение", hint: "Как вы себя ощущаете?", icon: "◌", accent: "lilac" },
  { key: "energy", title: "Энергия", hint: "Сколько сил сегодня?", icon: "↟", accent: "mint" },
  { key: "wellbeing", title: "Самочувствие", hint: "Оцените состояние", icon: "♡", accent: "peach" },
];

const emptyMetrics: Record<MetricKey, string> = { mood: "", energy: "", wellbeing: "" };

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [metrics, setMetrics] = useState<Record<MetricKey, string>>(emptyMetrics);
  const [sleepHours, setSleepHours] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [focuses, setFocuses] = useState(["", "", ""]);
  const [diary, setDiary] = useState("");
  const [saved, setSaved] = useState<SaveKey | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMetrics(readStored("milliora.metrics", emptyMetrics));
      const sleep = readStored("milliora.sleep", { hours: "", wakeTime: "" });
      setSleepHours(sleep.hours);
      setWakeTime(sleep.wakeTime);
      setFocuses(readStored("milliora.focuses", ["", "", ""]));
      setDiary(readStored("milliora.diary", ""));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    [],
  );

  function showSaved(key: SaveKey) {
    setSaved(key);
    window.setTimeout(() => setSaved((current) => (current === key ? null : current)), 1600);
  }

  function saveMetric(key: MetricKey) {
    const value = Number(metrics[key]);
    if (!Number.isFinite(value) || value < 1 || value > 10) return;
    window.localStorage.setItem("milliora.metrics", JSON.stringify(metrics));
    showSaved(key);
  }

  function saveSleep() {
    if (!sleepHours || !wakeTime) return;
    window.localStorage.setItem("milliora.sleep", JSON.stringify({ hours: sleepHours, wakeTime }));
    showSaved("sleep");
  }

  function saveFocus(index: number) {
    if (!focuses[index].trim()) return;
    window.localStorage.setItem("milliora.focuses", JSON.stringify(focuses));
    showSaved(`focus-${index}` as SaveKey);
  }

  function saveDiary() {
    if (!diary.trim()) return;
    window.localStorage.setItem("milliora.diary", JSON.stringify(diary));
    showSaved("diary");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">MO</span><strong>MilliOra</strong></div>
        <button className="profile-button" aria-label="Открыть профиль">А</button>
      </header>

      <div className="page-content">
        <section className="hero-copy">
          <p className="date-line">{today}</p>
          <h1>Доброе утро, Андрей</h1>
          <p>Небольшая отметка сегодня поможет увидеть ваши изменения завтра.</p>
        </section>

        <section className="thought-card panel">
          <div className="orb">✦</div>
          <div><span className="kicker">Мысль дня</span><blockquote>«Большие перемены начинаются с честного внимания к себе.»</blockquote></div>
        </section>

        <section className="context-grid">
          <article className="context-card panel">
            <div><span className="kicker">Погода</span><h2>Ваш город</h2><p>Укажите город в профиле</p></div><span className="context-icon sun">☼</span>
          </article>
          <article className="context-card panel">
            <div><span className="kicker">Магнитные бури</span><h2>Данные дня</h2><p>Подключим после профиля</p></div><span className="context-icon wave">⌁</span>
          </article>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div><span className="kicker">Моё состояние</span><h2>Как проходит ваш день?</h2></div>
            <span className="scale-hint">оценка от 1 до 10</span>
          </div>

          <div className="metrics-grid">
            {metricCards.map((card) => (
              <article className={`metric-card panel ${card.accent}`} key={card.key}>
                <div className="metric-title"><span className="metric-icon">{card.icon}</span><div><h3>{card.title}</h3><p>{card.hint}</p></div></div>
                <label className="score-field"><span>Сегодня</span><input aria-label={`${card.title}, оценка от 1 до 10`} inputMode="numeric" max="10" min="1" onChange={(event) => setMetrics((current) => ({ ...current, [card.key]: event.target.value }))} placeholder="1–10" type="number" value={metrics[card.key]} /></label>
                <button className="save-button" onClick={() => saveMetric(card.key)}>{saved === card.key ? "Сохранено ✓" : "Сохранить"}</button>
              </article>
            ))}

            <article className="metric-card panel blue">
              <div className="metric-title"><span className="metric-icon">☾</span><div><h3>Сон</h3><p>Восстановление за ночь</p></div></div>
              <div className="sleep-fields">
                <label className="score-field"><span>Часов</span><input max="24" min="0" onChange={(event) => setSleepHours(event.target.value)} placeholder="8" step="0.5" type="number" value={sleepHours} /></label>
                <label className="score-field"><span>Подъём</span><input onChange={(event) => setWakeTime(event.target.value)} type="time" value={wakeTime} /></label>
              </div>
              <button className="save-button" onClick={saveSleep}>{saved === "sleep" ? "Сохранено ✓" : "Сохранить"}</button>
            </article>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="kicker">Мой месяц</span><h2>Три главных фокуса</h2></div></div>
          <div className="focus-grid">
            {focuses.map((focus, index) => (
              <article className="focus-card panel" key={index}>
                <span className="focus-number">0{index + 1}</span>
                <label><span>{["Для себя", "Для отношений", "Для развития"][index]}</span><input maxLength={64} onChange={(event) => { const next = [...focuses]; next[index] = event.target.value; setFocuses(next); }} placeholder="Напишите коротко" value={focus} /></label>
                <button className="text-button" onClick={() => saveFocus(index)}>{saved === `focus-${index}` ? "Сохранено ✓" : "Сохранить"}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="insight-grid">
          <article className="horoscope-card panel">
            <div className="card-topline"><span className="kicker">Гороскоп дня</span><span>{today}</span></div>
            <h2>Сегодня важно слышать себя</h2>
            <p>Не торопите решения. Сначала отметьте внутреннюю реакцию — в ней может быть самый точный ориентир дня.</p>
            <button className="text-button">Открыть личный гороскоп →</button>
          </article>
          <article className="diary-card panel">
            <span className="kicker">Мой дневник</span><h2>Что хочется сохранить?</h2>
            <textarea maxLength={500} onChange={(event) => setDiary(event.target.value)} placeholder="Мысль, событие или ощущение этого дня…" value={diary} />
            <div className="diary-footer"><span>{diary.length}/500</span><button className="save-button compact" onClick={saveDiary}>{saved === "diary" ? "Сохранено ✓" : "Сохранить"}</button></div>
          </article>
        </section>

        <section className="install-card panel">
          <div className="phone-symbol">⌂</div>
          <div><span className="kicker">Всегда рядом</span><h2>Добавить MilliOra на главный экран</h2><p>Приложение будет открываться как обычная программа на телефоне.</p></div>
          <button className="outline-button">Как установить</button>
        </section>
      </div>

      <nav className="bottom-nav" aria-label="Основная навигация">
        {[["⌂", "Главная", true], ["◇", "Разделы", false], ["M", "Милли", false], ["O", "Ора", false], ["○", "Профиль", false]].map(([icon, label, active]) => (
          <button className={active ? "active" : ""} key={String(label)}><span>{icon}</span>{label}</button>
        ))}
      </nav>
    </main>
  );
}
