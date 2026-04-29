"use client"

import React, { forwardRef, useEffect, useRef, useState, useCallback, RefObject } from "react"

// ── Geometry ───────────────────────────────────────────────────────────────
function getCenter(el: HTMLElement, container: HTMLElement) {
  const eR = el.getBoundingClientRect()
  const cR = container.getBoundingClientRect()
  return { x: eR.left - cR.left + eR.width / 2, y: eR.top - cR.top + eR.height / 2 }
}

function quadPath(x1: number, y1: number, x2: number, y2: number, curve = 0) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const px = -(y2 - y1) / len * curve * len * 0.35
  const py =  (x2 - x1) / len * curve * len * 0.35
  return `M ${x1},${y1} Q ${mx + px},${my + py} ${x2},${y2}`
}

// ── Single beam line ───────────────────────────────────────────────────────
let beamKfId = 0
function BeamLine({
  containerRef, fromRef, toRef,
  curve = 0, delay = 0, duration = 3, reverse = false,
  particleColor = "#6fa8d4", trackColor = "rgba(255,255,255,0.07)",
  pathWidth = 1.2,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  fromRef:      RefObject<HTMLDivElement | null>
  toRef:        RefObject<HTMLDivElement | null>
  curve?:    number
  delay?:    number
  duration?: number
  reverse?:  boolean
  particleColor?: string
  trackColor?:    string
  pathWidth?:     number
}) {
  const [d, setD]   = useState("")
  const [len, setLen] = useState(300)
  const pathRef = useRef<SVGPathElement>(null)
  const kfId    = useRef(`bkf${beamKfId++}`)

  const recalc = useCallback(() => {
    const c = containerRef.current, f = fromRef.current, t = toRef.current
    if (!c || !f || !t) return
    const { x: x1, y: y1 } = getCenter(f, c)
    const { x: x2, y: y2 } = getCenter(t, c)
    setD(quadPath(x1, y1, x2, y2, curve))
  }, [containerRef, fromRef, toRef, curve])

  useEffect(() => {
    recalc()
    window.addEventListener("resize", recalc)
    return () => window.removeEventListener("resize", recalc)
  }, [recalc])

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength() || 300)
  }, [d])

  if (!d) return null

  const pLen = len
  const kf   = kfId.current
  const dir  = reverse ? `${pLen}px` : `-${pLen}px`
  const start = reverse ? `-${pLen}px` : `${pLen}px`

  return (
    <g>
      <style>{`@keyframes ${kf}{from{stroke-dashoffset:${start}}to{stroke-dashoffset:${dir}}}`}</style>
      {/* Track */}
      <path d={d} fill="none" stroke={trackColor} strokeWidth={pathWidth} strokeLinecap="round"/>
      {/* Particle */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={particleColor}
        strokeWidth={pathWidth + 0.8}
        strokeLinecap="round"
        strokeDasharray={`${pLen * 0.28} ${pLen * 0.72}`}
        strokeDashoffset={reverse ? -pLen : pLen}
        style={{ animation: `${kf} ${duration}s linear ${delay}s infinite` }}
      />
    </g>
  )
}

// ── Node ───────────────────────────────────────────────────────────────────
const OrbNode = forwardRef<HTMLDivElement, {
  icon:    React.ReactNode
  label:   string
  size?:   number
  accent?: boolean
}>(({ icon, label, size = 48, accent = false }, ref) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div
      ref={ref}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: accent ? "1.5px solid rgba(111,168,212,0.5)" : "1px solid rgba(255,255,255,0.15)",
        background: accent ? "#192535" : "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: accent ? "#6fa8d4" : "#1a1a1a",
        boxShadow: "0 2px 14px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ width: size * 0.42, height: size * 0.42 }}>{icon}</div>
    </div>
    <span style={{
      fontSize: 10, color: "rgba(255,255,255,0.38)",
      fontFamily: "var(--font-mono, monospace)",
      letterSpacing: "0.06em", textAlign: "center", whiteSpace: "nowrap",
    }}>{label}</span>
  </div>
))
OrbNode.displayName = "OrbNode"

// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  salesforce: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M10 4C7.8 4 6 5.8 6 8c0 .4.1.8.2 1.1C4.9 9.6 4 10.7 4 12c0 1.7 1.3 3 3 3 .2 0 .4 0 .6-.1.4 1.2 1.5 2.1 2.8 2.1.4 0 .8-.1 1.2-.3.5 1.3 1.8 2.3 3.4 2.3 1.8 0 3.3-1.2 3.7-2.9.3.1.6.2.9.2 1.7 0 3-1.3 3-3 0-1.1-.6-2-1.5-2.6.1-.3.1-.6.1-.9C21.2 7 19.2 5 16.7 5c-.9 0-1.8.3-2.5.8C13.5 4.7 11.8 4 10 4z"/></svg>,
  hubspot:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="16" cy="8" r="2.5"/><circle cx="8" cy="16" r="2.5"/><circle cx="16" cy="16" r="2.5"/><path d="M8 8v4"/><path d="M8 12a4 4 0 0 0 4 4"/><path d="M12 8h4"/></svg>,
  notion:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h6M8 16h4"/></svg>,
  airtable:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3L3 7.5l9 4.5 9-4.5L12 3z"/><path d="M3 12l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/></svg>,
  postgresql: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/></svg>,
  slack:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M14.5 10a1.5 1.5 0 1 1-3 0V5a1.5 1.5 0 1 1 3 0v5z"/><path d="M10 14.5a1.5 1.5 0 1 1 0 3H5a1.5 1.5 0 1 1 0-3h5z"/><path d="M9.5 10a1.5 1.5 0 1 1 3 0v5a1.5 1.5 0 1 1-3 0v-5z"/><path d="M14 9.5a1.5 1.5 0 1 1 0-3h5a1.5 1.5 0 1 1 0 3h-5z"/></svg>,
  gmail:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  sheets:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>,
  api:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  crm:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M12 3C8.7 3 6 5.7 6 9c0 4 6 12 6 12s6-8 6-12c0-3.3-2.7-6-6-6z"/><circle cx="12" cy="9" r="2"/></svg>,
  telegram:   <svg viewBox="0 0 24 24" fill="#6fa8d4"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-2.02 9.54c-.15.67-.54.84-1.1.52l-3-2.21-1.45 1.39c-.16.16-.3.29-.61.29l.22-3.07 5.6-5.06c.24-.22-.05-.34-.38-.12l-6.92 4.36-2.98-.93c-.65-.2-.66-.65.13-.96l11.63-4.49c.54-.2 1.01.13.88.74z"/></svg>,
}

// ── Main ───────────────────────────────────────────────────────────────────
export function AgentOrb({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const tgRef    = useRef<HTMLDivElement>(null)

  const sfRef  = useRef<HTMLDivElement>(null)
  const hsRef  = useRef<HTMLDivElement>(null)
  const ntRef  = useRef<HTMLDivElement>(null)
  const atRef  = useRef<HTMLDivElement>(null)
  const pgRef  = useRef<HTMLDivElement>(null)
  const slRef  = useRef<HTMLDivElement>(null)
  const gmRef  = useRef<HTMLDivElement>(null)
  const gsRef  = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HTMLDivElement>(null)
  const crmRef = useRef<HTMLDivElement>(null)

  const leftTools  = [
    { ref: sfRef,  label: "Salesforce",  icon: I.salesforce },
    { ref: hsRef,  label: "HubSpot",     icon: I.hubspot    },
    { ref: ntRef,  label: "Notion",      icon: I.notion     },
    { ref: atRef,  label: "Airtable",    icon: I.airtable   },
    { ref: pgRef,  label: "PostgreSQL",  icon: I.postgresql },
  ]
  const rightTools = [
    { ref: slRef,  label: "Slack",       icon: I.slack   },
    { ref: gmRef,  label: "Gmail",       icon: I.gmail   },
    { ref: gsRef,  label: "Sheets",      icon: I.sheets  },
    { ref: apiRef, label: "Custom API",  icon: I.api     },
    { ref: crmRef, label: "Your CRM",    icon: I.crm     },
  ]

  const blue = "#6fa8d4"
  const gold = "#c39a52"

  return (
    <div
      ref={containerRef}
      className={`agent-orb-wrap ${className}`}
      style={{ position: "relative", width: "100%", maxWidth: 780, margin: "0 auto" }}
    >
      {/* SVG overlay for all beam lines */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
        aria-hidden="true"
      >
        {leftTools.map((t, i) => (
          <BeamLine key={t.label} containerRef={containerRef} fromRef={t.ref} toRef={agentRef}
            curve={i % 2 === 0 ? 0.12 : -0.12} delay={i * 0.35} duration={2.6 + i * 0.15}
            reverse={i % 2 === 0} particleColor={blue}
          />
        ))}
        {rightTools.map((t, i) => (
          <BeamLine key={t.label} containerRef={containerRef} fromRef={t.ref} toRef={agentRef}
            curve={i % 2 === 0 ? -0.12 : 0.12} delay={i * 0.35 + 0.18} duration={2.6 + i * 0.15}
            reverse={i % 2 !== 0} particleColor={blue}
          />
        ))}
        {/* Agent ↔ Telegram */}
        <BeamLine containerRef={containerRef} fromRef={agentRef} toRef={tgRef}
          delay={0} duration={2} reverse={false} particleColor={gold} pathWidth={1.5}
        />
        <BeamLine containerRef={containerRef} fromRef={tgRef} toRef={agentRef}
          delay={1} duration={2} reverse={false} particleColor={blue} pathWidth={1.5}
        />
      </svg>

      {/* Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr 160px",
        alignItems: "center",
        padding: "24px 0 40px",
      }}>
        {/* Telegram — top center */}
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", paddingBottom: 36 }}>
          <OrbNode ref={tgRef} label="Telegram" icon={I.telegram} size={56} accent />
        </div>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          {leftTools.map(t => <OrbNode key={t.label} ref={t.ref} label={t.label} icon={t.icon} size={46} />)}
        </div>

        {/* Center — Agent */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            ref={agentRef}
            style={{
              width: 80, height: 80, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "#ffffff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 8px rgba(255,255,255,0.04)",
            }}
          >
            <span style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: 28, fontWeight: 800, color: "#1B3F5F", letterSpacing: "-0.05em", lineHeight: 1 }}>A</span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 7.5, color: "#6fa8d4", letterSpacing: "0.18em", marginTop: 3 }}>AGENT</span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          {rightTools.map(t => <OrbNode key={t.label} ref={t.ref} label={t.label} icon={t.icon} size={46} />)}
        </div>
      </div>
    </div>
  )
}
