import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Audit",
  description:
    "Take the free 5-minute AI Readiness Assessment. Find out where your business stands and get a personalised AI action roadmap — delivered to your inbox.",
  openGraph: {
    title: "Free AI Readiness Audit — MazoLogic",
    description:
      "15 questions. 5 minutes. Get your personalised AI Readiness Score and action roadmap.",
    url: "https://mazologic.com/audit",
    images: [{ url: "/og-audit.png", width: 1200, height: 630, alt: "AI Readiness Audit — MazoLogic" }],
  },
  alternates: {
    canonical: "https://mazologic.com/audit",
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
