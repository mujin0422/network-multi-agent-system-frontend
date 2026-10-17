import type { TaskStatus } from "./task-status.type"
import type { TaskType } from "./task-type.type"

export type Task = { id: string; conversation_id: string; source_message_id: string; user_id: string; input_message: string; task_type: TaskType; task_status: TaskStatus; created_at: string; completed_at: string | null }
