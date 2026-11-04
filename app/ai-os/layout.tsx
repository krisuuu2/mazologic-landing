import type { Metadata } from "next";

const description =
  "One system on top of your existing tools: a single source of truth, agents with memory, one interface to run your operations. Audit, build, tune, handover.";

export const metadata: Metadata = {
  title: "AI Operating System",
  description,
  alternates: { canonical: "https://mazologic.com/ai-os" },
  // child openGraph replaces the root one, so it is spelled out in full
  openGraph: {
    type: "website",
    url: "https://mazologic.com/ai-os",
    siteName: "MazoLogic",
    title: "AI Operating System | MazoLogic",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MazoLogic — AI Operating System" }],
  },
  twitter: { card: "summary_large_image", title: "AI Operating System | MazoLogic", description, images: ["/og-image.png"] },
};

export default function AiOsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
