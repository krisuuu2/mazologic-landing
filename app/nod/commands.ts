// Komendy z tutoriala „Nod na Hetznerze” (film2/edl.py CMDS + kroki z film3).
// Tylko placeholdery: żadnych prawdziwych IP ani tokenów.

export type NodLang = "pl" | "en";

type Block =
  | { kind: "note"; text: string }
  | { kind: "cmd"; cmd: string; note?: string };

type Step = { title: string; blocks: Block[] };
type Part = { title: string; steps: Step[] };

export type Guide = { title: string; intro: string[]; parts: Part[]; outro: string[] };

const n = (text: string): Block => ({ kind: "note", text });
const c = (cmd: string, note?: string): Block => ({ kind: "cmd", cmd, note });

export const GUIDE: Record<NodLang, Guide> = {
  pl: {
    title: "Nod na Hetznerze: komendy z tutoriala",
    intro: [
      "Kris AI Praktycznie · https://mazologic.com/nod",
      "Wklejaj komendy po kolei, każdą zatwierdzasz Enterem.",
      "W PowerShellu najpewniej wkleja się prawym przyciskiem myszy.",
      "Linie zaczynające się od # to komentarze. Ich nie wklejasz.",
      "<IP_SERWERA> zamień na publiczny adres IP serwera z konsoli Hetznera (bez nawiasów < >).",
    ],
    parts: [
      {
        title: "CZĘŚĆ 1: serwer i instalacja Noda",
        steps: [
          {
            title: "Krok 1. Klucz SSH na Twoim komputerze (Mac: Terminal, Windows: PowerShell)",
            blocks: [
              c('ssh-keygen -t ed25519 -C "my-laptop"', 'Zamiast "my-laptop" wpisz dowolną nazwę komputera. Potem jeszcze 2× Enter.'),
              c("cat ~/.ssh/id_ed25519.pub", "Wyświetla klucz publiczny. Skopiuj CAŁY wiersz, od ssh-ed25519 do końca."),
            ],
          },
          {
            title: "Krok 2. Serwer w konsoli Hetznera",
            blocks: [
              n("Console → projekt (domyślny albo + New project) → Create Server."),
              n("Typ serwera z co najmniej 8 GB RAM (np. CX33, a gdy niedostępny: inny z 8 GB, np. Regular Performance)."),
              n("System: Ubuntu 24.04. Sieć zostaw bez zmian."),
              n("SSH keys → Add SSH key → wklej klucz publiczny z kroku 1."),
              n("Nazwa serwera, np. nod → Create & Buy now. Rozliczenie jest godzinowe, cena w podsumowaniu to maksimum za miesiąc."),
              n("Skopiuj publiczny adres IP serwera z listy serwerów."),
            ],
          },
          {
            title: "Krok 3. Logowanie na serwer",
            blocks: [
              c("ssh root@<IP_SERWERA>", "Na pytanie, czy ufasz serwerowi, wpisz yes i Enter. Napis root@... = jesteś na serwerze."),
            ],
          },
          {
            title: "Krok 4. Instalacja (wszystko na serwerze)",
            blocks: [
              c("apt-get update && apt-get install -y docker.io docker-compose-v2 git openssl", "Docker, Git i OpenSSL. Chwilę potrwa."),
              c("docker --version && docker compose version", "Sprawdzenie, czy Docker się zainstalował."),
              c("ufw allow OpenSSH && ufw --force enable", "Zapora: zostaje otwarte tylko SSH."),
              c("git clone https://github.com/n8n-io/nod.git /opt/nod", "Pobiera kod Noda z GitHuba."),
              c("cd /opt/nod/deployment/self-host"),
              c("sh setup.sh", "Tworzy plik .env z sekretami: token, klucz do sejfu i hasło do bazy."),
              c("docker compose up -d --build --wait", "Budowa i start Noda. To trwa kilka minut."),
              c("grep NOD_AUTH_TOKEN .env", "Token = hasło do Noda. Skopiuj go (bez NOD_AUTH_TOKEN=), zapisz w notatniku i nikomu nie pokazuj."),
            ],
          },
          {
            title: "Krok 5. Tunel: DRUGIE okno terminala na Twoim komputerze",
            blocks: [
              c("ssh -N -L 4310:127.0.0.1:4310 root@<IP_SERWERA>", "Nic się nie wyświetla i tak ma być. Tego okna nie zamykaj, tylko je zminimalizuj."),
              n("W przeglądarce otwórz: http://localhost:4310"),
              n("Wklej token z kroku 4 → Connect → Get Started."),
            ],
          },
          {
            title: "Krok 6. Pierwsze uruchomienie w przeglądarce",
            blocks: [
              n("Poczta: Gmail albo Outlook. Logowanie przechodzi przez Composio, jedną bramkę do ponad 1700 aplikacji."),
              n("Krótki onboarding: praca, życie prywatne albo jedno i drugie. Możesz pominąć (Not now)."),
              n("Model AI: OpenRouter → Sign in to OpenRouter (albo klucz API: openrouter.ai → Keys → Create key → wklej → Connect)."),
              n("Po doładowaniu OpenRoutera (np. 5 USD) wybierz tani model, np. DeepSeek V4.1 Flash. Darmowe modele bywają niedostępne w Polsce."),
              n("Zamiast OpenRoutera możesz podłączyć DeepSeek bezpośrednio: Settings → Models → Add connection → DeepSeek → klucz API z platform.deepseek.com."),
              n("Start Chatting → napisz „Cześć Nod”."),
            ],
          },
        ],
      },
      {
        title: "CZĘŚĆ 2: model, Telegram, WhatsApp, głosówki i aplikacje",
        steps: [
          {
            title: "Krok 7. Zmiana modelu",
            blocks: [
              n("Settings (lewy dolny róg) → Models → wybierz model. Pozostałe ustawienia możesz zostawić bez zmian."),
            ],
          },
          {
            title: "Krok 8. Telegram",
            blocks: [
              n("Channels → Telegram → Connect. Zeskanuj kod QR aparatem telefonu, otworzy się Telegram z BotFatherem."),
              n("Uwaga na podróbki: tylko oryginalny @BotFather (zweryfikowany, miliony użytkowników)."),
              n("Uruchom bota → /newbot → nazwa (np. Nod) → username, który jest wolny i kończy się na „bot”."),
              n("BotFather poda token bota. Token = hasło, nikomu go nie pokazuj."),
              n("W Nodzie: I have my token → wklej token → Connect bot."),
              n("Zeskanuj nowy kod QR → kliknij link na telefonie → Connect account → napisz do bota „Cześć Nod”."),
            ],
          },
          {
            title: "Krok 9. WhatsApp",
            blocks: [
              n("Channels → WhatsApp → Connect. Bezpieczniej z osobnym numerem; z własnym klikasz „Rozumiem”."),
              n("Telefon: WhatsApp → ⋮ (trzy kropki) → Połączone urządzenia → Połącz urządzenie → zeskanuj kod QR."),
              n("Done → nazwij urządzenie (np. Nod)."),
              n("Do Noda piszesz na czacie z samym sobą (Twój własny numer)."),
            ],
          },
          {
            title: "Krok 10. Głosówki w obie strony",
            blocks: [
              n("Settings → Voice & audio. Odpowiedź głosem: After audio (na głosówkę odpowiada głosówką) albo Always."),
              n("Zgoda na mikrofon w przeglądarce albo w telefonie."),
              n("Głos Noda: automatyczny (nic nie trzeba robić), z OpenRoutera albo z ElevenLabs (wklejasz klucz API)."),
            ],
          },
          {
            title: "Krok 11. Aplikacje",
            blocks: [
              n("Apps → wyszukaj aplikację. Google Super podłącza cały pakiet Google (Gmail, Dysk, Dokumenty, Arkusze, Kalendarz) jednym logowaniem."),
              n("Przy Airtable możesz dać dostęp do wszystkich baz albo tylko do jednej → Grant access."),
              n("Nod pyta o zgodę, zanim coś zmieni albo wyśle. To ustawienie można zmienić."),
            ],
          },
        ],
      },
      {
        title: "GDY COŚ NIE DZIAŁA (na serwerze)",
        steps: [
          {
            title: "Logi i restart",
            blocks: [
              c("cd /opt/nod/deployment/self-host"),
              c("docker compose ps", "Czy wszystkie kontenery działają."),
              c("docker compose logs --tail 100", "Ostatnie logi."),
              c("docker compose restart", "Restart Noda."),
            ],
          },
        ],
      },
    ],
    outro: [
      "Serwer testowy usuwasz w konsoli Hetznera (Delete), wtedy przestaje się naliczać.",
      "Dokumentacja Noda: https://nod.n8n.io/docs/",
      "Pytania o wdrożenia w firmie: info@mazologic.com",
    ],
  },

  en: {
    title: "Nod on Hetzner: commands from the tutorial",
    intro: [
      "Kris AI Praktycznie · https://mazologic.com/nod",
      "Paste the commands one by one and press Enter after each.",
      "In PowerShell, right-click is the most reliable way to paste.",
      "Lines starting with # are comments. Do not paste them.",
      "Replace <SERVER_IP> with your server's public IP address from the Hetzner console (without the < >).",
    ],
    parts: [
      {
        title: "PART 1: the server and the Nod install",
        steps: [
          {
            title: "Step 1. SSH key on your computer (Mac: Terminal, Windows: PowerShell)",
            blocks: [
              c('ssh-keygen -t ed25519 -C "my-laptop"', 'Use any name for your computer instead of "my-laptop". Then press Enter twice more.'),
              c("cat ~/.ssh/id_ed25519.pub", "Prints your public key. Copy the WHOLE line, from ssh-ed25519 to the end."),
            ],
          },
          {
            title: "Step 2. The server in the Hetzner console",
            blocks: [
              n("Console → project (the default one or + New project) → Create Server."),
              n("A server type with at least 8 GB RAM (e.g. CX33, or if it is unavailable, another 8 GB type such as Regular Performance)."),
              n("Image: Ubuntu 24.04. Leave networking as it is."),
              n("SSH keys → Add SSH key → paste the public key from step 1."),
              n("Server name, e.g. nod → Create & Buy now. Billing is hourly; the price in the summary is the monthly maximum."),
              n("Copy the server's public IP address from the server list."),
            ],
          },
          {
            title: "Step 3. Log in to the server",
            blocks: [
              c("ssh root@<SERVER_IP>", "When asked whether you trust the host, type yes and press Enter. root@... means you are on the server."),
            ],
          },
          {
            title: "Step 4. Install (everything on the server)",
            blocks: [
              c("apt-get update && apt-get install -y docker.io docker-compose-v2 git openssl", "Docker, Git and OpenSSL. Takes a moment."),
              c("docker --version && docker compose version", "Checks that Docker is installed."),
              c("ufw allow OpenSSH && ufw --force enable", "Firewall: only SSH stays open."),
              c("git clone https://github.com/n8n-io/nod.git /opt/nod", "Downloads the Nod code from GitHub."),
              c("cd /opt/nod/deployment/self-host"),
              c("sh setup.sh", "Creates the .env file with secrets: token, vault key and database password."),
              c("docker compose up -d --build --wait", "Builds and starts Nod. This takes a few minutes."),
              c("grep NOD_AUTH_TOKEN .env", "The token is your Nod password. Copy it (without NOD_AUTH_TOKEN=), keep it in a note and never show it to anyone."),
            ],
          },
          {
            title: "Step 5. Tunnel: a SECOND terminal window on your computer",
            blocks: [
              c("ssh -N -L 4310:127.0.0.1:4310 root@<SERVER_IP>", "Nothing is printed, that is expected. Do not close this window, just minimise it."),
              n("Open in your browser: http://localhost:4310"),
              n("Paste the token from step 4 → Connect → Get Started."),
            ],
          },
          {
            title: "Step 6. First run in the browser",
            blocks: [
              n("Email: Gmail or Outlook. Sign-in goes through Composio, one gateway to 1,700+ apps."),
              n("A short onboarding: work, personal life or both. You can skip it (Not now)."),
              n("AI model: OpenRouter → Sign in to OpenRouter (or an API key: openrouter.ai → Keys → Create key → paste → Connect)."),
              n("After topping up OpenRouter (e.g. $5), pick a cheap model such as DeepSeek V4.1 Flash. Free models are sometimes unavailable in some regions."),
              n("Instead of OpenRouter you can connect DeepSeek directly: Settings → Models → Add connection → DeepSeek → API key from platform.deepseek.com."),
              n("Start Chatting → say \"Hi Nod\"."),
            ],
          },
        ],
      },
      {
        title: "PART 2: model, Telegram, WhatsApp, voice notes and apps",
        steps: [
          {
            title: "Step 7. Change the model",
            blocks: [
              n("Settings (bottom left) → Models → choose a model. The other settings can stay as they are."),
            ],
          },
          {
            title: "Step 8. Telegram",
            blocks: [
              n("Channels → Telegram → Connect. Scan the QR code with your phone camera; Telegram opens with BotFather."),
              n("Watch out for fakes: only the original @BotFather (verified, millions of users)."),
              n("Start the bot → /newbot → a name (e.g. Nod) → a username that is free and ends in \"bot\"."),
              n("BotFather gives you a bot token. The token is a password; never show it to anyone."),
              n("In Nod: I have my token → paste the token → Connect bot."),
              n("Scan the new QR code → tap the link on your phone → Connect account → send the bot \"Hi Nod\"."),
            ],
          },
          {
            title: "Step 9. WhatsApp",
            blocks: [
              n("Channels → WhatsApp → Connect. A separate number is safer; with your own number, confirm the notice."),
              n("Phone: WhatsApp → ⋮ (three dots) → Linked devices → Link a device → scan the QR code."),
              n("Done → name the device (e.g. Nod)."),
              n("You talk to Nod in the chat with yourself (your own number)."),
            ],
          },
          {
            title: "Step 10. Voice notes both ways",
            blocks: [
              n("Settings → Voice & audio. Reply with voice: After audio (a voice note gets a voice reply) or Always."),
              n("Allow the microphone in your browser or on your phone."),
              n("Nod's voice: automatic (nothing to set up), from OpenRouter or from ElevenLabs (paste an API key)."),
            ],
          },
          {
            title: "Step 11. Apps",
            blocks: [
              n("Apps → search for an app. Google Super connects the whole Google suite (Gmail, Drive, Docs, Sheets, Calendar) with one sign-in."),
              n("With Airtable you can grant access to all bases or just one → Grant access."),
              n("Nod asks before it changes or sends anything. You can change this setting."),
            ],
          },
        ],
      },
      {
        title: "IF SOMETHING DOES NOT WORK (on the server)",
        steps: [
          {
            title: "Logs and restart",
            blocks: [
              c("cd /opt/nod/deployment/self-host"),
              c("docker compose ps", "Are all containers running?"),
              c("docker compose logs --tail 100", "The latest logs."),
              c("docker compose restart", "Restarts Nod."),
            ],
          },
        ],
      },
    ],
    outro: [
      "Delete a test server in the Hetzner console (Delete) so it stops billing.",
      "Nod documentation: https://nod.n8n.io/docs/",
      "Questions about implementations in your company: info@mazologic.com",
    ],
  },
};

export const TXT_NAME: Record<NodLang, string> = {
  pl: "nod-komendy-pl.txt",
  en: "nod-commands-en.txt",
};

const RULE = "=".repeat(64);

export function guideText(lang: NodLang): string {
  const g = GUIDE[lang];
  const out: string[] = [g.title.toUpperCase(), RULE, ...g.intro, ""];
  for (const part of g.parts) {
    out.push(RULE, part.title, RULE, "");
    for (const step of part.steps) {
      out.push(`--- ${step.title} ---`);
      for (const b of step.blocks) {
        if (b.kind === "note") out.push(`# ${b.text}`);
        else {
          if (b.note) out.push(`# ${b.note}`);
          out.push(b.cmd);
        }
      }
      out.push("");
    }
  }
  out.push(RULE, ...g.outro, "");
  // CRLF: Notatnik na starszym Windowsie też pokaże to poprawnie.
  return out.join("\r\n");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Mail: kolory wpisane na sztywno, bo klienci poczty nie znają zmiennych CSS.
// Wartości = tokeny DS (tokens.css, motyw ciemny): bg-canvas, bg-raised, fg-1/2/3, accent, fg-accent, border-soft, r-lg.
const M = {
  canvas: "#09090b", raised: "#1c1c21", fg1: "#fafafa", fg2: "#c4c4cb", fg3: "#8a8a94",
  accent: "#3E6E99", accentFg: "#6fa8d4", border: "rgba(255,255,255,0.10)",
  mono: "'JetBrains Mono',Menlo,Consolas,monospace", body: "Inter,Arial,sans-serif",
};

export function guideHtml(lang: NodLang): string {
  const g = GUIDE[lang];
  const other = lang === "pl" ? TXT_NAME.en : TXT_NAME.pl;
  const lead = lang === "pl"
    ? `Poniżej komplet komend z tutoriala, po kolei. Te same komendy są w załączniku <b>${TXT_NAME.pl}</b> (łatwiej kopiować), a wersja angielska w <b>${other}</b>.`
    : `Below are all the commands from the tutorial, in order. The same commands are in the attachment <b>${TXT_NAME.en}</b> (easier to copy), and the Polish version is in <b>${other}</b>.`;

  const steps = g.parts.map(part => {
    const inner = part.steps.map(step => {
      const blocks = step.blocks.map(b => {
        if (b.kind === "note") return `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:${M.fg2};">${esc(b.text)}</p>`;
        return `${b.note ? `<p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:${M.fg3};">${esc(b.note)}</p>` : ""}<pre style="margin:0 0 12px;padding:12px 16px;background:${M.canvas};border:1px solid ${M.border};border-radius:10px;font-family:${M.mono};font-size:13px;line-height:1.5;color:${M.fg1};white-space:pre-wrap;word-break:break-all;">${esc(b.cmd)}</pre>`;
      }).join("");
      return `<h3 style="margin:20px 0 8px;font-size:15px;font-weight:600;color:${M.fg1};">${esc(step.title)}</h3>${blocks}`;
    }).join("");
    return `<div style="background:${M.raised};border:1px solid ${M.border};border-radius:14px;padding:20px 24px;margin:0 0 20px;"><h2 style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${M.accentFg};">${esc(part.title)}</h2>${inner}</div>`;
  }).join("");

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:${M.canvas};font-family:${M.body};color:${M.fg1};">
<div style="max-width:640px;margin:0 auto;padding:40px 16px;">
<div style="margin-bottom:32px;font-family:Arial,Helvetica,sans-serif;font-size:20px;letter-spacing:-0.04em;"><span style="font-weight:900">MAZO</span><span style="font-weight:300;color:${M.fg3}">LOGIC</span></div>
<h1 style="font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin:0 0 12px;">${esc(g.title)}</h1>
<p style="font-size:15px;line-height:1.6;color:${M.fg2};margin:0 0 24px;">${lead}</p>
<div style="margin:0 0 24px;">${g.intro.slice(1).map(t => `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:${M.fg3};">${esc(t)}</p>`).join("")}</div>
${steps}
${g.outro.map(t => `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:${M.fg3};">${esc(t)}</p>`).join("")}
<p style="margin:32px 0 0;font-size:12px;color:${M.fg3};">MazoLogic · Mazo Media Krzysztof Łomonkiewicz · <a href="https://mazologic.com/privacy" style="color:${M.accentFg};">${lang === "pl" ? "Polityka prywatności" : "Privacy policy"}</a></p>
</div></body></html>`;
}
