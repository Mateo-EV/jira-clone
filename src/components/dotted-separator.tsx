import { cn } from "@/lib/shadcn"
import React from "react"

export const DOTTED_SEPARATOR_DIRECTION = {
  HORIZONTAL: 0,
  VERTICAL: 1
}

interface DottedSeparatorProps {
  className?: string
  color?: string
  height?: string
  dotSize?: string
  gapSize?: string
  direction?: EnumValues<typeof DOTTED_SEPARATOR_DIRECTION>
}

export default function DottedSeparator({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = DOTTED_SEPARATOR_DIRECTION.HORIZONTAL
}: DottedSeparatorProps) {
  const isHorizontal = direction === DOTTED_SEPARATOR_DIRECTION.HORIZONTAL

  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center"
        }}
      />
    </div>
  )
}
