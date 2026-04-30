"use client"

import { memo, useEffect, useState } from "react"
import { motion, type Variants } from "motion/react"

interface TextAnimateProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  by?: "word" | "character"
  delay?: number
  once?: boolean
  // "viewport" = whileInView (for section headings scrolled into view)
  // "mount"    = animate immediately on mount (for hero, above the fold)
  trigger?: "viewport" | "mount"
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

const TextAnimateBase = ({
  children,
  className,
  as: Tag = "span",
  by = "word",
  delay = 0,
  once = true,
  trigger = "viewport",
}: TextAnimateProps) => {
  const MotionTag = motion[Tag] as typeof motion.span
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  const segments =
    by === "word" ? children.split(/(\s+)/) : children.split("")

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: by === "word" ? 0.06 : 0.03,
      },
    },
  }

  const motionProps =
    trigger === "mount"
      ? { initial: "hidden", animate: ready ? "show" : "hidden" }
      : { initial: "hidden", whileInView: "show", viewport: { once } }

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      {...motionProps}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {seg}
        </motion.span>
      ))}
    </MotionTag>
  )
}

export const TextAnimate = memo(TextAnimateBase)
