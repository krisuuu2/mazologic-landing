"use client"

import { useEffect, useRef, useState } from "react"
import { motion, type Variants } from "motion/react"

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

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

export function DiaTextReveal({
  text,
  textColor = "#6fa8d4",
  duration = 1.8,
  delay = 0,
  className = "",
  style = {},
}: DiaTextRevealProps) {
  const texts = Array.isArray(text) ? text : [text]
  const label = texts[0]
  const words = label.split(/(\s+)/).filter(w => w !== "")

  const [ready, setReady] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const hasPlayed = useRef(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasPlayed.current) {
        hasPlayed.current = true
        setTimeout(() => setReady(true), delay * 1000)
        observer.disconnect()
      }
    }, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const staggerChildren = duration / words.length

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: 0,
        staggerChildren,
      },
    },
  }

  return (
    <motion.span
      ref={wrapRef}
      className={className}
      style={{ display: "inline-block", color: textColor, ...style }}
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  )
}
