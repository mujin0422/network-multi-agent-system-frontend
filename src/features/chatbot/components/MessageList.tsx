import { CheckCircle2, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CHAT_TASK_STATUS_LABELS,
  MESSAGE_SENDER_LABELS,
} from "../constants/chatbot.constants"
import type { ChatMessage } from "../types/chat-message.type"
import type { ChatTaskPreview } from "../types/chat-task-preview.type"
import { formatMessageTimestamp } from "../utils/chatbot.util"

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
              (preview) => preview.message_id === item.id,
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
                      <span className="text-sm leading-7 text-foreground">
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
                {taskPreview && (
                  <div className="mt-4 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="type-caption font-medium">
                          Automation task created
                        </p>
                        <p className="mt-1 font-mono type-micro text-muted-foreground">
                          {taskPreview.task_id}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 type-caption text-amber-300">
                        <Clock3 className="size-3" />
                        {CHAT_TASK_STATUS_LABELS[taskPreview.task_status]}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 type-caption text-muted-foreground">
                      <CheckCircle2 className="size-3 text-emerald-400" />2 of 3
                      operations completed
                    </div>
                    <Button size="xs" variant="outline" className="mt-3 w-full">
                      Review task
                    </Button>
                  </div>
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
