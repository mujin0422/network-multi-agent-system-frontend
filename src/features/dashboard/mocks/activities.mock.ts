import { Bot, CheckCircle2, CircleAlert, UserRoundCheck } from "lucide-react"
import type { ActivityItem } from "../types/activity-item.type"

export const ACTIVITIES: ActivityItem[] = [
  { title: "OSPF deployment started", detail: "TASK-1042 · Alex Nguyen · 2 min ago", status: "RUNNING", tone: "running", icon: Bot },
  { title: "Routing tables collected", detail: "TASK-1041 · P1, P2 · 8 min ago", status: "SUCCESS", tone: "success", icon: CheckCircle2 },
  { title: "Task approved by Maya Chen", detail: "TASK-1040 · 16 min ago", status: "SUCCESS", tone: "success", icon: UserRoundCheck },
  { title: "Connection retry scheduled", detail: "P3 · 23 min ago", status: "PENDING", tone: "waiting", icon: CircleAlert },
]
