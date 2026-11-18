import type { Metadata } from "next";

const description =
  "A second brain for your company: one AI agent that holds the context of the whole team. Ask it, hand it tasks, tell it what to remember. Built on the tools you already use.";

export const metadata: Metadata = {
  title: "Company second brain",
  description,
  alternates: { canonical: "https://mazologic.com/ai-os" },
  // child openGraph replaces the root one, so it is spelled out in full
  openGraph: {
    type: "website",
    url: "https://mazologic.com/ai-os",
    siteName: "MazoLogic",
    title: "Company second brain | MazoLogic",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "MazoLogic — company second brain" }],
  },
  twitter: { card: "summary_large_image", title: "Company second brain | MazoLogic", description, images: ["/og-image.png"] },
};

export default function AiOsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
