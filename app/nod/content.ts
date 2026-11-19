import type { NodLang } from "./commands";

export const BASE_URL = "https://mazologic.com";
export const LANGS: NodLang[] = ["pl", "en"];
export const pageUrl = (lang: NodLang) => `${BASE_URL}/nod/${lang}`;

// Film na YouTube dla danego języka. null = sekcja z filmem się nie pokazuje.
export type NodVideo = {
  id: string;
  title: string;
  duration: string; // ISO 8601
  uploadDate: string; // YYYY-MM-DD
  thumb: string; // ścieżka w /public, 1280×720
};
export const VIDEO: Record<NodLang, NodVideo | null> = {
  pl: {
    id: "8p53197WHpw",
    title: "Własny agent AI na serwerze: Nod od n8n krok po kroku",
    duration: "PT24M19S",
    uploadDate: "2026-11-19",
    thumb: "/nod/film-pl.webp",
  },
  en: null,
};
export const videoUrl = (v: NodVideo) => `https://www.youtube.com/watch?v=${v.id}`;

type Benefit = { h: string; p: string };
type HowStep = { h: string; p: string };
type Faq = { q: string; a: string };

export type NodCopy = {
  metaTitle: string;
  metaDesc: string;
  ogAlt: string;
  eyebrow: string;
  h1a: string;
  h1b: string;
  lead: string;
  facts: string[];
  form: {
    title: string;
    sub: string;
    label: string;
    placeholder: string;
    submit: string;
    sending: string;
    okTitle: string;
    okText: string;
    errEmail: string;
    errCaptcha: string;
    errWidget: string;
    errServer: string;
    consent: string;
    privacy: string;
  };
  benefitsEyebrow: string;
  benefitsH: string;
  benefits: Benefit[];
  howEyebrow: string;
  howH: string;
  howLead: string;
  howTotalTime: string; // ISO 8601
  how: HowStep[];
  howCta: string;
  videoH: string;
  videoP: string;
  videoCta: string;
  videoPlay: string;
  faqEyebrow: string;
  faqH: string;
  faq: Faq[];
  disclaimer: string;
  footerPrivacy: string;
  footerContact: string;
  switchLabel: string;
};

export const COPY: Record<NodLang, NodCopy> = {
  pl: {
    metaTitle: "Nod od n8n: osobisty agent AI na własnym serwerze. Instalacja krok po kroku",
    metaDesc:
      "Nod to darmowy, open-source'owy osobisty agent AI od n8n. Postaw go na serwerze Hetzner kilkoma komendami, podłącz OpenRouter albo DeepSeek, Telegram i WhatsApp. Komendy z tutoriala wyślemy Ci na maila.",
    ogAlt: "Nod na własnym serwerze: komendy z tutoriala",
    eyebrow: "Tutorial · Kris AI Praktycznie",
    h1a: "Nod: osobisty agent AI",
    h1b: "na własnym serwerze",
    lead:
      "Darmowy i open source. Działa na Twoim serwerze, z modelem, który sam wybierasz. Płacisz tylko za serwer i za tokeny. Piszesz do niego na Telegramie albo WhatsAppie, także głosówkami.",
    facts: ["Licencja Apache 2.0", "1700+ aplikacji przez Composio", "Telegram i WhatsApp", "Głosówki w obie strony"],
    form: {
      title: "Komendy z tutoriala na maila",
      sub: "Wszystkie polecenia po kolei, gotowe do wklejenia. W treści maila i w pliku .txt, po polsku i po angielsku.",
      label: "Twój e-mail",
      placeholder: "ty@example.com",
      submit: "Wyślij mi komendy",
      sending: "Wysyłam…",
      okTitle: "Wysłane",
      okText: "Sprawdź skrzynkę. Jeśli maila nie ma w ciągu kilku minut, zajrzyj do spamu albo do zakładki Oferty.",
      errEmail: "Wpisz poprawny adres e-mail.",
      errCaptcha: "Potwierdź, że nie jesteś botem, i spróbuj jeszcze raz.",
      errWidget: "Weryfikacja antybotowa się nie wczytała. Odśwież stronę albo wyłącz na chwilę blokery w przeglądarce.",
      errServer: "Nie udało się wysłać. Spróbuj za chwilę albo napisz na info@mazologic.com.",
      consent:
        "Wysyłając formularz, zgadzasz się na zapis adresu przez MazoLogic i okazjonalne maile o Nodzie i automatyzacjach. Wypiszesz się jednym kliknięciem.",
      privacy: "Polityka prywatności",
    },
    benefitsEyebrow: "Dlaczego Nod",
    benefitsH: "Twój agent, Twój serwer, Twój model",
    benefits: [
      { h: "Darmowy i open source", p: "Nod od n8n ma otwarty kod na licencji Apache 2.0. Nie płacisz abonamentu za samo narzędzie." },
      { h: "Własny serwer", p: "Maile, pamięć i zapisane logowania zostają na Twoim serwerze. Komputer możesz wyłączyć, a Nod działa dalej." },
      { h: "Własny model AI", p: "OpenRouter, DeepSeek, Gemini, Claude, ChatGPT i ponad 20 innych dostawców. Model zmieniasz w ustawieniach jednym kliknięciem." },
      { h: "Płacisz za serwer i tokeny", p: "Serwer rozliczany godzinowo i model według zużycia. Z tanim modelem, np. DeepSeek, koszty są naprawdę niskie." },
      { h: "Ponad 1700 aplikacji", p: "Przez Composio podłączasz Gmaila, Kalendarz, Dysk, Arkusze, Airtable i setki innych. Do tego serwery MCP i Twoje automatyzacje." },
      { h: "Telegram i WhatsApp", p: "Piszesz do Noda tam, gdzie już rozmawiasz. Podłączenie to kod QR i kilka kliknięć." },
      { h: "Głosówki w obie strony", p: "Nagrywasz głosówkę, Nod ją rozumie i może odpowiedzieć głosem: automatycznym, z OpenRoutera albo z ElevenLabs." },
      { h: "Pyta, zanim coś zrobi", p: "Zanim coś zmieni albo wyśle, Nod prosi o zgodę. Reguły zaufania sprawdza serwer, nie sam model." },
    ],
    howEyebrow: "Instalacja w zarysie",
    howH: "Od zera do rozmowy na Telegramie",
    howLead: "Bez wcześniejszego doświadczenia z serwerami. Pełna lista komend przychodzi mailem.",
    howTotalTime: "PT45M",
    how: [
      { h: "Serwer na Hetznerze", p: "Zakładasz konto, w konsoli tworzysz serwer z Ubuntu 24.04 i co najmniej 8 GB RAM. Rozliczenie jest godzinowe." },
      { h: "Klucz SSH", p: "Na swoim komputerze (Terminal na Macu, PowerShell na Windowsie) generujesz klucz i wklejasz jego część publiczną w Hetznerze." },
      { h: "Kilka komend na serwerze", p: "Logujesz się przez SSH i wklejasz po kolei: Docker, zapora, pobranie Noda z GitHuba, setup i start." },
      { h: "Tunel i pierwsze logowanie", p: "Drugim oknem terminala otwierasz tunel, wchodzisz na localhost:4310 i logujesz się tokenem z serwera." },
      { h: "Model: OpenRouter albo DeepSeek", p: "Logujesz się do OpenRoutera albo wklejasz klucz API DeepSeeka. Tani i dobry wybór na start: DeepSeek V4.1 Flash." },
      { h: "Telegram, WhatsApp i głos", p: "W zakładce Channels skanujesz kody QR, a w ustawieniach głosu włączasz odpowiedzi głosówką." },
    ],
    howCta: "Wyślij mi komendy",
    videoH: "Cały tutorial na YouTube",
    videoP: "24 minuty, od konta na Hetznerze po pierwszą głosówkę na Telegramie. Komendy z filmu wyślemy Ci mailem.",
    videoCta: "Obejrzyj na YouTube",
    videoPlay: "Odtwórz film",
    faqEyebrow: "FAQ",
    faqH: "Najczęstsze pytania",
    faq: [
      { q: "Czym jest Nod?", a: "Nod to osobisty agent AI od n8n. Łączy się z Twoją pocztą, kalendarzem i aplikacjami, wykonuje zadania i odpisuje w przeglądarce, na Telegramie i na WhatsAppie." },
      { q: "Czy Nod jest darmowy?", a: "Tak. Nod jest darmowy i ma otwarty kod na licencji Apache 2.0. Płacisz tylko za serwer i za model AI według zużycia tokenów." },
      { q: "Ile kosztuje serwer na Hetznerze?", a: "Hetzner rozlicza serwer godzinowo, a cena w podsumowaniu to maksimum za miesiąc. Nod potrzebuje co najmniej 8 GB RAM. Cena zależy od typu serwera i lokalizacji. Serwer testowy usuwasz jednym kliknięciem i opłaty się kończą." },
      { q: "Jaki model AI wybrać?", a: "Najprościej przez OpenRouter, gdzie masz prawie wszystkie modele w jednym miejscu. Tani i dobry na start jest DeepSeek V4.1 Flash. DeepSeeka możesz też podłączyć bezpośrednio kluczem API." },
      { q: "Czy muszę znać się na serwerach?", a: "Nie. Tutorial pokazuje wszystko od założenia konta. Komendy kopiujesz i wklejasz po kolei, a my wysyłamy je mailem, żeby niczego nie przepisywać z filmu." },
      { q: "Czy Nod działa, gdy wyłączę komputer?", a: "Tak, bo działa na serwerze, a nie na Twoim komputerze. Tunel SSH jest potrzebny tylko do panelu w przeglądarce. Na Telegramie i WhatsAppie piszesz do Noda bez niego." },
      { q: "Czy moje dane są bezpieczne?", a: "Pliki, pamięć i zapisane logowania zostają na Twoim serwerze. Dostawca modelu dostaje to, czego wymaga dane zadanie, a połączenia z aplikacjami idą przez Composio. Nod pyta o zgodę przed zmianami i wysyłką." },
    ],
    disclaimer: "Nod jest projektem n8n GmbH. MazoLogic nie jest powiązany z n8n ani z Hetznerem.",
    footerPrivacy: "Prywatność",
    footerContact: "Kontakt",
    switchLabel: "Język",
  },

  en: {
    metaTitle: "Nod by n8n: a personal AI agent on your own server. Step-by-step install",
    metaDesc:
      "Nod is a free, open-source personal AI agent by n8n. Run it on a Hetzner server with a few commands, connect OpenRouter or DeepSeek, Telegram and WhatsApp. We email you the commands from the tutorial.",
    ogAlt: "Nod on your own server: commands from the tutorial",
    eyebrow: "Tutorial · Kris AI Praktycznie",
    h1a: "Nod: a personal AI agent",
    h1b: "on your own server",
    lead:
      "Free and open source. It runs on your server, with the model you choose. You pay only for the server and the tokens. Talk to it on Telegram or WhatsApp, voice notes included.",
    facts: ["Apache 2.0 licence", "1,700+ apps via Composio", "Telegram and WhatsApp", "Voice notes both ways"],
    form: {
      title: "The tutorial commands, by email",
      sub: "Every command in order, ready to paste. In the email body and as a .txt file, in English and Polish.",
      label: "Your email",
      placeholder: "you@example.com",
      submit: "Send me the commands",
      sending: "Sending…",
      okTitle: "Sent",
      okText: "Check your inbox. If the email is not there within a few minutes, look in spam or the Promotions tab.",
      errEmail: "Enter a valid email address.",
      errCaptcha: "Confirm you are not a bot and try again.",
      errWidget: "The bot check did not load. Refresh the page or briefly turn off blockers in your browser.",
      errServer: "Sending failed. Try again in a moment or write to info@mazologic.com.",
      consent:
        "By sending this form you agree that MazoLogic stores your address and sends occasional emails about Nod and automation. Unsubscribe with one click.",
      privacy: "Privacy policy",
    },
    benefitsEyebrow: "Why Nod",
    benefitsH: "Your agent, your server, your model",
    benefits: [
      { h: "Free and open source", p: "Nod by n8n is open source under the Apache 2.0 licence. There is no subscription for the tool itself." },
      { h: "Your own server", p: "Email, memory and saved logins stay on your server. Turn your computer off and Nod keeps running." },
      { h: "Your own AI model", p: "OpenRouter, DeepSeek, Gemini, Claude, ChatGPT and 20+ other providers. Switch models in settings with one click." },
      { h: "Pay for the server and tokens", p: "The server is billed by the hour and the model by usage. With a cheap model such as DeepSeek, costs stay really low." },
      { h: "1,700+ apps", p: "Through Composio you connect Gmail, Calendar, Drive, Sheets, Airtable and hundreds more. Plus MCP servers and your existing automations." },
      { h: "Telegram and WhatsApp", p: "Message Nod where you already chat. Connecting takes a QR code and a few clicks." },
      { h: "Voice notes both ways", p: "Record a voice note, Nod understands it and can reply with a voice: automatic, from OpenRouter or from ElevenLabs." },
      { h: "Asks before it acts", p: "Before it changes or sends anything, Nod asks for your OK. Trust rules are checked by the server, not by the model." },
    ],
    howEyebrow: "Install at a glance",
    howH: "From zero to a chat on Telegram",
    howLead: "No prior server experience needed. The full command list arrives by email.",
    howTotalTime: "PT45M",
    how: [
      { h: "A server on Hetzner", p: "Create an account, then a server in the console with Ubuntu 24.04 and at least 8 GB RAM. Billing is hourly." },
      { h: "An SSH key", p: "On your computer (Terminal on Mac, PowerShell on Windows) generate a key and paste its public part into Hetzner." },
      { h: "A few commands on the server", p: "Log in over SSH and paste in order: Docker, firewall, Nod from GitHub, setup and start." },
      { h: "Tunnel and first login", p: "In a second terminal window open a tunnel, go to localhost:4310 and log in with the token from the server." },
      { h: "Model: OpenRouter or DeepSeek", p: "Sign in to OpenRouter or paste a DeepSeek API key. A cheap, good choice to start: DeepSeek V4.1 Flash." },
      { h: "Telegram, WhatsApp and voice", p: "Scan the QR codes in the Channels tab and turn on voice replies in the voice settings." },
    ],
    howCta: "Send me the commands",
    videoH: "The full tutorial on YouTube",
    videoP: "Two parts: the server install, then the model, Telegram, WhatsApp and apps.",
    videoCta: "Watch on YouTube",
    videoPlay: "Play video",
    faqEyebrow: "FAQ",
    faqH: "Common questions",
    faq: [
      { q: "What is Nod?", a: "Nod is a personal AI agent by n8n. It connects to your email, calendar and apps, does tasks and replies in the browser, on Telegram and on WhatsApp." },
      { q: "Is Nod free?", a: "Yes. Nod is free and open source under the Apache 2.0 licence. You pay only for the server and for the AI model by token usage." },
      { q: "How much does a Hetzner server cost?", a: "Hetzner bills servers by the hour, and the price in the summary is the monthly maximum. Nod needs at least 8 GB RAM. The price depends on the server type and location. Delete a test server with one click and billing stops." },
      { q: "Which AI model should I pick?", a: "OpenRouter is the simplest, with nearly every model in one place. DeepSeek V4.1 Flash is cheap and good to start with. You can also connect DeepSeek directly with an API key." },
      { q: "Do I need server experience?", a: "No. The tutorial shows everything from creating the account. You copy and paste the commands in order, and we email them so you do not have to type them from the video." },
      { q: "Does Nod work when my computer is off?", a: "Yes, because it runs on the server, not on your computer. The SSH tunnel is only needed for the browser panel. On Telegram and WhatsApp you message Nod without it." },
      { q: "Is my data safe?", a: "Files, memory and saved logins stay on your server. The model provider gets what each task needs, and app connections go through Composio. Nod asks before it changes or sends anything." },
    ],
    disclaimer: "Nod is a project of n8n GmbH. MazoLogic is not affiliated with n8n or Hetzner.",
    footerPrivacy: "Privacy",
    footerContact: "Contact",
    switchLabel: "Language",
  },
};
