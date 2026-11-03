import { Skeleton } from "@/components/ui/skeleton"
import { FlaskConical, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout"
import { CHAT_COPY } from "../constants/chatbot.constants"
import { Button } from "@/components/ui/button"
import { benchmarksApi } from "@/service"
import type { BenchmarkRun } from "@/service"
import { useChatMessages } from "../hooks/use-chat-messages"
import { ChatComposer } from "./ChatComposer"
import { ConversationSidebar } from "./ConversationSidebar"
import { ConversationSidebarTrigger } from "./ConversationSidebarTrigger"
import { MessageList } from "./MessageList"

/** Không gian chat toàn chiều cao với sidebar hội thoại và vùng nhắn tin độc lập. */
export function ChatWorkspace() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const benchmarkRunId = searchParams.get("benchmark_run_id") ?? undefined
  const initialPrompt = searchParams.get("prompt") ?? undefined
  const {
    input,
    messages,
    taskPreviews,
    conversations,
    activeConversationId,
    createNewConversation,
    renameConversation,
    sendMessage,
    setActiveConversationId,
    setInput,
    sending,
    loadingConversations,
    loadingMessages,
    error,
    decideApproval,
    retryConversation,
  } = useChatMessages({ benchmarkRunId, initialPrompt })
  const visibleMessages = messages.filter(
    (item) => item.conversation_id === activeConversationId,
  )
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [conversationQuery, setConversationQuery] = useState("")
  const [benchmarkRun, setBenchmarkRun] = useState<BenchmarkRun | null>(null)

  useEffect(() => {
    if (!benchmarkRunId) return
    let active = true
    const refresh = async () => {
      try {
        const nextRun = await benchmarksApi.getRun(benchmarkRunId)
        if (active) setBenchmarkRun(nextRun)
      } catch {
        if (active) setBenchmarkRun(null)
      }
    }
    void refresh()
    const timer = window.setInterval(() => void refresh(), 1500)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [benchmarkRunId])

  async function cleanupBenchmark() {
    if (!benchmarkRun) return
    setBenchmarkRun(await benchmarksApi.cleanup(benchmarkRun.id))
  }

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
          loading={loadingConversations}
          activeConversationId={activeConversationId}
          query={conversationQuery}
          mobileOpen={mobileSidebarOpen}
          collapsed={sidebarCollapsed}
          onQueryChange={setConversationQuery}
          onSelect={setActiveConversationId}
          onRename={renameConversation}
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
          {benchmarkRun && (
            <div className="mx-4 mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-xs sm:mx-6">
              <FlaskConical className="size-4 text-amber-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{t("benchmarks.chatBanner")} · {benchmarkRun.scenario_name}</p>
                <p className="mt-0.5 text-muted-foreground">{t(`benchmarks.status.${benchmarkRun.status}`)}{benchmarkRun.evaluation_result ? ` · RCA ${benchmarkRun.evaluation_result}` : ""}</p>
              </div>
              {benchmarkRun.cleanup_required && benchmarkRun.status !== "RUNNING" && (
                <Button size="sm" variant="outline" onClick={() => void cleanupBenchmark()}><RotateCcw /> {t("benchmarks.cleanupEnvironment")}</Button>
              )}
            </div>
          )}
          {loadingConversations || loadingMessages ? (
            <div role="status" aria-label="Loading messages" className="min-h-0 flex-1 overflow-y-auto px-5 py-8">
              <span className="sr-only">Loading messages...</span>
              <div className="mx-auto w-full max-w-3xl space-y-6">
                <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
                <Skeleton className="h-24 w-4/5 rounded-2xl" />
                <Skeleton className="ml-auto h-12 w-1/2 rounded-2xl" />
              </div>
            </div>
          ) : (
          <MessageList
            messages={visibleMessages}
            taskPreviews={taskPreviews}
            onApprovalDecision={decideApproval}
            onRetryConversation={() => void retryConversation()}
          />
          )}
          {error && (
            <div role="alert" className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-6 text-xs text-destructive">
              <p>{error}</p>
              <Button size="sm" variant="outline" onClick={() => void retryConversation()}>
                Tải lại hội thoại
              </Button>
            </div>
          )}
          <ChatComposer
            input={input}
            onInputChange={setInput}
            onSend={sendMessage}
            disabled={sending}
          />
        </section>
      </PageLayoutContent>
    </PageLayout>
  )
}
