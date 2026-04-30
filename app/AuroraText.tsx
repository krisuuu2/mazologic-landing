"use client"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export function AuroraText({
  children,
  className = "",
  colors = ["#c39a52", "#e8d5a6", "#ffffff", "#6fa8d4", "#a8d4f5"],
  speed = 1,
}: AuroraTextProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`
  const duration = `${6 / speed}s`

  return (
    <>
      <style>{`
        @keyframes aurora-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .aurora-text {
          background-image: ${gradient};
          background-size: 300% 300%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: aurora-shift ${duration} ease infinite;
        }
      `}</style>
      <span className={`aurora-text ${className}`}>
        {children}
      </span>
    </>
  )
}
