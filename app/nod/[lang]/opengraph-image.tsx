import { ImageResponse } from "next/og";
import { COPY } from "../content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nod — MazoLogic";

export function generateStaticParams() {
  return [{ lang: "pl" }, { lang: "en" }];
}

// Kolory = tokeny DS (motyw ciemny): bg-canvas, fg-1, fg-3, fg-accent, border-soft. ImageResponse nie czyta zmiennych CSS.
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = COPY[lang === "pl" ? "pl" : "en"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 80, background: "#09090b", color: "#fafafa", fontFamily: "sans-serif",
          backgroundImage: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(27,63,95,0.55), transparent 70%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, letterSpacing: -1 }}>
          <span style={{ fontWeight: 900 }}>MAZO</span>
          <span style={{ fontWeight: 300, color: "#8a8a94" }}>LOGIC</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{t.h1a}</div>
          <div style={{ fontSize: 76, fontWeight: 300, letterSpacing: -2, lineHeight: 1.05, color: "#8a8a94" }}>{t.h1b}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {t.facts.map(f => (
            <div key={f} style={{ display: "flex", fontSize: 24, color: "#6fa8d4", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 999, padding: "8px 20px" }}>{f}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
