import { Bot, CheckCircle2, Clock3 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { ChatMessage } from "../types"

/** Hiển thị luồng tin nhắn và phân biệt nội dung của người dùng với AI. */
export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
      {messages.map((item) => (
        <div
          key={item.id}
          className={
            item.sender_by === "USER"
              ? "flex justify-end"
              : "flex items-start gap-3"
          }
        >
          {item.sender_by === "AGENT" && (
            <Avatar size="sm">
              <AvatarFallback className="bg-blue-500/10 text-blue-400">
                <Bot className="size-3" />
              </AvatarFallback>
            </Avatar>
          )}
          <div
            className={
              item.sender_by === "USER"
                ? "max-w-[82%] rounded-2xl rounded-br-sm bg-blue-500 px-4 py-3 text-xs leading-relaxed text-white"
                : "max-w-[82%]"
            }
          >
            {item.sender_by === "AGENT" ? (
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-xs leading-relaxed text-foreground">
                {item.message}
              </div>
            ) : (
              item.message
            )}
            <p
              className={
                item.sender_by === "USER"
                  ? "mt-1 text-right text-[8px] text-muted-foreground"
                  : "mt-1 text-[8px] text-muted-foreground"
              }
            >
              {new Date(item.created_at).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {item.task_id && (
              <div className="mt-3 rounded-xl border bg-card p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-medium">
                      Automation task created
                    </p>
                    <p className="mt-1 font-mono text-[8px] text-muted-foreground">
                      {item.task_id}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-[9px] text-amber-300">
                    <Clock3 className="size-3" />
                    Approval needed
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[9px] text-muted-foreground">
                  <CheckCircle2 className="size-3 text-emerald-400" />2 of 3
                  operations completed
                </div>
                <Button size="xs" variant="outline" className="mt-3 w-full">
                  Review task
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
