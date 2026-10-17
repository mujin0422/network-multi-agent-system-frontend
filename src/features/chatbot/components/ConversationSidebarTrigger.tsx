import { PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ConversationSidebarTriggerProps } from "../types/conversation-sidebar-trigger-props.type"

/** Nút nổi để mở drawer mobile hoặc khôi phục sidebar desktop đã thu gọn. */
export function ConversationSidebarTrigger({
  sidebarCollapsed,
  onOpenMobile,
  onExpandDesktop,
}: ConversationSidebarTriggerProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Open conversation sidebar"
        className="absolute top-3 left-3 z-10 border-0 bg-transparent shadow-none lg:hidden"
        onClick={onOpenMobile}
      >
        <PanelLeftOpen />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Expand conversation sidebar"
        className={cn(
          "absolute top-3 left-3 z-10 hidden border-0 bg-transparent shadow-none",
          sidebarCollapsed && "lg:inline-flex",
        )}
        onClick={onExpandDesktop}
      >
        <PanelLeftOpen />
      </Button>
    </>
  )
}
