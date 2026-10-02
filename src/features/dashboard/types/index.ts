import type { LucideIcon } from "lucide-react"

export type Tone = "success" | "running" | "waiting" | "danger"
export type Metric = { label: string; value: string; change: string; tone: Tone; icon: LucideIcon }
export type ChartBar = { label: string; height: number }
export type ActivityItem = { title: string; detail: string; status: string; tone: Tone; icon: LucideIcon }
