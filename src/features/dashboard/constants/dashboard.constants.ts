import type { Tone } from "../types/tone.type"

export const DASHBOARD_COPY = {
  title: "Dashboard",
  description: "Operational health and automation activity across your network.",
} as const

export const TONE_CLASSES: Record<Tone, string> = {
  success: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
  running: "border-blue-400 text-blue-300 bg-blue-500/10",
  waiting: "border-amber-400 text-amber-300 bg-amber-500/10",
  danger: "border-red-400 text-red-400 bg-red-500/10",
}
