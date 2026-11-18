"use client";

import { useEffect, useRef, useState } from "react";
import type { NodLang } from "./commands";
import type { NodCopy } from "./content";

// Klucz testowy Cloudflare (zawsze przechodzi) tylko jako zapas na podglądzie; produkcja bierze klucz z env.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject()));
    s.addEventListener("error", () => reject());
  });
}

type State = "idle" | "sending" | "ok" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function NodForm({ lang, t }: { lang: NodLang; t: NodCopy["form"] }) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [err, setErr] = useState("");
  const [widgetErr, setWidgetErr] = useState("");

  useEffect(() => {
    let alive = true;
    loadTurnstile().then(ts => {
      if (!alive || !box.current?.isConnected || widget.current) return;
      widget.current = ts.render(box.current, {
        sitekey: SITE_KEY,
        action: "nod_commands",
        language: lang,
        theme: "auto",
        size: "flexible",
        callback: (tok: string) => { setToken(tok); setWidgetErr(""); },
        "expired-callback": () => setToken(""),
        "timeout-callback": () => setToken(""),
        // Kod błędu widać pod widżetem, żeby dało się go zgłosić bez otwierania konsoli.
        "error-callback": (code: string) => { setToken(""); setWidgetErr(String(code || "?")); console.warn("turnstile error", code); },
        "unsupported-callback": () => setWidgetErr("unsupported"),
      });
    }).catch(() => setWidgetErr("script"));
    return () => {
      alive = false;
      try { if (widget.current && window.turnstile) window.turnstile.remove(widget.current); } catch { /* już usunięty */ }
      widget.current = null;
    };
  }, [lang]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const addr = email.trim();
    if (!EMAIL_RE.test(addr)) return setErr(t.errEmail);
    if (!token) return setErr(t.errCaptcha);
    setState("sending");
    try {
      const res = await fetch("/api/nod-commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr, lang, token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) return setState("ok");
      setState("error");
      setErr(data.error === "captcha" ? t.errCaptcha : data.error === "email" ? t.errEmail : t.errServer);
    } catch {
      setState("error");
      setErr(t.errServer);
    }
    // Token Turnstile jest jednorazowy: po nieudanej próbie nowy.
    setToken("");
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
  }

  if (state === "ok") {
    return (
      <div className="nod-form nod-form-ok" role="status">
        <span className="nod-ok-mark" aria-hidden="true">✓</span>
        <h2>{t.okTitle}</h2>
        <p>{t.okText}</p>
      </div>
    );
  }

  return (
    <form className="nod-form" onSubmit={submit} noValidate>
      <h2>{t.title}</h2>
      <p className="nod-form-sub">{t.sub}</p>
      <label htmlFor="nod-email" className="nod-label">{t.label}</label>
      <input
        id="nod-email"
        className="nod-input"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        required
        placeholder={t.placeholder}
        value={email}
        onChange={e => setEmail(e.target.value)}
        aria-invalid={err === t.errEmail || undefined}
        aria-describedby={err ? "nod-err" : undefined}
      />
      <div ref={box} className="nod-turnstile" />
      {widgetErr && !token && <p className="nod-err" role="alert">{t.errWidget} ({widgetErr})</p>}
      <button className="btn btn-primary btn-lg nod-submit" type="submit" disabled={state === "sending"}>
        <span>{state === "sending" ? t.sending : t.submit}</span>
        {state !== "sending" && <span className="arrow">→</span>}
      </button>
      {err && <p id="nod-err" className="nod-err" role="alert">{err}</p>}
      <p className="nod-consent">
        {t.consent} <a href="/privacy">{t.privacy}</a>.
      </p>
    </form>
  );
}
