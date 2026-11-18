"use client";

import type { NodLang } from "./commands";

// Zapisuje wybór (cookie dla przekierowania /nod + localStorage jak reszta strony) i przechodzi na drugą wersję.
export default function LangSwitch({ lang, label }: { lang: NodLang; label: string }) {
  const go = (l: NodLang) => {
    if (l === lang) return;
    document.cookie = `mazo-lang=${l}; path=/; max-age=31536000; samesite=lax`;
    try { localStorage.setItem("mazo-lang", l); } catch { /* prywatne okno */ }
    window.location.href = `/nod/${l}${window.location.hash}`;
  };
  return (
    <div className="toggle-group lang" role="group" aria-label={label}>
      {(["pl", "en"] as NodLang[]).map(l => (
        <a
          key={l}
          href={`/nod/${l}`}
          hrefLang={l}
          className={l === lang ? "active" : ""}
          aria-current={l === lang ? "page" : undefined}
          onClick={e => { e.preventDefault(); go(l); }}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
