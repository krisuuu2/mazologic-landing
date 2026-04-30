"use client";

import { useEffect, useState } from "react";
import { Lang } from "../strings";

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("mazo-lang") as Lang | null;
    const browser: Lang = navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    setLang(saved ?? browser);
  }, []);

  const ispl = lang === "pl";

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-left">
            <a href="/" aria-label="MazoLogic home" style={{ textDecoration: "none" }}>
              <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
            </a>
          </div>
        </div>
      </nav>

      <main style={{ minHeight: "100vh", background: "var(--bg-canvas)", paddingBottom: "80px" }}>
        <div className="container" style={{ maxWidth: "720px", paddingTop: "80px" }}>
          <div style={{ animation: "fadeUp 0.4s ease both" }}>

            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-accent)", display: "block", marginBottom: "12px" }}>
              {ispl ? "Dokument prawny" : "Legal document"}
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg-1)", marginBottom: "8px" }}>
              {ispl ? "Polityka Prywatności" : "Privacy Policy"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--fg-4)", marginBottom: "48px", fontFamily: "var(--font-mono)" }}>
              {ispl ? "Ostatnia aktualizacja: 1 maja 2026" : "Last updated: 1 May 2026"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

              <Section title={ispl ? "1. Administrator danych" : "1. Data Controller"}>
                {ispl
                  ? "Administratorem Twoich danych osobowych jest MazoLogic (info@mazologic.com). Możesz skontaktować się z nami pod adresem: info@mazologic.com."
                  : "The data controller is MazoLogic (info@mazologic.com). You can contact us at: info@mazologic.com."}
              </Section>

              <Section title={ispl ? "2. Jakie dane zbieramy" : "2. What data we collect"}>
                {ispl
                  ? "Zbieramy wyłącznie dane, które sam podajesz: imię (opcjonalne) i adres email — wyłącznie podczas wypełniania Audytu Gotowości AI. Nie zbieramy cookies analitycznych ani danych o zachowaniu na stronie."
                  : "We collect only data you provide voluntarily: your name (optional) and email address — only when you complete the AI Readiness Audit. We do not collect analytics cookies or behavioural tracking data."}
              </Section>

              <Section title={ispl ? "3. Cel i podstawa prawna przetwarzania" : "3. Purpose and legal basis"}>
                {ispl
                  ? "Twoje dane przetwarzamy w celu: (a) wysłania Ci spersonalizowanego raportu AI na email (podstawa: zgoda, art. 6 ust. 1 lit. a RODO), (b) kontaktu w sprawie usług MazoLogic, jeśli wyraziłeś zgodę. Zgoda jest dobrowolna i możesz ją wycofać w każdej chwili."
                  : "We process your data to: (a) send you a personalised AI Readiness Report by email (legal basis: consent, Art. 6(1)(a) GDPR), (b) follow up regarding MazoLogic services, if you have consented. Consent is voluntary and may be withdrawn at any time."}
              </Section>

              <Section title={ispl ? "4. Odbiorcy danych" : "4. Data recipients"}>
                {ispl
                  ? "Twoje dane są przekazywane do Brevo SAS (dawniej Sendinblue), z siedzibą we Francji, jako podmiot przetwarzający dane w celu wysyłki emaila. Brevo działa zgodnie z RODO. Nie sprzedajemy ani nie udostępniamy Twoich danych innym podmiotom."
                  : "Your data is shared with Brevo SAS (formerly Sendinblue), headquartered in France, acting as a data processor for email delivery. Brevo is GDPR-compliant. We do not sell or share your data with any other third parties."}
              </Section>

              <Section title={ispl ? "5. Okres przechowywania" : "5. Retention period"}>
                {ispl
                  ? "Przechowujemy Twoje dane przez maksymalnie 24 miesiące od daty ich podania, chyba że wcześniej poprosisz o usunięcie."
                  : "We retain your data for a maximum of 24 months from the date you provided it, unless you request deletion earlier."}
              </Section>

              <Section title={ispl ? "6. Twoje prawa" : "6. Your rights"}>
                {ispl
                  ? "Przysługuje Ci prawo do: dostępu do danych, ich sprostowania, usunięcia (\"prawo do bycia zapomnianym\"), ograniczenia przetwarzania, przenoszenia danych, wycofania zgody w każdej chwili. Aby skorzystać z tych praw, napisz na: info@mazologic.com. Masz również prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO)."
                  : "You have the right to: access your data, rectify it, erase it (\"right to be forgotten\"), restrict processing, data portability, and withdraw consent at any time. To exercise these rights, contact us at: info@mazologic.com. You also have the right to lodge a complaint with your local data protection authority (e.g. ICO in the UK, UODO in Poland)."}
              </Section>

              <Section title={ispl ? "7. Pliki cookie i localStorage" : "7. Cookies and localStorage"}>
                {ispl
                  ? "Ta strona nie używa plików cookie do śledzenia ani analityki. Używamy wyłącznie localStorage przeglądarki do zapamiętania Twoich preferencji językowych i motywu (jasny/ciemny). Dane te pozostają wyłącznie na Twoim urządzeniu i nie są przesyłane na nasze serwery."
                  : "This website does not use tracking or analytics cookies. We use browser localStorage only to remember your language preference and colour theme (light/dark). This data stays on your device and is never sent to our servers."}
              </Section>

            </div>

            <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
              <a href="/" style={{ fontSize: "13px", color: "var(--fg-4)", textDecoration: "none" }}>
                ← {ispl ? "Wróć na stronę główną" : "Back to homepage"}
              </a>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700,
        color: "var(--fg-1)", marginBottom: "12px", letterSpacing: "-0.01em",
      }}>
        {title}
      </h2>
      <p style={{ fontSize: "15px", color: "var(--fg-2)", lineHeight: 1.7 }}>
        {children}
      </p>
    </div>
  );
}
