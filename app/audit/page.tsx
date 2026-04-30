"use client";

import { useEffect, useState, useCallback } from "react";
import { STRINGS, Lang } from "../strings";
import { LightRays } from "../LightRays";

// ── Quiz question definitions ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: 1,  section: "Process Automation",    sectionPl: "Automatyzacja Procesów",   key: "q1",  options: [{ score: 0, key: "q.no" }, { score: 1, key: "q.partial" }, { score: 2, key: "q.yes" }] },
  { q: 2,  section: "Data Organisation",     sectionPl: "Organizacja Danych",       key: "q2",  options: [{ score: 0, key: "q2.a" }, { score: 1, key: "q2.b" }, { score: 2, key: "q2.c" }] },
  { q: 3,  section: "Workflow Automation",   sectionPl: "Automatyzacja Workflow",   key: "q3",  options: [{ score: 0, key: "q3.a" }, { score: 1, key: "q3.b" }, { score: 2, key: "q3.c" }] },
  { q: 4,  section: "AI & Tool Literacy",    sectionPl: "Znajomość AI i Narzędzi",  key: "q4",  options: [{ score: 0, key: "q4.a" }, { score: 1, key: "q4.b" }, { score: 2, key: "q4.c" }] },
  { q: 5,  section: "Communication Tools",   sectionPl: "Narzędzia Komunikacji",    key: "q5",  options: [{ score: 0, key: "q5.a" }, { score: 1, key: "q5.b" }, { score: 2, key: "q5.c" }] },
  { q: 6,  section: "Customer Handling",     sectionPl: "Obsługa Klienta",          key: "q6",  options: [{ score: 0, key: "q6.a" }, { score: 1, key: "q6.b" }, { score: 2, key: "q6.c" }] },
  { q: 7,  section: "Reporting",             sectionPl: "Raportowanie",             key: "q7",  options: [{ score: 0, key: "q7.a" }, { score: 1, key: "q7.b" }, { score: 2, key: "q7.c" }] },
  { q: 8,  section: "Security & Governance", sectionPl: "Bezpieczeństwo",           key: "q8",  options: [{ score: 0, key: "q8.a" }, { score: 1, key: "q8.b" }, { score: 2, key: "q8.c" }] },
  { q: 9,  section: "AI Strategy",           sectionPl: "Strategia AI",             key: "q9",  options: [{ score: 0, key: "q9.a" }, { score: 1, key: "q9.b" }, { score: 2, key: "q9.c" }] },
  { q: 10, section: "Budget Allocation",     sectionPl: "Budżet",                   key: "q10", options: [{ score: 0, key: "q10.a" }, { score: 1, key: "q10.b" }, { score: 2, key: "q10.c" }] },
  { q: 11, section: "Your Situation",        sectionPl: "Twoja Sytuacja",           key: "q11", options: [{ score: 0, key: "q11.a" }, { score: 1, key: "q11.b" }, { score: 2, key: "q11.c" }] },
  { q: 12, section: "Your Goal",             sectionPl: "Twój Cel",                 key: "q12", options: [{ score: 1, key: "q12.a" }, { score: 2, key: "q12.b" }, { score: 1, key: "q12.c" }, { score: 2, key: "q12.d" }] },
  { q: 13, section: "Your Obstacle",         sectionPl: "Twoja Przeszkoda",         key: "q13", options: [{ score: 0, key: "q13.a" }, { score: 1, key: "q13.b" }, { score: 1, key: "q13.c" }, { score: 2, key: "q13.d" }] },
  { q: 14, section: "Your Preference",       sectionPl: "Twoje Preferencje",        key: "q14", options: [{ score: 0, key: "q14.a" }, { score: 1, key: "q14.b" }, { score: 2, key: "q14.c" }] },
  { q: 15, section: "Anything Else",         sectionPl: "Coś Jeszcze",              key: "q15", options: [] },
];

const TOTAL_Q = 15;

function getDeep(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

type ResultData = {
  score: number;
  tier: string;
  tierColor: string;
  desc: string;
  insights: { icon: string; h: string; p: string }[];
  ctaLabel: string;
  ctaSub: string;
};

export default function AuditPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [phase, setPhase] = useState<"gate" | "quiz" | "results">("gate");
  const [currentQ, setCurrentQ] = useState(1);
  const [scores, setScores] = useState<(number | null)[]>(Array(TOTAL_Q).fill(null));
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [q15Text, setQ15Text] = useState("");
  const [results, setResults] = useState<ResultData | null>(null);
  const [animating, setAnimating] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateName, setGateName] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const S = STRINGS[lang] as Record<string, unknown>;
  const t = useCallback((key: string): string => getDeep(S, key) ?? key, [S]);

  useEffect(() => {
    const savedLang = localStorage.getItem("mazo-lang") as Lang | null;
    const browserLang: Lang = navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    const initLang: Lang = savedLang ?? browserLang;
    const savedTheme = localStorage.getItem("mazo-theme") as "dark" | "light" | null;
    const systemTheme: "dark" | "light" = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initTheme = savedTheme ?? systemTheme;
    setLang(initLang);
    setTheme(initTheme);
    document.documentElement.setAttribute("data-theme", initTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const switchLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("mazo-lang", l);
  };

  const switchTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("mazo-theme", t);
  };

  const startQuiz = () => {
    if (!gateEmail.includes("@")) {
      const emailEl = document.getElementById("gate-email") as HTMLInputElement;
      if (emailEl) emailEl.style.borderColor = "#d4443a";
      return;
    }
    setScores(Array(TOTAL_Q).fill(null));
    setCurrentQ(1);
    setSelectedOpt(null);
    setPhase("quiz");
  };

  const sendResultsEmail = async (data: ResultData) => {
    setEmailSending(true);
    try {
      await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: gateEmail,
          name: gateName,
          lang,
          ...data,
        }),
      });
      setEmailSent(true);
    } catch {
      // silent fail — results still shown
    } finally {
      setEmailSending(false);
    }
  };

  const handleOptClick = (qNum: number, score: number, optIdx: number) => {
    if (animating) return;
    setSelectedOpt(optIdx);
    const newScores = [...scores];
    newScores[qNum - 1] = score;
    setScores(newScores);
    if (qNum < TOTAL_Q) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentQ(qNum + 1);
        setSelectedOpt(null);
        setAnimating(false);
      }, 320);
    }
  };

  const submitScorecard = () => {
    let total = 0;
    for (let i = 0; i < 14; i++) total += (scores[i] || 0);
    const displayScore = Math.round((total / 28) * 20);
    const ispl = lang === "pl";

    let tier: string, tierColor: string, desc: string,
        insights: { icon: string; h: string; p: string }[],
        ctaLabel: string, ctaSub: string;

    if (displayScore <= 6) {
      tier      = ispl ? "📍 Etap 1: Manual AI" : "📍 Stage 1: Manual AI";
      tierColor = "#d4443a";
      desc      = ispl
        ? "Twój biznes jest na etapie Manualnego AI — narzędzia są rozproszone, procesy zależą od ludzi. Dobra wiadomość: Twoje Quick Wins są duże i dostępne natychmiast."
        : "Your business is at the Manual AI stage — tools are scattered, processes depend on humans. Good news: your Quick Wins are large and immediately accessible.";
      insights  = [
        { icon: "🎯", h: ispl ? "Znajdź jeden bottleneck"          : "Find your one bottleneck",           p: ispl ? "Jest zawsze tylko jedna przeszkoda blokująca szybszy postęp. Zapytaj: co kosztuje mnie najbardziej czasu lub pieniędzy?" : "There is always only one constraint blocking faster progress. Ask: what costs me the most time or money right now?" },
        { icon: "🏭", h: ispl ? "Zbuduj fundament danych"          : "Build your data foundation",         p: ispl ? "Dokumentuj 3 kluczowe procesy i scentralizuj dane w jednym miejscu — bez tego automatyzacja nie ma na czym stać." : "Document 3 key processes and centralise data in one place. You can't build a factory on a workbench." },
        { icon: "⚡", h: ispl ? "Zacznij od Low-Complexity"        : "Start with Low-Complexity wins",     p: ispl ? "Follow-upy, przypomnienia, raportowanie — wdrożone w 2–3 tygodnie, ROI widoczny w 4. tygodniu." : "Follow-ups, reminders, reporting — deploy in 2–3 weeks, ROI visible by week 4." },
      ];
      ctaLabel  = ispl ? "Umów bezpłatny Audyt Architektury" : "Book free Architecture Audit";
      ctaSub    = ispl ? "Dla firm na Etapie 1 oferujemy bezpłatną 30-minutową sesję audytu." : "For Stage 1 businesses we offer a free 30-min Architecture Audit.";
    } else if (displayScore <= 13) {
      tier      = ispl ? "⚙️ Etap 2: Equipped AI" : "⚙️ Stage 2: Equipped AI";
      tierColor = "#c39a52";
      desc      = ispl
        ? "Jesteś na etapie Equipped AI — masz narzędzia, część procesów jest zautomatyzowana, ale system nie jest zunifikowany. Jesteś blisko przełomu."
        : "You're at the Equipped AI stage — you have tools, some processes are automated, but the system is not unified. You're close to the breakthrough.";
      insights  = [
        { icon: "🏗️", h: ispl ? "Zdefiniuj swój One Big Goal"      : "Define your One Big Goal",           p: ispl ? "Twój AI OS musi być zbudowany wokół jednego strategicznego celu — nie zbioru narzędzi." : "Your AI OS must be built around one strategic goal — not a collection of tools." },
        { icon: "🔗", h: ispl ? "Zunifikuj dane (SSOT)"             : "Unify your data (SSOT)",             p: ispl ? "Warstwa integracyjna zamienia warsztat w fabrykę. Jeden system który zawsze zna aktualny stan." : "An integration layer turns your Workshop into a Factory. One system that always knows the current state." },
        { icon: "🤖", h: ispl ? "Wdróż pierwszego Agenta"           : "Deploy your first Reasoned Agent",   p: ispl ? "Jeden agent z dostępem do Twoich danych może zredukować 10+ godzin tygodniowo." : "One agent with access to your data can reduce 10+ hours per week." },
      ];
      ctaLabel  = ispl ? "Umów sesję System Architect" : "Book a System Architect session";
      ctaSub    = ispl ? "Jeden dobrze zaplanowany ruch może Cię wyciągnąć z J-Curve." : "One well-planned move can pull you out of the J-Curve.";
    } else {
      tier      = ispl ? "🚀 Etap 3: AI OS Ready" : "🚀 Stage 3: AI OS Ready";
      tierColor = "#3f9d5b";
      desc      = ispl
        ? "Twój biznes jest gotowy na pełny AI OS. Masz procesy, dane i mindset. Teraz potrzebujesz Architekta który zaprojektuje Jarvisa dla Twojego biznesu."
        : "Your business is ready for a full AI OS. You have the processes, the data, and the mindset. Now you need an Architect to design the Jarvis for your business.";
      insights  = [
        { icon: "⚡", h: ispl ? "Masz już warstwę strategiczną"     : "You already have the strategic layer", p: ispl ? "Twój AI OS potrzebuje Board of Directors — zestaw celów i zasad które kontrolują decyzje agentów." : "Your AI OS needs a Board of Directors — goals and rules that govern agent decisions." },
        { icon: "🏭", h: ispl ? "Jeden system, wszystkie procesy"   : "One system. Every process.",          p: ispl ? "Twój AI OS to nie narzędzie produktywności — to silnik przychodów który pracuje gdy Ty nie pracujesz." : "Your AI OS is not a productivity tool — it is a revenue engine that works when you don't." },
        { icon: "🎯", h: ispl ? "Wdróż pełny AI OS w 4 fazach"     : "Deploy full AI OS in 4 phases",      p: ispl ? "Audyt → SSOT → 14 dni Kalibracji → Graduation. Pierwsze Quick Wins w 2–3 tygodnie." : "Audit → SSOT Build → 14-day Calibration → Graduation. First Quick Wins in 2–3 weeks." },
      ];
      ctaLabel  = ispl ? "Umów rozmowę AI OS 1:1" : "Book your AI OS 1:1";
      ctaSub    = ispl ? "Ta rozmowa to architektura, nie sprzedaż. Wychodzimy z planem." : "This call is architecture, not sales. We leave with a plan.";
    }

    const resultData = { score: displayScore, tier, tierColor, desc, insights, ctaLabel, ctaSub };
    setResults(resultData);
    setPhase("results");
    sendResultsEmail(resultData);
  };

  const progress = Math.round(((currentQ - 1) / TOTAL_Q) * 100);
  const qDef = QUIZ_QUESTIONS[currentQ - 1];
  const currentSection = lang === "pl" ? qDef?.sectionPl : qDef?.section;

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-left">
            <a href="/" aria-label="MazoLogic home" style={{ textDecoration: "none" }}>
              <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
            </a>
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
          </div>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ minHeight: "100vh", background: "var(--bg-canvas)", paddingBottom: "80px" }}>
        <LightRays count={7} color="rgba(107,168,212,0.16)" blur={50} speed={15} length="60vh" />

        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px" }}>

          {/* ── GATE ── */}
          {phase === "gate" && (
            <div style={{ animation: "fadeUp 0.4s var(--ease-out) both" }}>
              <span className="section-eyebrow" style={{ display: "block", marginBottom: "16px" }}>
                {t("scorecard.eyebrow")}
              </span>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px,5vw,52px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--fg-1)",
                marginBottom: "12px",
              }}>
                {t("scorecard.h2a")}<br />
                <span style={{ color: "var(--fg-3)", fontWeight: 300 }}>{t("scorecard.h2b")}</span>
              </h1>
              <p style={{ fontSize: "16px", color: "var(--fg-2)", lineHeight: 1.6, marginBottom: "40px", maxWidth: "520px" }}>
                {t("scorecard.lead")}
              </p>

              <div style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-xl)",
                padding: "36px",
                boxShadow: "var(--shadow-md)",
              }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--fg-1)", marginBottom: "8px" }}>
                  {t("gate.title")}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--fg-3)", marginBottom: "24px" }}>{t("gate.sub")}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder={t("gate.name")}
                    value={gateName}
                    onChange={e => setGateName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    id="gate-email"
                    type="email"
                    placeholder={t("gate.email")}
                    value={gateEmail}
                    onChange={e => setGateEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border-soft)")}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={startQuiz}
                >
                  {lang === "pl" ? "Rozpocznij Diagnostykę →" : "Start Diagnostic →"}
                </button>

                <p style={{ fontSize: "12px", color: "var(--fg-4)", marginTop: "14px", textAlign: "center" }}>
                  {t("gate.privacy")}
                </p>
              </div>

              {/* What to expect */}
              <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
                {[
                  { icon: "⏱", label: lang === "pl" ? "5 minut" : "5 minutes" },
                  { icon: "📊", label: lang === "pl" ? "15 pytań" : "15 questions" },
                  { icon: "🎯", label: lang === "pl" ? "Spersonalizowany wynik" : "Personalised result" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--r-lg)",
                    padding: "16px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--fg-2)" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && qDef && (
            <div key={currentQ} style={{ animation: "fadeUp 0.3s var(--ease-out) both" }}>
              {/* Progress */}
              <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-accent)" }}>
                    {currentSection}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-4)" }}>
                    {currentQ} / {TOTAL_Q}
                  </span>
                </div>
                <div style={{ height: "3px", background: "var(--border-subtle)", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--accent)",
                    borderRadius: "99px",
                    transition: "width 0.4s var(--ease-out)",
                  }} />
                </div>
              </div>

              {/* Question */}
              <div style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-xl)",
                padding: "36px",
                boxShadow: "var(--shadow-md)",
                marginBottom: "16px",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-4)", marginBottom: "16px" }}>
                  {lang === "pl" ? "Pytanie" : "Question"} {String(currentQ).padStart(2, "0")}
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(18px,2.5vw,24px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                  color: "var(--fg-1)",
                  marginBottom: "28px",
                }}>
                  {t(`${qDef.key}.q`)}
                </h2>

                {/* Q15 — open text */}
                {currentQ === 15 ? (
                  <div>
                    <textarea
                      value={q15Text}
                      onChange={e => setQ15Text(e.target.value)}
                      placeholder={lang === "pl" ? "Opcjonalnie — możesz pominąć" : "Optional — you can skip this"}
                      rows={4}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: "100px",
                        fontFamily: "var(--font-body)",
                        marginBottom: "20px",
                      }}
                    />
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={submitScorecard}
                    >
                      {lang === "pl" ? "Zobacz moje wyniki →" : "See my results →"}
                    </button>
                  </div>
                ) : (
                  /* Options */
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {qDef.options.map((opt, idx) => {
                      const isSelected = selectedOpt === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptClick(currentQ, opt.score, idx)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "16px 20px",
                            background: isSelected ? "var(--accent-soft)" : "var(--bg-surface)",
                            border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border-soft)"}`,
                            borderRadius: "var(--r-lg)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all var(--dur-base) var(--ease-out)",
                            color: isSelected ? "var(--fg-accent)" : "var(--fg-2)",
                            fontFamily: "var(--font-body)",
                            fontSize: "15px",
                            lineHeight: 1.4,
                            fontWeight: isSelected ? 500 : 400,
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-overlay)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-soft)";
                              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface)";
                            }
                          }}
                        >
                          <span style={{
                            flexShrink: 0,
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: `1.5px solid ${isSelected ? "var(--accent)" : "var(--border-strong)"}`,
                            background: isSelected ? "var(--accent)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all var(--dur-base) var(--ease-out)",
                          }}>
                            {isSelected && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          {t(opt.key)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Back button */}
              {currentQ > 1 && (
                <button
                  onClick={() => { setCurrentQ(q => q - 1); setSelectedOpt(null); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--fg-4)",
                    fontSize: "13px",
                    cursor: "pointer",
                    padding: "8px 0",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  ← {lang === "pl" ? "Poprzednie pytanie" : "Previous question"}
                </button>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === "results" && results && (
            <div style={{ animation: "fadeUp 0.4s var(--ease-out) both" }}>
              {/* Score header */}
              <div style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-xl)",
                padding: "36px",
                boxShadow: "var(--shadow-md)",
                marginBottom: "20px",
                textAlign: "center",
              }}>
                {/* Score ring */}
                <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 24px" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-subtle)" strokeWidth="8"/>
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke={results.tierColor} strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - results.score / 20)}`}
                      style={{ transition: "stroke-dashoffset 1s var(--ease-out)" }}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 800, color: results.tierColor, lineHeight: 1 }}>
                      {results.score}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--fg-4)", letterSpacing: "0.05em" }}>/20</span>
                  </div>
                </div>

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "var(--bg-surface)", border: "1px solid var(--border-soft)",
                  borderRadius: "var(--r-pill)", padding: "6px 14px",
                  fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.06em",
                  color: results.tierColor, fontWeight: 600, marginBottom: "16px",
                }}>
                  {results.tier}
                </div>

                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--fg-2)", maxWidth: "480px", margin: "0 auto" }}>
                  {results.desc}
                </p>
              </div>

              {/* Email status */}
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 16px",
                background: emailSent ? "rgba(63,157,91,0.08)" : "var(--bg-surface)",
                border: `1px solid ${emailSent ? "rgba(63,157,91,0.25)" : "var(--border-subtle)"}`,
                borderRadius: "var(--r-md)",
                marginBottom: "16px",
                fontSize: "13px",
                color: emailSent ? "#3f9d5b" : "var(--fg-4)",
              }}>
                {emailSending ? (
                  <><span>⏳</span><span>{lang === "pl" ? "Wysyłam raport na " : "Sending report to "}{gateEmail}…</span></>
                ) : emailSent ? (
                  <><span>✓</span><span>{lang === "pl" ? `Raport PDF wysłany na ${gateEmail}` : `PDF report sent to ${gateEmail}`}</span></>
                ) : (
                  <><span>📧</span><span>{lang === "pl" ? `Raport zostanie wysłany na ${gateEmail}` : `Report will be sent to ${gateEmail}`}</span></>
                )}
              </div>

              {/* Insights */}
              <div style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-xl)",
                padding: "28px 36px",
                boxShadow: "var(--shadow-md)",
                marginBottom: "20px",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700,
                  color: "var(--fg-1)", marginBottom: "20px",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  {t("results.insightsTitle")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {results.insights.map((ins, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <span style={{
                        flexShrink: 0, fontSize: "20px",
                        width: "40px", height: "40px",
                        background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--r-md)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{ins.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--fg-1)", marginBottom: "4px" }}>{ins.h}</div>
                        <div style={{ fontSize: "14px", color: "var(--fg-3)", lineHeight: 1.55 }}>{ins.p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--r-xl)",
                padding: "32px 36px",
                boxShadow: "var(--shadow-md)",
                textAlign: "center",
              }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--fg-1)", marginBottom: "8px" }}>
                  {results.ctaLabel}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--fg-3)", marginBottom: "20px" }}>{results.ctaSub}</p>
                <a
                  className="btn btn-primary btn-lg"
                  href="https://calendar.app.google/ok4xj5QtxsRTCCoZ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", justifyContent: "center" }}
                >
                  {lang === "pl" ? "Umów rozmowę →" : "Book a call →"}
                </a>
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => { setPhase("gate"); setResults(null); setScores(Array(TOTAL_Q).fill(null)); }}
                    style={{
                      background: "none", border: "none", color: "var(--fg-4)",
                      fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-body)",
                    }}
                  >
                    {lang === "pl" ? "← Zacznij od nowa" : "← Start over"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "var(--bg-surface)",
  border: "1.5px solid var(--border-soft)",
  borderRadius: "var(--r-md)",
  color: "var(--fg-1)",
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  outline: "none",
  transition: "border-color var(--dur-base) var(--ease-out)",
};
