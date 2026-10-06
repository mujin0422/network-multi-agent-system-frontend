import {
  Bot,
  MessageSquare,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
} from "lucide-react"
import { useState } from "react"
import type { FormMode } from "@/components/common/FeatureFormSheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CHAT_COPY } from "../constants"
import { useChatMessages } from "../hooks/useChatMessages"
import type { Conversation } from "../types"
import { ChatComposer } from "./ChatComposer"
import { ConversationForm } from "./ConversationForm"
import { MessageList } from "./MessageList"

/** Màn hình chat chính gồm danh sách hội thoại, tin nhắn và ô soạn nội dung. */
export function ChatContent() {
  const {
    input,
    messages,
    conversations,
    activeConversationId,
    sendMessage,
    setActiveConversationId,
    setInput,
  } = useChatMessages()
  const activeConversation =
    conversations.find((item) => item.id === activeConversationId) ?? null
  const visibleMessages = messages.filter(
    (item) => item.conversation_id === activeConversationId,
  )
  const [form, setForm] = useState<{
    open: boolean
    mode: FormMode
    conversation: Conversation | null
  }>({ open: false, mode: "create", conversation: null })
  const openForm = (mode: FormMode, conversation: Conversation | null = null) =>
    setForm({ open: true, mode, conversation })
  return (
    <>
      <div className="flex min-h-[calc(100svh-3rem)] flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {CHAT_COPY.title}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {CHAT_COPY.description}
            </p>
          </div>
          <Button size="sm" onClick={() => openForm("create")}>
            <Plus />
            New chat
          </Button>
        </div>
        <Card className="grid min-h-0 flex-1 grid-cols-1 gap-0 py-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r lg:block">
            <div className="border-b p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-8 bg-background pl-8 text-[10px]"
                  placeholder="Search conversations..."
                />
              </div>
            </div>
            <div className="p-2">
              <p className="px-2 py-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                Recent conversations
              </p>
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={cn(
                    "mb-1 flex w-full gap-2 rounded-lg px-2.5 py-2.5 text-left",
                    activeConversationId === conversation.id
                      ? "bg-blue-500/10 text-blue-300"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <MessageSquare className="mt-0.5 size-3.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium">
                      {conversation.title}
                    </p>
                    <p className="mt-1 text-[8px] opacity-60">
                      {new Date(
                        conversation.last_updated_at,
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
          <section className="flex min-h-[580px] flex-col">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="grid size-8 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">Network AI</p>
                <p className="text-[9px] text-emerald-400">
                  ● Online · 5 devices in context
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" className="lg:hidden">
                <PanelLeftClose />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  activeConversation && openForm("view", activeConversation)
                }
              >
                <MoreHorizontal />
              </Button>
            </div>
            <MessageList messages={visibleMessages} />
            <ChatComposer
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
            />
          </section>
        </Card>
      </div>
      <ConversationForm
        open={form.open}
        mode={form.mode}
        conversation={form.conversation}
        onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
        onModeChange={(mode) => setForm((current) => ({ ...current, mode }))}
      />
    </>
  )
}
