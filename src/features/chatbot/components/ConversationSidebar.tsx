import { Skeleton } from "@/components/ui/skeleton"
import { PanelLeftClose, Search } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

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
import type { Conversation } from "../types/conversation.type"
import { formatMessageTimestamp } from "../utils/chatbot.util"
import { ConversationTitleDialog } from "./ConversationTitleDialog"

/** Sidebar hội thoại theo bố cục ứng dụng chat, hỗ trợ desktop và mobile drawer. */
export function ConversationSidebar({
  conversations,
  loading = false,
  loadingMore = false,
  hasMore = false,
  activeConversationId,
  query,
  mobileOpen,
  collapsed,
  onQueryChange,
  onSelect,
  onRename,
  onCreate,
  onClose,
  onCollapse,
  onLoadMore,
}: ConversationSidebarProps) {
  const rowHeight = 48
  const overscan = 4
  const [renamingConversation, setRenamingConversation] = useState<Conversation | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const visibleConversations = conversations.filter((conversation) =>
    conversation.title.toLocaleLowerCase().includes(normalizedQuery),
  )
  const virtualRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const count = Math.ceil(viewportHeight / rowHeight) + overscan * 2
    return { start, end: Math.min(visibleConversations.length, start + count) }
  }, [scrollTop, viewportHeight, visibleConversations.length])
  const virtualConversations = visibleConversations.slice(virtualRange.start, virtualRange.end)

  useEffect(() => {
    const element = listRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (
      !normalizedQuery &&
      hasMore &&
      !loadingMore &&
      visibleConversations.length * rowHeight <= viewportHeight + rowHeight
    ) void onLoadMore()
  }, [hasMore, loadingMore, normalizedQuery, onLoadMore, viewportHeight, visibleConversations.length])

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
          <Button className="flex-1 justify-start text-xs" variant="outline" onClick={onCreate}>
            New chat
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close conversation sidebar" onClick={onClose}>
            <PanelLeftClose />
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex" aria-label="Collapse conversation sidebar" onClick={onCollapse} >
            <PanelLeftClose />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                if (listRef.current) listRef.current.scrollTop = 0
                setScrollTop(0)
                onQueryChange(event.target.value)
              }}
              className="h-9 bg-background pl-9 text-xs md:text-xs placeholder:text-xs"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div
          ref={listRef}
          className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const element = event.currentTarget
            setScrollTop(element.scrollTop)
            if (
              !normalizedQuery &&
              hasMore &&
              !loadingMore &&
              element.scrollHeight - element.scrollTop - element.clientHeight < rowHeight * 3
            ) void onLoadMore()
          }}
        >
          {loading ? (
            <div role="status" aria-label="Loading conversations" className="px-1">
              <span className="sr-only">Loading conversations...</span>
              <Skeleton aria-hidden="true" className="h-72 w-full rounded-xl border border-border bg-card/80" />
            </div>
          ) : (
          <TooltipProvider delay={300}>
            <div className="relative" style={{ height: visibleConversations.length * rowHeight }}>
            {virtualConversations.map((conversation, index) => (
              <Tooltip key={conversation.id}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(conversation.id)
                        onClose()
                      }}
                      onDoubleClick={() => {
                        if (conversation.user_id) setRenamingConversation(conversation)
                      }}
                      className={cn(
                        "group absolute left-0 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left transition-colors",
                        activeConversationId === conversation.id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                      )}
                      style={{ top: (virtualRange.start + index) * rowHeight }}
                    />
                  }
                >
                  <p className="min-w-0 flex-1 truncate text-xs font-medium">
                    {conversation.title}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {formatMessageTimestamp(conversation.last_updated_at)}
                </TooltipContent>
              </Tooltip>
            ))}
            </div>
            {loadingMore && (
              <p className="py-2 text-center text-xs text-muted-foreground">Loading more...</p>
            )}
          </TooltipProvider>
          )}
          {!loading && visibleConversations.length === 0 && (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              No conversations found.
            </p>
          )}
        </div>
      </div>
      <ConversationTitleDialog
        key={renamingConversation?.id ?? "closed"}
        open={renamingConversation !== null}
        title={renamingConversation?.title ?? ""}
        onOpenChange={(open) => {
          if (!open) setRenamingConversation(null)
        }}
        onSave={async (title) => {
          if (!renamingConversation) return
          await onRename(renamingConversation.id, title)
        }}
      />
    </aside>
  )
}
