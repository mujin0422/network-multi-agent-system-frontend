import type { LucideIcon } from "lucide-react"

export type SidebarNavigationItem = {
  nameKey: string
  path: string
  icon: LucideIcon
}

export type SidebarMenuSection = {
  labelKey?: string
  items: SidebarNavigationItem[]
}

export type SidebarWorkspace = {
  name: string
  descriptionKey: string
  icon: LucideIcon
}
