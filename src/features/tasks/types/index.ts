export type TaskStatus = "PENDING" | "PLANNING" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED" | "REJECTED"
export type Task = { id: string; conversation_id: string; source_message_id: string; user_id: string; input_message: string; status: TaskStatus; created_at: string; completed_at: string | null }
export type OperationStatus = "PENDING" | "WAITING_APPROVAL" | "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED" | "REJECTED" | "SKIPPED"
export type TaskOperation = { id: string; task_id: string; intent: string; display_order: number; status: OperationStatus; parameters: Record<string, string> | null; created_at: string; completed_at: string | null }
