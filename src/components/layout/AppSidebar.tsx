import {
  BrainCircuit, Check, ChevronsUpDown, CircleUserRound, Settings2,
  Fingerprint, KeyRound, LayoutDashboard, ListChecks, LogOut, Users,
  MessageSquareText, Network, Router, ScrollText, Server, Settings,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useState } from "react"
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

type MenuItem = { name: string; path: string; icon: LucideIcon }
type MenuSection = { label?: string; items: MenuItem[] }

const sections: MenuSection[] = [
  { items: [{ name: "Dashboard", path: "/", icon: LayoutDashboard }] },
  { label: "AI AUTOMATION", items: [
    { name: "Chatbot", path: "/chat", icon: MessageSquareText },
    { name: "Tasks", path: "/tasks", icon: ListChecks },
  ] },
  { label: "NETWORK", items: [
    { name: "Devices", path: "/devices", icon: Server },
    { name: "Credentials", path: "/credentials", icon: KeyRound },
  ] },
  { label: "MONITORING", items: [
    { name: "Audit Logs", path: "/audit-logs", icon: ScrollText },
  ] },
  { label: "ADMINISTRATION", items: [
    { name: "Users", path: "/users", icon: Users },
    { name: "Access Control", path: "/access-control", icon: Fingerprint },
  ] },
  { label: "GENERAL SETTING", items: [
    { name: "System Settings", path: "/settings/system", icon: Settings2 },
  ] },
]

const workspaces = [
  { name: "Network AI", description: "Production", icon: Network },
  { name: "Core Network", description: "Infrastructure", icon: Router },
  { name: "Automation Lab", description: "Development", icon: BrainCircuit },
]

function NavigationItem({ item }: { item: MenuItem }) {
  const location = useLocation()
  const { setOpenMobile } = useSidebar()
  const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<NavLink to={item.path} onClick={() => setOpenMobile(false)} />}
        isActive={isActive}
        tooltip={item.name}
        size="sm"
        className="text-[11px] text-sidebar-foreground/85 data-active:text-white [&_svg]:size-3.5"
      >
        <Icon />
        <span>{item.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AppSidebar() {
  const { setOpenMobile } = useSidebar()
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])
  const WorkspaceIcon = activeWorkspace.icon

  return (
    <ShadcnSidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-2 p-2">
        <div className="flex min-w-0 items-center gap-1">
          <SidebarMenu className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent" />}>
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <WorkspaceIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-semibold text-white">{activeWorkspace.name}</p>
                    <p className="truncate text-[9px] text-sidebar-foreground/60">{activeWorkspace.description}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto size-3.5 text-sidebar-foreground/60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                    {workspaces.map((workspace) => {
                      const Icon = workspace.icon
                      return (
                        <DropdownMenuItem key={workspace.name} onClick={() => setActiveWorkspace(workspace)} className="py-2">
                          <Icon className="size-4" />
                          <div className="min-w-0 flex-1"><p className="truncate text-xs">{workspace.name}</p><p className="text-[9px] text-muted-foreground">{workspace.description}</p></div>
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
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {sections.map((section) => (
          <SidebarGroup key={section.label ?? "dashboard"} className="py-1.5">
            {section.label && <SidebarGroupLabel className="h-5 px-2 text-[9px] tracking-wide text-sidebar-foreground/55">{section.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => <NavigationItem key={item.path} item={item} />)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter className="pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Account" className="data-open:bg-sidebar-accent" />}>
                <Avatar>
                  <AvatarFallback className="bg-blue-500/15 text-[10px] font-semibold text-blue-300">AN</AvatarFallback>
                  <AvatarBadge className="bg-emerald-400 ring-sidebar" />
                </Avatar>
                <div className="min-w-0 flex-1 text-left"><p className="truncate text-xs font-medium text-white">Pham Dinh Duy Thai</p><p className="truncate text-[9px] text-sidebar-foreground/60">Administrator</p></div>
                <ChevronsUpDown className="ml-auto size-3.5 text-sidebar-foreground/60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<NavLink to="/profile" onClick={() => setOpenMobile(false)} />}><CircleUserRound />Profile</DropdownMenuItem>
                  <DropdownMenuItem render={<NavLink to="/settings/system" onClick={() => setOpenMobile(false)} />}><Settings />Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive"><LogOut />Logout</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  )
}
