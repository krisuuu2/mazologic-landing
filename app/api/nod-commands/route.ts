import { NextRequest, NextResponse } from "next/server";
import { GUIDE, TXT_NAME, guideHtml, guideText, type NodLang } from "../../nod/commands";

// POST { email, lang, token } → weryfikacja Turnstile → mail z komendami (Brevo) → kontakt na liście Noda (Brevo).
//
// Env:
//   BREVO_API_KEY           wymagany
//   TURNSTILE_SECRET_KEY    wymagany na produkcji; poza produkcją zapasowo klucz testowy Cloudflare
//   BREVO_NOD_LIST_ID       id listy „Nod” w Brevo; bez niego kontakt nie jest zapisywany
//   BREVO_NOD_LANG_ATTR     nazwa atrybutu z językiem (domyślnie NOD_LANG)

const FROM = { name: "MazoLogic", email: "info@mazologic.com" };
const TEST_SECRET = "1x0000000000000000000000000000000AA";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isProd = () => process.env.VERCEL_ENV === "production";

function turnstileSecret(): string | null {
  return process.env.TURNSTILE_SECRET_KEY || (isProd() ? null : TEST_SECRET);
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = turnstileSecret();
  if (!secret) {
    console.error("nod-commands: TURNSTILE_SECRET_KEY missing");
    return false;
  }
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean; action?: string; "error-codes"?: string[] };
  if (!data.success) {
    console.warn("nod-commands: turnstile rejected", data["error-codes"]);
    return false;
  }
  // Klucze testowe zwracają pustą akcję; prawdziwy widżet musi mieć naszą.
  if (secret !== TEST_SECRET && data.action !== "nod_commands") return false;
  return true;
}

const b64 = (s: string) => Buffer.from("﻿" + s, "utf8").toString("base64");

export async function POST(req: NextRequest) {
  let body: { email?: unknown; lang?: unknown; token?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const lang: NodLang = body.lang === "pl" ? "pl" : "en";
  const token = typeof body.token === "string" ? body.token : "";

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "email" }, { status: 400 });
  }
  if (!token || token.length > 2048) {
    return NextResponse.json({ error: "captcha" }, { status: 400 });
  }

  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (!(await verifyTurnstile(token, ip))) {
    return NextResponse.json({ error: "captcha" }, { status: 403 });
  }

  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.error("nod-commands: BREVO_API_KEY missing");
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  const brevo = (path: string, payload: unknown) =>
    fetch(`https://api.brevo.com/v3/${path}`, {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });

  // Załączniki: najpierw w języku strony, potem drugi.
  const order: NodLang[] = lang === "pl" ? ["pl", "en"] : ["en", "pl"];
  const sent = await brevo("smtp/email", {
    sender: FROM,
    to: [{ email }],
    replyTo: FROM,
    subject: GUIDE[lang].title,
    htmlContent: guideHtml(lang),
    textContent: guideText(lang),
    attachment: order.map(l => ({ name: TXT_NAME[l], content: b64(guideText(l)) })),
    tags: ["nod-commands", `nod-${lang}`],
  });
  if (!sent.ok) {
    console.error("nod-commands: brevo send failed", sent.status, await sent.text());
    return NextResponse.json({ error: "server" }, { status: 502 });
  }

  const listId = Number(process.env.BREVO_NOD_LIST_ID);
  if (listId > 0) {
    const attr = process.env.BREVO_NOD_LANG_ATTR || "NOD_LANG";
    const saved = await brevo("contacts", {
      email,
      updateEnabled: true,
      listIds: [listId],
      attributes: { [attr]: lang },
    });
    if (!saved.ok) console.error("nod-commands: brevo contact failed", saved.status, await saved.text());
  }

  return NextResponse.json({ ok: true });
}
