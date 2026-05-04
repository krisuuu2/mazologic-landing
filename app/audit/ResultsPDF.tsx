import {
  Document, Page, Text, View, StyleSheet, Font,
} from "@react-pdf/renderer";

// ── Types ──────────────────────────────────────────────────────────────────
interface Insight { icon: string; h: string; p: string; }

interface Props {
  lang: "en" | "pl";
  score: number;
  tier: string;
  tierColor: string;
  desc: string;
  insights: Insight[];
  ctaLabel: string;
  ctaSub: string;
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: "#09090b",
    color: "#fafafa",
    fontFamily: "Helvetica",
    padding: "40 48",
    fontSize: 11,
  },
  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  logo: { fontSize: 18, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, color: "#fafafa" },
  logoLight: { fontFamily: "Helvetica", fontWeight: 300, color: "#8a8a94" },
  date: { fontSize: 9, color: "#52525b", fontFamily: "Courier" },

  // Title section
  eyebrow: { fontSize: 9, color: "#3E6E99", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Courier", marginBottom: 8 },
  title: { fontSize: 26, fontFamily: "Helvetica-Bold", letterSpacing: -0.8, lineHeight: 1.1, color: "#fafafa", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#8a8a94", marginBottom: 28 },

  // Score card
  scoreCard: { backgroundColor: "#1c1c21", borderRadius: 12, padding: "24 28", marginBottom: 16, alignItems: "center" },
  scoreNumber: { fontSize: 56, fontFamily: "Helvetica-Bold", lineHeight: 1 },
  scoreOf: { fontSize: 11, color: "#52525b", marginBottom: 10 },
  tierBadge: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 14 },
  tierBadgeBorder: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 6 },
  desc: { fontSize: 12, color: "#c4c4cb", lineHeight: 1.55, textAlign: "center", maxWidth: 380 },

  // Section
  sectionCard: { backgroundColor: "#1c1c21", borderRadius: 12, padding: "20 24", marginBottom: 16 },
  sectionTitle: { fontSize: 9, fontFamily: "Courier", color: "#52525b", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 16 },

  // Insight row
  insightRow: { flexDirection: "row", gap: 12, marginBottom: 14, alignItems: "flex-start" },
  insightBullet: { width: 4, height: 4, backgroundColor: "#3E6E99", borderRadius: 2, marginTop: 5, flexShrink: 0 },
  insightH: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#fafafa", marginBottom: 3 },
  insightP: { fontSize: 10.5, color: "#8a8a94", lineHeight: 1.5 },

  // CTA card
  ctaCard: { backgroundColor: "#1B3F5F", borderRadius: 12, padding: "24 28", marginBottom: 20, alignItems: "center" },
  ctaLabel: { fontSize: 15, fontFamily: "Helvetica-Bold", color: "#fafafa", marginBottom: 6 },
  ctaSub: { fontSize: 11, color: "rgba(255,255,255,0.65)", marginBottom: 14, textAlign: "center" },
  ctaUrl: { fontSize: 11, color: "#6fa8d4", fontFamily: "Courier" },

  // Footer
  footer: { borderTopWidth: 1, borderTopColor: "#27272a", paddingTop: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 9, color: "#52525b" },
});

// ── Component ──────────────────────────────────────────────────────────────
export function ResultsPDF({ lang, score, tier, tierColor, desc, insights, ctaLabel, ctaSub }: Props) {
  const ispl = lang === "pl";
  const now = new Date().toLocaleDateString(lang === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document
      title={ispl ? "Raport Gotowości AI — MazoLogic" : "AI Readiness Report — MazoLogic"}
      author="MazoLogic"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>MAZO<Text style={s.logoLight}>LOGIC</Text></Text>
          <Text style={s.date}>{now}</Text>
        </View>

        {/* Title */}
        <Text style={s.eyebrow}>{ispl ? "Diagnostyka Operacyjna" : "Operations Diagnostic"}</Text>
        <Text style={s.title}>{ispl ? "Raport Gotowości AI" : "AI Readiness Report"}</Text>
        <Text style={s.subtitle}>{ispl ? "Twoja spersonalizowana analiza i mapa działania" : "Your personalised analysis and action roadmap"}</Text>

        {/* Score card */}
        <View style={s.scoreCard}>
          <Text style={[s.scoreNumber, { color: tierColor }]}>{score}</Text>
          <Text style={s.scoreOf}>/20</Text>
          <View style={[s.tierBadgeBorder, { borderColor: tierColor }]}>
            <Text style={[s.tierBadge, { color: tierColor, padding: 0 }]}>{tier}</Text>
          </View>
          <Text style={s.desc}>{desc}</Text>
        </View>

        {/* Insights */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>{ispl ? "Twoje spersonalizowane spostrzeżenia" : "Your personalised insights"}</Text>
          {insights.map((ins, i) => (
            <View key={i} style={s.insightRow}>
              <View style={s.insightBullet} />
              <View style={{ flex: 1 }}>
                <Text style={s.insightH}>{ins.h}</Text>
                <Text style={s.insightP}>{ins.p}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={s.ctaCard}>
          <Text style={s.ctaLabel}>{ctaLabel}</Text>
          <Text style={s.ctaSub}>{ctaSub}</Text>
          <Text style={s.ctaUrl}>calendar.app.google/ok4xj5QtxsRTCCoZ8</Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>© 2026 MazoLogic</Text>
          <Text style={s.footerText}>mazologic.com</Text>
        </View>
      </Page>
    </Document>
  );
}
