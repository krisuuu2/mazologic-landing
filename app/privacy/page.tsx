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
          <div className="nav-right">
            <div className="toggle-group lang" role="tablist" aria-label="Language">
              <button className={lang === "en" ? "active" : ""} onClick={() => { setLang("en"); localStorage.setItem("mazo-lang", "en"); }}>EN</button>
              <button className={lang === "pl" ? "active" : ""} onClick={() => { setLang("pl"); localStorage.setItem("mazo-lang", "pl"); }}>PL</button>
            </div>
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
                  ? "Administratorem Twoich danych osobowych jest Mazo Media Krzysztof Łomonkiewicz, ul. Obrońców Wybrzeża 4A lok. 69, 80-398 Gdańsk, NIP: 5842550318, REGON: 369116389 (działająca pod marką MazoLogic). Nie wyznaczyliśmy Inspektora Ochrony Danych (IOD), ponieważ przetwarzanie danych nie wymaga tego na podstawie art. 37 RODO. We wszelkich sprawach dotyczących danych osobowych prosimy o kontakt: info@mazologic.com."
                  : "The data controller is Mazo Media Krzysztof Łomonkiewicz, ul. Obrońców Wybrzeża 4A lok. 69, 80-398 Gdańsk, Poland, NIP: 5842550318, REGON: 369116389 (trading as MazoLogic). We have not appointed a Data Protection Officer (DPO) as our processing does not require one under Art. 37 GDPR. For all data protection matters, contact us at: info@mazologic.com."}
              </Section>

              <Section title={ispl ? "2. Jakie dane zbieramy" : "2. What data we collect"}>
                {ispl
                  ? "Zbieramy wyłącznie dane, które sam podajesz podczas wypełniania Audytu Gotowości AI: imię (opcjonalne), adres email, Twoje odpowiedzi na pytania quizu oraz wyliczony wynik i poziom gotowości. Nie zbieramy cookies analitycznych, pikseli śledzących ani danych o zachowaniu na stronie. Podanie danych jest dobrowolne — jeśli ich nie podasz, nie będziesz mógł otrzymać spersonalizowanego raportu."
                  : "We collect only data you provide voluntarily when completing the AI Readiness Audit: your name (optional), email address, your quiz answers, and the calculated score and readiness tier. We do not collect analytics cookies, tracking pixels, or behavioural data. Providing your data is voluntary — if you choose not to, you will not be able to receive your personalised report."}
              </Section>

              <Section title={ispl ? "3. Cel i podstawa prawna przetwarzania" : "3. Purpose and legal basis"}>
                {ispl
                  ? "Twoje dane przetwarzamy w następujących celach: (a) wysłanie Ci spersonalizowanego raportu AI Readiness na email — podstawa prawna: Twoja zgoda (art. 6 ust. 1 lit. a RODO); (b) przechowywanie Twoich danych kontaktowych w naszym CRM w celu ewentualnego kontaktu w sprawie usług MazoLogic — podstawa prawna: Twoja zgoda. Zgoda jest dobrowolna i możesz ją wycofać w każdej chwili, pisząc na info@mazologic.com. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej wycofaniem."
                  : "We process your data for the following purposes: (a) sending you a personalised AI Readiness Report by email — legal basis: your consent (Art. 6(1)(a) GDPR); (b) storing your contact information in our CRM for potential follow-up regarding MazoLogic services — legal basis: your consent. Consent is voluntary and may be withdrawn at any time by emailing info@mazologic.com. Withdrawal of consent does not affect the lawfulness of processing carried out before the withdrawal."}
              </Section>

              <Section title={ispl ? "4. Odbiorcy danych i przekazywanie danych" : "4. Data recipients and transfers"}>
                {ispl
                  ? "Twoje dane mogą być przekazywane następującym podmiotom przetwarzającym: (a) Brevo SAS (dawniej Sendinblue), 17 rue Salneuve, 75017 Paryż, Francja — w celu wysyłki emaili i przechowywania kontaktów w CRM. Brevo przetwarza dane na terenie UE. (b) Vercel Inc., San Francisco, USA — jako dostawca hostingu naszej strony. Vercel jest certyfikowany w ramach EU-US Data Privacy Framework (DPF) i stosuje Standardowe Klauzule Umowne (SCC) jako dodatkowe zabezpieczenie. Nie sprzedajemy ani nie udostępniamy Twoich danych żadnym innym podmiotom trzecim."
                  : "Your data may be shared with the following processors: (a) Brevo SAS (formerly Sendinblue), 17 rue Salneuve, 75017 Paris, France — for email delivery and CRM contact storage. Brevo processes data within the EU. (b) Vercel Inc., San Francisco, USA — as our website hosting provider. Vercel is certified under the EU-US Data Privacy Framework (DPF) and has Standard Contractual Clauses (SCCs) in place as supplementary safeguards. We do not sell or share your data with any other third parties."}
              </Section>

              <Section title={ispl ? "5. Okres przechowywania" : "5. Retention period"}>
                {ispl
                  ? "Przechowujemy Twoje dane przez maksymalnie 24 miesiące od daty ich podania, po czym zostaną automatycznie usunięte. Okres ten jest uzasadniony koniecznością umożliwienia Ci dostępu do wyników oraz naszych celów administracyjnych. Możesz zażądać wcześniejszego usunięcia w dowolnym momencie, pisząc na info@mazologic.com."
                  : "We retain your data for a maximum of 24 months from the date of collection, after which it will be automatically deleted. This period is justified by the need to allow you access to your results and for our administrative record-keeping. You may request earlier deletion at any time by emailing info@mazologic.com."}
              </Section>

              <Section title={ispl ? "6. Twoje prawa" : "6. Your rights"}>
                {ispl
                  ? "Na podstawie RODO przysługuje Ci prawo do: (a) dostępu do Twoich danych osobowych, (b) ich sprostowania, (c) usunięcia (\"prawo do bycia zapomnianym\"), (d) ograniczenia przetwarzania, (e) przenoszenia danych, (f) wniesienia sprzeciwu wobec przetwarzania. Aby skorzystać z tych praw, napisz na: info@mazologic.com — odpowiemy w ciągu 30 dni."
                  : "Under the GDPR you have the right to: (a) access your personal data, (b) rectify it, (c) erase it (\"right to be forgotten\"), (d) restrict processing, (e) data portability, (f) object to processing. To exercise any of these rights, contact info@mazologic.com — we will respond within 30 days."}
              </Section>

              <Section title={ispl ? "7. Wycofanie zgody" : "7. Withdrawal of consent"}>
                {ispl
                  ? "Masz prawo wycofać swoją zgodę na przetwarzanie danych w dowolnym momencie. Możesz to zrobić pisząc na adres info@mazologic.com. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, które miało miejsce przed jej wycofaniem. Po wycofaniu zgody Twoje dane zostaną usunięte z naszych systemów."
                  : "You have the right to withdraw your consent to data processing at any time. You can do so by emailing info@mazologic.com. Withdrawal does not affect the lawfulness of processing carried out prior to the withdrawal. Upon withdrawal, your data will be deleted from our systems."}
              </Section>

              <Section title={ispl ? "8. Organ nadzorczy" : "8. Supervisory authority"}>
                {ispl
                  ? "Masz prawo wniesienia skargi do organu nadzorczego. W Polsce jest to Prezes Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa, uodo.gov.pl. Jeśli jesteś w innym kraju UE, możesz złożyć skargę do lokalnego organu ochrony danych."
                  : "You have the right to lodge a complaint with a supervisory authority. In Poland this is the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw, uodo.gov.pl. If you are in another EU country, you may contact your local data protection authority (e.g. ICO in the UK, CNIL in France)."}
              </Section>

              <Section title={ispl ? "9. Zautomatyzowane podejmowanie decyzji" : "9. Automated decision-making"}>
                {ispl
                  ? "Quiz AI Readiness wykorzystuje automatyczny system punktacji do wyliczenia Twojego wyniku i przypisania poziomu gotowości (Etap 1, 2 lub 3). Jest to proces w pełni zautomatyzowany, oparty na Twoich odpowiedziach. Wynik ma charakter wyłącznie informacyjny i nie wywołuje żadnych skutków prawnych ani nie wpływa istotnie na Twoją sytuację. Możesz w każdej chwili skontaktować się z nami w celu uzyskania ludzkiej oceny."
                  : "The AI Readiness Quiz uses an automated scoring system to calculate your score and assign a readiness tier (Stage 1, 2, or 3). This is a fully automated process based on your answers. The result is purely informational and does not produce any legal effects or significantly affect you. You may contact us at any time to request a human review of your results."}
              </Section>

              <Section title={ispl ? "10. Pliki cookie i localStorage" : "10. Cookies and localStorage"}>
                {ispl
                  ? "Ta strona nie używa plików cookie do śledzenia, analityki ani reklam. Używamy wyłącznie localStorage przeglądarki do zapamiętania dwóch preferencji: (a) wybranego języka (EN/PL), (b) wybranego motywu kolorystycznego (jasny/ciemny). Te dane pozostają wyłącznie na Twoim urządzeniu, nie są przesyłane na nasze serwery i możesz je usunąć w każdej chwili czyszcząc dane przeglądarki. Na podstawie art. 5 ust. 3 dyrektywy ePrivacy (w Polsce: art. 173 Prawa Telekomunikacyjnego) przechowywanie to jest zwolnione z wymogu zgody, ponieważ jest ściśle niezbędne do świadczenia usługi na Twoje wyraźne żądanie."
                  : "This website does not use cookies for tracking, analytics, or advertising. We use browser localStorage only to remember two preferences: (a) your chosen language (EN/PL), (b) your chosen colour theme (light/dark). This data stays exclusively on your device, is never sent to our servers, and can be cleared at any time through your browser settings. Under Art. 5(3) of the ePrivacy Directive, this storage is exempt from consent requirements as it is strictly necessary to provide the service you explicitly requested."}
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
