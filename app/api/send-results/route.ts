import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ResultsPDF } from "../../audit/ResultsPDF";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const FROM_EMAIL   = "info@mazologic.com";
const FROM_NAME    = "MazoLogic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, lang, score, tier, tierColor, desc, insights, ctaLabel, ctaSub } = body;

    if (!email?.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      createElement(ResultsPDF, { lang, score, tier, tierColor, desc, insights, ctaLabel, ctaSub })
    );

    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    const subjectEN = `Your AI Readiness Report — ${tier}`;
    const subjectPL = `Twój Raport Gotowości AI — ${tier}`;
    const subject   = lang === "pl" ? subjectPL : subjectEN;

    const htmlBody = lang === "pl"
      ? buildHtmlPL({ name, score, tier, tierColor, desc, insights, ctaLabel, ctaSub })
      : buildHtmlEN({ name, score, tier, tierColor, desc, insights, ctaLabel, ctaSub });

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender:  { name: FROM_NAME, email: FROM_EMAIL },
        to:      [{ email, name: name || email }],
        subject,
        htmlContent: htmlBody,
        attachment: [
          {
            name:    lang === "pl" ? "raport-gotowosci-ai.pdf" : "ai-readiness-report.pdf",
            content: pdfBase64,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Brevo error:", errText);
      return NextResponse.json({ error: "Email send failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-results error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── HTML email templates ──────────────────────────────────────────────────

interface TemplateProps {
  name: string;
  score: number;
  tier: string;
  tierColor: string;
  desc: string;
  insights: { icon: string; h: string; p: string }[];
  ctaLabel: string;
  ctaSub: string;
}

function buildHtmlEN({ name, score, tier, tierColor, desc, insights, ctaLabel, ctaSub }: TemplateProps) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Inter,Arial,sans-serif;color:#fafafa;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,serif;font-size:22px;font-weight:900;letter-spacing:-0.03em;color:#fafafa;"><b>MAZO</b><span style="font-weight:300">LOGIC</span></span>
    </div>
    <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin:0 0 8px;color:#fafafa;">
      Your AI Readiness Report
    </h1>
    <p style="font-size:15px;color:#8a8a94;margin:0 0 32px;">
      Hi ${name || "there"} — here are your results.
    </p>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px;text-align:center;">
      <div style="font-size:52px;font-weight:900;color:${tierColor};line-height:1;">${score}</div>
      <div style="font-size:13px;color:#52525b;margin-bottom:12px;">/20</div>
      <div style="display:inline-block;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:999px;padding:6px 16px;font-size:13px;color:${tierColor};font-weight:600;">${tier}</div>
      <p style="font-size:14px;color:#c4c4cb;line-height:1.6;margin:16px 0 0;">${desc}</p>
    </div>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#52525b;margin:0 0 20px;">Your Personalised Insights</h3>
      ${insights.map(ins => `
      <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-start;">
        <span style="font-size:20px;flex-shrink:0;">${ins.icon}</span>
        <div>
          <div style="font-size:14px;font-weight:600;color:#fafafa;margin-bottom:4px;">${ins.h}</div>
          <div style="font-size:13px;color:#8a8a94;line-height:1.55;">${ins.p}</div>
        </div>
      </div>`).join("")}
    </div>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;">
      <h3 style="font-size:18px;font-weight:700;color:#fafafa;margin:0 0 8px;">${ctaLabel}</h3>
      <p style="font-size:14px;color:#8a8a94;margin:0 0 20px;">${ctaSub}</p>
      <a href="https://calendar.app.google/ok4xj5QtxsRTCCoZ8" style="display:inline-block;background:#1B3F5F;color:#fafafa;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">Book a call →</a>
    </div>

    <p style="font-size:12px;color:#3f3f46;text-align:center;">
      Your full report is attached as a PDF.<br/>
      © 2026 MazoLogic · <a href="https://mazologic.com" style="color:#3E6E99;">mazologic.com</a>
    </p>
  </div>
</body>
</html>`;
}

function buildHtmlPL({ name, score, tier, tierColor, desc, insights, ctaLabel, ctaSub }: TemplateProps) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Inter,Arial,sans-serif;color:#fafafa;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,serif;font-size:22px;font-weight:900;letter-spacing:-0.03em;color:#fafafa;"><b>MAZO</b><span style="font-weight:300">LOGIC</span></span>
    </div>
    <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;margin:0 0 8px;color:#fafafa;">
      Twój Raport Gotowości AI
    </h1>
    <p style="font-size:15px;color:#8a8a94;margin:0 0 32px;">
      Cześć ${name || ""} — oto Twoje wyniki.
    </p>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px;text-align:center;">
      <div style="font-size:52px;font-weight:900;color:${tierColor};line-height:1;">${score}</div>
      <div style="font-size:13px;color:#52525b;margin-bottom:12px;">/20</div>
      <div style="display:inline-block;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:999px;padding:6px 16px;font-size:13px;color:${tierColor};font-weight:600;">${tier}</div>
      <p style="font-size:14px;color:#c4c4cb;line-height:1.6;margin:16px 0 0;">${desc}</p>
    </div>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:20px;">
      <h3 style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#52525b;margin:0 0 20px;">Twoje Spersonalizowane Spostrzeżenia</h3>
      ${insights.map(ins => `
      <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-start;">
        <span style="font-size:20px;flex-shrink:0;">${ins.icon}</span>
        <div>
          <div style="font-size:14px;font-weight:600;color:#fafafa;margin-bottom:4px;">${ins.h}</div>
          <div style="font-size:13px;color:#8a8a94;line-height:1.55;">${ins.p}</div>
        </div>
      </div>`).join("")}
    </div>

    <div style="background:#1c1c21;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;margin-bottom:32px;text-align:center;">
      <h3 style="font-size:18px;font-weight:700;color:#fafafa;margin:0 0 8px;">${ctaLabel}</h3>
      <p style="font-size:14px;color:#8a8a94;margin:0 0 20px;">${ctaSub}</p>
      <a href="https://calendar.app.google/ok4xj5QtxsRTCCoZ8" style="display:inline-block;background:#1B3F5F;color:#fafafa;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">Umów rozmowę →</a>
    </div>

    <p style="font-size:12px;color:#3f3f46;text-align:center;">
      Pełny raport dołączony jako PDF.<br/>
      © 2026 MazoLogic · <a href="https://mazologic.com" style="color:#3E6E99;">mazologic.com</a>
    </p>
  </div>
</body>
</html>`;
}
