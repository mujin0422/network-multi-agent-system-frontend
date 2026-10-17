import { useState } from "react"

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { CHAT_COPY } from "../constants/chatbot.constants"
import { useChatMessages } from "../hooks/use-chat-messages"
import { ChatComposer } from "./ChatComposer"
import { ConversationSidebar } from "./ConversationSidebar"
import { ConversationSidebarTrigger } from "./ConversationSidebarTrigger"
import { MessageList } from "./MessageList"

/** Không gian chat toàn chiều cao với sidebar hội thoại và vùng nhắn tin độc lập. */
export function ChatWorkspace() {
  const {
    input,
    messages,
    conversations,
    activeConversationId,
    createNewConversation,
    sendMessage,
    setActiveConversationId,
    setInput,
  } = useChatMessages()
  const visibleMessages = messages.filter(
    (item) => item.conversation_id === activeConversationId,
  )
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [conversationQuery, setConversationQuery] = useState("")

  function handleNewChat() {
    createNewConversation()
    setConversationQuery("")
    setMobileSidebarOpen(false)
  }

  return (
    <PageLayout className="h-[calc(100svh-2.5rem)] min-h-[680px] lg:h-[calc(100svh-3rem)]">
      <PageLayoutHeader
        title={CHAT_COPY.title}
        description={CHAT_COPY.description}
      />
      <PageLayoutContent className="relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border bg-background pb-0 shadow-sm">
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label="Close conversation sidebar"
            className="absolute inset-0 z-20 bg-black/35 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          query={conversationQuery}
          mobileOpen={mobileSidebarOpen}
          collapsed={sidebarCollapsed}
          onQueryChange={setConversationQuery}
          onSelect={setActiveConversationId}
          onCreate={handleNewChat}
          onClose={() => setMobileSidebarOpen(false)}
          onCollapse={() => setSidebarCollapsed(true)}
        />

        <section className="relative flex min-w-0 flex-1 flex-col bg-background">
          <ConversationSidebarTrigger
            sidebarCollapsed={sidebarCollapsed}
            onOpenMobile={() => setMobileSidebarOpen(true)}
            onExpandDesktop={() => setSidebarCollapsed(false)}
          />
          <MessageList messages={visibleMessages} />
          <ChatComposer
            input={input}
            onInputChange={setInput}
            onSend={sendMessage}
          />
        </section>
      </PageLayoutContent>
    </PageLayout>
  )
}
