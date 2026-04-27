"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { STRINGS, Lang } from "./strings";

// ── Quiz question definitions ──────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: 1, section: "Process Automation",   sectionPl: "Automatyzacja Procesów",   key: "q1",  options: [{ score: 0, key: "q.no" }, { score: 1, key: "q.partial" }, { score: 2, key: "q.yes" }] },
  { q: 2, section: "Data Organisation",    sectionPl: "Organizacja Danych",       key: "q2",  options: [{ score: 0, key: "q2.a" }, { score: 1, key: "q2.b" }, { score: 2, key: "q2.c" }] },
  { q: 3, section: "Workflow Automation",  sectionPl: "Automatyzacja Workflow",   key: "q3",  options: [{ score: 0, key: "q3.a" }, { score: 1, key: "q3.b" }, { score: 2, key: "q3.c" }] },
  { q: 4, section: "AI & Tool Literacy",   sectionPl: "Znajomość AI i Narzędzi",  key: "q4",  options: [{ score: 0, key: "q4.a" }, { score: 1, key: "q4.b" }, { score: 2, key: "q4.c" }] },
  { q: 5, section: "Communication Tools",  sectionPl: "Narzędzia Komunikacji",    key: "q5",  options: [{ score: 0, key: "q5.a" }, { score: 1, key: "q5.b" }, { score: 2, key: "q5.c" }] },
  { q: 6, section: "Customer Handling",    sectionPl: "Obsługa Klienta",          key: "q6",  options: [{ score: 0, key: "q6.a" }, { score: 1, key: "q6.b" }, { score: 2, key: "q6.c" }] },
  { q: 7, section: "Reporting",            sectionPl: "Raportowanie",             key: "q7",  options: [{ score: 0, key: "q7.a" }, { score: 1, key: "q7.b" }, { score: 2, key: "q7.c" }] },
  { q: 8, section: "Security & Governance",sectionPl: "Bezpieczeństwo",           key: "q8",  options: [{ score: 0, key: "q8.a" }, { score: 1, key: "q8.b" }, { score: 2, key: "q8.c" }] },
  { q: 9, section: "AI Strategy",          sectionPl: "Strategia AI",             key: "q9",  options: [{ score: 0, key: "q9.a" }, { score: 1, key: "q9.b" }, { score: 2, key: "q9.c" }] },
  { q: 10, section: "Budget Allocation",   sectionPl: "Budżet",                   key: "q10", options: [{ score: 0, key: "q10.a" }, { score: 1, key: "q10.b" }, { score: 2, key: "q10.c" }] },
  { q: 11, section: "Your Situation",      sectionPl: "Twoja Sytuacja",           key: "q11", options: [{ score: 0, key: "q11.a", qual: "starter" }, { score: 1, key: "q11.b", qual: "experimenting" }, { score: 2, key: "q11.c", qual: "adopting" }] },
  { q: 12, section: "Your Goal",           sectionPl: "Twój Cel",                 key: "q12", options: [{ score: 1, key: "q12.a" }, { score: 2, key: "q12.b" }, { score: 1, key: "q12.c" }, { score: 2, key: "q12.d" }] },
  { q: 13, section: "Your Obstacle",       sectionPl: "Twoja Przeszkoda",         key: "q13", options: [{ score: 0, key: "q13.a" }, { score: 1, key: "q13.b" }, { score: 1, key: "q13.c" }, { score: 2, key: "q13.d" }] },
  { q: 14, section: "Your Preference",     sectionPl: "Twoje Preferencje",        key: "q14", options: [{ score: 0, key: "q14.a", pref: "diy" }, { score: 1, key: "q14.b", pref: "guided" }, { score: 2, key: "q14.c", pref: "dfy" }] },
  { q: 15, section: "Anything Else",       sectionPl: "Coś Jeszcze",              key: "q15", options: [] },
];

const TOTAL_Q = 15;
const HERO_VARIANT_KEY = "hero_variant_idx";

function getHeroVariantIndex(total: number): number {
  if (typeof sessionStorage === "undefined") return 0;
  let idx = parseInt(sessionStorage.getItem(HERO_VARIANT_KEY) ?? "-1", 10);
  idx = (idx + 1) % total;
  sessionStorage.setItem(HERO_VARIANT_KEY, String(idx));
  return idx;
}

function getDeep(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

const VOICE_BAR_HEIGHTS = [5,10,16,8,20,6,14,20,10,18,5,12,20,8,16,6,18,10,20,7,14,20,9,16,5,12,20,8,18,6,14,20,10,16,7,12];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [heroVariantIdx, setHeroVariantIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Quiz state
  const [quizPhase, setQuizPhase] = useState<"gate" | "quiz" | "results">("gate");
  const [currentQ, setCurrentQ] = useState(1);
  const [scores, setScores] = useState<(number | null)[]>(Array(TOTAL_Q).fill(null));
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [q15Text, setQ15Text] = useState("");

  // Voice player
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceTime, setVoiceTime] = useState("00:00");

  // Results
  const [results, setResults] = useState<{ score: number; tier: string; tierColor: string; desc: string; insights: {icon:string;h:string;p:string}[]; ctaHTML: string } | null>(null);

  const S = STRINGS[lang] as Record<string, unknown>;

  const t = useCallback((key: string): string => {
    return getDeep(S, key) ?? key;
  }, [S]);

  // Init on mount
  useEffect(() => {
    // Lang: saved preference → browser language → fallback EN
    const savedLang = localStorage.getItem("mazo-lang") as Lang | null;
    const browserLang: Lang = navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    const initLang: Lang = savedLang ?? browserLang;

    // Theme: saved preference → system prefers-color-scheme → fallback dark
    const savedTheme = localStorage.getItem("mazo-theme") as "dark" | "light" | null;
    const systemTheme: "dark" | "light" = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initTheme: "dark" | "light" = savedTheme ?? systemTheme;

    setLang(initLang);
    setTheme(initTheme);
    document.documentElement.setAttribute("data-theme", initTheme);
    const variants = STRINGS[initLang].hero.h1variants;
    setHeroVariantIdx(getHeroVariantIndex(variants.length));
  }, []);

  // Sync theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const switchLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("mazo-lang", l);
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (audioRef.current) {
      audioRef.current.src = l === "pl" ? "/agent-voice-pl.mp3" : "/agent-voice.mp3";
      audioRef.current.load();
      setVoiceTime("00:00");
    }
  };

  const switchTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("mazo-theme", t);
  };

  // Voice player
  const toggleVoice = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const m = Math.floor(audio.currentTime / 60);
    const s = Math.floor(audio.currentTime % 60);
    setVoiceTime(`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setVoiceTime("00:00");
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  // Quiz
  const startQuiz = () => {
    const emailEl = document.getElementById("gate-email") as HTMLInputElement;
    if (!emailEl?.value?.includes("@")) {
      if (emailEl) emailEl.style.borderColor = "#d4443a";
      return;
    }
    setScores(Array(TOTAL_Q).fill(null));
    setCurrentQ(1);
    setSelectedOpt(null);
    setQuizPhase("quiz");
  };

  const handleOptClick = (qNum: number, score: number, optIdx: number) => {
    setSelectedOpt(optIdx);
    const newScores = [...scores];
    newScores[qNum - 1] = score;
    setScores(newScores);
    setTimeout(() => {
      if (qNum < TOTAL_Q) {
        setCurrentQ(qNum + 1);
        setSelectedOpt(null);
      }
    }, 280);
  };

  const submitScorecard = () => {
    let total = 0;
    for (let i = 0; i < 14; i++) total += (scores[i] || 0);
    const displayScore = Math.round((total / 28) * 20);
    const ispl = lang === "pl";

    let tier: string, tierColor: string, desc: string,
        insights: {icon:string;h:string;p:string}[],
        ctaHTML: string;

    if (displayScore <= 6) {
      tier = "📍 Stage 1: Manual AI";
      tierColor = "#d4443a";
      desc = ispl
        ? "Twój biznes jest na etapie Manualnego AI — narzędzia są rozproszone, procesy zależą od ludzi. Dobra wiadomość: Twoje Quick Wins są duże i dostępne natychmiast."
        : "Your business is at the Manual AI stage — tools are scattered, processes depend on humans. Good news: your Quick Wins are large and immediately accessible.";
      insights = [
        { icon: "🎯", h: ispl ? "Strategic Clarity: Znajdź jeden bottleneck" : "Strategic Clarity: Find your one bottleneck", p: ispl ? "Jest zawsze tylko jedna przeszkoda blokująca szybszy postęp. Nie automatyzuj wszystkiego — zapytaj: co kosztuje mnie najbardziej czasu/pieniędzy?" : "There is always only one constraint blocking faster progress. Don't automate everything — ask: what costs me the most time/money right now?" },
        { icon: "🏭", h: ispl ? "Process Efficiency: Zbuduj fundament" : "Process Efficiency: Build the foundation", p: ispl ? "Nie możesz zbudować fabryki na warsztacie. Dokumentuj 3 kluczowe procesy, scentralizuj dane w jednym miejscu." : "You can't build a factory on a workbench. Document 3 key processes, centralise data in one place. This is your SSOT." },
        { icon: "⚡", h: ispl ? "Lean Filter: Zacznij od Low-Complexity" : "Lean Filter: Start with Low-Complexity automation", p: ispl ? "Follow-upy, przypomnienia, raportowanie — wdrożone w 2-3 tygodnie, ROI widoczny w 4. tygodniu." : "Follow-ups, reminders, reporting — deploy in 2-3 weeks, ROI visible by week 4." },
      ];
      ctaHTML = `<h3>${ispl ? "Pobierz darmowy Plan Startowy" : "Get your free Starter Plan"}</h3><p>${ispl ? "Dla firm Stage 1 oferujemy bezpłatny 30-min Audyt Architektury." : "For Stage 1 businesses we offer a free 30-min Architecture Audit."}</p><button class="btn btn-primary btn-lg" onclick="alert('Booking — coming soon')">${ispl ? "Umów bezpłatny Audyt →" : "Book free Architecture Audit →"}</button>`;
    } else if (displayScore <= 13) {
      tier = "⚙️ Stage 2: Equipped AI";
      tierColor = "#c39a52";
      desc = ispl
        ? "Jesteś na etapie Equipped AI — masz narzędzia, część procesów jest zautomatyzowana, ale system nie jest zunifikowany. Jesteś blisko przełomu."
        : "You're at the Equipped AI stage — you have tools, some processes are automated, but the system isn't unified. You're close to the breakthrough.";
      insights = [
        { icon: "🏗️", h: ispl ? "Strategic Clarity: Zdefiniuj swój One Big Goal" : "Strategic Clarity: Define your One Big Goal", p: ispl ? "Twój AI OS musi być zbudowany wokół jednego strategicznego celu — nie zbioru narzędzi." : "Your AI OS must be built around one strategic goal — not a collection of tools." },
        { icon: "🔗", h: ispl ? "Process Efficiency: Zunifikuj dane (SSOT)" : "Process Efficiency: Unify data (SSOT)", p: ispl ? "Warstwa integracyjna zamienia Workshop w Factory. Jeden system, który zawsze zna aktualny stan." : "An integration layer turns your Workshop into a Factory. One system that always knows the current state." },
        { icon: "🤖", h: ispl ? "Lean Filter: Wdróż pierwszego Agenta" : "Lean Filter: Deploy your first Reasoned Agent", p: ispl ? "Jeden agent z dostępem do Twoich danych może zredukować 10+ godzin tygodniowo." : "One agent with access to your data can reduce 10+ hours per week." },
      ];
      ctaHTML = `<h3>${ispl ? "Umów sesję System Architect" : "Book a System Architect session"}</h3><p>${ispl ? "Jeden dobrze zaplanowany ruch może Cię wyciągnąć z J-Curve." : "One well-planned move can pull you out of the J-Curve."}</p><button class="btn btn-primary btn-lg" onclick="alert('Booking — coming soon')">${ispl ? "Umów sesję System Architect →" : "Book System Architect session →"}</button>`;
    } else {
      tier = "🚀 Stage 3: AI OS Ready";
      tierColor = "#3f9d5b";
      desc = ispl
        ? "Twój biznes jest gotowy na pełny AI OS. Masz procesy, dane i mindset. Teraz potrzebujesz Architekta który zaprojektuje Jarvis dla Twojego biznesu."
        : "Your business is ready for a full AI OS. You have the processes, the data, and the mindset. Now you need an Architect to design the Jarvis for your business.";
      insights = [
        { icon: "⚡", h: ispl ? "Strategic Clarity: Masz już warstwę strategiczną" : "Strategic Clarity: You already have the strategic layer", p: ispl ? "Twój AI OS potrzebuje Board of Directors — zestaw celów i zasad które kontrolują decyzje agentów." : "Your AI OS needs a Board of Directors — goals and rules that govern agent decisions." },
        { icon: "🏭", h: ispl ? "Process Efficiency: Jeden system, wszystkie procesy" : "Process Efficiency: One system. Every process.", p: ispl ? "Twój AI OS to nie narzędzie produktywności — to silnik przychodów który pracuje gdy Ty nie pracujesz." : "Your AI OS isn't a productivity tool — it's a revenue engine that works when you don't." },
        { icon: "🎯", h: ispl ? "Lean Filter: Wdróż pełny AI OS w 4 fazach" : "Lean Filter: Deploy full AI OS in 4 phases", p: ispl ? "Audyt → SSOT → 14 dni Kalibracji → Graduation. Pierwsze Quick Wins w 2-3 tygodnie." : "Audit → SSOT Build → 14-day Calibration → Graduation. First Quick Wins in 2-3 weeks." },
      ];
      ctaHTML = `<h3>${ispl ? "Umów rozmowę 1:1 — projektujemy Twój AI OS" : "Book 1:1 — we design your AI OS"}</h3><p>${ispl ? "Ta rozmowa to architektura, nie sprzedaż." : "This call is architecture, not sales. We leave with a plan."}</p><button class="btn btn-primary btn-lg" onclick="alert('Booking — coming soon')">${ispl ? "Umów rozmowę AI OS 1:1 →" : "Book AI OS 1:1 session →"}</button>`;
    }

    setResults({ score: displayScore, tier, tierColor, desc, insights, ctaHTML });
    setQuizPhase("results");
  };

  const heroVariant = heroVariantIdx !== null ? STRINGS[lang].hero.h1variants[heroVariantIdx % STRINGS[lang].hero.h1variants.length] : null;
  const currentSection = lang === "pl"
    ? QUIZ_QUESTIONS[currentQ - 1]?.sectionPl
    : QUIZ_QUESTIONS[currentQ - 1]?.section;

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-left">
            <a href="#" aria-label="MazoLogic home" style={{ textDecoration: "none" }}>
              <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
            </a>
            <div className="nav-links">
              <a className="nav-link" href="#method">{t("nav.method")}</a>
              <a className="nav-link" href="#process">{t("nav.process")}</a>
              <a className="nav-link" href="#infra">{t("nav.infra")}</a>
            </div>
          </div>
          <div className="nav-right">
            <div className="toggle-group lang" role="tablist" aria-label="Language">
              <button className={lang === "en" ? "active" : ""} onClick={() => switchLang("en")}>EN</button>
              <button className={lang === "pl" ? "active" : ""} onClick={() => switchLang("pl")}>PL</button>
            </div>
            <div className="toggle-group" role="tablist" aria-label="Theme">
              <button className={theme === "dark" ? "active" : ""} onClick={() => switchTheme("dark")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Dark
              </button>
              <button className={theme === "light" ? "active" : ""} onClick={() => switchTheme("light")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                Light
              </button>
            </div>
            <button className="btn btn-primary btn-sm nav-cta-desktop">{t("nav.cta")}</button>
            {/* Hamburger — mobile only */}
            <button
              className="hamburger"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className="mobile-menu">
            <a className="mobile-nav-link" href="#method" onClick={() => setMenuOpen(false)}>{t("nav.method")}</a>
            <a className="mobile-nav-link" href="#process" onClick={() => setMenuOpen(false)}>{t("nav.process")}</a>
            <a className="mobile-nav-link" href="#infra" onClick={() => setMenuOpen(false)}>{t("nav.infra")}</a>
            <div className="mobile-menu-footer">
              <div className="mobile-menu-toggles">
                <div className="toggle-group lang" role="tablist" aria-label="Language">
                  <button className={lang === "en" ? "active" : ""} onClick={() => switchLang("en")}>EN</button>
                  <button className={lang === "pl" ? "active" : ""} onClick={() => switchLang("pl")}>PL</button>
                </div>
                <div className="toggle-group" role="tablist" aria-label="Theme">
                  <button className={theme === "dark" ? "active" : ""} onClick={() => switchTheme("dark")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Dark
                  </button>
                  <button className={theme === "light" ? "active" : ""} onClick={() => switchTheme("light")}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                    Light
                  </button>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setMenuOpen(false)}>{t("nav.cta")}</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-grid"></div>
        <div className="container hero-inner">
          <span className="eyebrow-pill">
            <span className="pulse"></span>
            <span>{t("hero.eyebrow")}</span>
          </span>
          <h1>
            {heroVariant ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: heroVariant.h1a }} />
                <br />
                <span className="h1-light" dangerouslySetInnerHTML={{ __html: heroVariant.h1b }} />
              </>
            ) : (
              <>
                <span>{t("hero.h1a")}</span><br />
                <span className="h1-light">{t("hero.h1b")}</span>
              </>
            )}
          </h1>
          <p className="hero-sub">
            {heroVariant ? heroVariant.sub : t("hero.sub")}
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg hero-main-cta" onClick={() => document.getElementById("scorecard")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero.cta")}
            </button>
          </div>
          <div className="hero-chips">
            <span className="chip"><span className="chip-dot green"></span>{t("hero.chip1")}</span>
            <span className="chip">{t("hero.chip2")}</span>
            <span className="chip">{t("hero.chip3")}</span>
          </div>
          <div className="hero-value-props">
            <div className="vp-item"><span className="vp-dot">→</span><span>{t("hero.vp1")}</span></div>
            <div className="vp-item"><span className="vp-dot">→</span><span>{t("hero.vp2")}</span></div>
            <div className="vp-item"><span className="vp-dot">→</span><span>{t("hero.vp3")}</span></div>
          </div>
        </div>
      </section>

      {/* ── METHOD ── */}
      <section className="section" id="method">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("method.eyebrow")}</span>
            <h2><span>{t("method.h2a")}</span> <span className="light">{t("method.h2b")}</span></h2>
            <p className="section-lead">{t("method.lead")}</p>
          </div>
          <div className="bento">
            {[
              { h: "method.card1h", p: "method.card1p", tag: "method.card1tag", icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> },
              { h: "method.card2h", p: "method.card2p", tag: "method.card2tag", icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg> },
              { h: "method.card3h", p: "method.card3p", tag: "method.card3tag", icon: <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.44 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
            ].map((card, i) => (
              <div className="bento-card" key={i}>
                <div className="bento-visual">
                  <div className="mesh-bg"></div>
                  <div className="glyph circle">{card.icon}</div>
                </div>
                <h3>{t(card.h)}</h3>
                <p>{t(card.p)}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--fg-accent)", padding: "0 24px 4px", marginTop: "12px" }}>{t(card.tag)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("solution.eyebrow")}</span>
            <h2><span>{t("solution.h2a")}</span> <span className="light">{t("solution.h2b")}</span></h2>
          </div>
          <div className="solution-grid">
            {[
              { num: "01", h: "solution.card1h", p: "solution.card1p", tag: "solution.card1tag" },
              { num: "02", h: "solution.card2h", p: "solution.card2p", tag: "solution.card2tag" },
              { num: "03", h: "solution.card3h", p: "solution.card3p", tag: "solution.card3tag" },
            ].map((c, i) => (
              <div className="sol-card" key={i}>
                <div className="sol-num">{c.num}</div>
                <div><h4>{t(c.h)}</h4><p>{t(c.p)}</p></div>
                <div className="sol-tag">{t(c.tag)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ── */}
      <section className="section">
        <div className="container">
          <div className="diff-card">
            <div className="diff-header">
              <span className="diff-label">{t("diff.label")}</span>
              <span className="diff-sub">{t("diff.subLabel")}</span>
            </div>
            <h2 className="diff-h2">
              <span className="dim">{t("diff.h2a")}</span><span className="dim light">{t("diff.h2b")}</span><span className="dim">.</span><br />
              <span>{t("diff.h2c")}</span><span className="accent-text">{t("diff.h2d")}</span>.
            </h2>
            <p className="diff-lead">{t("diff.lead")}</p>
            <div className="comp-table">
              <div className="comp-head">
                <span></span>
                <span>{t("diff.colOld")}</span>
                <span className="accent-text">MazoLogic</span>
              </div>
              {STRINGS[lang].diff.rows.map((row, i) => (
                <div className="comp-row" key={i}>
                  <span className="comp-label">{row.label}</span>
                  <span className="comp-usual">{row.old}</span>
                  <span className="comp-us">{row.new}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY ── */}
      <section className="section section-alt" id="cases">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("caseStudy.eyebrow")}</span>
            <h2><span>{t("caseStudy.h2a")}</span> <span className="light">{t("caseStudy.h2b")}</span></h2>
          </div>
          <div className="case-card">
            <div className="case-light">
              <div>
                <div className="case-chips" style={{ marginBottom: "20px" }}>
                  <span className="case-chip" style={{ background: "rgba(63,157,91,0.12)", color: "#3f9d5b", borderColor: "rgba(63,157,91,0.3)" }}>● live</span>
                  <span className="case-chip">CRM + Email + SMS</span>
                  <span className="case-chip" style={{ background: "transparent", color: "var(--fg-3)", borderColor: "var(--border-soft)" }}>Telegram interface</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--fg-1)", margin: "0 0 16px" }}>
                  <span style={{ color: "var(--fg-3)" }}>{t("caseStudy.h3a")}</span><br />
                  <span>{t("caseStudy.h3b")}</span>
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.55, color: "var(--fg-2)", maxWidth: "380px" }}>{t("caseStudy.p")}</p>
                <div className="case-chips" style={{ marginTop: "20px" }}>
                  <span className="case-chip">Telegram → AI Agent</span>
                  <span className="case-chip">Airtable CRM</span>
                  <span className="case-chip">Email SMTP</span>
                  <span className="case-chip">Voice Messages</span>
                  <span className="case-chip">Web Scraping</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)", fontSize: "13px", color: "var(--fg-3)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent)" }}>19</span>
                <span>{t("caseStudy.stat1label")}</span>
                <span style={{ color: "var(--border-strong)" }}>·</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent)" }}>0</span>
                <span>{t("caseStudy.statSwitch")}</span>
              </div>
            </div>
            <div className="case-dark">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3E6E99", marginBottom: "16px" }}>{t("caseStudy.demoLabel")}</div>
              <div style={{ marginBottom: "20px" }}>
                <div className="tg-bubble right">{t("caseStudy.ownerMsg")}</div>
              </div>
              <div className="agent-steps">
                {["step1","step2","step3","step4"].map((s, i) => (
                  <div className="agent-step" key={i}>
                    <span className="agent-step-num">{String(i+1).padStart(2,"0")}</span>
                    <span className="agent-step-text">→ <strong>{t(`caseStudy.${s}`)}</strong></span>
                  </div>
                ))}
              </div>
              {/* Voice player */}
              <div className="voice-bubble" style={{ marginTop: "16px" }}>
                <audio
                  ref={audioRef}
                  src={lang === "pl" ? "/agent-voice-pl.mp3" : "/agent-voice.mp3"}
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleAudioEnded}
                />
                <button className="voice-play" onClick={toggleVoice} aria-label="Play voice message">
                  {isPlaying ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#e8f0f7"><rect x="0" y="0" width="3.5" height="10" rx="1"/><rect x="6.5" y="0" width="3.5" height="10" rx="1"/></svg>
                  ) : (
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="#e8f0f7"><path d="M0 0l10 6-10 6z"/></svg>
                  )}
                </button>
                <div className="voice-bars">
                  {VOICE_BAR_HEIGHTS.map((h, i) => (
                    <div key={i} className={`voice-bar${isPlaying ? " playing" : ""}`} style={{ height: `${h}px` }} />
                  ))}
                </div>
                <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                  <span className="voice-label">{t("caseStudy.voiceLabel")}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#52525b" }}>{voiceTime}</span>
                </div>
              </div>
              <div className="case-result" style={{ marginTop: "16px" }}>
                <div className="case-result-label">{t("caseStudy.resultLabel")}</div>
                <div className="case-result-text">{t("caseStudy.resultText")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT ── */}
      <div className="spotlight-block">
        <div className="grid-bg"></div>
        <div className="warm-glow"></div>
        <div className="container inner" style={{ flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fafafa", lineHeight: 1.1, maxWidth: "700px" }}>
            <span>{t("spotlight.left")}</span> <span style={{ color: "#6fa8d4" }}>{t("spotlight.right")}</span>
          </p>
          <button className="btn btn-primary btn-lg" style={{ width: "auto" }}>{t("nav.cta")}</button>
        </div>
      </div>

      {/* ── MATRIX ── */}
      <section className="section section-alt" id="matrix">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("matrix.eyebrow")}</span>
            <h2><span>{t("matrix.h2a")}</span> <span className="light">{t("matrix.h2b")}</span></h2>
            <p className="section-lead">{t("matrix.lead")}</p>
          </div>
          <div className="matrix-wrap">
            <div className="matrix">
              <div className="matrix-axis-y">{t("matrix.axisHigh")}</div>
              <div className="matrix-quadrant q-quickwin">
                <div className="matrix-labels">
                  <span className="matrix-label">{t("matrix.q1tag")}</span>
                  <h4 className="matrix-title">{t("matrix.q1title")}</h4>
                  <p className="matrix-desc">{t("matrix.q1desc")}</p>
                </div>
                <span className="matrix-foot">{t("matrix.q1foot")}</span>
                <div className="matrix-verdict">
                  <div className="matrix-verdict-icon">↗</div>
                  <div className="matrix-verdict-title">{t("matrix.q1title")}</div>
                  <div className="matrix-verdict-sub">{t("matrix.q1desc")}</div>
                </div>
              </div>
              <div className="matrix-quadrant q-strategic">
                <div className="matrix-labels">
                  <span className="matrix-label">{t("matrix.q2tag")}</span>
                  <h4 className="matrix-title">{t("matrix.q2title")}</h4>
                  <p className="matrix-desc">{t("matrix.q2desc")}</p>
                </div>
                <span className="matrix-foot">{t("matrix.q2foot")}</span>
                <div className="matrix-verdict">
                  <div className="matrix-verdict-icon">◎</div>
                  <div className="matrix-verdict-title">{t("matrix.q2title")}</div>
                  <div className="matrix-verdict-sub">{t("matrix.q2desc")}</div>
                </div>
              </div>
              <div className="matrix-axis-y">{t("matrix.axisLow")}</div>
              <div className="matrix-quadrant q-fill">
                <div className="matrix-labels">
                  <span className="matrix-label">{t("matrix.q3tag")}</span>
                  <h4 className="matrix-title">{t("matrix.q3title")}</h4>
                  <p className="matrix-desc">{t("matrix.q3desc")}</p>
                </div>
                <div className="matrix-verdict">
                  <div className="matrix-verdict-icon">→</div>
                  <div className="matrix-verdict-title">{t("matrix.q3title")}</div>
                  <div className="matrix-verdict-sub">{t("matrix.q3desc")}</div>
                </div>
              </div>
              <div className="matrix-quadrant q-avoid">
                <div className="matrix-labels">
                  <span className="matrix-label">{t("matrix.q4tag")}</span>
                  <h4 className="matrix-title">{t("matrix.q4title")}</h4>
                  <p className="matrix-desc">{t("matrix.q4desc")}</p>
                </div>
                <div className="matrix-verdict">
                  <div className="matrix-verdict-icon">✗</div>
                  <div className="matrix-verdict-title">{t("matrix.q4title")}</div>
                  <div className="matrix-verdict-sub">{t("matrix.q4desc")}</div>
                </div>
              </div>
              <div></div>
              <div className="matrix-axis-x">{t("matrix.axisEffortLow")}</div>
              <div className="matrix-axis-x">{t("matrix.axisEffortHigh")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="section section-dark" id="process">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("process.eyebrow")}</span>
            <h2><span>{t("process.h2a")}</span> <span className="light">{t("process.h2b")}</span></h2>
          </div>
          <div className="steps">
            {STRINGS[lang].process.phases.map((phase, i) => (
              <div className="step" key={i}>
                <div className="step-num">{phase.num}</div>
                <h4>{phase.h}</h4>
                <p>{phase.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFRA ── */}
      <section className="section" id="infra">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("infra.eyebrow")}</span>
            <h2><span>{t("infra.h2a")}</span> <span className="light">{t("infra.h2b")}</span></h2>
            <p className="section-lead">{t("infra.lead")}</p>
          </div>
          <div className="infra-strip">
            <span className="infra-chip"><img className="infra-logo" src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" alt="Salesforce" />Salesforce</span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/hubspot/a1a1aa" alt="HubSpot" />HubSpot</span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/notion/a1a1aa" alt="Notion" />Notion</span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/airtable/a1a1aa" alt="Airtable" />Airtable</span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/postgresql/a1a1aa" alt="PostgreSQL" />PostgreSQL</span>
            <span className="infra-chip">
              <svg className="infra-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>
              Slack
            </span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/gmail/a1a1aa" alt="Gmail" />Gmail</span>
            <span className="infra-chip"><img className="infra-logo" src="https://cdn.simpleicons.org/googlesheets/a1a1aa" alt="Google Sheets" />Google Sheets</span>
            <span className="infra-chip">
              <svg className="infra-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Custom API
            </span>
            <span className="infra-chip">
              <svg className="infra-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              Your CRM
            </span>
          </div>
        </div>
      </section>

      {/* ── SCORECARD ── */}
      <section className="section section-dark" id="scorecard">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{t("scorecard.eyebrow")}</span>
            <h2><span>{t("scorecard.h2a")}</span> <span className="light">{t("scorecard.h2b")}</span></h2>
            <p className="section-lead">{t("scorecard.lead")}</p>
          </div>

          <div className="quiz-shell">
            {/* GATE */}
            {quizPhase === "gate" && (
              <div className="quiz-gate">
                <h3 className="gate-title">{t("gate.title")}</h3>
                <p className="gate-sub">{t("gate.sub")}</p>
                <input className="gate-input" type="text" id="gate-name" placeholder={t("gate.name")} />
                <input className="gate-input" type="email" id="gate-email" placeholder={t("gate.email")} />
                <button className="btn btn-primary btn-lg" onClick={startQuiz}>{t("gate.cta")}</button>
                <p className="gate-privacy">{t("gate.privacy")}</p>
              </div>
            )}

            {/* QUIZ */}
            {quizPhase === "quiz" && (
              <>
                <div className="quiz-progress-wrap">
                  <div className="quiz-progress-bar" style={{ width: `${((currentQ - 1) / TOTAL_Q) * 100}%` }}></div>
                </div>
                <div className="quiz-meta">
                  <span className="quiz-counter">Question {currentQ} of {TOTAL_Q}</span>
                  <span className="quiz-section-label">{currentSection}</span>
                </div>
                {QUIZ_QUESTIONS.map((qDef) => (
                  <div key={qDef.q} className={`quiz-q${currentQ === qDef.q ? " active" : ""}`}>
                    <h3 className="quiz-question">{t(`${qDef.key}.q`)}</h3>
                    {qDef.q < 15 ? (
                      <div className="quiz-options">
                        {qDef.options.map((opt, idx) => (
                          <button
                            key={idx}
                            className={`quiz-opt${selectedOpt === idx && currentQ === qDef.q ? " selected" : ""}`}
                            onClick={() => handleOptClick(qDef.q, opt.score, idx)}
                          >
                            {t(opt.key)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <textarea className="quiz-textarea" value={q15Text} onChange={e => setQ15Text(e.target.value)} placeholder="E.g. industry, team size, urgent deadline, specific process you want to fix..." />
                        <button className="btn btn-primary btn-lg" onClick={submitScorecard}>{t("q15.cta")}</button>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      {quizPhase === "results" && results && (
        <section className="section" id="results-section">
          <div className="container">
            <div className="results-wrap">
              <div className="score-display">
                <div className="score-ring-wrap">
                  <svg className="score-ring" viewBox="0 0 120 120" width="180" height="180">
                    <circle className="ring-bg" cx="60" cy="60" r="50" fill="none" strokeWidth="8" />
                    <circle className="ring-fill" cx="60" cy="60" r="50" fill="none" strokeWidth="8"
                      stroke={results.tierColor}
                      strokeDasharray="314"
                      strokeDashoffset={314 - (314 * results.score / 20)}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                  </svg>
                  <div className="score-center">
                    <span className="score-num">{results.score}</span>
                    <span className="score-label">/ 20</span>
                  </div>
                </div>
                <div className="score-tier" style={{ color: results.tierColor }}>{results.tier}</div>
                <p className="score-desc">{results.desc}</p>
              </div>
              <div className="insights-wrap">
                <h3 className="insights-title">{t("results.insightsTitle")}</h3>
                <div className="insights-grid">
                  {results.insights.map((ins, i) => (
                    <div className="insight-item" key={i}>
                      <div className="insight-icon">{ins.icon}</div>
                      <div className="insight-text">
                        <h4>{ins.h}</h4>
                        <p>{ins.p}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result-cta-wrap" dangerouslySetInnerHTML={{ __html: results.ctaHTML }} />
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
          <div className="footer-links">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
            <a href="#">{t("footer.contact")}</a>
          </div>
          <span className="footer-copy">© 2026 MazoLogic</span>
        </div>
      </footer>
    </>
  );
}
