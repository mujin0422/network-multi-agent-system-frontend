import type { TaskStatus } from "../types/task-status.type"
import type { Task } from "../types/task.type"

export function matchesTask(task: Task, query: string, status: TaskStatus | "ALL") {
  const matchesQuery = [task.id, task.input_message, task.task_type, task.task_status, task.user_id]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase())
  return matchesQuery && (status === "ALL" || task.task_status === status)
}
