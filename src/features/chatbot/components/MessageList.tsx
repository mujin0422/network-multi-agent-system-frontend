import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { MESSAGE_SENDER_LABELS } from "../constants/chatbot.constants"
import type { ChatMessage } from "../types/chat-message.type"
import type { ChatTaskPreview } from "../types/chat-task-preview.type"
import { formatMessageTimestamp } from "../utils/chatbot.util"
import { AgentActivity } from "./AgentActivity"
import { ApprovalRequestCard } from "./ApprovalRequestCard"

/** Hiển thị luồng tin nhắn và phân biệt nội dung của người dùng với AI. */
export function MessageList({
  messages,
  taskPreviews,
  onApprovalDecision,
  onRetryConversation,
}: {
  messages: ChatMessage[]
  taskPreviews: ChatTaskPreview[]
  onApprovalDecision: (approvalId: string, decision: "APPROVED" | "REJECTED") => Promise<void>
  onRetryConversation: () => void
}) {
  if (messages.length === 0) {
    return (
      <div className="no-scrollbar grid min-h-0 flex-1 place-items-center overflow-y-auto px-5 py-10 text-center">
        <div className="max-w-md">
          <h2 className="text-lg font-semibold">
            How can I help with your network?
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ask Network AI to inspect devices, analyze incidents, or prepare an
            automation task.
          </p>
        </div>
      </div>
    )
  }

  const orderedMessages = [...messages].sort(
    (left, right) =>
      Date.parse(left.created_at) - Date.parse(right.created_at),
  )

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto scroll-smooth">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10">
        <TooltipProvider delay={300}>
          {orderedMessages.map((item) => {
            const taskPreview = taskPreviews.find(
              (preview) =>
                item.sender_by === "AGENT" &&
                preview.response_message_id === item.id,
            )
            const pendingTaskPreview = taskPreviews.find(
              (preview) =>
                item.sender_by === "USER" &&
                preview.source_message_id === item.id &&
                !preview.response_message_id,
            )

            return (
            <Fragment key={item.id}>
            <article
              aria-label={`${MESSAGE_SENDER_LABELS[item.sender_by]} message`}
              className={
                item.sender_by === "USER"
                  ? "flex justify-end"
                  : "flex items-start"
              }
            >
              <div
                className={
                  item.sender_by === "USER"
                    ? "max-w-[85%] rounded-3xl rounded-br-lg bg-muted px-4 py-3 text-sm leading-6 text-foreground sm:max-w-[75%]"
                    : "min-w-0 flex-1"
                }
              >
                {taskPreview && <AgentActivity task={taskPreview} />}
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <span
                        tabIndex={0}
                        className="block cursor-default outline-none"
                      />
                    }
                  >
                    {item.sender_by === "AGENT" ? (
                      <span
                        className={
                          taskPreview
                            ? "mt-4 block whitespace-pre-wrap text-sm leading-7 text-foreground"
                            : "whitespace-pre-wrap text-sm leading-7 text-foreground"
                        }
                      >
                        {item.message}
                      </span>
                    ) : (
                      item.message
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    side={item.sender_by === "USER" ? "left" : "top"}
                  >
                    {MESSAGE_SENDER_LABELS[item.sender_by]} ·{" "}
                    {formatMessageTimestamp(item.created_at)}
                  </TooltipContent>
                </Tooltip>
                {taskPreview?.approval && (
                  <ApprovalRequestCard key={taskPreview.approval.id} approval={taskPreview.approval} onDecision={onApprovalDecision} />
                )}
                {taskPreview?.approvalLoadError && (
                  <ApprovalLoadWarning message={taskPreview.approvalLoadError} onRetry={onRetryConversation} />
                )}
              </div>
            </article>
            {pendingTaskPreview && (
              <article aria-label="AI processing" className="flex items-start">
                <div className="min-w-0 flex-1">
                  <AgentActivity task={pendingTaskPreview} />
                  {pendingTaskPreview.approval && (
                    <ApprovalRequestCard key={pendingTaskPreview.approval.id} approval={pendingTaskPreview.approval} onDecision={onApprovalDecision} />
                  )}
                  {pendingTaskPreview.approvalLoadError && (
                    <ApprovalLoadWarning message={pendingTaskPreview.approvalLoadError} onRetry={onRetryConversation} />
                  )}
                </div>
              </article>
            )}
            </Fragment>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}

function ApprovalLoadWarning({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
      <p>{message}</p>
      <Button type="button" size="sm" variant="outline" onClick={onRetry}>
        Tải lại phiếu phê duyệt
      </Button>
    </div>
  )
}
