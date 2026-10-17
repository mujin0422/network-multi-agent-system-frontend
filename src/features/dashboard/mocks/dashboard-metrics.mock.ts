import { Activity, CheckCircle2, CircleAlert, Clock3, ListTodo, Router } from "lucide-react"
import type { Metric } from "../types/metric.type"

export const DASHBOARD_METRICS: Metric[] = [
  { label: "Total Devices", value: "13", change: "GNS3 inventory", tone: "running", icon: Router },
  { label: "Total Tasks", value: "1,248", change: "+12.5%", tone: "running", icon: ListTodo },
  { label: "Running Tasks", value: "8", change: "Live", tone: "running", icon: Activity },
  { label: "Success Rate", value: "96.4%", change: "+1.8%", tone: "success", icon: CheckCircle2 },
  { label: "Waiting Approval", value: "5", change: "Review", tone: "waiting", icon: Clock3 },
  { label: "Failed Tasks", value: "3", change: "−2 today", tone: "danger", icon: CircleAlert },
]
