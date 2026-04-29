"use client"

import { useEffect, useRef, useState } from "react"

interface DiaTextRevealProps {
  text: string | string[]
  colors?: string[]
  textColor?: string
  duration?: number
  delay?: number
  repeat?: boolean
  repeatDelay?: number
  className?: string
  style?: React.CSSProperties
}

// Two absolutely-stacked spans:
// 1. BASE  — textColor, clipped to [0%, revealPct%] → grows left→right
// 2. SHINE — the color band, also clipped, slightly ahead of the reveal front
//
// Both use clip-path: inset(0 X% 0 0) animated via CSS custom property + @keyframes.

let injected = false
function ensureKeyframes() {
  if (injected || typeof document === "undefined") return
  injected = true
  const el = document.createElement("style")
  el.textContent = `
@property --dia-pct {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}
@keyframes dia-reveal-clip {
  from { --dia-pct: 100%; }
  to   { --dia-pct: 0%; }
}
@keyframes dia-shine-clip {
  0%   { --dia-pct: 100%; opacity: 1; }
  80%  { opacity: 1; }
  100% { --dia-pct: -20%; opacity: 0; }
}
`
  document.head.appendChild(el)
}

export function DiaTextReveal({
  text,
  colors = ["#c39a52", "#e8d5a6", "#ffffff", "#a8d4f5", "#6fa8d4"],
  textColor = "#6fa8d4",
  duration = 1.8,
  delay = 0,
  repeat = false,
  repeatDelay = 2.5,
  className = "",
  style = {},
}: DiaTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text]
  const [activeIndex, setActiveIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [phase, setPhase] = useState<"hidden" | "animating" | "done">("hidden")
  const wrapRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasPlayed = useRef(false)

  useEffect(() => { ensureKeyframes() }, [])

  function startCycle(index: number) {
    setActiveIndex(index)
    setAnimKey(k => k + 1)
    setPhase("animating")
    timerRef.current = setTimeout(() => {
      setPhase("done")
      if (repeat) {
        timerRef.current = setTimeout(() => startCycle((index + 1) % texts.length), repeatDelay * 1000)
      }
    }, duration * 1000 + 100)
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasPlayed.current) {
        hasPlayed.current = true
        timerRef.current = setTimeout(() => startCycle(0), delay * 1000)
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const label = texts[activeIndex]
  const shineGradient = `linear-gradient(90deg, transparent, ${colors.join(", ")}, transparent)`

  // clip-path inset(top right bottom left)
  // inset(0 X% 0 0) = clip right side: shows [0 .. (100-X)%] of element
  // so --dia-pct goes 100%→0% = reveals from left to right

  const baseAnim: React.CSSProperties = {
    animation: `dia-reveal-clip ${duration}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
    clipPath: `inset(0 var(--dia-pct) 0 0)`,
  }

  // shine runs a bit faster so it stays ahead of the reveal
  const shineAnim: React.CSSProperties = {
    animation: `dia-shine-clip ${duration * 0.85}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
    clipPath: `inset(0 var(--dia-pct) 0 0)`,
  }

  if (phase === "hidden") {
    return (
      <span ref={wrapRef} className={className} style={{ display: "inline-block", color: "transparent", ...style }}>
        {label}
      </span>
    )
  }

  if (phase === "done") {
    return (
      <span ref={wrapRef} className={className} style={{ display: "inline-block", color: textColor, ...style }}>
        {label}
      </span>
    )
  }

  // animating — wrapper is relative, two layers stacked
  return (
    <span
      key={animKey}
      ref={wrapRef}
      className={className}
      style={{ display: "inline-block", position: "relative", ...style }}
    >
      {/* Invisible spacer — no whiteSpace override, wraps naturally */}
      <span style={{ visibility: "hidden" }}>{label}</span>

      {/* Base — solid textColor, revealed left→right */}
      <span style={{
        position: "absolute", inset: 0,
        color: textColor,
        ...baseAnim,
      }}>
        {label}
      </span>

      {/* Shine — gradient band, slightly ahead, fades out */}
      <span style={{
        position: "absolute", inset: 0,
        backgroundImage: shineGradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        backgroundSize: "100% 100%",
        ...shineAnim,
      }}>
        {label}
      </span>
    </span>
  )
}
