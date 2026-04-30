"use client"

import { useEffect, useState } from "react"
import { motion, type Variants } from "motion/react"

interface Segment {
  t: string
  c?: boolean
}

interface HeroAnimateProps {
  segments: readonly Segment[]
  className?: string
  delay?: number
  accentColor?: string
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

export function HeroAnimate({
  segments,
  className,
  delay = 0,
  accentColor = "#6fa8d4",
}: HeroAnimateProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  // Flatten all segments into per-word list
  const words: { word: string; colored: boolean }[] = []
  for (const seg of segments) {
    const parts = seg.t.split(/(\s+)/)
    for (const part of parts) {
      if (part !== "") words.push({ word: part, colored: !!seg.c })
    }
  }

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: 0.06,
      },
    },
  }

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            color: w.colored ? accentColor : undefined,
          }}
        >
          {w.word}
        </motion.span>
      ))}
    </motion.span>
  )
}
