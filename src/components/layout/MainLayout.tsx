import type { CSSProperties } from "react"
import { Outlet } from "react-router-dom"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"

export default function MainLayout() {
  return (
    <SidebarProvider
      defaultOpen
      style={{ "--sidebar-width": "14.75rem", "--sidebar-width-icon": "3.25rem" } as CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:py-6">
          <Outlet />
        </main>
        <SidebarTrigger className="fixed bottom-4 left-4 z-50 size-10 rounded-full border bg-card shadow-lg md:hidden" />
      </SidebarInset>
    </SidebarProvider>
  )
}
