import type { OperationStatus } from "../types/operation-status.type"
import type { TaskStatus } from "../types/task-status.type"

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pending",
  PLANNING: "Planning",
  RUNNING: "Running",
  SUCCESS: "Success",
  PARTIAL_SUCCESS: "Partial success",
  FAILED: "Failed",
  REJECTED: "Rejected",
}

export const OPERATION_STATUS_LABELS: Record<OperationStatus, string> = {
  PENDING: "Pending",
  WAITING_APPROVAL: "Waiting approval",
  RUNNING: "Running",
  SUCCESS: "Success",
  PARTIAL_SUCCESS: "Partial success",
  FAILED: "Failed",
  REJECTED: "Rejected",
  SKIPPED: "Skipped",
}

export const TASK_STATUS_OPTIONS = (
  Object.keys(TASK_STATUS_LABELS) as TaskStatus[]
).map((status) => ({
  value: status,
  label: TASK_STATUS_LABELS[status],
}))
