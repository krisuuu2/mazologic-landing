"use client"

import { memo } from "react"
import { motion, type Variants } from "motion/react"

interface TextAnimateProps {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  by?: "word" | "character"
  delay?: number
  once?: boolean
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
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
}: TextAnimateProps) => {
  const MotionTag = motion[Tag] as typeof motion.span

  const segments =
    by === "word" ? children.split(/(\s+)/) : children.split("")

  const containerWithDelay: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: by === "word" ? 0.06 : 0.03,
      },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={containerWithDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once }}
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
