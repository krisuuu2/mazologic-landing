import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Operating System",
  description:
    "One system on top of your existing tools: a single source of truth, agents with memory, one interface to run your operations. Audit, build, tune, handover.",
  alternates: { canonical: "https://mazologic.com/ai-os" },
};

export default function AiOsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
