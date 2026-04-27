import type { Metadata } from "next";
import "./tokens.css";
import "./main.css";
import "./v3b.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "MazoLogic — AI Operating System",
  description: "Stop managing tools. Start running your business. MazoLogic builds AI Operating Systems for SMBs.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
