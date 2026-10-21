import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
}: {
  messages: ChatMessage[]
  taskPreviews: ChatTaskPreview[]
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

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto scroll-smooth">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10">
        <TooltipProvider delay={300}>
          {messages.map((item) => {
            const taskPreview = taskPreviews.find(
              (preview) =>
                item.sender_by === "AGENT" &&
                preview.response_message_id === item.id,
            )

            return (
            <article
              key={item.id}
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
                            ? "mt-4 block text-sm leading-7 text-foreground"
                            : "text-sm leading-7 text-foreground"
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
                  <ApprovalRequestCard approval={taskPreview.approval} />
                )}
              </div>
            </article>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
