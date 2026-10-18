export const FORM_COMBOBOX_DEFAULT_PLACEHOLDER = "Select an option"

export const STATUS_TONES = {
  success: "border-success/20 bg-success/10 text-success",
  danger: "border-red-500/20 bg-red-500/10 text-red-400",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  neutral: "border-border bg-muted text-muted-foreground",
} as const

export const LANGUAGE_OPTIONS = [
  { code: "vi", labelKey: "common.vietnamese", shortLabel: "VI" },
  { code: "en", labelKey: "common.english", shortLabel: "EN" },
] as const
