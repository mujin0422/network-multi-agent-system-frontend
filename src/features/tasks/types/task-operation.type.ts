import type { OperationStatus } from "./operation-status.type"

export type TaskOperation = { id: string; task_id: string; operation_intent: string; display_order: number; operation_status: OperationStatus; operation_parameters: Record<string, unknown> | null; created_at: string; started_at?: string | null; completed_at: string | null }
