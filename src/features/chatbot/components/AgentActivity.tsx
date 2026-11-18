import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type {
  AgentActivity as AgentActivityItem,
  ChatTaskPreview,
} from "../types/chat-task-preview.type"

function elapsedLabel(durationMs: number) {
  const seconds = Math.max(0, Math.floor(durationMs / 1000))
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
  const [displayedDuration, setDisplayedDuration] = useState({
    taskId: task.task_id,
    value: task.active_duration_ms,
  })
  const waitingApproval = task.approvals.some((approval) => approval.status === "PENDING")
  const workflowCompleted = task.activities.some(
    (activity) => activity.event_type === "FINAL_RESPONSE_CREATED",
  )
  const running = !workflowCompleted && !waitingApproval

  const latestActivity = task.activities.at(-1)
  const latestTimestamp = latestActivity?.completed_at
    ?? latestActivity?.started_at
    ?? task.started_at
  const latestTimestampMs = Date.parse(latestTimestamp)

  useEffect(() => {
    const updateDuration = () => {
      const calculatedDuration = task.active_duration_ms + (
        running && Number.isFinite(latestTimestampMs)
          ? Math.max(0, Date.now() - latestTimestampMs)
          : 0
      )
      setDisplayedDuration((current) => ({
        taskId: task.task_id,
        value: current.taskId === task.task_id
          ? Math.max(current.value, calculatedDuration)
          : calculatedDuration,
      }))
    }
    const initialUpdate = window.setTimeout(updateDuration, 0)
    const timer = running
      ? window.setInterval(updateDuration, 1000)
      : undefined
    return () => {
      window.clearTimeout(initialUpdate)
      if (timer !== undefined) window.clearInterval(timer)
    }
  }, [latestTimestampMs, running, task.active_duration_ms, task.task_id])

  const duration = elapsedLabel(displayedDuration.value)

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
