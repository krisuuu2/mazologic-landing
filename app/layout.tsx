import type { Metadata } from "next";
import "./tokens.css";
import "./main.css";
import "./v3b.css";
import "./globals.css";

const BASE_URL = "https://mazologic.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MazoLogic — AI Operating System for SMBs",
    template: "%s | MazoLogic",
  },
  description:
    "Stop managing tools. Start running your business. MazoLogic builds AI Operating Systems for small and medium businesses — automating operations, data, and customer workflows.",
  keywords: [
    "AI Operating System", "AI automation", "SMB automation",
    "business AI", "AI consultant", "workflow automation", "MazoLogic",
  ],
  authors: [{ name: "MazoLogic", url: BASE_URL }],
  creator: "MazoLogic",
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "MazoLogic",
    title: "MazoLogic — AI Operating System for SMBs",
    description:
      "Stop managing tools. Start running your business. MazoLogic builds AI Operating Systems for small and medium businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MazoLogic — AI Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MazoLogic — AI Operating System for SMBs",
    description:
      "Stop managing tools. Start running your business. MazoLogic builds AI Operating Systems for SMBs.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en": BASE_URL,
      "pl": BASE_URL,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MazoLogic",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "MazoLogic builds AI Operating Systems for small and medium businesses — automating operations, data, and customer workflows.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@mazologic.com",
    contactType: "customer service",
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
