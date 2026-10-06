import {
  BrainCircuit, Check, ChevronsUpDown, CircleUserRound, Settings2,
  Fingerprint, KeyRound, LayoutDashboard, ListChecks, LogOut, Users,
  MessageSquareText, Network, Router, ScrollText, Server, Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { NavLink, useLocation } from "react-router-dom"

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

type MenuItem = { nameKey: string; path: string; icon: LucideIcon }
type MenuSection = { labelKey?: string; items: MenuItem[] }

const sections: MenuSection[] = [
  { items: [{ nameKey: "navigation.dashboard", path: "/", icon: LayoutDashboard }] },
  { labelKey: "navigation.sections.automation", items: [
    { nameKey: "navigation.chatbot", path: "/chat", icon: MessageSquareText },
    { nameKey: "navigation.tasks", path: "/tasks", icon: ListChecks },
  ] },
  { labelKey: "navigation.sections.network", items: [
    { nameKey: "navigation.devices", path: "/devices", icon: Server },
    { nameKey: "navigation.credentials", path: "/credentials", icon: KeyRound },
  ] },
  { labelKey: "navigation.sections.monitoring", items: [
    { nameKey: "navigation.auditLogs", path: "/audit-logs", icon: ScrollText },
  ] },
  { labelKey: "navigation.sections.administration", items: [
    { nameKey: "navigation.users", path: "/users", icon: Users },
    { nameKey: "navigation.accessControl", path: "/access-control", icon: Fingerprint },
  ] },
  { labelKey: "navigation.sections.settings", items: [
    { nameKey: "navigation.systemSettings", path: "/settings/system", icon: Settings2 },
  ] },
]

const workspaces = [
  { name: "Network AI", descriptionKey: "sidebar.production", icon: Network },
  { name: "Core Network", descriptionKey: "sidebar.infrastructure", icon: Router },
  { name: "Automation Lab", descriptionKey: "sidebar.development", icon: BrainCircuit },
]

function NavigationItem({ item }: { item: MenuItem }) {
  const { t } = useTranslation()
  const location = useLocation()
  const { setOpenMobile } = useSidebar()
  const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<NavLink to={item.path} onClick={() => setOpenMobile(false)} />}
        isActive={isActive}
        tooltip={t(item.nameKey)}
        size="sm"
        className="text-[11px] text-sidebar-foreground/85 data-active:text-sidebar-accent-foreground [&_svg]:size-3.5"
      >
        <Icon />
        <span>{t(item.nameKey)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AppSidebar() {
  const { t } = useTranslation()
  const { setOpenMobile } = useSidebar()
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])
  const WorkspaceIcon = activeWorkspace.icon

  return (
    <ShadcnSidebar collapsible="icon" className="border-sidebar-border">

      {/* --- Sidebar Header --- */}
      <SidebarHeader className="min-w-0 flex-row items-center gap-1 p-2">
        <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent" />}>
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <WorkspaceIcon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">{activeWorkspace.name}</p>
                  <p className="truncate text-[9px] text-sidebar-foreground/60">{t(activeWorkspace.descriptionKey)}</p>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 text-sidebar-foreground/60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("sidebar.workspaces")}</DropdownMenuLabel>
                  {workspaces.map((workspace) => {
                    const Icon = workspace.icon
                    return (
                      <DropdownMenuItem key={workspace.name} onClick={() => setActiveWorkspace(workspace)} className="py-2">
                        <Icon className="size-4" />
                        <div className="min-w-0 flex-1"><p className="truncate text-xs">{workspace.name}</p><p className="text-[9px] text-muted-foreground">{t(workspace.descriptionKey)}</p></div>
                        {workspace.name === activeWorkspace.name && <Check className="ml-auto size-3.5" />}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger className="shrink-0 text-sidebar-foreground group-data-[collapsible=icon]:mx-auto" />
      </SidebarHeader>
      
      {/* --- Sidebar Content --- */}
      <SidebarContent className="gap-0">
        {sections.map((section) => (
          <SidebarGroup key={section.labelKey ?? "dashboard"} className="py-1.5">
            {section.labelKey && <SidebarGroupLabel className="h-5 px-2 text-[9px] tracking-wide text-sidebar-foreground/55">{t(section.labelKey)}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => <NavigationItem key={item.path} item={item} />)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* --- Sidebar Separator --- */}
      <SidebarSeparator className="data-horizontal:w-[calc(100%-1rem)]" />

      {/* --- Sidebar Footer --- */}
      <SidebarFooter className="pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip={t("sidebar.account")} className="data-open:bg-sidebar-accent" />}>
                <Avatar>
                  <AvatarFallback className="bg-blue-500/15 text-[10px] font-semibold text-blue-300">AN</AvatarFallback>
                  <AvatarBadge className="bg-emerald-400 ring-sidebar" />
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-medium text-sidebar-accent-foreground">Pham Dinh Duy Thai</p>
                  <p className="truncate text-[9px] text-sidebar-foreground/60">{t("sidebar.administrator")}</p>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 text-sidebar-foreground/60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{t("sidebar.myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<NavLink to="/profile" onClick={() => setOpenMobile(false)} />}><CircleUserRound />{t("sidebar.profile")}</DropdownMenuItem>
                  <DropdownMenuItem render={<NavLink to="/settings/system" onClick={() => setOpenMobile(false)} />}><Settings />{t("sidebar.settings")}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive"><LogOut />{t("sidebar.logout")}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* --- Sidebar Rail --- */}
      <SidebarRail />
    </ShadcnSidebar>
  )
}
