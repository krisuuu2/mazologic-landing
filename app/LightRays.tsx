"use client"

import { useEffect, useState, useRef } from "react"

interface RayConfig {
  id: string
  left: number
  rotate: number
  width: number
  delay: number
  duration: number
  intensity: number
  swing: number
}

function createRays(count: number, speed: number): RayConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const left = 5 + Math.random() * 90
    const rotate = -32 + Math.random() * 64
    const width = 120 + Math.random() * 200
    const swing = 0.6 + Math.random() * 1.6
    const delay = Math.random() * speed
    const duration = speed * (0.7 + Math.random() * 0.6)
    const intensity = 0.55 + Math.random() * 0.45
    return { id: `ray-${i}-${Math.round(left * 10)}`, left, rotate, width, swing, delay, duration, intensity }
  })
}

interface LightRaysProps {
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
  className?: string
}

export function LightRays({
  count = 8,
  color = "rgba(107, 168, 212, 0.22)",
  blur = 40,
  speed = 12,
  length = "75vh",
  className = "",
}: LightRaysProps) {
  const [rays, setRays] = useState<RayConfig[]>([])
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    setRays(createRays(count, speed))
  }, [count, speed])

  // Inject per-ray keyframes dynamically
  useEffect(() => {
    if (!rays.length) return
    const css = rays.map(r => `
@keyframes ray-${r.id} {
  0%   { opacity: 0; transform: rotate(${r.rotate - r.swing}deg); }
  25%  { opacity: ${r.intensity}; }
  50%  { opacity: ${r.intensity * 0.85}; transform: rotate(${r.rotate + r.swing}deg); }
  75%  { opacity: ${r.intensity}; }
  100% { opacity: 0; transform: rotate(${r.rotate - r.swing}deg); }
}`).join("\n")

    if (!styleRef.current) {
      const el = document.createElement("style")
      el.setAttribute("data-light-rays", "1")
      document.head.appendChild(el)
      styleRef.current = el
    }
    styleRef.current.textContent = css

    return () => {
      styleRef.current?.remove()
      styleRef.current = null
    }
  }, [rays])

  return (
    <div
      className={className}
      style={{
        position: "absolute", inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "inherit",
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      {/* Ambient radial glows */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 45% at 20% 0%, ${color.replace(/[\d.]+\)$/, "0.55)")}, transparent 70%)`,
        opacity: 0.7,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 50% 40% at 80% 0%, ${color.replace(/[\d.]+\)$/, "0.4)")}, transparent 75%)`,
        opacity: 0.6,
      }} />

      {/* Rays */}
      {rays.map(r => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            top: "-12%",
            left: `${r.left}%`,
            width: `${r.width}px`,
            height: length,
            transform: `translateX(-50%) rotate(${r.rotate}deg)`,
            transformOrigin: "top center",
            borderRadius: "9999px",
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            opacity: 0,
            filter: `blur(${blur}px)`,
            mixBlendMode: "screen",
            animation: `ray-${r.id} ${r.duration}s ease-in-out ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
