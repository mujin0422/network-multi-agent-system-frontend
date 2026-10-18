import type { LucideIcon } from "lucide-react"
import type { Tone } from "./tone.type"

export type DashboardStatus = "PENDING" | "RUNNING" | "SUCCESS"

export type ActivityItem = { title: string; detail: string; status: DashboardStatus; tone: Tone; icon: LucideIcon }
