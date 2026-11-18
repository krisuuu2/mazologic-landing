"use client";

import { useEffect, useState } from "react";
import { STRINGS, Lang } from "./strings";
import { OFFER } from "./offer-strings";
import { LightRays } from "./LightRays";
import { AuroraText } from "./AuroraText";
import { TextAnimate } from "./TextAnimate";
import { HeroAnimate } from "./HeroAnimate";

const CAL = "https://calendar.app.google/ok4xj5QtxsRTCCoZ8";
const HERO_VARIANT_KEY = "hero_variant_idx";

function getHeroVariantIndex(total: number): number {
  if (typeof sessionStorage === "undefined") return 0;
  let idx = parseInt(sessionStorage.getItem(HERO_VARIANT_KEY) ?? "-1", 10);
  idx = (idx + 1) % total;
  sessionStorage.setItem(HERO_VARIANT_KEY, String(idx));
  return idx;
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [heroVariantIdx, setHeroVariantIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const o = OFFER[lang];
  const m = STRINGS[lang].matrix;

  useEffect(() => {
    const savedLang = localStorage.getItem("mazo-lang") as Lang | null;
    const browserLang: Lang = navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
    setLang(savedLang ?? browserLang);
    setHeroVariantIdx(getHeroVariantIndex(OFFER.en.hero.variants.length));
  }, []);

  const switchLang = (l: Lang) => { setLang(l); localStorage.setItem("mazo-lang", l); };

  const hero = o.hero.variants[(heroVariantIdx ?? 0) % o.hero.variants.length];

  const toggles = (
    <>
      <div className="toggle-group lang" role="tablist" aria-label="Language">
        <button className={lang === "en" ? "active" : ""} onClick={() => switchLang("en")}>EN</button>
        <button className={lang === "pl" ? "active" : ""} onClick={() => switchLang("pl")}>PL</button>
      </div>
    </>
  );

  const navLinks = [
    ["#services", o.nav.services],
    ["#running", o.nav.running],
    ["#training", o.nav.training],
    ["#how", o.nav.how],
    ["/ai-os", o.nav.brain],
  ] as const;

  const H2 = ({ a, b }: { a: string; b: string }) => (
    <h2>
      <TextAnimate as="span" by="word" once={true}>{a}</TextAnimate>{" "}
      <TextAnimate as="span" by="word" once={true} delay={0.5} className="light">{b}</TextAnimate>
    </h2>
  );

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="container nav-inner">
          <div className="nav-left">
            <a href="/" aria-label="MazoLogic home" style={{ textDecoration: "none" }}>
              <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
            </a>
            <div className="nav-links">
              {navLinks.map(([href, label]) => <a className="nav-link" href={href} key={href}>{label}</a>)}
            </div>
          </div>
          <div className="nav-right">
            {toggles}
            <a className="btn btn-primary btn-sm nav-cta-desktop" href={CAL} target="_blank" rel="noopener noreferrer">{o.nav.cta}</a>
            <button className="hamburger" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map(([href, label]) => <a className="mobile-nav-link" href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <div className="mobile-menu-footer">
              <div className="mobile-menu-toggles">{toggles}</div>
              <a className="btn btn-primary" href={CAL} target="_blank" rel="noopener noreferrer" style={{ width: "100%" }} onClick={() => setMenuOpen(false)}>{o.nav.cta}</a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <LightRays count={9} color="rgba(107, 168, 212, 0.22)" blur={42} speed={13} length="80vh" />
        <div className="container hero-inner">
          <h1>
            {heroVariantIdx !== null && (
              <>
                <HeroAnimate segments={hero.h1a} delay={0} />
                <br />
                <TextAnimate as="span" by="word" trigger="mount" delay={0.4} className="h1-light">{hero.h1b}</TextAnimate>
              </>
            )}
          </h1>
          <p className="hero-sub">{hero.sub}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary btn-lg hero-main-cta" href={CAL} target="_blank" rel="noopener noreferrer">{o.hero.cta}</a>
            <a className="btn btn-ghost btn-lg" href="#running">{o.hero.cta2}</a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.services.eyebrow}</span>
            <H2 a={o.services.h2a} b={o.services.h2b} />
            <p className="section-lead">{o.services.lead}</p>
            <p className="offer-price"><strong>{o.services.price}</strong><span>{o.services.priceNote}</span></p>
          </div>
          <div className="solution-grid">
            {o.services.cards.map((c, i) => {
              const last = i === o.services.cards.length - 1;
              return (
                <div className="sol-card" key={i}>
                  <div className="sol-dept">{c.dept}</div>
                  <div><h4>{c.h}</h4><p>{c.p}</p></div>
                  {last
                    ? <a className="sol-tag sol-tag-link" href={CAL} target="_blank" rel="noopener noreferrer">{c.tag}</a>
                    : <div className="sol-tag">{c.tag}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MATRIX: which process first ── */}
      <section className="section section-alt" id="matrix">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.matrix.eyebrow}</span>
            <H2 a={o.matrix.h2a} b={o.matrix.h2b} />
            <p className="section-lead">{o.matrix.lead}</p>
          </div>
          <div className="matrix-wrap">
            <div className="matrix">
              <div className="matrix-axis-y">{m.axisHigh}</div>
              {([
                ["q-quickwin", m.q1tag, m.q1title, m.q1desc, m.q1foot, "↗"],
                ["q-strategic", m.q2tag, m.q2title, m.q2desc, m.q2foot, "◎"],
              ] as const).map(([cls, tag, title, desc, foot, icon]) => (
                <div className={`matrix-quadrant ${cls}`} key={cls}>
                  <div className="matrix-labels">
                    <span className="matrix-label">{tag}</span>
                    <h4 className="matrix-title">{title}</h4>
                    <p className="matrix-desc">{desc}</p>
                  </div>
                  <span className="matrix-foot">{foot}</span>
                  <div className="matrix-verdict">
                    <div className="matrix-verdict-icon">{icon}</div>
                    <div className="matrix-verdict-title">{title}</div>
                    <div className="matrix-verdict-sub">{desc}</div>
                  </div>
                </div>
              ))}
              <div className="matrix-axis-y">{m.axisLow}</div>
              {([
                ["q-fill", m.q3tag, m.q3title, m.q3desc, "→"],
                ["q-avoid", m.q4tag, m.q4title, m.q4desc, "✗"],
              ] as const).map(([cls, tag, title, desc, icon]) => (
                <div className={`matrix-quadrant ${cls}`} key={cls}>
                  <div className="matrix-labels">
                    <span className="matrix-label">{tag}</span>
                    <h4 className="matrix-title">{title}</h4>
                    <p className="matrix-desc">{desc}</p>
                  </div>
                  <div className="matrix-verdict">
                    <div className="matrix-verdict-icon">{icon}</div>
                    <div className="matrix-verdict-title">{title}</div>
                    <div className="matrix-verdict-sub">{desc}</div>
                  </div>
                </div>
              ))}
              <div></div>
              <div className="matrix-axis-x">{m.axisEffortLow}</div>
              <div className="matrix-axis-x">{m.axisEffortHigh}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RUNNING ── */}
      <section className="section" id="running">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.running.eyebrow}</span>
            <H2 a={o.running.h2a} b={o.running.h2b} />
            <p className="section-lead">{o.running.lead}</p>
          </div>
          <div className="solution-grid">
            {o.running.cards.map((c, i) => (
              <div className="sol-card" key={i}>
                <div className="sol-dept">{c.where}</div>
                <div><h4>{c.h}</h4><p>{c.p}</p></div>
                <div className="sol-tag"><span className="pulse-dot" aria-hidden="true"></span>{lang === "pl" ? "pracuje" : "running"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINING ── */}
      <section className="section section-alt" id="training">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.training.eyebrow}</span>
            <H2 a={o.training.h2a} b={o.training.h2b} />
            <p className="section-lead">{o.training.lead}</p>
          </div>
          <div className="problem-grid">
            {o.training.programs.map((p, i) => (
              <div className="prob-card program-card" key={i}>
                <div className="sol-dept">{p.name}</div>
                <h4>{p.who}</h4>
                <ul>{p.points.map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                <p className="program-effect">{p.effect}</p>
                <div className="sol-tag">{p.price}</div>
              </div>
            ))}
          </div>
          <p className="offer-included">{o.training.included}</p>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="section" id="security">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.security.eyebrow}</span>
            <H2 a={o.security.h2a} b={o.security.h2b} />
            <p className="section-lead">{o.security.lead}</p>
          </div>
          <div className="problem-grid">
            {o.security.cards.map((c, i) => (
              <div className="prob-card" key={i}><h4>{c.h}</h4><p>{c.p}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE START ── */}
      <section className="section section-dark" id="how">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">{o.how.eyebrow}</span>
            <H2 a={o.how.h2a} b={o.how.h2b} />
          </div>
          <div className="steps">
            {o.how.steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-beam" aria-hidden="true"></div>
                <div className="step-num">{s.num}</div>
                <h4>{s.h}</h4>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI OS TEASER ── */}
      <div className="spotlight-block">
        <LightRays count={10} color="rgba(107, 168, 212, 0.18)" blur={44} speed={11} length="100%" className="spotlight-rays" />
        <div className="container inner" style={{ flexDirection: "column", alignItems: "center", gap: "28px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fafafa", lineHeight: 1.1, maxWidth: "760px" }}>
            <span>{o.aios.left}</span>{" "}
            <AuroraText>{o.aios.right}</AuroraText>
          </p>
          <p style={{ maxWidth: "620px", fontSize: "16px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>{o.aios.lead}</p>
          <a className="btn btn-primary btn-lg" href="/ai-os" style={{ width: "auto" }}>{o.aios.cta}</a>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="section" id="faq">
        <div className="container">
          <div className="diff-card">
            <div className="diff-header"><span className="diff-label">{o.faq.eyebrow}</span></div>
            <h2 className="diff-h2">{o.faq.h2}</h2>
            <div className="faq">
              {o.faq.items.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSE ── */}
      <section className="section section-cta">
        <div className="container bottom-cta-wrap" style={{ textAlign: "center" }}>
          <h2>{o.close.h2}</h2>
          <div className="hero-ctas" style={{ justifyContent: "center" }}>
            <a className="btn btn-primary btn-lg" href={CAL} target="_blank" rel="noopener noreferrer">{o.close.cta}</a>
            <a className="btn btn-ghost btn-lg" href="mailto:info@mazologic.com">{o.close.cta2}</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="wm"><b>MAZO</b><span>LOGIC</span></span>
          <div className="footer-links">
            <a href="/ai-os">{o.footer.aios}</a>
            <a href="/audit">{o.footer.audit}</a>
            <a href="/privacy">{o.footer.privacy}</a>
            <a href="mailto:info@mazologic.com">{o.footer.contact}</a>
          </div>
          <span className="footer-copy">© 2026 MazoLogic · Mazo Media Krzysztof Łomonkiewicz · NIP 5842550318</span>
        </div>
      </footer>
    </>
  );
}
