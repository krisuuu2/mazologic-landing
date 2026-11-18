// MazoLogic offer v4 (2026-11) — bilingual strings for the main page.
// The AI OS page (/ai-os) keeps using strings.ts.

type Seg = { t: string; c?: boolean };
type HeroVariant = { h1a: Seg[]; h1b: string; sub: string };
type Card = { dept: string; h: string; p: string; tag: string };
type Step = { num: string; h: string; p: string };
type Faq = { q: string; a: string };

export type OfferStrings = {
  nav: { services: string; running: string; training: string; how: string; brain: string; cta: string };
  hero: { variants: HeroVariant[]; cta: string; cta2: string };
  services: { eyebrow: string; h2a: string; h2b: string; lead: string; price: string; priceNote: string; cards: Card[]; yourTag: string };
  running: { eyebrow: string; h2a: string; h2b: string; lead: string; cards: { where: string; h: string; p: string }[] };
  training: { eyebrow: string; h2a: string; h2b: string; lead: string; programs: { name: string; who: string; points: string[]; effect: string; price: string }[]; included: string };
  security: { eyebrow: string; h2a: string; h2b: string; lead: string; cards: { h: string; p: string }[] };
  matrix: { eyebrow: string; h2a: string; h2b: string; lead: string };
  how: { eyebrow: string; h2a: string; h2b: string; steps: Step[] };
  aios: { left: string; right: string; lead: string; cta: string };
  faq: { eyebrow: string; h2: string; items: Faq[] };
  close: { h2: string; cta: string; cta2: string };
  footer: { privacy: string; contact: string; aios: string; audit: string };
};

const en: OfferStrings = {
  nav: { services: "Implementations", running: "In production", training: "Training", how: "How we start", brain: "Second brain", cta: "Book a free call →" },
  hero: {
    variants: [
      { h1a: [{ t: "We automate business processes. " }, { t: "One at a time.", c: true }], h1b: "Implementation takes one day.", sub: "We start with the one task that eats most of your team's time. We build a solution that works on your files and inside your tools, runs the agreed steps on its own, and stops where a human has to decide." },
      { h1a: [{ t: "One task eats most of your team's week. " }, { t: "Start there.", c: true }], h1b: "Fixed scope. Fixed price. Done in a day.", sub: "You don't need a company-wide AI strategy to get your Monday back. You need one process handed over, working, with a human still in charge of the decisions that matter." },
      { h1a: [{ t: "Not another tool. " }, { t: "A solution that does the work.", c: true }], h1b: "On your files. In your systems.", sub: "AI in a browser tab still leaves the copying, pasting and checking to your team. We put the solution where the work is, with access only to what one process needs." },
      { h1a: [{ t: "Built in a day. " }, { t: "Yours to keep.", c: true }], h1b: "No subscription with us.", sub: "The solution runs on your accounts and is billed to your account. You see every cent, you can switch it off any time, and your team learns how it works while we build it." },
    ],
    cta: "Book a free call →",
    cta2: "See what's already running ↓",
  },
  services: {
    eyebrow: "One-day implementations",
    h2a: "One day. One process.",
    h2b: "A working solution.",
    lead: "Every implementation has a fixed scope and a fixed price. On site or online, we build the solution on your data and launch it with your team in the room. These are the processes companies usually start with.",
    price: "$3,000 per implementation day",
    priceNote: "30 days of support included · model usage billed to your own account",
    cards: [
      { dept: "Marketing", h: "Content and video", p: "Phone footage turned into a finished short with captions and voice-over. Copy, descriptions and graphics in your brand style, with no pasting between tools.", tag: "In-house · at a client" },
      { dept: "Sales", h: "Quoting", p: "From an inbound email to a ready quote or proposal. The system reads the request, prices it by your rules and price list, and prepares the reply for approval.", tag: "At a client" },
      { dept: "Admin", h: "Inbox and documents", p: "Inbox triage, replies to recurring questions, invoices and attachments filed where they belong. Call and meeting notes written up automatically.", tag: "In-house" },
      { dept: "HR", h: "Onboarding and company knowledge", p: "Onboarding materials generated from your own documentation. Calls, voice notes and team chats turned into one searchable knowledge base, so nothing lives only in someone's head.", tag: "In-house" },
      { dept: "Data", h: "Reporting", p: "A weekly report from several systems in one place: sales, social media, costs. No manual data pulling and no new dashboard to maintain.", tag: "In-house" },
      { dept: "Your team", h: "Your process", p: "Any repeatable process in your company. We start with one, agree the boundaries before we build, and the solution stays with you.", tag: "Describe your process →" },
    ],
    yourTag: "Describe your process →",
  },
  running: {
    eyebrow: "In-house first, then at clients",
    h2a: "We don't experiment",
    h2b: "on someone else's business.",
    lead: "Every solution runs first in our own company or with a first client on real data. Only what works day to day gets implemented further. Five that are running right now.",
    cards: [
      { where: "Real estate agency", h: "Assistant on Telegram", p: "One message: \"find buyers for this property, text and email them, confirm by voice.\" The system searches the database, sends, confirms. Before: 20–40 phone calls a day and notes kept in agents' heads." },
      { where: "Freight company", h: "Transport quotes", p: "A transport request becomes a quote with route, road tolls and margin by the company's own rules. The admin edits the rules without a developer." },
      { where: "Foundation", h: "Event reels", p: "Phone photos and clips plus a voice-over script. Out comes a finished reel with music, captions and an end card. The foundation's team does it themselves from a phone." },
      { where: "In-house", h: "Notes from calls and chats", p: "Phone calls, voice notes and team chats land in one knowledge base as written, tagged notes. Nothing gets lost in private threads." },
      { where: "In-house", h: "One report from 19 social accounts", p: "One script pulls YouTube, Facebook and Instagram data for every brand and builds a single report. Before: an hour of clicking every week." },
    ],
  },
  training: {
    eyebrow: "Training for teams",
    h2a: "We teach teams to build their own tools.",
    h2b: "On their own tasks.",
    lead: "The program is built from the tasks your team does every day. The tools created during training are in use the next morning. We work in Claude Code because it acts directly on company files and systems, not just in a chat window.",
    programs: [
      { name: "AI in daily work", who: "For teams that want to get their work done faster.", points: ["We map the tasks that eat the most time", "Everyone builds their own tool in the environment your IT allows", "We connect it to email, spreadsheets and your CRM", "The team learns to extend the tools on their own"], effect: "Every participant leaves with 3–5 working tools.", price: "Online $2,500 · on site $4,500 per day" },
      { name: "A solution built during training", who: "For companies with a specific process to automate.", points: ["We build the solution on the process you choose", "We connect your data sources, generating keys together", "We define when the system decides and when it asks", "We launch it in production with a daily report", "We close costs, monitoring and compliance"], effect: "You leave with a working solution and a team that can build the next one.", price: "From $4,500 · online or on site" },
    ],
    included: "Included: 30 days of email and phone support · recording of online sessions for 6 months · a check-in after 3 months at half the day rate",
  },
  security: {
    eyebrow: "Scope of access",
    h2a: "What the system can touch",
    h2b: "is agreed before we start.",
    lead: "In companies the first question is rarely what the solution can do. It's almost always what it will have access to. We answer that before anything runs.",
    cards: [
      { h: "Your accounts", p: "The solution works on your tools and your credentials. Nothing passes through our servers." },
      { h: "Narrow scope", p: "Only the systems and folders one process needs. Written into the configuration, not agreed verbally." },
      { h: "A human approves", p: "Sending, paying, changing a client record: nothing goes out without approval until you decide otherwise." },
      { h: "Cost to the cent", p: "Model usage is billed to your own account. You see every cent and can switch the solution off at any time." },
    ],
  },
  matrix: {
    eyebrow: "Which process first",
    h2a: "Before we build:",
    h2b: "what pays back, and what to leave alone.",
    lead: "On the call we place your processes in four zones, by impact, implementation effort and return. You leave knowing which process to hand over first, and which ones not to touch yet.",
  },
  how: {
    eyebrow: "From call to implementation",
    h2a: "Four steps.",
    h2b: "No surprises in the quote.",
    steps: [
      { num: "STEP 1", h: "Free call, 30 minutes", p: "We ask how the team works today and which process hurts most. If we think an implementation won't pay off, we say so." },
      { num: "STEP 2", h: "Written proposal, 2–3 working days", p: "One document: scope, date, price with all costs." },
      { num: "STEP 3", h: "Short contract and preparation", p: "We block the date. Your team gets a short prep list. Access is set up together in the first hour." },
      { num: "STEP 4", h: "Implementation day and 30 days of support", p: "We work on your data. Afterwards we reply within one working day." },
    ],
  },
  aios: {
    left: "One AI agent with the whole team's context.",
    right: "The company's second brain.",
    lead: "It knows your clients, projects, arrangements and procedures. Anyone on the team can ask it, hand it a task, or tell it to remember something. A separate offer, built on the tools you already use.",
    cta: "See the second brain →",
  },
  faq: {
    eyebrow: "Questions",
    h2: "Straight answers.",
    items: [
      { q: "Do you work in Claude Code or ChatGPT?", a: "Mainly Claude Code, because it acts directly on company files and systems and gives the most reliable control over what the solution may do. If your IT only allows another environment, we adapt. The way of working is the same." },
      { q: "Does the team need to code?", a: "No. The solution is operated with plain-language commands. The coding is on our side, and what stays with you is documented step by step." },
      { q: "What if the solution does something wrong?", a: "Higher-risk decisions go back to a human. Every step is logged. Switching it off is one click." },
      { q: "What does it cost to run?", a: "Model usage is usually tens to a few hundred dollars a month, billed to your account. There is no subscription with us." },
      { q: "Is company data safe?", a: "Data stays in your tools. Access scope is agreed before we start and written into the configuration. NDA and data processing agreement on request." },
      { q: "Does this make sense for a small company?", a: "Yes, if there is one process that repeats every week and takes a few hours. If there isn't, we'll tell you on the call." },
    ],
  },
  close: { h2: "Let's find the process worth handing over first.", cta: "Book a free call →", cta2: "Ask about training" },
  footer: { privacy: "Privacy", contact: "Contact", aios: "Second brain", audit: "AI Audit" },
};

const pl: OfferStrings = {
  nav: { services: "Wdrożenia", running: "Co już pracuje", training: "Szkolenia", how: "Jak zaczynamy", brain: "Drugi mózg firmy", cta: "Umów bezpłatną rozmowę →" },
  hero: {
    variants: [
      { h1a: [{ t: "Automatyzujemy procesy w firmach. " }, { t: "Jeden na raz.", c: true }], h1b: "Wdrożenie trwa jeden dzień.", sub: "Zaczynamy od jednego zadania, które zabiera Waszemu zespołowi najwięcej czasu. Budujemy rozwiązanie, które pracuje na Waszych plikach i w Waszych narzędziach, samo wykonuje uzgodnione kroki i zatrzymuje się tam, gdzie decyzja należy do człowieka." },
      { h1a: [{ t: "Jedno zadanie zjada zespołowi pół tygodnia. " }, { t: "Zacznijmy od niego.", c: true }], h1b: "Stały zakres. Stała cena. Gotowe w jeden dzień.", sub: "Nie potrzebujecie strategii AI dla całej firmy, żeby odzyskać poniedziałek. Potrzebujecie jednego procesu oddanego w dobre ręce, działającego, z człowiekiem, który dalej podejmuje ważne decyzje." },
      { h1a: [{ t: "Nie kolejne narzędzie. " }, { t: "Rozwiązanie, które wykonuje pracę.", c: true }], h1b: "Na Waszych plikach. W Waszych systemach.", sub: "AI w przeglądarce nadal zostawia zespołowi kopiowanie, wklejanie i sprawdzanie. My stawiamy rozwiązanie tam, gdzie jest praca, z dostępem tylko do tego, czego wymaga jeden proces." },
      { h1a: [{ t: "Zbudowane w jeden dzień. " }, { t: "Zostaje u Was.", c: true }], h1b: "Bez abonamentu u nas.", sub: "Rozwiązanie pracuje na Waszych kontach i jest rozliczane z Waszego konta. Widzicie każdy grosz, możecie je wyłączyć w każdej chwili, a zespół uczy się, jak działa, w trakcie budowy." },
    ],
    cta: "Umów bezpłatną rozmowę →",
    cta2: "Zobacz, co już pracuje ↓",
  },
  services: {
    eyebrow: "Wdrożenia jednodniowe",
    h2a: "Jeden dzień. Jeden proces.",
    h2b: "Gotowe rozwiązanie.",
    lead: "Każde wdrożenie ma stały zakres i stałą cenę. Przyjeżdżamy albo łączymy się online, budujemy rozwiązanie na Waszych danych i uruchamiamy je przy zespole. Poniżej procesy, od których firmy zaczynają najczęściej.",
    price: "3 900 zł netto za dzień wdrożenia",
    priceNote: "w cenie 30 dni wsparcia · praca modelu rozliczana z Waszego konta",
    cards: [
      { dept: "Marketing", h: "Treści i wideo", p: "Z nagrań z telefonu gotowa rolka z napisami i lektorem. Teksty, opisy i grafiki w stylu marki, bez przeklejania między narzędziami.", tag: "U nas · u klienta" },
      { dept: "Sprzedaż", h: "Ofertowanie", p: "Od zapytania mailowego do gotowej wyceny lub oferty. System czyta zapytanie, liczy według Waszego cennika i reguł, przygotowuje odpowiedź do akceptacji.", tag: "U klienta" },
      { dept: "Administracja", h: "Poczta i dokumenty", p: "Segregacja skrzynki, odpowiedzi na powtarzalne pytania, faktury i załączniki trafiają tam, gdzie mają trafić. Notatki z rozmów i spotkań spisane same.", tag: "U nas" },
      { dept: "HR", h: "Onboarding i wiedza firmy", p: "Materiały wdrożeniowe dla nowych osób z Waszej dokumentacji. Rozmowy, głosówki i czaty zespołu zamienione w jedną przeszukiwalną bazę wiedzy, żeby nic nie żyło tylko w czyjejś głowie.", tag: "U nas" },
      { dept: "Analiza danych", h: "Raportowanie", p: "Co tydzień raport z kilku systemów w jednym miejscu: sprzedaż, social media, koszty. Bez ręcznego zbierania danych i bez kolejnego dashboardu.", tag: "U nas" },
      { dept: "Wasz zespół", h: "Twój proces", p: "Dowolny powtarzalny proces w firmie. Zaczynamy od jednego, granice ustalamy przed wdrożeniem, rozwiązanie zostaje u Was.", tag: "Opisz proces →" },
    ],
    yourTag: "Opisz proces →",
  },
  running: {
    eyebrow: "Najpierw u nas, potem u klientów",
    h2a: "Nie eksperymentujemy",
    h2b: "na cudzej firmie.",
    lead: "Każde rozwiązanie najpierw pracuje u nas albo u pierwszego klienta na prawdziwych danych. Dopiero to, co działa na co dzień, wdrażamy dalej. Poniżej pięć, które pracują teraz.",
    cards: [
      { where: "Biuro nieruchomości", h: "Asystent na Telegramie", p: "Jedna wiadomość: „znajdź kupujących na tę nieruchomość, wyślij im SMS i mail, potwierdź głosem”. System przeszukuje bazę, wysyła, potwierdza. Wcześniej: 20–40 telefonów dziennie i notatki w głowach agentów." },
      { where: "Firma transportowa", h: "Wyceny przewozów", p: "Zapytanie o przewóz zamienia się w wycenę z trasą, opłatami drogowymi i marżą według reguł firmy. Admin poprawia reguły sam, bez programisty." },
      { where: "Fundacja", h: "Rolki z wydarzeń", p: "Zdjęcia i klipy z telefonu plus tekst dla lektora. Z tego gotowa rolka z muzyką, napisami i planszą końcową. Zespół fundacji robi to sam z telefonu." },
      { where: "U nas", h: "Notatki z rozmów i czatów", p: "Rozmowy telefoniczne, głosówki i czaty zespołu trafiają do jednej bazy wiedzy jako spisane notatki z tagami. Nic nie ginie w prywatnych wątkach." },
      { where: "U nas", h: "Raport z 19 kont social media", p: "Jeden skrypt zbiera dane z YouTube, Facebooka i Instagrama dla wszystkich marek i składa je w jeden raport. Wcześniej: godzina klikania co tydzień." },
    ],
  },
  training: {
    eyebrow: "Szkolenia dla zespołów",
    h2a: "Uczymy zespoły budować własne narzędzia.",
    h2b: "Na Waszych zadaniach.",
    lead: "Program układamy z zadań, które zespół wykonuje każdego dnia. W trakcie szkolenia powstają rozwiązania, z których korzystacie od następnego dnia. Pracujemy w Claude Code, bo działa bezpośrednio na plikach i systemach firmy, nie tylko w oknie czatu.",
    programs: [
      { name: "AI w codziennej pracy", who: "Dla zespołów, które chcą robić swoją pracę szybciej.", points: ["Mapujemy zadania, które zjadają najwięcej czasu", "Każdy buduje własne narzędzie w środowisku, które dopuszcza Wasz dział IT", "Podpinamy je do poczty, arkuszy i CRM", "Zespół uczy się rozwijać narzędzia samodzielnie"], effect: "Każdy uczestnik wychodzi z 3–5 działającymi narzędziami.", price: "Online 3 500 zł netto · u Was 5 500 zł netto za dzień" },
      { name: "Rozwiązanie zbudowane na szkoleniu", who: "Dla firm, które mają już konkretny proces do zautomatyzowania.", points: ["Budujemy rozwiązanie na procesie, który wskażecie", "Podpinamy Wasze źródła danych, klucze generujemy wspólnie", "Ustalamy, kiedy system decyduje sam, a kiedy pyta", "Uruchamiamy na produkcji z codziennym raportem", "Domykamy koszty, monitoring i RODO"], effect: "Wychodzicie z działającym rozwiązaniem i zespołem, który umie zbudować następne.", price: "Od 5 500 zł netto · online lub u Was" },
    ],
    included: "W cenie: 30 dni wsparcia mailowo i telefonicznie · nagranie szkolenia online na 6 miesięcy · spotkanie kontrolne po 3 miesiącach za połowę stawki dziennej",
  },
  security: {
    eyebrow: "Zakres uprawnień",
    h2a: "Do czego system ma dostęp,",
    h2b: "ustalamy przed startem.",
    lead: "W firmach pierwsze pytanie rzadko dotyczy tego, co rozwiązanie potrafi. Prawie zawsze dotyczy tego, do czego dostanie dostęp. Odpowiadamy na nie, zanim cokolwiek uruchomimy.",
    cards: [
      { h: "Wasze konta", p: "Rozwiązanie pracuje na Waszych narzędziach i Waszych dostępach. Nic nie przechodzi przez nasze serwery." },
      { h: "Wąski zakres", p: "Tylko te systemy i katalogi, których wymaga jeden proces. Zakres zapisany w konfiguracji, nie w ustaleniach ustnych." },
      { h: "Człowiek zatwierdza", p: "Wysyłka, płatność, zmiana w systemie klienta: nic nie wychodzi bez akceptacji, dopóki sami nie zdecydujecie inaczej." },
      { h: "Koszt co do złotówki", p: "Praca modelu rozliczana z Waszego konta. Widzicie każdy grosz i możecie wyłączyć rozwiązanie w każdej chwili." },
    ],
  },
  matrix: {
    eyebrow: "Który proces pierwszy",
    h2a: "Zanim zbudujemy:",
    h2b: "co się zwraca, a czego na razie nie ruszać.",
    lead: "Na rozmowie układamy Wasze procesy w czterech strefach według wpływu, nakładu wdrożenia i zwrotu. Wychodzicie wiedząc, który proces oddać jako pierwszy, a których jeszcze nie dotykać.",
  },
  how: {
    eyebrow: "Od rozmowy do wdrożenia",
    h2a: "Cztery kroki.",
    h2b: "Bez niespodzianek w wycenie.",
    steps: [
      { num: "KROK 1", h: "Bezpłatna rozmowa, 30 minut", p: "Pytamy, jak dziś pracuje zespół i który proces boli najbardziej. Jeśli uznamy, że wdrożenie Wam się nie opłaci, powiemy to wprost." },
      { num: "KROK 2", h: "Propozycja na piśmie, 2–3 dni robocze", p: "Jeden dokument: zakres, termin, cena ze wszystkimi kosztami." },
      { num: "KROK 3", h: "Krótka umowa i przygotowanie", p: "Blokujemy termin. Zespół dostaje listę rzeczy do przygotowania. Dostępy generujemy wspólnie w pierwszej godzinie." },
      { num: "KROK 4", h: "Dzień wdrożenia i 30 dni wsparcia", p: "Pracujemy na Waszych danych. Po wdrożeniu odpowiadamy w ciągu doby w dni robocze." },
    ],
  },
  aios: {
    left: "Jeden agent AI z kontekstem całego zespołu.",
    right: "Drugi mózg firmy.",
    lead: "Zna klientów, projekty, ustalenia i procedury. Każdy w zespole może go zapytać, zlecić mu zadanie albo kazać coś zapamiętać. To osobna oferta, budowana na narzędziach, których już używacie.",
    cta: "Zobacz drugi mózg firmy →",
  },
  faq: {
    eyebrow: "Pytania",
    h2: "Odpowiadamy wprost.",
    items: [
      { q: "Pracujecie w Claude Code czy w ChatGPT?", a: "Głównie w Claude Code, bo działa bezpośrednio na plikach i systemach firmy i daje najpewniejszą kontrolę nad tym, co rozwiązanie może zrobić. Jeśli Wasz dział IT dopuszcza tylko inne środowisko, dostosujemy się. Schemat pracy jest ten sam." },
      { q: "Czy zespół musi umieć programować?", a: "Nie. Rozwiązanie obsługuje się poleceniami w zwykłym języku. Programowanie jest po naszej stronie, a to, co zostaje u Was, jest opisane krok po kroku." },
      { q: "Co, jeśli rozwiązanie zrobi coś nie tak?", a: "Decyzje o podwyższonym ryzyku wracają do człowieka. Każdy krok jest zapisany w logu. Wyłączenie to jedno kliknięcie." },
      { q: "Ile to kosztuje w utrzymaniu?", a: "Praca modelu to zwykle kilkadziesiąt do kilkuset złotych miesięcznie, rozliczane z Waszego konta. Nie ma abonamentu u nas." },
      { q: "Czy dane firmy są bezpieczne?", a: "Dane zostają w Waszych narzędziach. Zakres dostępu ustalamy przed startem i zapisujemy w konfiguracji. Na życzenie podpisujemy NDA i umowę powierzenia." },
      { q: "Czy to ma sens dla małej firmy?", a: "Tak, jeśli jest jeden proces, który powtarza się co tydzień i zajmuje kilka godzin. Jeśli nie ma, powiemy to na rozmowie." },
    ],
  },
  close: { h2: "Sprawdźmy, który proces warto oddać jako pierwszy.", cta: "Umów bezpłatną rozmowę →", cta2: "Zapytaj o szkolenie" },
  footer: { privacy: "Prywatność", contact: "Kontakt", aios: "Drugi mózg firmy", audit: "Audyt AI" },
};

export const OFFER = { en, pl } as const;
