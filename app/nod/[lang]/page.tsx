import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../nod.css";
import type { NodLang } from "../commands";
import { BASE_URL, COPY, LANGS, VIDEO, pageUrl, videoUrl } from "../content";
import NodForm from "../NodForm";
import VideoEmbed from "../VideoEmbed";
import LangSwitch from "../LangSwitch";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map(lang => ({ lang }));
}

const isLang = (l: string): l is NodLang => l === "pl" || l === "en";

// "PT24M19S" → "24:19"
function isoToClock(iso: string) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso);
  if (!m) return "";
  const [h, min, s] = [Number(m[1] || 0), Number(m[2] || 0), Number(m[3] || 0)];
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(min).padStart(2, "0")}:${ss}` : `${min}:${ss}`;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = COPY[lang];
  const url = pageUrl(lang);
  return {
    title: { absolute: `${t.metaTitle} | MazoLogic` },
    description: t.metaDesc,
    keywords: lang === "pl"
      ? ["Nod", "n8n Nod", "osobisty agent AI", "agent AI na własnym serwerze", "Nod Hetzner", "instalacja Nod", "open source asystent AI", "OpenRouter", "DeepSeek", "Telegram bot AI", "WhatsApp AI", "Composio"]
      : ["Nod", "n8n Nod", "personal AI agent", "self-hosted AI agent", "Nod Hetzner", "install Nod", "open source AI assistant", "OpenRouter", "DeepSeek", "Telegram AI bot", "WhatsApp AI", "Composio"],
    alternates: {
      canonical: url,
      languages: { pl: pageUrl("pl"), en: pageUrl("en"), "x-default": `${BASE_URL}/nod` },
    },
    openGraph: {
      type: "article",
      url,
      siteName: "MazoLogic",
      locale: lang === "pl" ? "pl_PL" : "en_US",
      alternateLocale: lang === "pl" ? ["en_US"] : ["pl_PL"],
      title: t.metaTitle,
      description: t.metaDesc,
    },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.metaDesc },
  };
}

function jsonLd(lang: NodLang) {
  const t = COPY[lang];
  const url = pageUrl(lang);
  const v = VIDEO[lang];
  const videoLd = v && {
    "@type": "VideoObject",
    name: v.title,
    description: t.metaDesc,
    inLanguage: lang,
    thumbnailUrl: [`${BASE_URL}${v.thumb.replace(/\.webp$/, ".jpg")}`, `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`],
    uploadDate: v.uploadDate,
    duration: v.duration,
    contentUrl: videoUrl(v),
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    author: { "@type": "Person", name: "Krzysztof Łomonkiewicz" },
  };
  return [
    ...(videoLd ? [{ "@context": "https://schema.org", ...videoLd }] : []),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      ...(videoLd ? { video: videoLd } : {}),
      name: t.metaTitle,
      description: t.metaDesc,
      inLanguage: lang,
      url,
      totalTime: t.howTotalTime,
      tool: [{ "@type": "HowToTool", name: lang === "pl" ? "Terminal albo PowerShell" : "Terminal or PowerShell" }],
      supply: [{ "@type": "HowToSupply", name: lang === "pl" ? "Serwer Hetzner z Ubuntu 24.04 i 8 GB RAM" : "Hetzner server with Ubuntu 24.04 and 8 GB RAM" }],
      step: t.how.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.h,
        text: s.p,
        url: `${url}#krok-${i + 1}`,
      })),
      about: { "@type": "SoftwareApplication", name: "Nod", applicationCategory: "BusinessApplication", operatingSystem: "Linux, macOS, Windows", license: "https://www.apache.org/licenses/LICENSE-2.0", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, url: "https://nod.n8n.io/", author: { "@type": "Organization", name: "n8n" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: t.faq.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "MazoLogic", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Nod", item: url },
      ],
    },
  ];
}

export default async function NodPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = COPY[lang];
  const video = VIDEO[lang];

  return (
    <div className="nod" lang={lang}>
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />

      <nav className="nav">
        <div className="container nav-inner">
          <a href="/" aria-label="MazoLogic">
            <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
          </a>
          <div className="nav-right">
            <LangSwitch lang={lang} label={t.switchLabel} />
          </div>
        </div>
      </nav>

      <main>
        <section className="nod-hero">
          <div className="container nod-hero-grid">
            <div className="nod-hero-copy">
              <span className="section-eyebrow">{t.eyebrow}</span>
              <h1 className="nod-h1">
                {t.h1a}<br /><span className="light">{t.h1b}</span>
              </h1>
              <p className="nod-lead">{t.lead}</p>
              <ul className="nod-facts">
                {t.facts.map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div id="komendy" className="nod-form-wrap">
              <NodForm lang={lang} t={t.form} />
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">{t.benefitsEyebrow}</span>
              <h2>{t.benefitsH}</h2>
            </div>
            <div className="nod-benefits">
              {t.benefits.map(b => (
                <article key={b.h} className="nod-card">
                  <h3>{b.h}</h3>
                  <p>{b.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">{t.howEyebrow}</span>
              <h2>{t.howH}</h2>
              <p className="nod-section-lead">{t.howLead}</p>
            </div>
            <ol className="nod-steps">
              {t.how.map((s, i) => (
                <li key={s.h} id={`krok-${i + 1}`} className="nod-step">
                  <span className="nod-step-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{s.h}</h3>
                    <p>{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="nod-center">
              <a className="btn btn-primary btn-lg" href="#komendy"><span>{t.howCta}</span><span className="arrow">→</span></a>
            </div>
          </div>
        </section>

        {video && (
          <section id="film" className="section section-alt">
            <div className="container nod-center nod-video">
              <h2 className="nod-h2">{t.videoH}</h2>
              <p className="nod-section-lead">{t.videoP}</p>
              <VideoEmbed id={video.id} title={video.title} thumb={video.thumb} playLabel={t.videoPlay} duration={isoToClock(video.duration)} />
              <a className="btn btn-secondary btn-lg" href={videoUrl(video)} target="_blank" rel="noopener noreferrer">{t.videoCta}</a>
            </div>
          </section>
        )}

        <section className={video ? "section" : "section section-alt"}>
          <div className="container nod-faq-wrap">
            <div className="section-head">
              <span className="section-eyebrow">{t.faqEyebrow}</span>
              <h2>{t.faqH}</h2>
            </div>
            <div className="nod-faq">
              {t.faq.map(f => (
                <details key={f.q} className="nod-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p className="nod-disclaimer">{t.disclaimer}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
          <div className="footer-links">
            <a href="/privacy">{t.footerPrivacy}</a>
            <a href="mailto:info@mazologic.com">{t.footerContact}</a>
          </div>
          <span className="footer-copy">© 2026 MazoLogic · Mazo Media Krzysztof Łomonkiewicz · NIP 5842550318</span>
        </div>
      </footer>
    </div>
  );
}
