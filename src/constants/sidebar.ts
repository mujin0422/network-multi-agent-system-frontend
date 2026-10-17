import {
  BrainCircuit,
  Fingerprint,
  LibraryBig,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Network,
  Router,
  ScrollText,
  Server,
  Settings2,
  Users,
} from "lucide-react"
import type { SidebarMenuSection, SidebarWorkspace } from "@/types/sidebar"
import type { CSSProperties } from "react"

export const SIDEBAR_PROVIDER_STYLE = {
  "--sidebar-width": "14.75rem",
  "--sidebar-width-icon": "3.25rem",
} as CSSProperties

/** Các nhóm điều hướng hiển thị trong sidebar của ứng dụng. */
export const SIDEBAR_SECTIONS: SidebarMenuSection[] = [
  {
    labelKey: "navigation.sections.overview",
    items: [
      { nameKey: "navigation.dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    labelKey: "navigation.sections.automation",
    items: [
      { nameKey: "navigation.chatbot", path: "/chat", icon: MessageSquareText },
      { nameKey: "navigation.tasks", path: "/tasks", icon: ListChecks },
    ],
  },
  {
    labelKey: "navigation.sections.network",
    items: [
      { nameKey: "navigation.devices", path: "/devices", icon: Server },
      {
        nameKey: "navigation.credentials",
        path: "/credentials",
        icon: KeyRound,
      },
      {
        nameKey: "navigation.deviceCatalog",
        path: "/device-catalog",
        icon: LibraryBig,
      },
    ],
  },
  {
    labelKey: "navigation.sections.monitoring",
    items: [
      {
        nameKey: "navigation.auditLogs",
        path: "/audit-logs",
        icon: ScrollText,
      },
    ],
  },
  {
    labelKey: "navigation.sections.administration",
    items: [
      { nameKey: "navigation.users", path: "/users", icon: Users },
      {
        nameKey: "navigation.accessControl",
        path: "/access-control",
        icon: Fingerprint,
      },
    ],
  },
  {
    labelKey: "navigation.sections.settings",
    items: [
      {
        nameKey: "navigation.systemSettings",
        path: "/settings/system",
        icon: Settings2,
      },
    ],
  },
]

/** Danh sách workspace có thể chọn từ phần đầu sidebar. */
export const SIDEBAR_WORKSPACES: SidebarWorkspace[] = [
  {
    name: "Network AI",
    descriptionKey: "sidebar.production",
    icon: Network,
  },
  {
    name: "Core Network",
    descriptionKey: "sidebar.infrastructure",
    icon: Router,
  },
  {
    name: "Automation Lab",
    descriptionKey: "sidebar.development",
    icon: BrainCircuit,
  },
]
