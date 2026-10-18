import { MessageSquare, PanelLeftClose, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ConversationSidebarProps } from "../types/conversation-sidebar-props.type"
import { formatMessageTimestamp } from "../utils/chatbot.util"

/** Sidebar hội thoại theo bố cục ứng dụng chat, hỗ trợ desktop và mobile drawer. */
export function ConversationSidebar({
  conversations,
  activeConversationId,
  query,
  mobileOpen,
  collapsed,
  onQueryChange,
  onSelect,
  onCreate,
  onClose,
  onCollapse,
}: ConversationSidebarProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleConversations = conversations.filter((conversation) =>
    conversation.title.toLocaleLowerCase().includes(normalizedQuery),
  )

  return (
    <aside
      className={cn(
        "absolute inset-y-0 left-0 z-30 w-[280px] shrink-0 overflow-hidden border-r bg-muted/30 shadow-xl transition-[width,transform,opacity] duration-200 ease-linear lg:static lg:translate-x-0 lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed
          ? "lg:pointer-events-none lg:w-0 lg:border-r-0 lg:opacity-0"
          : "lg:w-[260px] lg:opacity-100",
      )}
    >
      <div className="flex h-full w-[280px] flex-col lg:w-[260px]">
        <div className="flex items-center gap-2 p-3">
          <Button
            className="flex-1 justify-start"
            variant="outline"
            onClick={onCreate}
          >
            New chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Close conversation sidebar"
            onClick={onClose}
          >
            <PanelLeftClose />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Collapse conversation sidebar"
            onClick={onCollapse}
          >
            <PanelLeftClose />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="h-9 bg-background pl-9 text-xs"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          <p className="px-2 py-2 type-caption font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Recent
          </p>
          <TooltipProvider delay={300}>
            {visibleConversations.map((conversation) => (
              <Tooltip key={conversation.id}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(conversation.id)
                        onClose()
                      }}
                      className={cn(
                        "group mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                        activeConversationId === conversation.id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                      )}
                    />
                  }
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <p className="min-w-0 flex-1 truncate text-xs font-medium">
                    {conversation.title}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {formatMessageTimestamp(conversation.last_updated_at)}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          {visibleConversations.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              No conversations found.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
