import { Terminal, Wifi } from "lucide-react"
import type { ActivityItem } from "../types/activity-item.type"

export const DEVICE_ACTIONS: ActivityItem[] = [
  { title: "show ip route", detail: "P1 · 127.0.0.1:5001 · 12 ms", status: "SUCCESS", tone: "success", icon: Terminal },
  { title: "show ip route", detail: "P2 · 127.0.0.1:5002 · 14 ms", status: "SUCCESS", tone: "success", icon: Terminal },
  { title: "router ospf 10", detail: "P3 · 127.0.0.1:5003 · executing", status: "RUNNING", tone: "running", icon: Terminal },
  { title: "Connectivity validated", detail: "P3 · 31 min ago", status: "SUCCESS", tone: "success", icon: Wifi },
]
