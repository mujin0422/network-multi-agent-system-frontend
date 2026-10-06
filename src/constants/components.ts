import type { StatCardTone } from "@/types/components"

export const FORM_COMBOBOX_DEFAULT_PLACEHOLDER = "Select an option"

export const STAT_CARD_TONES: Record<StatCardTone, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  green: "bg-emerald-500/10 text-emerald-400",
  amber: "bg-amber-500/10 text-amber-400",
  red: "bg-red-500/10 text-red-400",
  violet: "bg-violet-500/10 text-violet-400",
}

export const STATUS_TONES = {
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  danger: "border-red-500/20 bg-red-500/10 text-red-400",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  neutral: "border-border bg-muted text-muted-foreground",
} as const

export const LANGUAGE_OPTIONS = [
  { code: "vi", labelKey: "common.vietnamese", shortLabel: "VI" },
  { code: "en", labelKey: "common.english", shortLabel: "EN" },
] as const
