import { Outlet } from "react-router-dom"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SIDEBAR_PROVIDER_STYLE } from "@/constants/sidebar"
import AppSidebar from "./Sidebar"

export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen style={SIDEBAR_PROVIDER_STYLE}>
      {/* --- Application Sidebar --- */}
      <AppSidebar />

      {/* --- Main Content --- */}
      <SidebarInset>
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:py-6">
          <Outlet />
        </main>

        {/* --- Mobile Sidebar Trigger --- */}
        <SidebarTrigger className="fixed top-4 left-4 z-50 size-10 rounded-full border bg-card shadow-lg md:hidden" />
      </SidebarInset>
    </SidebarProvider>
  )
}
