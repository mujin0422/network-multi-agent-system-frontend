import type { Tone } from "../types/tone.type"
import type { DashboardStatus } from "../types/activity-item.type"

export const DASHBOARD_COPY = {
  title: "Dashboard",
  description: "Operational health and automation activity across your network.",
} as const

export const TONE_CLASSES: Record<Tone, string> = {
  success: "border-success/20 bg-success/10 text-success",
  running: "border-blue-400/20 bg-blue-500/10 text-blue-300",
  waiting: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  danger: "border-red-400/20 bg-red-500/10 text-red-400",
}

export const DASHBOARD_STATUS_LABELS: Record<DashboardStatus, string> = {
  PENDING: "Pending",
  RUNNING: "Running",
  SUCCESS: "Success",
}
