import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type {
  AgentActivity as AgentActivityItem,
  ChatTaskPreview,
} from "../types/chat-task-preview.type"

function elapsedLabel(durationMs: number) {
  const seconds = Math.max(0, Math.round(durationMs / 1000))
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function ActivityRow({ activity }: { activity: AgentActivityItem }) {
  return (
    <li className="pb-3 last:pb-0">
      <p className="text-xs leading-5 text-muted-foreground">
        <span className="font-medium text-foreground/80">{activity.actor}</span>
        <span className="px-1.5">·</span>
        {activity.title}
      </p>
      {activity.detail && (
        <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground/80">
          {activity.detail}
        </p>
      )}
    </li>
  )
}

/** Timeline thu gọn mô tả những gì các agent đã làm cho một user message. */
export function AgentActivity({ task }: { task: ChatTaskPreview }) {
  const [open, setOpen] = useState(true)
  const [now, setNow] = useState(Date.now())
  const waitingApproval = task.activities.some(
    (item) => item.status === "WAITING_APPROVAL",
  )
  const workflowFailed = task.activities.some(
    (item) => item.status === "FAILED",
  )
  const running = !task.response_message_id && !waitingApproval && !workflowFailed

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const latestStartedAt = task.activities.at(-1)?.started_at ?? task.started_at
  const liveDuration = running
    ? task.active_duration_ms + Math.max(0, now - Date.parse(latestStartedAt))
    : task.active_duration_ms
  const duration = elapsedLabel(liveDuration)

  return (
    <div className="mt-3">
      <button
        type="button"
        className="flex items-center justify-start gap-1 border-0 bg-transparent px-0 py-1 text-left text-xs text-muted-foreground outline-none transition-colors hover:text-white"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate font-medium">
            {running ? "Đang xử lý" : "Đã xử lý"} trong {duration}
          </span>
          {waitingApproval && (
            <span className="hidden text-xs font-normal text-amber-600 dark:text-amber-400 sm:inline">
              · Đang tạm dừng để chờ phê duyệt
            </span>
          )}
        </span>
        <ChevronDown
          className={cn("size-3 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ol className="mt-2 pb-1">
          {task.activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </ol>
      )}
    </div>
  )
}
