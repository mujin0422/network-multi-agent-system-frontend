import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

export type SegmentOption<T extends string> = {
  value: T
  label: string
  icon?: ReactNode
  style?: CSSProperties
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div
      className="inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-muted p-1"
      role="group"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          style={option.style}
          className={cn(
            "inline-flex h-7 items-center justify-center gap-2 rounded-md px-3 type-caption font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            value === option.value &&
              "bg-background text-foreground shadow-sm ring-1 ring-border",
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}
