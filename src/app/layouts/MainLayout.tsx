import { Outlet } from "react-router-dom"

import Sidebar from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SIDEBAR_PROVIDER_STYLE } from "@/constants/sidebar"

/** Khung giao diện chung cho toàn bộ route đã xác thực. */
export default function MainLayout() {
  return (
    <SidebarProvider defaultOpen style={SIDEBAR_PROVIDER_STYLE}>
      <Sidebar />
      <SidebarInset>
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 lg:py-6">
          <Outlet />
        </main>
        <SidebarTrigger className="fixed top-4 left-4 z-50 size-10 rounded-full border bg-card shadow-lg md:hidden" />
      </SidebarInset>
    </SidebarProvider>
  )
}
