import { Activity, Bot, CheckCircle2, CircleAlert, Clock3, ListTodo, Router, Terminal, UserRoundCheck, Wifi } from "lucide-react"
import type { ActivityItem, ChartBar, Metric } from "../types"

export const METRICS: Metric[] = [
  { label: "Total Devices", value: "24", change: "+3 this month", tone: "running", icon: Router },
  { label: "Total Tasks", value: "1,248", change: "+12.5%", tone: "running", icon: ListTodo },
  { label: "Running Tasks", value: "8", change: "Live", tone: "running", icon: Activity },
  { label: "Success Rate", value: "96.4%", change: "+1.8%", tone: "success", icon: CheckCircle2 },
  { label: "Waiting Approval", value: "5", change: "Review", tone: "waiting", icon: Clock3 },
  { label: "Failed Tasks", value: "3", change: "−2 today", tone: "danger", icon: CircleAlert },
]

export const TASK_BARS: ChartBar[] = [
  { label: "Mon", height: 48 }, { label: "Tue", height: 72 }, { label: "Wed", height: 58 }, { label: "Thu", height: 86 },
  { label: "Fri", height: 66 }, { label: "Sat", height: 94 }, { label: "Sun", height: 78 },
]

export const DEVICE_BARS: ChartBar[] = [
  { label: "P1", height: 82 }, { label: "P2", height: 63 }, { label: "P3", height: 95 }, { label: "SW1", height: 57 },
  { label: "FW1", height: 72 }, { label: "AP1", height: 44 }, { label: "LB1", height: 68 },
]

export const ACTIVITIES: ActivityItem[] = [
  { title: "OSPF deployment started", detail: "TASK-1042 · Alex Nguyen · 2 min ago", status: "RUNNING", tone: "running", icon: Bot },
  { title: "Routing tables collected", detail: "TASK-1041 · P1, P2 · 8 min ago", status: "SUCCESS", tone: "success", icon: CheckCircle2 },
  { title: "Task approved by Maya Chen", detail: "TASK-1040 · 16 min ago", status: "SUCCESS", tone: "success", icon: UserRoundCheck },
  { title: "Connection retry scheduled", detail: "P3 · 23 min ago", status: "WAITING", tone: "waiting", icon: CircleAlert },
]

export const DEVICE_ACTIONS: ActivityItem[] = [
  { title: "show ip route", detail: "P1 · 127.0.0.1:5001 · 12 ms", status: "SUCCESS", tone: "success", icon: Terminal },
  { title: "show ip route", detail: "P2 · 127.0.0.1:5002 · 14 ms", status: "SUCCESS", tone: "success", icon: Terminal },
  { title: "router ospf 10", detail: "P3 · 127.0.0.1:5003 · executing", status: "RUNNING", tone: "running", icon: Terminal },
  { title: "Connectivity validated", detail: "P3 · 31 min ago", status: "SUCCESS", tone: "success", icon: Wifi },
]
